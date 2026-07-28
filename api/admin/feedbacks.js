/**
 * Feedbacks côté admin : lecture paginée + changement de statut
 * (nouveau → vu → traité). PATCH plutôt que DELETE : on ne supprime pas la
 * parole des utilisateurs, on la traite.
 */
import { serverReady, notConfigured, sql } from '../_lib/db.js'
import { sessionOf, isAdmin } from '../_lib/auth.js'

const STATUTS = new Set(['nouveau', 'vu', 'traite'])

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!isAdmin(session)) return res.status(403).json({ error: 'accès refusé' })

  if (req.method === 'GET') {
    const statut = STATUTS.has(req.query?.status) ? req.query.status : null
    const rows = statut
      ? await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    WHERE f.status = ${statut} ORDER BY f.created_at DESC LIMIT 100`
      : await sql()`SELECT f.*, u."email" FROM feedbacks f LEFT JOIN "user" u ON u.id = f.user_id
                    ORDER BY f.created_at DESC LIMIT 100`
    return res.status(200).json({ feedbacks: rows })
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
