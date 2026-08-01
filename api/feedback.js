/**
 * Dépôt de feedback — PUBLIC : le compte n'est pas requis pour nous dire
 * qu'un truc cloche, et l'emoji seul suffit (le public n'est pas toujours à
 * l'aise à l'écrit en français).
 *
 * Garde-fou minimal contre l'abus : limite par IP dans la mémoire de
 * l'instance. C'est faible (les fonctions serverless redémarrent), et c'est
 * ASSUMÉ : le pire cas est du spam en base, pas une fuite. Un vrai
 * rate-limit partagé viendra avec un stockage KV s'il devient nécessaire.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'
import { sansVisages } from './_lib/texte.js'

const MOODS = new Set(['love', 'good', 'meh', 'bad'])
const CATS = new Set(['idee', 'bug', 'contenu', 'autre'])
const LANGS = new Set(['kab', 'rif', 'shi', 'tzm', 'zgh'])

const seen = new Map() // ip -> [timestamps]
function tooMany(ip) {
  const now = Date.now()
  const arr = (seen.get(ip) || []).filter((t) => now - t < 3600_000)
  arr.push(now)
  seen.set(ip, arr)
  return arr.length > 10
}

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  if (req.method !== 'POST') return res.status(405).json({ error: 'méthode non autorisée' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'inconnu'
  if (tooMany(ip)) return res.status(429).json({ error: 'trop de retours d’un coup — réessaie plus tard' })

  const { mood, category, message, lang } = req.body || {}
  if (!MOODS.has(mood)) return res.status(400).json({ error: 'humeur manquante' })

  const session = await sessionOf(req)
  await sql()`
    INSERT INTO feedbacks (user_id, mood, category, message, lang)
    VALUES (
      ${session?.user?.id || null},
      ${mood},
      ${CATS.has(category) ? category : null},
      ${typeof message === 'string' ? sansVisages(message.slice(0, 1000)) : null},
      ${LANGS.has(lang) ? lang : null}
    )`
  return res.status(200).json({ ok: true })
}
