/**
 * Événements d'usage, par lots — la matière première de la rétention
 * J1/J7/J30 et des futurs classements hebdomadaires.
 *
 * Pseudonymisé à dessein : type + langue + XP + horodatage, rien d'autre.
 * Le client les met en file hors-ligne et les envoie quand il peut — d'où
 * le champ `at` fourni par le client (l'événement date du moment où il a eu
 * lieu, pas du moment où le réseau est revenu), borné à ±7 jours pour ne pas
 * accepter n'importe quoi.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'

const TYPES = new Set([
  'app_opened',
  'lesson_completed',
  'chest_opened',
  'challenge_done',
  'duo_played',
  'mission_done',
])
const LANGS = new Set(['kab', 'rif', 'shi', 'tzm', 'zgh'])
const MAX_BATCH = 100
const WEEK_MS = 7 * 24 * 3600 * 1000

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  if (req.method !== 'POST') return res.status(405).json({ error: 'méthode non autorisée' })
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })

  const batch = Array.isArray(req.body?.events) ? req.body.events.slice(0, MAX_BATCH) : []
  const now = Date.now()
  const valides = batch
    .map((e) => ({
      type: e?.type,
      lang: LANGS.has(e?.lang) ? e.lang : null,
      xp: Number.isFinite(e?.xp) ? Math.max(0, Math.min(1000, Math.round(e.xp))) : 0,
      at: new Date(e?.at || now),
    }))
    .filter((e) => TYPES.has(e.type) && !isNaN(e.at) && Math.abs(now - e.at.getTime()) < WEEK_MS)

  for (const e of valides) {
    await sql()`
      INSERT INTO events (user_id, type, lang, xp, at)
      VALUES (${session.user.id}, ${e.type}, ${e.lang}, ${e.xp}, ${e.at.toISOString()})`
  }
  return res.status(200).json({ ok: true, inserted: valides.length })
}
