/**
 * Préférences email de l'utilisateur connecté — GET pour lire, POST pour
 * écrire. C'est l'interrupteur que le cron des relances consulte : sans
 * ligne ici (ou avec relances=false), il ne part RIEN d'autre que les
 * emails transactionnels. L'opt-in se coche dans l'app, jamais d'office.
 *
 * Écrire des préférences efface un éventuel désabonnement one-click
 * (unsubscribed_at) : recocher la case DANS l'app est un consentement
 * plus récent que le clic de désabonnement d'hier.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })
  const userId = session.user.id

  if (req.method === 'GET') {
    const [r] = await sql()`
      SELECT relances, resume_hebdo FROM email_prefs WHERE user_id = ${userId}`
    return res.status(200).json({
      relances: r?.relances ?? false,
      resumeHebdo: r?.resume_hebdo ?? false,
    })
  }

  if (req.method === 'POST') {
    const relances = req.body?.relances === true
    const resumeHebdo = req.body?.resumeHebdo === true
    await sql()`
      INSERT INTO email_prefs (user_id, relances, resume_hebdo, unsubscribed_at, updated_at)
      VALUES (${userId}, ${relances}, ${resumeHebdo}, NULL, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET relances = ${relances}, resume_hebdo = ${resumeHebdo},
            unsubscribed_at = NULL, updated_at = NOW()`
    return res.status(200).json({ ok: true, relances, resumeHebdo })
  }

  return res.status(405).json({ error: 'méthode non autorisée' })
}
