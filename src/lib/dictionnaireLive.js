/**
 * Les corrections publiées, posées par-dessus le dictionnaire embarqué.
 *
 * LE PROBLÈME QUE CE MODULE RÉSOUT. Le dictionnaire de l'app vit dans son
 * bundle (`src/data/dictionnaire.js`) : c'est ce qui le rend consultable dans
 * le métro, et cela ne changera pas. Mais un mot faux relu et corrigé au
 * backoffice restait faux chez les élèves jusqu'au déploiement suivant —
 * autrement dit, la relecture d'un locuteur natif n'atteignait personne tant
 * qu'un développeur n'avait pas repris son clavier.
 *
 * D'où cette COUCHE : le serveur ne renvoie que ce qui a bougé depuis le
 * dernier déploiement (`/api/sync?r=dictionnaire`), et l'app la pose sur le
 * contenu qu'elle porte déjà. Trois gestes, et trois seulement :
 *
 *   • CORRIGER — une entrée du bundle prend la forme et le sens relus ;
 *   • AJOUTER  — un mot qui n'est dans aucune leçon entre au dictionnaire ;
 *   • RETIRER  — un mot rejeté disparaît, sans attendre un déploiement.
 *
 * CE QU'IL NE FAIT PAS, et ne doit pas faire :
 *   • toucher aux LEÇONS. Une correction change ce que le dictionnaire
 *     MONTRE, pas ce que les exercices demandent — un exercice dont la
 *     bonne réponse change sous les pieds de l'élève casserait sa série.
 *     Le report dans `src/data/` reste le geste qui corrige le cours.
 *   • bloquer quoi que ce soit. Hors-ligne, serveur muet, réponse
 *     illisible : on garde le contenu embarqué et on se tait. Un
 *     dictionnaire qui refuse de s'ouvrir parce que le réseau manque
 *     serait pire que celui qui montre un mot d'avant-hier.
 *
 * La couche est mise en cache dans `localStorage` : au deuxième lancement,
 * même sans réseau, les corrections sont déjà là.
 */
import { lireJson, ecrireJson } from './storage.js'

const CLE = 'tama-speak:dico-corrections'
const VIDE = { version: null, corrections: [], ajouts: [], retraits: [] }

/**
 * L'identité d'une forme — la même règle que `data/dictionnaire.js` (`ident`) :
 * casse, espaces et ponctuation finale seulement. Surtout PAS les
 * diacritiques : ⵣ et ⵥ, ⵜ et ⵟ sont des lettres distinctes, et les confondre
 * ferait appliquer à l'une la correction de l'autre.
 */
const ident = (mot) =>
  String(mot || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.…]+$/, '')
    .trim()

const cle = (lang, mot) => `${lang}:${ident(mot)}`

/* ------------------------------------------------------------------ */
/* Chargement                                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Application                                                         */
/* ------------------------------------------------------------------ */

/**
 * Pose la couche sur une liste d'entrées de dictionnaire.
 *
 * Les entrées ajoutées reçoivent `ajoutee: true` et les corrigées
 * `corrigee: true` : l'écran peut le dire, et il le doit — une correction
 * venue d'un locuteur mérite d'être signalée, pas glissée en douce.
 *
 * @param {object[]} entrees les entrées embarquées (data/dictionnaire.js)
 * @param {object}   [c]     la couche ; celle en cache par défaut
 */
export function appliquerCorrections(entrees, c = coucheEnCache()) {
  if (!c || (!c.corrections.length && !c.ajouts.length && !c.retraits.length)) return entrees

  const retires = new Set(c.retraits.map((r) => cle(r.lang, r.cle)))
  const parCle = new Map(c.corrections.map((x) => [cle(x.lang, x.cle), x]))

  const sortie = []
  const vues = new Set()
  for (const e of entrees) {
    const k = cle(e.lang, e.mot)
    vues.add(k)
    if (retires.has(k)) continue
    const fix = parCle.get(k)
    if (!fix) {
      sortie.push(e)
      continue
    }
    sortie.push({
      ...e,
      mot: fix.mot || e.mot,
      sens: fix.sens?.length ? fix.sens : e.sens,
      note: fix.notes || e.note || '',
      corrigee: true,
    })
  }

  // Les ajouts arrivent en bout de liste, avec le strict minimum : ils ne
  // viennent d'aucune leçon, donc ni unité, ni leçons, ni audio à promettre.
  for (const a of c.ajouts) {
    const k = cle(a.lang, a.mot)
    if (vues.has(k) || retires.has(k)) continue
    vues.add(k)
    sortie.push({
      id: `ajout:${k}`,
      cle: ident(a.mot),
      lang: a.lang,
      mot: a.mot,
      sens: a.sens || [],
      note: a.notes || '',
      categorie: String(a.mot).trim().includes(' ') ? 'expression' : 'mot',
      unite: null,
      lecons: [],
      noyaux: [],
      alias: [],
      audio: null,
      ajoutee: true,
    })
  }
  return sortie
}

/** Combien de corrections sont en ligne — pour l'afficher en tête d'écran. */
export function compteCorrections(c = coucheEnCache()) {
  return (c?.corrections.length || 0) + (c?.ajouts.length || 0) + (c?.retraits.length || 0)
}
