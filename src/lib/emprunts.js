/**
 * Mémoire des modales d'emprunt : quelles explications l'élève a déjà lues.
 *
 * POURQUOI une mémoire. Un même mot revient dix fois dans un cours (« ssalamu
 * ɛlikum » ouvre trois leçons du tarifit, plus les quiz de révision et le défi
 * du jour). Rejouer l'explication à chaque bonne réponse la transformerait en
 * péage : au troisième passage, on ferme sans lire. Elle s'affiche donc une
 * fois par mot et par langue, à la première bonne réponse — là où elle
 * apprend quelque chose.
 *
 * Remettre une langue à zéro (profil → recommencer) efface aussi ses modales :
 * qui repart de la leçon 1 doit retrouver le cours entier, explications
 * comprises.
 *
 * Comme partout ici, la panne de stockage n'est pas une erreur : en navigation
 * privée, `storage.js` renvoie simplement `null` et la modale se réaffichera —
 * mieux vaut une explication de trop qu'une leçon qui plante.
 */
import { lireJson, ecrireJson } from './storage.js'

const CLE = 'tama-speak:emprunts-vus'

const charger = () => {
  const v = lireJson(CLE, [])
  return Array.isArray(v) ? v : []
}

const marque = (langId, mot) => `${langId}:${mot}`

/** Cette explication a-t-elle déjà été lue pour ce mot ? */
export function dejaVu(langId, mot) {
  return charger().includes(marque(langId, mot))
}

/** Retenir qu'elle vient d'être lue. */
export function marquerVu(langId, mot) {
  const vus = charger()
  const m = marque(langId, mot)
  if (vus.includes(m)) return
  ecrireJson(CLE, [...vus, m])
}

/** Oublier les modales d'une langue — appelé quand on la remet à zéro. */
export function oublierEmprunts(langId) {
  if (!langId) return ecrireJson(CLE, [])
  ecrireJson(
    CLE,
    charger().filter((m) => !m.startsWith(`${langId}:`)),
  )
}
