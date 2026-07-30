/**
 * Relances par email — le cron quotidien (vercel.json → crons, 9 h UTC).
 *
 * Séquence sobre, décidée avec la recherche : JAMAIS de culpabilisation.
 *   • bienvenue     — compte créé hier (transactionnel, pas d'opt-in requis) ;
 *   • relance J+2   — opt-in uniquement, inactif depuis 2 jours, UNE fois ;
 *   • bilan J+7     — opt-in uniquement, une semaine après l'inscription ;
 *   • résumé hebdo  — opt-in dédié, et SEULEMENT pour qui a été actif.
 * Après la J+2 et le bilan : plus AUCUNE relance d'inactivité — le résumé
 * hebdo ne part qu'aux actifs. On ne harcèle pas les partis.
 *
 * Anti-doublon : chaque envoi est journalisé dans la table notifications
 * (kind 'email-…') — pas de nouvelle table, et l'historique est visible.
 * Quota : sendEmail applique déjà 5/jour/adresse et 80/jour global ; le
 * cron se borne en plus à 40 envois par passage, les plus anciens d'abord.
 *
 * Protection : Vercel appelle avec `Authorization: Bearer CRON_SECRET`.
 * Sans la variable, l'endpoint refuse tout — il ne doit jamais être public.
 */
import { serverReady, notConfigured, sql, assurerSchema } from '../_lib/db.js'
import { sendEmail } from '../_lib/email.js'
import { envoyerPalmares } from '../_lib/palmares.js'

const MAX_PAR_PASSAGE = 40

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'réservé au cron' })
  }
  // Zéro manip au déploiement : les tables récentes s'installent seules.
  await assurerSchema()

  const q = sql()
  const envoyes = { palmares: 0, bienvenue: 0, j2: 0, j7: 0, hebdo: 0, refuses: 0 }
  let budget = MAX_PAR_PASSAGE

  // ---- Palmarès du cercle (lundi / le 1ᵉʳ / le 1ᵉʳ janvier) ------------
  // En PREMIER : ses jours d'envoi sont rares, il ne doit pas trouver un
  // budget déjà mangé par les relances quotidiennes.
  {
    const r = await envoyerPalmares(budget)
    envoyes.palmares = r.envoyes
    envoyes.refuses += r.refuses
    budget = r.budget
  }

  const dejaEnvoye = async (userId, kind) => {
    const [r] = await q`
      SELECT 1 FROM notifications WHERE user_id = ${userId} AND kind = ${kind} LIMIT 1`
    return !!r
  }
  const journaliser = (userId, kind, title) =>
    q`INSERT INTO notifications (user_id, kind, title) VALUES (${userId}, ${kind}, ${title})`

  // ---- Bienvenue : comptes créés il y a 2 h à 2 jours ------------------
  const nouveaux = await q`
    SELECT id, "name", "email" FROM "user"
    WHERE "createdAt" BETWEEN NOW() - INTERVAL '2 days' AND NOW() - INTERVAL '2 hours'
    ORDER BY "createdAt" ASC LIMIT 50`
  for (const u of nouveaux) {
    if (budget <= 0) break
    if (await dejaEnvoye(u.id, 'email-bienvenue')) continue
    const ok = await sendEmail({
      to: u.email,
      subject: 'Ansuf ! Ton compte Tama Speak est prêt 🌿',
      template: 'bienvenue',
      data: { name: u.name },
    })
    if (ok) {
      await journaliser(u.id, 'email-bienvenue', 'Email de bienvenue envoyé')
      envoyes.bienvenue++
      budget--
    } else envoyes.refuses++
  }

  // ---- Relance J+2 : opt-in, inactif depuis 2 jours, UNE seule fois ----
  const inactifs = await q`
    SELECT u.id, u."name", u."email"
    FROM "user" u
    JOIN email_prefs p ON p.user_id = u.id
    WHERE p.relances = TRUE AND p.unsubscribed_at IS NULL
      AND u."createdAt" < NOW() - INTERVAL '2 days'
      AND NOT EXISTS (
        SELECT 1 FROM events e WHERE e.user_id = u.id AND e.at > NOW() - INTERVAL '2 days')
    ORDER BY u."createdAt" ASC LIMIT 50`
  for (const u of inactifs) {
    if (budget <= 0) break
    if (await dejaEnvoye(u.id, 'email-relance-j2')) continue
    const ok = await sendEmail({
      to: u.email,
      subject: 'Une nouvelle chose à découvrir sur Tama Speak',
      template: 'relance-j2',
      data: { name: u.name },
      marketing: true,
    })
    if (ok) {
      await journaliser(u.id, 'email-relance-j2', 'Relance J+2 envoyée')
      envoyes.j2++
      budget--
    } else envoyes.refuses++
  }

  // ---- Bilan J+7 : opt-in, une semaine après l'inscription -------------
  const semaine = await q`
    SELECT u.id, u."name", u."email",
      COALESCE((SELECT SUM(e.xp)::int FROM events e WHERE e.user_id = u.id), 0) AS xp,
      COALESCE((SELECT COUNT(*)::int FROM events e
                WHERE e.user_id = u.id AND e.type = 'lesson_completed'), 0) AS lecons
    FROM "user" u
    JOIN email_prefs p ON p.user_id = u.id
    WHERE p.relances = TRUE AND p.unsubscribed_at IS NULL
      AND u."createdAt" BETWEEN NOW() - INTERVAL '8 days' AND NOW() - INTERVAL '7 days'
    ORDER BY u."createdAt" ASC LIMIT 50`
  for (const u of semaine) {
    if (budget <= 0) break
    if (await dejaEnvoye(u.id, 'email-bilan-j7')) continue
    const ok = await sendEmail({
      to: u.email,
      subject: 'Ta première semaine sur Tama Speak 🎉',
      template: 'bilan-j7',
      data: { name: u.name, xp: u.xp, lecons: u.lecons },
      marketing: true,
    })
    if (ok) {
      await journaliser(u.id, 'email-bilan-j7', 'Bilan J+7 envoyé')
      envoyes.j7++
      budget--
    } else envoyes.refuses++
  }

  // ---- Résumé hebdo : opt-in dédié, actifs de la semaine seulement -----
  const actifs = await q`
    SELECT u.id, u."name", u."email",
      COALESCE((SELECT SUM(e.xp)::int FROM events e
                WHERE e.user_id = u.id AND e.at > NOW() - INTERVAL '7 days'), 0) AS xp,
      COALESCE((SELECT COUNT(*)::int FROM events e
                WHERE e.user_id = u.id AND e.type = 'lesson_completed'
                  AND e.at > NOW() - INTERVAL '7 days'), 0) AS lecons
    FROM "user" u
    JOIN email_prefs p ON p.user_id = u.id
    WHERE p.resume_hebdo = TRUE AND p.unsubscribed_at IS NULL
      AND EXISTS (
        SELECT 1 FROM events e WHERE e.user_id = u.id AND e.at > NOW() - INTERVAL '7 days')
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = u.id AND n.kind = 'email-hebdo'
          AND n.created_at > NOW() - INTERVAL '6 days')
    ORDER BY u."createdAt" ASC LIMIT 50`
  for (const u of actifs) {
    if (budget <= 0) break
    const ok = await sendEmail({
      to: u.email,
      subject: 'Ta semaine en amazigh ⵣ',
      template: 'resume-hebdo',
      data: { name: u.name, xp: u.xp, lecons: u.lecons },
      marketing: true,
    })
    if (ok) {
      await journaliser(u.id, 'email-hebdo', 'Résumé hebdo envoyé')
      envoyes.hebdo++
      budget--
    } else envoyes.refuses++
  }

  return res.status(200).json({ ok: true, envoyes })
}
