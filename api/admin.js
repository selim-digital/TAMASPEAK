/**
 * Le tableau de bord admin, en UNE fonction routée par `?r=` :
 *
 *   ?r=stats      GET    les chiffres d'usage
 *   ?r=feedbacks  GET    les retours (paginés) · PATCH  changer leur statut
 *   ?r=revenus    GET    l'abonnement — combien, où, et qui s'en va
 *
 * Pourquoi réunies : le plan Vercel Hobby plafonne à DOUZE fonctions
 * serverless. `api/admin/stats.js` et `api/admin/feedbacks.js` en occupaient
 * deux ; les fondre ici a libéré la place d'`api/billing.js` sans rien
 * sacrifier. Même motif qu'`api/distance.js`, qui réunit tout le jeu à
 * distance pour la même raison.
 *
 * Les anciennes adresses (`/api/admin/stats`, `/api/admin/feedbacks`) sont
 * redirigées par vercel.json : un signet ne se casse pas.
 */
import { serverReady, notConfigured, sql, assurerSchema } from './_lib/db.js'
import { sessionOf, isAdmin } from './_lib/auth.js'
import { LANGUAGES } from '../src/data/languages.js'

/**
 * Le nom lisible d'un cours, résolu ICI et envoyé au tableau de bord.
 *
 * Pourquoi le serveur et pas la page : `public/admin.html` est du HTML nu,
 * sans build ni import — elle tenait donc sa propre table de noms, copiée à
 * la main. Elle a dérivé dès la première langue ajoutée : le parcours d'essai
 * « kab-beta » s'y affichait en code brut, parce que personne n'avait pensé
 * à recopier la ligne. Même règle que les tarifs (voir api/billing.js, qui
 * importe src/data/tarifs.js) : une seule source de vérité, du côté qui peut
 * l'importer.
 */
const nomDuCours = (id) => LANGUAGES.find((l) => l.id === id)?.name || id

/* ------------------------------------------------------------------ */
/* ?r=stats — les chiffres qui disent si l'app apprend réellement       */
/* quelque chose à quelqu'un, pas les chiffres qui flattent.            */
/* ------------------------------------------------------------------ */

async function stats(res) {
  const q = sql()

  const [inscrits] = await q`SELECT COUNT(*)::int AS n FROM "user"`
  const [actifs] = await q`
    SELECT
      COUNT(DISTINCT user_id) FILTER (WHERE at > NOW() - INTERVAL '1 day')::int  AS j1,
      COUNT(DISTINCT user_id) FILTER (WHERE at > NOW() - INTERVAL '7 days')::int AS j7,
      COUNT(DISTINCT user_id) FILTER (WHERE at > NOW() - INTERVAL '30 days')::int AS j30
    FROM events`

  const parLangueBrut = await q`
    SELECT lang, COUNT(*)::int AS lecons
    FROM events WHERE type = 'lesson_completed' AND lang IS NOT NULL
    GROUP BY lang ORDER BY lecons DESC`
  const parLangue = parLangueBrut.map((r) => ({ ...r, nom: nomDuCours(r.lang) }))

  const courbe = await q`
    SELECT DATE(at) AS jour, COUNT(DISTINCT user_id)::int AS actifs, COUNT(*)::int AS evenements
    FROM events WHERE at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(at) ORDER BY jour`

  // Rétention par cohorte : inscrits il y a >= N jours, revenus après J+N.
  const retention = await q`
    WITH cohorte AS (SELECT id, "createdAt" AS inscrit FROM "user")
    SELECT
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '1 day')::int AS base_j1,
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '1 day' AND EXISTS (
        SELECT 1 FROM events e WHERE e.user_id = cohorte.id AND e.at > inscrit + INTERVAL '1 day'))::int AS revenus_j1,
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '7 days')::int AS base_j7,
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '7 days' AND EXISTS (
        SELECT 1 FROM events e WHERE e.user_id = cohorte.id AND e.at > inscrit + INTERVAL '7 days'))::int AS revenus_j7,
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '30 days')::int AS base_j30,
      COUNT(*) FILTER (WHERE inscrit < NOW() - INTERVAL '30 days' AND EXISTS (
        SELECT 1 FROM events e WHERE e.user_id = cohorte.id AND e.at > inscrit + INTERVAL '30 days'))::int AS revenus_j30
    FROM cohorte`

  const derniers = await q`
    SELECT "name", "email", "createdAt" FROM "user" ORDER BY "createdAt" DESC LIMIT 20`

  return res.status(200).json({
    inscrits: inscrits.n,
    actifs,
    parLangue,
    courbe,
    retention: retention[0],
    derniers,
  })
}

/* ------------------------------------------------------------------ */
/* ?r=revenus — l'abonnement vu d'en haut                              */
/*                                                                      */
/* Volontairement sobre : des COMPTES par statut, plan et zone, pas des */
/* euros. Les montants réels (remises, TVA, impayés, remboursements)    */
/* vivent chez Stripe, qui les calcule mieux que nous ; recopier ici un */
/* chiffre d'affaires approximatif ne servirait qu'à se tromper.        */
/* ------------------------------------------------------------------ */

async function revenus(res) {
  const q = sql()

  const parStatut = await q`
    SELECT statut, plan, zone, COUNT(*)::int AS n
    FROM abonnements
    GROUP BY statut, plan, zone
    ORDER BY n DESC`

  const [actifs] = await q`
    SELECT
      COUNT(*) FILTER (WHERE statut IN ('actif', 'essai'))::int          AS ouverts,
      COUNT(*) FILTER (WHERE statut = 'essai')::int                      AS essais,
      COUNT(*) FILTER (WHERE statut = 'retard')::int                     AS retards,
      COUNT(*) FILTER (WHERE annule_a_la_fin AND statut IN ('actif', 'essai'))::int AS partants
    FROM abonnements`

  // Les places de pack famille réellement occupées : la mesure qui dit si le
  // pack sert à quelque chose ou s'il est acheté puis oublié.
  const [famille] = await q`
    SELECT
      COUNT(DISTINCT proprietaire)::int                       AS packs,
      COUNT(*) FILTER (WHERE joined_at IS NOT NULL)::int      AS places_prises,
      COUNT(*) FILTER (WHERE joined_at IS NULL)::int          AS invitations_dormantes
    FROM famille_membres`

  const nouveaux = await q`
    SELECT DATE(created_at) AS jour, COUNT(*)::int AS n
    FROM abonnements WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at) ORDER BY jour`

  return res.status(200).json({ parStatut, actifs, famille, nouveaux })
}

/* ------------------------------------------------------------------ */
/* ?r=feedbacks — lecture paginée + changement de statut.              */
/* PATCH plutôt que DELETE : on ne supprime pas la parole des           */
/* utilisateurs, on la traite.                                          */
/* ------------------------------------------------------------------ */

const STATUTS = new Set(['nouveau', 'vu', 'traite'])

async function feedbacks(req, res) {
  if (req.method === 'GET') {
    const statut = STATUTS.has(req.query?.status) ? req.query.status : null
    const rows = statut
      ? await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    WHERE f.status = ${statut} ORDER BY f.created_at DESC LIMIT 100`
      : await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    ORDER BY f.created_at DESC LIMIT 100`
    // Même raison qu'aux statistiques : le nom du cours se résout ici, où
    // src/data/languages.js est importable.
    return res.status(200).json({ feedbacks: rows.map((f) => ({ ...f, langNom: f.lang ? nomDuCours(f.lang) : null })) })
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!Number.isInteger(id) || !STATUTS.has(status))
      return res.status(400).json({ error: 'id ou statut invalide' })
    await sql()`UPDATE feedbacks SET status = ${status} WHERE id = ${id}`
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'méthode non autorisée' })
}

/* ------------------------------------------------------------------ */

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!isAdmin(session)) return res.status(403).json({ error: 'accès refusé' })

  const r = req.query?.r || 'stats'

  if (r === 'stats') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'méthode non autorisée' })
    return stats(res)
  }
  if (r === 'revenus') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'méthode non autorisée' })
    // Les tables d'abonnement sont les dernières arrivées : sur une base
    // installée avant la monétisation, elles n'existent pas encore.
    await assurerSchema()
    return revenus(res)
  }
  if (r === 'feedbacks') return feedbacks(req, res)

  return res.status(404).json({ error: 'route inconnue' })
}
