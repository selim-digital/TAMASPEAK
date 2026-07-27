/**
 * Le seul endroit de l'app qui touche `localStorage`.
 *
 * Pourquoi centraliser : le jour où la progression se synchronise avec un
 * serveur, il faut UN point de bascule, pas une chasse aux appels dispersés.
 * `progress.js` et `sfx.js` passent tous deux par ici.
 *
 * Toutes les fonctions sont tolérantes à la panne : en navigation privée
 * Safari, `localStorage` lève à l'écriture. Une app qui ne peut pas retenir la
 * progression doit continuer à fonctionner — sans planter, sans prévenir.
 */

export function lire(cle) {
  try {
    return localStorage.getItem(cle)
  } catch {
    return null
  }
}

export function ecrire(cle, valeur) {
  try {
    localStorage.setItem(cle, valeur)
    return true
  } catch {
    return false
  }
}

export function effacer(cle) {
  try {
    localStorage.removeItem(cle)
    return true
  } catch {
    return false
  }
}

/** Lecture JSON : renvoie `defaut` si la clé est absente ou illisible. */
export function lireJson(cle, defaut = null) {
  const brut = lire(cle)
  if (!brut) return defaut
  try {
    return JSON.parse(brut)
  } catch {
    return defaut
  }
}

export const ecrireJson = (cle, valeur) => ecrire(cle, JSON.stringify(valeur))
