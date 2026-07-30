/**
 * Palmarès du cercle — la phase email, appelée par le cron QUOTIDIEN
 * existant (api/cron/relances.js) : le plan Vercel plafonne à 12 fonctions
 * et elles y sont déjà toutes — pas de 13ᵉ, on partage le passage de 9 h.
 *
 * Ce qui est dû se décide ici :
 *   • lundi        → palmarès de la SEMAINE écoulée ;
 *   • le 1ᵉʳ       → palmarès du MOIS écoulé ;
 *   • 1ᵉʳ janvier  → palmarès de l'ANNÉE écoulée.
 * Un 1ᵉʳ janvier qui tombe un lundi envoie les trois — le budget par
 * passage l'encaisse, et l'anti-doublon est par personne + période : un
 * envoi refusé (quota plein) n'est pas journalisé et repart au passage
 * suivant du même jour d'éligibilité… c'est-à-dire jamais pour l'hebdo
 * raté — assumé : mieux vaut un palmarès manqué qu'un doublon ou un
 * cron qui court après son retard.
 *
 * Le cercle étant fait de liens DEUX-À-DEUX, chacun reçoit le palmarès de
 * SON cercle (soi + ses reliés) — les listes de deux proches peuvent donc
 * différer, et c'est honnête : on ne montre à chacun que les gens qu'il
 * connaît. Consentement : l'acte de se relier (dit en clair dans l'app),
 * préférence `palmares` et désabonnement one-click pour tout arrêter.
 * Cercle vide ou sans activité sur la période : pas d'email.
 */
import { sql } from './db.js'
import { sendEmail } from './email.js'
import { classementEntre } from '../distance.js'

/** Les palmarès dus aujourd'hui : [{ nom, debut, fin, cle, libelle }]. */
export function palmaresDus(maintenant = new Date()) {
  const d = maintenant
  const dus = []
  const jourISO = (x) => x.toISOString().slice(0, 10)
  if (((d.getUTCDay() + 6) % 7) === 0) {
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
      dus.push({
        nom: 'annuel',
        debut: debutAn,
        fin,
        cle: `annuel-${d.getUTCFullYear() - 1}`,
        libelle: `de l'année ${d.getUTCFullYear() - 1}`,
      })
    }
  }
  return dus
}

/**
 * Envoie les palmarès dus, dans la limite de `budget` emails.
 * @returns {{ envoyes: number, refuses: number, budget: number }}
 */
export async function envoyerPalmares(budget) {
  const q = sql()
  const bilan = { envoyes: 0, refuses: 0 }
  const dus = palmaresDus()
  if (!dus.length || budget <= 0) return { ...bilan, budget }

  // Les personnes reliées à au moins un proche — les seules concernées.
  const gens = await q`
    SELECT DISTINCT u.id, u."name" AS nom, u."email"
    FROM "user" u
    JOIN cercle_liens l ON l.accepted_at IS NOT NULL
      AND (l.createur = u.id OR l.invite = u.id)
    ORDER BY u.id ASC LIMIT 300`

  for (const periode of dus) {
    for (const personne of gens) {
      if (budget <= 0) return { ...bilan, budget }
      const kind = `email-palmares-${periode.cle}`
      const [deja] = await q`
        SELECT 1 FROM notifications WHERE user_id = ${personne.id} AND kind = ${kind} LIMIT 1`
      if (deja) continue
      // Préférence : ligne absente = consentie à la liaison ; FALSE = refus.
      const [pref] = await q`
        SELECT palmares, unsubscribed_at FROM email_prefs WHERE user_id = ${personne.id}`
      if (pref && (pref.palmares === false || pref.unsubscribed_at)) continue

      const relies = await q`
        SELECT CASE WHEN l.createur = ${personne.id} THEN l.invite ELSE l.createur END AS id
        FROM cercle_liens l
        WHERE l.accepted_at IS NOT NULL AND (l.createur = ${personne.id} OR l.invite = ${personne.id})`
      const ids = [personne.id, ...relies.map((r) => r.id)]
      if (ids.length < 2) continue

      const classement = await classementEntre(ids, periode.debut, periode.fin)
      const actifs = classement.filter((l) => l.points > 0)
      if (actifs.length === 0) continue // personne n'a joué : rien à honorer

      const totalXp = classement.reduce((s, l) => s + l.xp, 0)
      const assidu = [...classement].sort((a, b) => b.jours - a.jours || b.xp - a.xp)[0]

      const ok = await sendEmail({
        to: personne.email,
        subject: `🏆 Le palmarès ${periode.libelle} de ton cercle`,
        template: 'palmares',
        data: {
          name: personne.nom,
          cercle: 'ton cercle',
          periode: periode.libelle,
          lignes: classement.map(({ nom, points, xp, jours }) => ({ nom, points, xp, jours })),
          vainqueur: actifs[0]?.nom || null,
          assidu: assidu?.jours > 0 ? assidu.nom : null,
          totalXp,
        },
        marketing: true,
      })
      if (ok) {
        await q`INSERT INTO notifications (user_id, kind, title)
                VALUES (${personne.id}, ${kind}, ${'Palmarès ' + periode.libelle + ' envoyé'})`
        bilan.envoyes++
        budget--
      } else bilan.refuses++
    }
  }
  return { ...bilan, budget }
}
