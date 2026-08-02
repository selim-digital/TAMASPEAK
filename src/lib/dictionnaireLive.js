/**
 * Le TRANSPORT des corrections publiées — aller les chercher, les garder.
 *
 * LE PROBLÈME QUE CE MODULE RÉSOUT. Le dictionnaire de l'app vit dans son
 * bundle (`src/data/dictionnaire.js`) : c'est ce qui le rend consultable dans
 * le métro, et cela ne changera pas. Mais un mot faux relu et corrigé au
 * backoffice restait faux chez les élèves jusqu'au déploiement suivant —
 * autrement dit, la relecture d'un locuteur natif n'atteignait personne tant
 * qu'un développeur n'avait pas repris son clavier.
 *
 * D'où cette COUCHE : le serveur ne renvoie que ce qui a bougé depuis le
 * dernier déploiement (`/api/sync?r=dictionnaire`) — corrections, ajouts,
 * retraits. Elle est mise en cache dans `localStorage` : au deuxième
 * lancement, même sans réseau, les corrections sont déjà là.
 *
 * CE MODULE NE FAIT QUE LE TRANSPORT. C'est `data/dictionnaire.js`
 * (`appliquerCouche`) qui la POSE : corriger un mot périme tout ce qu'on en
 * dérive — clé de recherche, tifinagh, nom du fichier audio, noyaux de sens
 * qui font les cousins — et ces règles vivent là-bas. Les rejouer ici, ce
 * serait les écrire deux fois, et laisser des entrées corrigées introuvables.
 *
 * IL NE BLOQUE JAMAIS RIEN. Hors-ligne, serveur muet, réponse illisible : on
 * rend la dernière couche connue, ou rien, et le dictionnaire embarqué fait
 * le travail. Un dictionnaire qui refuserait de s'ouvrir faute de réseau
 * serait pire que celui qui montre un mot d'avant-hier.
 */
import { lireJson, ecrireJson } from './storage.js'

const CLE = 'tama-speak:dico-corrections'
const VIDE = { version: null, corrections: [], ajouts: [], retraits: [] }

let couche = null // la couche en mémoire, une fois lue

/** Ce qu'on avait la dernière fois — disponible avant même le réseau. */
export function coucheEnCache() {
  if (couche) return couche
  const garde = lireJson(CLE, null)
  couche = garde && Array.isArray(garde.corrections) ? garde : VIDE
  return couche
}

/**
 * Va chercher les corrections publiées. À appeler à l'ouverture du
 * dictionnaire : l'échec est silencieux et sans conséquence.
 * @returns {Promise<object>} la couche (celle du cache si le réseau manque)
 */
export async function chargerCorrections() {
  const base = import.meta.env.BASE_URL || '/'
  try {
    const r = await fetch(`${base}api/sync?r=dictionnaire`, { credentials: 'omit' })
    // Un hébergeur de SPA renvoie la PAGE avec un 200 sur une route inconnue :
    // sans cette garde, on écraserait le cache par du HTML analysé de travers.
    if (!r.ok || !(r.headers.get('content-type') || '').includes('application/json'))
      return coucheEnCache()
    const recu = await r.json()
    if (!recu || !Array.isArray(recu.corrections)) return coucheEnCache()
    couche = {
      version: recu.version || null,
      corrections: recu.corrections || [],
      ajouts: recu.ajouts || [],
      retraits: recu.retraits || [],
    }
    ecrireJson(CLE, couche)
    return couche
  } catch {
    return coucheEnCache()
  }
}

/** Combien de corrections sont en ligne — pour l'afficher en tête d'écran. */
export function compteCorrections(c = coucheEnCache()) {
  return (c?.corrections?.length || 0) + (c?.ajouts?.length || 0) + (c?.retraits?.length || 0)
}
