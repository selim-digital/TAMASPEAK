/**
 * La table rase — effacer toute trace locale d'une personne sur cet appareil.
 *
 * Supprimer son compte, c'est demander une VRAIE table rase. Garder la
 * progression locale faisait revenir l'utilisateur « déjà connu » au
 * lancement suivant : sans onboarding, avec « Reprendre » au lieu de
 * « Commencer », alors qu'il venait d'exercer son droit à l'effacement.
 * Vécu, et corrigé.
 *
 * Ce module ne connaît AUCUN nom de clé : il demande à chaque module
 * d'oublier ce qui lui appartient. Une liste de littéraux recopiée ici
 * divergerait au premier renommage, et l'oubli serait alors partiel — le pire
 * des états, puisqu'il a l'air complet.
 *
 * Il porte aussi l'état « suppression demandée mais pas encore confirmée » :
 * nos comptes n'ont pas de mot de passe, la preuve d'identité est la boîte
 * mail, et l'effacement réel n'a lieu qu'au clic dans l'email — souvent dans
 * un AUTRE navigateur que l'app. Cet état est donc ce qui permet à l'app de
 * reconnaître, à son retour au premier plan, que le compte a disparu.
 */
import { resetStore } from './progress.js'
import { oublierSession } from './api.js'
import { oublierAbonnement } from './abonnement.js'
import { oublierEmprunts } from './emprunts.js'
import { lire, ecrire, effacer } from './storage.js'

const CLE_SUPPR = 'tama-speak:suppression-demandee'

/** La date ISO de la demande de suppression, ou null. */
export const suppressionDemandee = () => lire(CLE_SUPPR)

/**
 * Inscrit (ou retire) la demande. Sans cette trace, l'utilisateur repartait
 * en croyant son compte effacé et le retrouvait intact au lancement suivant.
 */
export const noterSuppression = (valeur) =>
  valeur ? ecrire(CLE_SUPPR, valeur) : effacer(CLE_SUPPR)

/**
 * Efface tout : progression, session, file d'événements, verdict
 * d'abonnement, demande de suppression. Rien ne doit survivre.
 */
export function tableRase() {
  resetStore()
  oublierSession()
  oublierAbonnement()
  // Sans langue : toutes. Les modales d'emprunt ne s'affichent qu'une fois
  // par mot — les laisser vues priverait le suivant de ce qu'elles disent.
  oublierEmprunts(null)
  effacer(CLE_SUPPR)
}
