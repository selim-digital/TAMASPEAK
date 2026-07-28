/**
 * Tableau de bord admin — les chiffres qui disent si l'app apprend
 * réellement quelque chose à quelqu'un, pas les chiffres qui flattent.
 *
 *   • actifs J/7J/30J (personnes distinctes, pas ouvertures) ;
 *   • leçons terminées par langue (le produit sert-il les 5 langues ?) ;
 *   • rétention J1/J7/J30 par cohorte d'inscription : « parmi les inscrits
 *     d'il y a N jours, combien sont revenus depuis ? » ;
 *   • activité des 30 derniers jours, pour la courbe.
 */
import { serverReady, notConfigured, sql } from '../_lib/db.js'
import { sessionOf, isAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!isAdmin(session)) return res.status(403).json({ error: 'accès refusé' })
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
