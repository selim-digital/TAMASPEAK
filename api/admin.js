/**
 * Le tableau de bord admin, en UNE fonction routée par `?r=` :
 *
 *   ?r=stats      GET    les chiffres d'usage
 *   ?r=feedbacks  GET    les retours (paginés) · PATCH  changer leur statut
 *   ?r=revenus    GET    l'abonnement — combien, où, et qui s'en va
 *   ?r=lexique    GET    le contenu à valider / à enregistrer (+ export CSV)
 *                 POST   ajouter une entrée · PATCH corriger · DELETE retirer
 *   ?r=voix       GET    relire un enregistrement · POST déposer · DELETE effacer
 *
 * Pourquoi réunies : le plan Vercel Hobby plafonne à DOUZE fonctions
 * serverless. `api/admin/stats.js` et `api/admin/feedbacks.js` en occupaient
 * deux ; les fondre ici a libéré la place d'`api/billing.js` sans rien
 * sacrifier. Même motif qu'`api/distance.js`, qui réunit tout le jeu à
 * distance pour la même raison. C'est aussi pourquoi l'atelier du contenu
 * arrive ici plutôt que dans un `api/lexique.js` : il n'y a plus de place,
 * et ce fichier est déjà celui que seuls les admins peuvent ouvrir.
 *
 * Les anciennes adresses (`/api/admin/stats`, `/api/admin/feedbacks`) sont
 * redirigées par vercel.json : un signet ne se casse pas.
 */
import { serverReady, notConfigured, sql, assurerSchema } from './_lib/db.js'
import { sessionOf, isAdmin } from './_lib/auth.js'
import { sansVisages } from './_lib/texte.js'
import {
  VOIX,
  VOIX_SET,
  STATUTS,
  STATUTS_SET,
  CATEGORIES_SET,
  TYPES_AUDIO,
  categorieDe,
  semer,
  slug,
} from './_lib/lexique.js'

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

  const parLangue = await q`
    SELECT lang, COUNT(*)::int AS lecons
    FROM events WHERE type = 'lesson_completed' AND lang IS NOT NULL
    GROUP BY lang ORDER BY lecons DESC`

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

const STATUTS_RETOUR = new Set(['nouveau', 'vu', 'traite'])

async function feedbacks(req, res) {
  if (req.method === 'GET') {
    const statut = STATUTS_RETOUR.has(req.query?.status) ? req.query.status : null
    const rows = statut
      ? await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    WHERE f.status = ${statut} ORDER BY f.created_at DESC LIMIT 100`
      : await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    ORDER BY f.created_at DESC LIMIT 100`
    return res.status(200).json({ feedbacks: rows })
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!Number.isInteger(id) || !STATUTS_RETOUR.has(status))
      return res.status(400).json({ error: 'id ou statut invalide' })
    await sql()`UPDATE feedbacks SET status = ${status} WHERE id = ${id}`
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'méthode non autorisée' })
}

/* ------------------------------------------------------------------ */
/* ?r=lexique — l'atelier du contenu.                                   */
/*                                                                      */
/* Une seule table sert les trois listes demandées, parce que ce sont    */
/* trois REGARDS sur le même contenu et non trois contenus :             */
/*   • « à enregistrer » = filtre sur les voix manquantes ;              */
/*   • « à valider »     = filtre sur le statut ;                        */
/*   • « dictionnaire »  = pas de filtre, tout est éditable.             */
/* Trois tables auraient divergé dès la première correction.             */
/* ------------------------------------------------------------------ */

/** Un texte libre venu du backoffice : borné, sans visage, vide → NULL. */
const texte = (v, max) => {
  if (v === undefined || v === null) return null
  const t = sansVisages(String(v).trim().slice(0, max))
  return t || null
}

/** Le paramètre d'une liste blanche, ou NULL (= « ne filtre pas »). */
const parmi = (v, set) => (v && set.has(v) ? v : null)

async function lexiqueGet(req, res) {
  // Le contenu de référence est réinjecté AVANT lecture : ouvrir le
  // backoffice suffit à voir les mots ajoutés depuis la dernière fois, sans
  // script à lancer ni migration à se rappeler. (Cadencé côté module.)
  const seme = await semer()

  const lang = texte(req.query?.lang, 12)
  const statut = parmi(req.query?.statut, STATUTS_SET)
  const categorie = parmi(req.query?.categorie, CATEGORIES_SET)
  // 'toute' = « il manque au moins une des quatre voix »
  const manque = req.query?.manque === 'toute' ? 'toute' : parmi(req.query?.manque, VOIX_SET)
  const q = texte(req.query?.q, 60)
  const motif = q ? `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%` : null

  const lignes = await sql()`
    SELECT l.id, l.lang, l.cle, l.terme, l.sens, l.notes, l.categorie, l.source,
           l.unite, l.lecons, l.rang, l.statut, l.valide_par, l.valide_le, l.updated_at,
           COALESCE(
             json_agg(json_build_object(
               'voix', a.voix, 'locuteur', a.locuteur,
               'type', a.audio_type, 'at', a.created_at
             ) ORDER BY a.voix) FILTER (WHERE a.id IS NOT NULL),
             '[]'
           ) AS voix
    FROM lexique l
    LEFT JOIN lexique_audio a ON a.lexique_id = l.id
    WHERE (${lang}::text IS NULL OR l.lang = ${lang})
      AND (${statut}::text IS NULL OR l.statut = ${statut})
      AND (${categorie}::text IS NULL OR l.categorie = ${categorie})
      AND (${motif}::text IS NULL OR l.terme ILIKE ${motif} ESCAPE '\\'
                                  OR l.sens  ILIKE ${motif} ESCAPE '\\')
      AND (${manque}::text IS NULL
           OR (${manque} = 'toute'
               AND (SELECT COUNT(*) FROM lexique_audio m WHERE m.lexique_id = l.id) < 4)
           OR (${manque} <> 'toute'
               AND NOT EXISTS (SELECT 1 FROM lexique_audio m
                               WHERE m.lexique_id = l.id AND m.voix = ${manque})))
    GROUP BY l.id
    ORDER BY l.lang, l.rang, l.terme
    LIMIT 2000`

  // Le nom de fichier attendu par l'app (`public/audio/<slug>.mp3`) est
  // calculé ICI, avec la règle qui fait foi — la page admin ne peut pas
  // importer src/lib/slug.js, et une deuxième copie de cette règle finirait
  // par baptiser le même mot de deux façons.
  const entrees = lignes.map((e) => ({ ...e, slug: slug(e.terme) }))

  if (req.query?.format === 'csv') return csv(res, entrees)

  // Le résumé suit la LANGUE choisie mais ignore les autres filtres : c'est un
  // état des lieux (« où en est le kabyle ? »), pas le compte de ce qui est
  // affiché — sinon « il manque la voix femme » afficherait 0 voix femme.
  const [compte] = await sql()`
    SELECT COUNT(*)::int                                        AS entrees,
           COUNT(*) FILTER (WHERE statut = 'a-valider')::int     AS a_valider,
           COUNT(*) FILTER (WHERE statut = 'valide')::int        AS valides,
           COUNT(*) FILTER (WHERE statut = 'a-revoir')::int      AS a_revoir,
           COUNT(*) FILTER (WHERE statut = 'rejete')::int        AS rejetes,
           COUNT(*) FILTER (WHERE categorie = 'expression')::int AS expressions
    FROM lexique WHERE (${lang}::text IS NULL OR lang = ${lang})`

  const parVoix = await sql()`
    SELECT a.voix, COUNT(*)::int AS n
    FROM lexique_audio a JOIN lexique l ON l.id = a.lexique_id
    WHERE (${lang}::text IS NULL OR l.lang = ${lang})
    GROUP BY a.voix`

  const [completes] = await sql()`
    SELECT COUNT(*)::int AS n FROM lexique l
    WHERE (${lang}::text IS NULL OR l.lang = ${lang})
      AND (SELECT COUNT(*) FROM lexique_audio a WHERE a.lexique_id = l.id) = 4`

  return res.status(200).json({
    entrees,
    resume: {
      ...compte,
      completes: completes.n,
      parVoix: Object.fromEntries(parVoix.map((r) => [r.voix, r.n])),
    },
    // D'où vient ce qu'on relit : `dictionnaire` quand src/data/dictionnaire.js
    // est là, `cours` sinon. Affiché en clair — relire sans savoir quelle
    // extraction on relit n'aurait pas de sens.
    semeDepuis: seme.source,
    voix: VOIX,
    statuts: STATUTS,
  })
}

/**
 * L'export CSV — la fiche qu'on envoie à un locuteur qui ne veut pas d'un
 * écran. Séparateur `;` et BOM : même convention que `content-review.csv`,
 * pour qu'Excel en français l'ouvre sans poser de question.
 */
function csv(res, entrees) {
  const ech = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
  const lignes = [
    ['Langue', 'Terme retenu', 'Terme du cours', 'Français', 'Type', 'Unité', 'Leçons',
     'Fichier audio', 'Statut', 'Notes', ...VOIX]
      .map(ech)
      .join(';'),
    ...entrees.map((e) => {
      const faites = new Set((e.voix || []).map((v) => v.voix))
      return [
        e.lang,
        e.terme,
        e.cle || '(ajout)',
        e.sens || '',
        e.categorie,
        e.unite || '',
        e.lecons || '',
        `${e.slug}.mp3`,
        e.statut,
        e.notes || '',
        ...VOIX.map((v) => (faites.has(v) ? 'oui' : '')),
      ]
        .map(ech)
        .join(';')
    }),
  ].join('\r\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="tama-speak-lexique.csv"')
  return res.status(200).send('﻿' + lignes)
}

/** Ajouter une entrée à la main — le dictionnaire n'est pas borné aux leçons. */
async function lexiquePost(req, res, session) {
  const lang = texte(req.body?.lang, 12)
  const terme = texte(req.body?.terme, 120)
  if (!lang || !terme) return res.status(400).json({ error: 'langue ou terme manquant' })

  // Un terme déjà présent dans cette langue est une CORRECTION à faire sur la
  // ligne existante, pas une deuxième ligne : un doublon casserait le compte
  // des voix enregistrées et ferait enregistrer deux fois le même mot.
  const [deja] = await sql()`
    SELECT id FROM lexique WHERE lang = ${lang} AND (cle = ${terme} OR terme = ${terme}) LIMIT 1`
  if (deja) return res.status(409).json({ error: 'terme déjà au dictionnaire', id: deja.id })

  const [ligne] = await sql()`
    INSERT INTO lexique (lang, cle, terme, sens, notes, categorie, source, unite, rang, statut)
    VALUES (${lang}, NULL, ${terme}, ${texte(req.body?.sens, 200)}, ${texte(req.body?.notes, 1000)},
            ${parmi(req.body?.categorie, CATEGORIES_SET) || categorieDe(terme)},
            'ajout', ${texte(req.body?.unite, 120)}, 9999, 'a-valider')
    RETURNING id`
  return res.status(200).json({ ok: true, id: ligne.id })
}

/**
 * Corriger une entrée. Tout est modifiable, y compris pour une entrée venue
 * d'un cours : c'est `cle` — jamais touchée — qui garde le lien avec le
 * fichier du cours, et l'écart entre `cle` et `terme` qui dit ce qu'il reste
 * à reporter dans `src/data/`.
 *
 * Un champ absent du corps n'est pas modifié ; une chaîne vide EFFACE (sens,
 * notes). Sans cette distinction, on ne pourrait jamais retirer une note.
 */
async function lexiquePatch(req, res, session) {
  const id = Number(req.body?.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'id invalide' })

  const statut = parmi(req.body?.statut, STATUTS_SET)
  if (req.body?.statut !== undefined && !statut)
    return res.status(400).json({ error: 'statut invalide' })

  const terme = texte(req.body?.terme, 120)
  const categorie = parmi(req.body?.categorie, CATEGORIES_SET)
  // `undefined` (champ absent) → on garde ; `''` → on efface.
  const sens = req.body?.sens === undefined ? null : texte(req.body.sens, 200)
  const sensFourni = req.body?.sens !== undefined
  const notes = req.body?.notes === undefined ? null : texte(req.body.notes, 1000)
  const notesFourni = req.body?.notes !== undefined

  const [ligne] = await sql()`
    UPDATE lexique SET
      terme      = COALESCE(${terme}::text, terme),
      categorie  = COALESCE(${categorie}::text, categorie),
      sens       = CASE WHEN ${sensFourni}::bool  THEN ${sens}::text  ELSE sens  END,
      notes      = CASE WHEN ${notesFourni}::bool THEN ${notes}::text ELSE notes END,
      statut     = COALESCE(${statut}::text, statut),
      -- Qui a tranché, et quand. On l'inscrit dès qu'un statut est posé,
      -- fût-il « à revoir » : un doute aussi a un auteur.
      valide_par = CASE WHEN ${statut}::text IS NULL THEN valide_par ELSE ${session.user.email} END,
      valide_le  = CASE WHEN ${statut}::text IS NULL THEN valide_le  ELSE NOW() END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, terme, sens, notes, categorie, statut, valide_par, valide_le`
  if (!ligne) return res.status(404).json({ error: 'entrée introuvable' })
  return res.status(200).json({ ok: true, entree: ligne })
}

/**
 * Supprimer — réservé aux ajouts manuels. Une entrée venue du contenu
 * reviendrait au prochain ensemencement (le mot est toujours dans la leçon) :
 * la supprimer donnerait l'illusion d'avoir agi. Le geste juste est
 * « rejeté », qui reste visible et dit quoi retirer de `src/data/`.
 */
async function lexiqueDelete(req, res) {
  const id = Number(req.query?.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'id invalide' })
  const [ligne] = await sql()`SELECT id, source FROM lexique WHERE id = ${id}`
  if (!ligne) return res.status(404).json({ error: 'entrée introuvable' })
  if (ligne.source !== 'ajout')
    return res.status(409).json({
      error: 'entrée venue du contenu',
      detail:
        'Elle reviendrait au prochain chargement, puisque le mot est encore dans la leçon. ' +
        'Marque-la « rejetée », puis retire-la de src/data/ — le déploiement la fera disparaître.',
    })
  await sql()`DELETE FROM lexique WHERE id = ${id}`
  return res.status(200).json({ ok: true })
}

async function lexique(req, res, session) {
  if (req.method === 'GET') return lexiqueGet(req, res)
  if (req.method === 'POST') return lexiquePost(req, res, session)
  if (req.method === 'PATCH') return lexiquePatch(req, res, session)
  if (req.method === 'DELETE') return lexiqueDelete(req, res)
  return res.status(405).json({ error: 'méthode non autorisée' })
}

/* ------------------------------------------------------------------ */
/* ?r=voix — les quatre enregistrements d'une entrée.                   */
/*                                                                      */
/* Aucune IA, aucune synthèse, aucune notation : on garde le fichier tel */
/* quel, attribué à qui a prêté sa voix, et effaçable d'un clic. C'est   */
/* la même règle que src/lib/speakerVoice.js, et elle ne se négocie pas. */
/* ------------------------------------------------------------------ */

/** Relire une prise — renvoyée en binaire pour que <audio src> suffise. */
async function voixGet(req, res) {
  const id = Number(req.query?.id)
  const voix = parmi(req.query?.voix, VOIX_SET)
  if (!Number.isInteger(id) || !voix) return res.status(400).json({ error: 'id ou voix invalide' })
  const [a] = await sql()`
    SELECT audio_b64, audio_type FROM lexique_audio
    WHERE lexique_id = ${id} AND voix = ${voix}`
  if (!a?.audio_b64) return res.status(404).json({ error: 'enregistrement introuvable' })
  // Le type a été validé À L'ÉCRITURE contre une liste blanche ; on ne renvoie
  // donc jamais ici un en-tête choisi par un client.
  res.setHeader('Content-Type', TYPES_AUDIO.has(a.audio_type) ? a.audio_type : 'audio/webm')
  res.setHeader('Content-Disposition', 'inline')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'private, no-store')
  return res.status(200).send(Buffer.from(a.audio_b64, 'base64'))
}

/** Déposer une prise (micro du navigateur ou fichier reçu) — remplace. */
async function voixPost(req, res, session) {
  const id = Number(req.body?.id)
  const voix = parmi(req.body?.voix, VOIX_SET)
  const audio = String(req.body?.audio || '')
  const type = String(req.body?.type || 'audio/webm').trim()

  if (!Number.isInteger(id) || !voix) return res.status(400).json({ error: 'id ou voix invalide' })
  if (!audio) return res.status(400).json({ error: 'audio manquant' })
  if (audio.length > 800000) return res.status(413).json({ error: 'audio trop long (5 s suffisent)' })
  if (!TYPES_AUDIO.has(type)) return res.status(415).json({ error: `format non accepté : ${type}` })

  const [existe] = await sql()`SELECT id FROM lexique WHERE id = ${id}`
  if (!existe) return res.status(404).json({ error: 'entrée introuvable' })

  await sql()`
    INSERT INTO lexique_audio (lexique_id, voix, audio_b64, audio_type, locuteur, depose_par)
    VALUES (${id}, ${voix}, ${audio}, ${type}, ${texte(req.body?.locuteur, 80)}, ${session.user.email})
    ON CONFLICT (lexique_id, voix) DO UPDATE SET
      audio_b64  = EXCLUDED.audio_b64,
      audio_type = EXCLUDED.audio_type,
      locuteur   = EXCLUDED.locuteur,
      depose_par = EXCLUDED.depose_par,
      created_at = NOW()`
  return res.status(200).json({ ok: true })
}

async function voixDelete(req, res) {
  const id = Number(req.query?.id)
  const voix = parmi(req.query?.voix, VOIX_SET)
  if (!Number.isInteger(id) || !voix) return res.status(400).json({ error: 'id ou voix invalide' })
  await sql()`DELETE FROM lexique_audio WHERE lexique_id = ${id} AND voix = ${voix}`
  return res.status(200).json({ ok: true })
}

async function voixRoute(req, res, session) {
  if (req.method === 'GET') return voixGet(req, res)
  if (req.method === 'POST') return voixPost(req, res, session)
  if (req.method === 'DELETE') return voixDelete(req, res)
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
  if (r === 'lexique' || r === 'voix') {
    // Les deux tables de l'atelier sont les dernières arrivées du schéma :
    // sur une base installée avant le backoffice de contenu, elles n'existent
    // pas encore. Même filet que pour les abonnements.
    await assurerSchema()
    return r === 'lexique' ? lexique(req, res, session) : voixRoute(req, res, session)
  }

  return res.status(404).json({ error: 'route inconnue' })
}
