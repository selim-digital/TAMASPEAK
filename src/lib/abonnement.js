/**
 * Client de l'abonnement — parle à /api/billing.
 *
 * LA RÈGLE, héritée de tout le reste du projet : ON NE VERROUILLE QUE SUR UN
 * REFUS EXPLICITE DU SERVEUR. Un métro sans réseau, un serveur en panne, une
 * boutique pas encore ouverte (pas de clé Stripe) : dans tous ces cas, l'app
 * s'ouvre en entier. C'est la même logique anti-boucle que la session (voir
 * lib/api.js) — « le serveur n'a pas répondu » n'autorise rien à exiger.
 *
 * Le dernier verdict connu est mis en cache : quelqu'un qui a payé et qui
 * prend l'avion garde ses leçons. Le cache expire au bout de sept jours, pour
 * qu'un abonnement résilié finisse par se refermer même sans réseau.
 *
 * Une précision honnête, écrite ici pour ne pas se raconter d'histoires : le
 * contenu des cours est dans le bundle de la PWA (c'est ce qui la rend
 * utilisable hors-ligne). Le verrou est donc une porte, pas un coffre : il
 * tient devant l'usage normal, pas devant quelqu'un qui ouvre les outils de
 * développement. Le déplacer côté serveur coûterait le hors-ligne — c'est-à-
 * dire l'app elle-même. Ce compromis est assumé.
 */
import { isApi } from './api.js'
import { UNITES_LIBRES } from '../data/tarifs.js'

const CACHE_KEY = 'tama-speak:abonnement'
const CACHE_TTL = 7 * 24 * 3600 * 1000

/** Le dernier verdict connu, s'il n'est pas périmé. */
function cacheLu() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY))
    if (!c || Date.now() - c.at > CACHE_TTL) return null
    return c.etat
  } catch {
    return null
  }
}

function cacheEcrit(etat) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), etat }))
  } catch {
    /* stockage indisponible : on se passera du cache */
  }
}

export function oublierAbonnement() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* rien à oublier */
  }
}

/**
 * L'état d'abonnement.
 *
 * @returns {Promise<object|null>} l'état, ou `null` si le serveur est muet —
 *   `null` veut dire « on ne sait pas », JAMAIS « pas abonné ».
 */
export async function etatAbonnement() {
  try {
    const r = await fetch('/api/billing?r=etat', { credentials: 'include' })
    if (!r.ok || !isApi(r)) return cacheLu()
    const etat = await r.json()
    cacheEcrit(etat)
    return etat
  } catch {
    return cacheLu()
  }
}

async function poste(r, body) {
  try {
    const rep = await fetch(`/api/billing?r=${r}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body || {}),
    })
    if (!isApi(rep)) return null
    const json = await rep.json()
    // `detail` n'est renseigné par le serveur qu'en mode test : c'est le
    // message brut (de Stripe ou du garde-fou des tarifs).
    return rep.ok ? json : { erreur: json?.error || 'refus', detail: json?.detail || null }
  } catch {
    return null
  }
}

/**
 * Ouvre la caisse Stripe (redirection pleine page — c'est ce que Stripe
 * recommande : Apple Pay et Google Pay n'apparaissent pas dans une iframe).
 * @returns {Promise<string|null>} le message d'erreur à afficher, ou null si on part
 */
export async function passerEnCaisse(plan) {
  const r = await poste('checkout', { plan })
  if (r?.url) {
    window.location.href = r.url
    return null
  }
  const humain =
    r?.erreur === 'deja abonne'
      ? 'Tu es déjà abonné — merci !'
      : r?.erreur === 'tarif non configuré' || r?.erreur === 'paiement non configuré'
        ? 'Les abonnements ne sont pas encore ouverts. Reviens bientôt.'
        : 'La caisse n’a pas répondu. Réessaie dans un instant.'
  // En mode test, la cause exacte s'affiche sous le message : sans elle,
  // « la caisse n'a pas répondu » envoie fouiller les journaux d'un serveur
  // depuis un téléphone — c'est-à-dire nulle part.
  return r?.detail ? `${humain}\n\n${r.detail}` : humain
}

/** Ouvre le portail Stripe : résilier, changer de carte, voir ses factures. */
export async function ouvrirPortail() {
  const r = await poste('portail', {})
  if (r?.url) {
    window.location.href = r.url
    return null
  }
  return 'Le portail n’a pas répondu. Réessaie dans un instant.'
}

/* ---------------- pack famille ---------------- */

export const inviterFamille = () => poste('famille', { action: 'inviter' })
export const retirerFamille = (id) => poste('famille', { action: 'retirer', id })
export const quitterFamille = () => poste('famille', { action: 'quitter' })

/** Lien complet à partager (WhatsApp) — même forme que l'invitation au cercle. */
export const invitationFamilleUrl = (code) => `https://tamaspeak.com/?famille=${code}`

/** @returns {'ok'|'deja'|'introuvable'|'complet'|'inactif'|'erreur'} */
export async function rejoindreFamille(code) {
  const r = await poste('famille', { action: 'rejoindre', code })
  if (!r) return { statut: 'erreur' }
  if (r.ok) return { statut: 'ok', avec: r.avec || '' }
  if (r.erreur === 'code inconnu') return { statut: 'introuvable' }
  if (r.erreur === 'code deja utilise' || r.erreur === 'deja dans un pack') return { statut: 'deja' }
  if (r.erreur === 'places complètes') return { statut: 'complet' }
  if (r.erreur === 'pack inactif') return { statut: 'inactif' }
  return { statut: 'erreur' }
}

/* ------------------------------------------------------------------ */
/* Le verrou — une seule fonction, appelée partout                     */
/* ------------------------------------------------------------------ */

/**
 * Cette unité est-elle ouverte ?
 *
 * @param {number} indexUnite  rang de l'unité dans le cours (0 = la première)
 * @param {object|null} etat   ce que `etatAbonnement()` a rendu (null = inconnu)
 * @returns {boolean}
 */
export function uniteOuverte(indexUnite, etat) {
  // Les premières unités sont gratuites pour toujours, sans compte ni carte.
  if (indexUnite < (etat?.unitesLibres ?? UNITES_LIBRES)) return true
  // On ne sait pas (hors-ligne, serveur muet, boutique fermée) : on ouvre.
  if (!etat) return true
  return etat.abonne === true
}

/**
 * Cette fiche du dictionnaire est-elle ouverte ?
 *
 * Le dictionnaire est une option payante — la première du projet qui ne soit
 * pas une unité de cours. Il suit pourtant EXACTEMENT la même règle, et c'est
 * volontaire : ce qui est déjà gratuit le reste. Les mots des unités libres
 * (la première de chaque cours) s'ouvrent en entier, sans compte ni carte ;
 * le reste demande un abonnement ; et un serveur muet n'interdit rien.
 *
 * Ce qui n'est JAMAIS verrouillé, et ne doit pas l'être : la recherche
 * elle-même. On voit toujours que le mot existe, dans quelle langue, et ce
 * qu'il veut dire. C'est la fiche — étymologie, cousins d'une langue à
 * l'autre, synonymes — qui est derrière la porte. Cacher jusqu'à l'existence
 * du mot ferait un dictionnaire inutilisable, donc invendable.
 *
 * @param {{uniteIndex:number}} entree  une entrée de data/dictionnaire.js
 * @param {object|null} etat            ce que `etatAbonnement()` a rendu
 */
export function entreeDicoOuverte(entree, etat) {
  return uniteOuverte(entree?.uniteIndex ?? 0, etat)
}

/** Reste-t-il quelque chose à débloquer ? (sert à décider d'inviter, ou non) */
export function verrouActif(etat) {
  return !!etat && etat.paiementOuvert === true && etat.abonne !== true
}

/**
 * Y a-t-il un ABONNEMENT RÉEL derrière cet accès ?
 *
 * À ne jamais confondre avec `etat.abonne`, qui répond à une autre question :
 * « faut-il ouvrir les leçons ? ». Les deux divergent dans trois cas, et
 * chacun des trois afficherait sinon « Abonnement actif » à quelqu'un qui n'a
 * jamais rien payé :
 *   • boutique fermée (pas de clé Stripe) — tout est ouvert, rien n'est vendu ;
 *   • mode test — l'app reste entière pour les élèves le temps des essais ;
 *   • serveur muet — le doute profite à l'élève.
 *
 * Promettre un abonnement qui n'existe pas serait un mensonge idiot : la
 * personne le découvrirait le jour où elle chercherait sa facture.
 */
export function abonnementReel(etat) {
  if (!etat) return false
  if (etat.via === 'famille') return true
  return ['essai', 'actif', 'retard'].includes(etat.statut)
}
