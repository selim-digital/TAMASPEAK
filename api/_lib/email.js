/**
 * Envoi d'email via Resend — inerte tant que RESEND_API_KEY est absent.
 *
 * Décisions issues du rapport de délivrabilité (27/07/2026, sourcé) :
 *   • expéditeur sur un SOUS-DOMAINE dédié (send.tamaspeak.com) pour isoler
 *     la réputation — recommandation explicite de Resend ;
 *   • en-têtes `List-Unsubscribe` + `List-Unsubscribe-Post` (RFC 8058) sur
 *     tout email NON transactionnel : exigés par Gmail/Yahoo pour les gros
 *     volumes, et le seuil de plaintes Resend (0,08 %) est plus strict que
 *     celui de Gmail (0,3 %) — on peut être suspendu par Resend avant même
 *     d'inquiéter Google ;
 *   • palier gratuit : 3 000/mois ET 100/jour — le plafond JOURNALIER tombe
 *     en premier, ne jamais programmer d'envoi de masse à heure fixe.
 *
 * Les gabarits vivent dans api/_lib/templates.js (logo, palette, FR simple).
 */
import { renderTemplate } from './templates.js'

export const emailReady = () => !!process.env.RESEND_API_KEY

const FROM = process.env.EMAIL_FROM || 'Tama Speak <bonjour@send.tamaspeak.com>'
const UNSUB_URL = process.env.UNSUB_URL || 'https://tamaspeak.com/api/unsubscribe'

/**
 * @param {object} p
 * @param {string} p.to
 * @param {string} p.subject
 * @param {string} p.template  nom du gabarit (voir templates.js)
 * @param {object} p.data      variables du gabarit
 * @param {boolean} [p.marketing]  true → en-têtes de désabonnement + lien visible
 * @returns {Promise<boolean>} envoyé ou non (false = pas de clé, pas une erreur)
 */
/**
 * Garde-fou de quota (audit) : compteur EN BASE — déterministe et partagé
 * entre instances, contrairement au limiteur mémoire qui a causé deux
 * pannes. 5 envois/jour par adresse (personne n'a besoin de plus de codes),
 * 80/jour au total (marge de 20 sous le plafond Resend, pour que la
 * connexion par code reste vivante même si les relances dérapent).
 * En cas de doute (base injoignable), on LAISSE PASSER : rater une relance
 * est bénin, bloquer une connexion ne l'est pas.
 */
async function quotaOk(to) {
  try {
    const { serverReady, sql } = await import('./db.js')
    if (!serverReady()) return true
    const [ligne] = await sql()`
      INSERT INTO email_quota (day, email, n) VALUES (CURRENT_DATE, ${to.toLowerCase()}, 1)
      ON CONFLICT (day, email) DO UPDATE SET n = email_quota.n + 1
      RETURNING n`
    if ((ligne?.n || 0) > 5) return false
    const [total] = await sql()`
      SELECT COALESCE(SUM(n), 0)::int AS t FROM email_quota WHERE day = CURRENT_DATE`
    return (total?.t || 0) <= 80
  } catch (e) {
    console.error('[tama] quota email indécidable, on laisse passer :', e?.message)
    return true
  }
}

export async function sendEmail({ to, subject, template, data = {}, marketing = false }) {
  if (!emailReady()) return false
  if (!(await quotaOk(to))) {
    console.error(`[tama] quota email atteint — envoi refusé vers ${to} (${template})`)
    return false
  }
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const unsubscribe = marketing ? `${UNSUB_URL}?email=${encodeURIComponent(to)}` : null
  const html = renderTemplate(template, { ...data, unsubscribe })

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
    headers: unsubscribe
      ? {
          'List-Unsubscribe': `<${unsubscribe}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined,
  })
  if (error) {
    console.error('[tama] échec email', template, error?.message || error)
    return false
  }
  return true
}
