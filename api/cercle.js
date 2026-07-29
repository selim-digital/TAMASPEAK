/**
 * Le cercle — famille et amis qui apprennent ensemble, et se mesurent
 * gentiment : classement de la semaine, du mois et de l'année en cours.
 *
 * Les POINTS valorisent l'EFFORT d'abord (règle du produit : on n'accuse
 * jamais, on célèbre ce qui est fait) :
 *   points = XP gagnés + 5 par duel joué + 20 par duel gagné
 * Jouer rapporte toujours ; gagner rapporte plus. Le « plus assidu »
 * (jours actifs distincts) est un titre à part entière, à égalité d'honneur
 * avec le vainqueur — c'est lui que l'email du palmarès met aussi en avant.
 *
 * GET  → { cercle, membres, classements: { semaine, mois, annee } }
 * POST → { action: 'creer', nom } | { action: 'rejoindre', code } | { action: 'quitter' }
 *
 * Un utilisateur n'appartient qu'à UN cercle à la fois : rejoindre exige
 * d'avoir quitté — la règle la plus simple à comprendre en famille.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'

const MAX_MEMBRES = 20

/** Barème — le même que celui affiché dans l'app et utilisé par le cron. */
export const POINTS = { duelJoue: 5, duelGagne: 20 }

/** Code d'invitation court, sans caractères ambigus (0/O, 1/l). */
function nouveauCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let c = ''
  for (let i = 0; i < 6; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)]
  return c
}

/**
 * Classement d'un cercle depuis `depuis` (date ISO) — calculé au moment de
 * la demande, rien n'est stocké : `events` porte déjà toute l'histoire.
 */
export async function classementDe(q, cercleId, depuis) {
  const lignes = await q`
    SELECT u.id, u."name" AS nom,
      COALESCE(SUM(e.xp), 0)::int AS xp,
      COUNT(e.id) FILTER (WHERE e.type = 'duel_won')::int AS duels_gagnes,
      COUNT(e.id) FILTER (WHERE e.type IN ('duel_won', 'duel_played'))::int AS duels_joues,
      COUNT(DISTINCT DATE(e.at)) FILTER (WHERE e.id IS NOT NULL)::int AS jours
    FROM cercle_membres m
    JOIN "user" u ON u.id = m.user_id
    LEFT JOIN events e ON e.user_id = u.id AND e.at >= ${depuis}
    WHERE m.cercle_id = ${cercleId}
    GROUP BY u.id, u."name"`
  return lignes
    .map((l) => ({
      id: l.id,
      nom: l.nom,
      xp: l.xp,
      duelsJoues: l.duels_joues,
      duelsGagnes: l.duels_gagnes,
      jours: l.jours,
      points: l.xp + POINTS.duelJoue * l.duels_joues + POINTS.duelGagne * l.duels_gagnes,
    }))
    .sort((a, b) => b.points - a.points || b.jours - a.jours || a.nom.localeCompare(b.nom))
}

/** Débuts des périodes EN COURS (l'app montre « où on en est »). */
export function debutsPeriodes(maintenant = new Date()) {
  const d = new Date(maintenant)
  const jour = (d.getUTCDay() + 6) % 7 // lundi = 0
  const semaine = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - jour))
  const mois = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
  const annee = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return { semaine, mois, annee }
}

const cercleDe = async (q, userId) => {
  const [c] = await q`
    SELECT c.id, c.nom, c.code
    FROM cercle_membres m JOIN cercles c ON c.id = m.cercle_id
    WHERE m.user_id = ${userId} LIMIT 1`
  return c || null
}

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })
  const q = sql()
  const moi = session.user.id

  if (req.method === 'GET') {
    const cercle = await cercleDe(q, moi)
    if (!cercle) return res.status(200).json({ cercle: null })
    const { semaine, mois, annee } = debutsPeriodes()
    const [membres, clSemaine, clMois, clAnnee] = await Promise.all([
      q`SELECT COUNT(*)::int AS n FROM cercle_membres WHERE cercle_id = ${cercle.id}`,
      classementDe(q, cercle.id, semaine.toISOString()),
      classementDe(q, cercle.id, mois.toISOString()),
      classementDe(q, cercle.id, annee.toISOString()),
    ])
    return res.status(200).json({
      cercle: { ...cercle, membres: membres[0]?.n || 0 },
      moi,
      bareme: POINTS,
      classements: { semaine: clSemaine, mois: clMois, annee: clAnnee },
    })
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'méthode non autorisée' })
  const { action } = req.body || {}

  if (action === 'creer') {
    const nom = String(req.body?.nom || '').trim().slice(0, 40)
    if (!nom) return res.status(400).json({ error: 'donne un nom à ton cercle' })
    if (await cercleDe(q, moi)) return res.status(409).json({ error: 'tu es déjà dans un cercle' })
    // Collision de code : astronomiquement rare (31^6), mais on réessaie
    // plutôt que d'échouer pour si peu.
    for (let essai = 0; essai < 3; essai++) {
      const code = nouveauCode()
      try {
        const [c] = await q`
          INSERT INTO cercles (nom, code, created_by) VALUES (${nom}, ${code}, ${moi})
          RETURNING id, nom, code`
        await q`INSERT INTO cercle_membres (cercle_id, user_id) VALUES (${c.id}, ${moi})`
        // L'acte de créer/rejoindre vaut consentement au palmarès (dit en
        // clair dans l'app) — révocable, et le one-click arrête tout.
        await q`
          INSERT INTO email_prefs (user_id, palmares) VALUES (${moi}, TRUE)
          ON CONFLICT (user_id) DO UPDATE SET palmares = TRUE, updated_at = NOW()`
        return res.status(200).json({ ok: true, cercle: { ...c, membres: 1 } })
      } catch (e) {
        if (!String(e?.message || '').includes('cercles_code_key')) throw e
      }
    }
    return res.status(500).json({ error: 'réessaie dans un instant' })
  }

  if (action === 'rejoindre') {
    const code = String(req.body?.code || '').trim().toUpperCase()
    if (!code) return res.status(400).json({ error: 'il faut le code du cercle' })
    if (await cercleDe(q, moi)) return res.status(409).json({ error: 'tu es déjà dans un cercle — quitte-le d’abord' })
    const [c] = await q`SELECT id, nom, code FROM cercles WHERE code = ${code}`
    if (!c) return res.status(404).json({ error: 'aucun cercle avec ce code' })
    const [{ n }] = await q`SELECT COUNT(*)::int AS n FROM cercle_membres WHERE cercle_id = ${c.id}`
    if (n >= MAX_MEMBRES) return res.status(409).json({ error: 'ce cercle est complet' })
    await q`
      INSERT INTO cercle_membres (cercle_id, user_id) VALUES (${c.id}, ${moi})
      ON CONFLICT DO NOTHING`
    await q`
      INSERT INTO email_prefs (user_id, palmares) VALUES (${moi}, TRUE)
      ON CONFLICT (user_id) DO UPDATE SET palmares = TRUE, updated_at = NOW()`
    return res.status(200).json({ ok: true, cercle: { ...c, membres: n + 1 } })
  }

  if (action === 'quitter') {
    const cercle = await cercleDe(q, moi)
    if (!cercle) return res.status(404).json({ error: 'tu n’es dans aucun cercle' })
    await q`DELETE FROM cercle_membres WHERE cercle_id = ${cercle.id} AND user_id = ${moi}`
    // Un cercle vide ne sert plus à personne — on ne garde pas de coquilles.
    await q`
      DELETE FROM cercles c WHERE c.id = ${cercle.id}
      AND NOT EXISTS (SELECT 1 FROM cercle_membres m WHERE m.cercle_id = c.id)`
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'action inconnue' })
}
