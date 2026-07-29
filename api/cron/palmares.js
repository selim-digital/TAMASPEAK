/**
 * Palmarès des cercles — le cron (vercel.json → crons, 8 h 30 UTC).
 *
 * Un seul passage quotidien qui décide de ce qui est dû :
 *   • lundi        → palmarès de la SEMAINE écoulée ;
 *   • le 1ᵉʳ       → palmarès du MOIS écoulé ;
 *   • 1ᵉʳ janvier  → palmarès de l'ANNÉE écoulée.
 * Un 1ᵉʳ janvier qui tombe un lundi envoie les trois — le budget par
 * passage l'encaisse, et l'anti-doublon est par PÉRIODE + membre : un
 * envoi refusé (quota plein) n'est pas journalisé et repartira au
 * prochain passage éligible.
 *
 * L'email va aux membres du cercle : le consentement vient de l'acte de
 * rejoindre (dit en clair dans l'app), il est révocable — préférence
 * `palmares` et désabonnement one-click arrêtent tout. Cercles d'une seule
 * personne ou sans activité sur la période : pas d'email, un palmarès
 * vide n'honore personne.
 *
 * Protection : Vercel appelle avec `Authorization: Bearer CRON_SECRET`.
 */
import { serverReady, notConfigured, sql } from '../_lib/db.js'
import { sendEmail } from '../_lib/email.js'

const MAX_PAR_PASSAGE = 40

/** Les palmarès dus aujourd'hui : [{ nom, depuis, jusqu'à, clé, libellé }]. */
export function palmaresDus(maintenant = new Date()) {
  const d = maintenant
  const dus = []
  const jourISO = (x) => x.toISOString().slice(0, 10)
  if (((d.getUTCDay() + 6) % 7) === 0) {
    // Lundi : la semaine écoulée [lundi-7, lundi).
    const fin = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    const debut = new Date(fin.getTime() - 7 * 24 * 3600 * 1000)
    dus.push({ nom: 'hebdo', debut, fin, cle: `hebdo-${jourISO(debut)}`, libelle: 'de la semaine' })
  }
  if (d.getUTCDate() === 1) {
    const fin = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    const debut = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1))
    dus.push({ nom: 'mensuel', debut, fin, cle: `mensuel-${jourISO(debut)}`, libelle: 'du mois' })
    if (d.getUTCMonth() === 0) {
      const debutAn = new Date(Date.UTC(d.getUTCFullYear() - 1, 0, 1))
      dus.push({ nom: 'annuel', debut: debutAn, fin, cle: `annuel-${d.getUTCFullYear() - 1}`, libelle: `de l'année ${d.getUTCFullYear() - 1}` })
    }
  }
  return dus
}

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'réservé au cron' })
  }

  const q = sql()
  const dus = palmaresDus()
  const bilan = { periodes: dus.map((p) => p.nom), envoyes: 0, refuses: 0, cerclesMuets: 0 }
  let budget = MAX_PAR_PASSAGE

  for (const periode of dus) {
    if (budget <= 0) break
    const cercles = await q`SELECT id, nom FROM cercles ORDER BY id ASC LIMIT 200`
    for (const cercle of cercles) {
      if (budget <= 0) break

      // Le classement de la période ÉCOULÉE — borné des deux côtés, à la
      // différence de celui de l'app (période en cours, ouverte à droite).
      const lignes = await q`
        SELECT u.id, u."name" AS nom, u."email",
          COALESCE(SUM(e.xp), 0)::int AS xp,
          COUNT(e.id) FILTER (WHERE e.type = 'duel_won')::int AS duels_gagnes,
          COUNT(e.id) FILTER (WHERE e.type IN ('duel_won', 'duel_played'))::int AS duels_joues,
          COUNT(DISTINCT DATE(e.at))::int AS jours
        FROM cercle_membres m
        JOIN "user" u ON u.id = m.user_id
        LEFT JOIN events e ON e.user_id = u.id
          AND e.at >= ${periode.debut.toISOString()} AND e.at < ${periode.fin.toISOString()}
        WHERE m.cercle_id = ${cercle.id}
        GROUP BY u.id, u."name", u."email"`
      const classement = lignes
        .map((l) => ({
          ...l,
          points: l.xp + 5 * l.duels_joues + 20 * l.duels_gagnes,
        }))
        .sort((a, b) => b.points - a.points || b.jours - a.jours || a.nom.localeCompare(b.nom))

      // Un palmarès n'a de sens qu'à plusieurs, et avec de l'activité.
      const totalXp = classement.reduce((s, l) => s + l.xp, 0)
      const actifs = classement.filter((l) => l.points > 0)
      if (classement.length < 2 || actifs.length === 0) {
        bilan.cerclesMuets++
        continue
      }

      const vainqueur = actifs[0]?.nom || null
      const assidu = [...classement].sort((a, b) => b.jours - a.jours || b.xp - a.xp)[0]
      const kind = `email-palmares-${periode.cle}-c${cercle.id}`

      for (const membre of classement) {
        if (budget <= 0) break
        // Anti-doublon par membre, période et cercle.
        const [deja] = await q`
          SELECT 1 FROM notifications WHERE user_id = ${membre.id} AND kind = ${kind} LIMIT 1`
        if (deja) continue
        // Préférence : absente = consentie à l'adhésion ; FALSE = refusée.
        const [pref] = await q`
          SELECT palmares, unsubscribed_at FROM email_prefs WHERE user_id = ${membre.id}`
        if (pref && (pref.palmares === false || pref.unsubscribed_at)) continue

        const ok = await sendEmail({
          to: membre.email,
          subject: `🏆 Le palmarès ${periode.libelle} de « ${cercle.nom} »`,
          template: 'palmares',
          data: {
            name: membre.nom,
            cercle: cercle.nom,
            periode: periode.libelle,
            lignes: classement.map(({ nom, points, xp, jours }) => ({ nom, points, xp, jours })),
            vainqueur,
            assidu: assidu?.jours > 0 ? assidu.nom : null,
            totalXp,
          },
          marketing: true,
        })
        if (ok) {
          await q`INSERT INTO notifications (user_id, kind, title)
                  VALUES (${membre.id}, ${kind}, ${'Palmarès ' + periode.libelle + ' envoyé'})`
          bilan.envoyes++
          budget--
        } else bilan.refuses++
      }
    }
  }

  return res.status(200).json({ ok: true, ...bilan })
}
