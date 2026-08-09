/**
 * LE DICTIONNAIRE — les cinq cours réunis en une seule base cherchable.
 *
 * PARTI PRIS FONDATEUR : le dictionnaire ne tient AUCUNE liste de mots à lui.
 * Il dérive ses entrées du contenu réel des leçons, exactement comme la fiche
 * d'enregistrement (scripts/gen-lexique.mjs importe d'ailleurs ce module).
 * Une seconde liste tenue à la main aurait divergé dès la leçon suivante, et
 * un dictionnaire qui ment sur ce que l'app enseigne ne vaut rien.
 *
 * Trois couches se superposent, de la plus sûre à la plus fragile :
 *
 *   1. LES ENTRÉES — mot, sens, unité, leçons. Extraites des exercices : ce
 *      sont des faits, pas des opinions.
 *   2. LES LIENS — synonymes (même langue, même sens) et cousins (le même
 *      sens dans les autres langues amazighes). Calculés en rapprochant les
 *      traductions françaises : « Le travail », « Le travail (mot arabe) » et
 *      « aman — l'eau » se ramènent au même noyau.
 *   3. L'ÉTYMOLOGIE — data/etymologies.js, écrite à la main, à valider.
 *      Quand elle manque, on n'affiche rien plutôt que d'inventer.
 *
 * Ce que le dictionnaire ne fait PAS : conjuguer, décliner l'état d'annexion,
 * ou proposer une traduction pour un mot qu'aucun cours n'enseigne. Il dit ce
 * que l'app sait, et s'arrête là — c'est ce qui le rend fiable.
 */
import { COURSES } from './courses.js'
import { EMPRUNTS } from './emprunts.js'
import { etymologieDe, ORIGINES } from './etymologies.js'
import { cleRecherche, enTifinagh } from '../lib/translit.js'
import { slug } from '../lib/slug.js'

export { ORIGINES }

/** L'ordre d'affichage des cours — le kabyle d'abord, il porte le plus de contenu. */
export const ORDRE_LANGUES = ['kab', 'shi', 'rif', 'tzm', 'zgh']

/* ------------------------------------------------------------------ */
/* Le noyau d'un sens — ce qui permet de rapprocher deux langues       */
/* ------------------------------------------------------------------ */

/**
 * « Le travail (mot amazigh) », « L'eau » et « aman — l'eau » partagent le
 * noyau « travail » / « eau ». C'est lui qui relie les cinq cours.
 *
 * On enlève, dans l'ordre : la partie avant le tiret cadratin (les exercices
 * de lecture du tifinagh écrivent « aman — l'eau »), les précisions entre
 * parenthèses, puis l'article — y compris élidé et collé, « l'eau » n'ayant
 * pas d'espace où s'accrocher. Le reste est normalisé comme une clé.
 */
export function noyauSens(sens) {
  let s = String(sens || '').toLowerCase().replace(/’/g, "'").trim()
  if (s.includes('—')) s = s.slice(s.lastIndexOf('—') + 1)
  s = s.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim()
  s = s.replace(/^[ld]'\s*/, '').replace(/^(les|le|la|une|un|des|du|de la)\s+/, '')
  return cleRecherche(s)
}

/**
 * L'identité d'une forme — ce qui décide que deux occurrences sont le même
 * mot. Volontairement PLUS STRICTE que la clé de recherche : celle-ci retire
 * les diacritiques (pour qu'on trouve « aḍar » en tapant « adar »), ce qui
 * confondrait ⵣ avec ⵥ et ⵜ avec ⵟ — deux lettres distinctes de l'alphabet.
 * On ne mélange que la casse, les espaces et la ponctuation finale.
 */
const ident = (mot) =>
  String(mot || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.…]+$/, '')
    .trim()

/* ------------------------------------------------------------------ */
/* Extraction — mêmes règles que le moteur de leçon                    */
/* ------------------------------------------------------------------ */

/**
 * Les paires (mot amazigh, sens) d'un exercice.
 *
 * En fr→kab l'énoncé est FRANÇAIS et le mot amazigh est la réponse : les
 * confondre rangerait « Oui » dans le dictionnaire kabyle. Et sur les
 * questions « on te dit X, que réponds-tu ? », `word` porte le contexte
 * affiché, pas une traduction — on ne prend donc pas ce sens-là.
 */
const REPONSE = /réponds-tu|répond-on|que réponds/i
function pairesDe(ex) {
  if (ex.type === 'match') return ex.pairs.map((p) => ({ mot: p.kab, sens: p.fr }))
  if (ex.type === 'culture') return [] // les deux faces sont en français
  if (ex.type === 'image') return [{ mot: ex.answer, sens: '' }]
  if (!ex.word) return []
  if (ex.kind !== 'fr-to-kab') return [{ mot: ex.word, sens: ex.answer }]
  return [{ mot: ex.answer, sens: REPONSE.test(ex.prompt || '') ? '' : ex.word }]
}

const categorieDe = (mot) => {
  if ([...mot].length === 1) return 'lettre'
  return mot.trim().includes(' ') ? 'expression' : 'mot'
}

/** Le registre des emprunts, indexé par clé de recherche. */
const EMPRUNT_PAR_LANG = Object.fromEntries(
  Object.entries(EMPRUNTS).map(([lang, liste]) => [
    lang,
    new Map(liste.map((e) => [cleRecherche(e.mot), e])),
  ]),
)

function entreesDe(course) {
  const vues = new Map()
  course.units.forEach((unit, uniteIndex) => {
    for (const node of unit.lessons) {
      if (node.type === 'chest') continue
      for (const ex of course.getExercises(node.id)) {
        for (const { mot, sens } of pairesDe(ex)) {
          if (!mot) continue
          const id = ident(mot)
          const cle = cleRecherche(mot)
          if (!id || !cle) continue
          if (!vues.has(id)) {
            vues.set(id, {
              id: `${course.id}:${id}`,
              cle,
              lang: course.id,
              langue: course.name,
              mot,
              sens: [],
              categorie: categorieDe(mot),
              unite: unit.unitLabel,
              uniteTitre: unit.title,
              uniteIndex,
              lecons: [],
              tifinagh: enTifinagh(mot),
            })
          }
          const e = vues.get(id)
          if (sens && !e.sens.includes(sens)) e.sens.push(sens)
          if (!e.lecons.includes(node.id)) e.lecons.push(node.id)
        }
      }
    }
  })

  // Un « sens » qui est lui-même un mot du cours n'est pas une traduction :
  // c'est le mot de l'énoncé qui a débordé (« Uř » = « Uř »).
  for (const e of vues.values()) {
    e.sens = e.sens.filter((s) => !vues.has(ident(s)))
    const emprunt = EMPRUNT_PAR_LANG[e.lang]?.get(e.cle) || null
    // Le registre des emprunts porte des traductions écrites à la main :
    // elles font foi sur celles qu'on devine depuis les exercices.
    if (!e.sens.length && emprunt?.sens) e.sens = [emprunt.sens]
    e.emprunt = emprunt
    // La forme exacte est passée en plus de la clé : sans elle, ⵜ et ⵟ (ou
    // ⵣ et ⵥ) partageraient la même note — la normalisation les confond.
    e.etymologie = etymologieDe(e.cle, e.lang, e.mot)
    // Le tifinagh ne se translittère pas en nom de fichier — et le cours
    // d'amazighe standard n'a de toute façon pas d'audio (voir courses/zgh.js).
    const s = slug(e.mot)
    e.audio = s ? (e.lang === 'kab' ? `${s}.mp3` : `${e.lang}/${s}.mp3`) : null
    e.noyaux = [...new Set(e.sens.map(noyauSens).filter(Boolean))]
    // Les autres façons de chercher ce mot — aujourd'hui le nom des lettres
    // tifinagh (« yaz » pour ⵣ), qui ne s'écrit nulle part dans l'entrée.
    e.alias = (e.etymologie?.alias || []).map(cleRecherche).filter(Boolean)
  }
  return [...vues.values()]
}

/**
 * Les entrées telles que les LEÇONS les donnent. C'est la base, elle ne
 * change jamais : la couche de corrections se pose dessus, elle ne l'écrase
 * pas — un retour en arrière doit toujours être possible.
 */
const EMBARQUEES = ORDRE_LANGUES.filter((id) => COURSES[id]).flatMap((id) =>
  entreesDe(COURSES[id]).sort((a, b) => a.mot.localeCompare(b.mot, 'fr')),
)

/**
 * Les entrées EN VIGUEUR — base seule, ou base + corrections publiées.
 *
 * `let` et non `const` : les modules qui les importent voient la mise à jour
 * (liaison vivante d'ESM) dès qu'une couche est posée. Rien n'est rechargé,
 * rien n'est recopié.
 */
export let ENTREES = EMBARQUEES
export let STATS = []
export let VEDETTES = []

let PAR_ID = new Map()
let PAR_NOYAU = new Map() // noyau de sens → entrées, pour synonymes et cousins

/** (Re)construit les index à partir d'une liste d'entrées. */
function indexer(entrees) {
  ENTREES = entrees
  PAR_ID = new Map(entrees.map((e) => [e.id, e]))
  PAR_NOYAU = new Map()
  for (const e of entrees) {
    for (const n of e.noyaux) {
      if (!PAR_NOYAU.has(n)) PAR_NOYAU.set(n, [])
      PAR_NOYAU.get(n).push(e)
    }
  }
  STATS = ORDRE_LANGUES.filter((id) => COURSES[id]).map((id) => ({
    lang: id,
    nom: COURSES[id].name,
    autonym: COURSES[id].autonym,
    accent: COURSES[id].accent,
    total: entrees.filter((e) => e.lang === id).length,
  }))
  VEDETTES = entrees
    .filter((e) => e.lang === 'kab' && e.categorie === 'mot')
    .map((e) => ({ e, n: cousins(e).length }))
    .sort((a, b) => b.n - a.n || a.e.mot.localeCompare(b.e.mot, 'fr'))
    .slice(0, 12)
    .map((x) => x.e)
  return ENTREES
}

export const entree = (id) => PAR_ID.get(id) || null

/* ------------------------------------------------------------------ */
/* Liens : synonymes et cousins                                        */
/* ------------------------------------------------------------------ */

const memeSens = (e) => [...new Set(e.noyaux.flatMap((n) => PAR_NOYAU.get(n) || []))]

/**
 * Les autres mots de LA MÊME langue qui disent la même chose — c'est là que
 * se lit le vrai sujet du cours : axeddim à côté de tawuri, ryaḍa à côté
 * d'addal. L'emprunt et le mot du fonds, l'un en face de l'autre.
 */
export const synonymes = (e) =>
  memeSens(e).filter((a) => a.lang === e.lang && a.id !== e.id && a.categorie !== 'lettre')

/**
 * Le même sens dans les autres langues amazighes — la colonne vertébrale du
 * dictionnaire. C'est ce qui fait voir d'un coup d'œil que « aman » et
 * « aɣrum » ne bougent pas d'un bout à l'autre de Tamazgha, alors que la
 * maison change de nom à chaque massif.
 */
export function cousins(e) {
  const par = new Map()
  for (const a of memeSens(e)) {
    if (a.lang === e.lang || a.categorie === 'lettre') continue
    if (!par.has(a.lang)) par.set(a.lang, [])
    par.get(a.lang).push(a)
  }
  return ORDRE_LANGUES.filter((l) => par.has(l)).map((l) => ({
    lang: l,
    nom: COURSES[l].name,
    mots: par.get(l),
  }))
}

/* ------------------------------------------------------------------ */
/* Recherche                                                           */
/* ------------------------------------------------------------------ */

/**
 * Chercher un mot — en amazigh comme en français, en latin comme en tifinagh.
 *
 * Taper « azul » trouve ⴰⵣⵓⵍ (le tifinagh est indexé sous sa forme latine),
 * « adar » trouve « aḍar », et « eau » trouve « aman » dans les cinq langues.
 * Les résultats sont classés du plus littéral au plus lointain : forme exacte,
 * début de mot, mot contenu, puis traduction — c'est l'ordre dans lequel on
 * s'attend à retrouver ce qu'on cherchait.
 *
 * @param {string} q                 ce qui est tapé
 * @param {object} [opts]
 * @param {string} [opts.lang]       limiter à un cours ('kab'…), sinon tous
 * @param {number} [opts.limite]     nombre maximum de résultats
 */
export function chercher(q, { lang, limite = 60 } = {}) {
  const requete = cleRecherche(q)
  const base = lang ? ENTREES.filter((e) => e.lang === lang) : ENTREES
  if (!requete) return base.filter((e) => e.categorie !== 'lettre').slice(0, limite)

  const notes = []
  for (const e of base) {
    let score = 0
    let viaAlias = false
    if (e.cle === requete) score = 100
    else if (e.alias.includes(requete)) ((score = 90), (viaAlias = true))
    else if (e.cle.startsWith(requete)) score = 80
    else if (e.alias.some((a) => a.startsWith(requete))) ((score = 70), (viaAlias = true))
    else if (e.cle.includes(requete)) score = 60
    if (!score) {
      // Côté français, on compare d'abord au NOYAU du sens : « travail »
      // doit rendre « tawuri » avant « où travailles-tu ? ».
      if (e.noyaux.includes(requete)) score = 55
      for (const s of e.sens) {
        const c = cleRecherche(s)
        if (c === requete) score = Math.max(score, 50)
        // Un mot du sens qui COMMENCE par la requête — jamais un fragment au
        // milieu, sinon « eau » remonterait « bureau » et « beaucoup ».
        else if (c.split(' ').some((w) => w.startsWith(requete))) score = Math.max(score, 40)
      }
    }
    // Les lettres de l'alphabet tifinagh ne remontent que si on les cherche
    // vraiment : sinon « a » noierait la liste sous des caractères isolés.
    // Chercher « yaz », en revanche, ne peut viser qu'une lettre — pas de
    // pénalité quand c'est le nom du signe qui a répondu.
    if (score && e.categorie === 'lettre' && score < 100 && !viaAlias) score -= 40
    if (score > 0) notes.push({ e, score })
  }
  notes.sort((a, b) => b.score - a.score || a.e.mot.localeCompare(b.e.mot, 'fr'))
  return notes.slice(0, limite).map((n) => n.e)
}

/* ------------------------------------------------------------------ */
/* La couche de corrections publiées                                   */
/*                                                                      */
/* Le dictionnaire voyage dans le bundle — c'est ce qui le rend         */
/* consultable dans le métro. Mais un mot relu et corrigé au backoffice */
/* restait faux jusqu'au déploiement suivant : la relecture d'un        */
/* locuteur natif n'atteignait personne. On pose donc PAR-DESSUS le peu */
/* qui a bougé (src/lib/dictionnaireLive.js va le chercher).            */
/*                                                                      */
/* Pourquoi ici et pas dans le module de transport : corriger un mot    */
/* périme tout ce qu'on en dérive — la clé de recherche, le tifinagh,   */
/* le nom du fichier audio, les noyaux de sens qui font les cousins.    */
/* Ces règles vivent dans ce fichier ; les rejouer ailleurs, ce serait  */
/* les écrire deux fois, et laisser des entrées corrigées introuvables. */
/*                                                                      */
/* CE QUE LA COUCHE NE TOUCHE PAS : les LEÇONS. Une correction change   */
/* ce que le dictionnaire MONTRE, pas ce que les exercices DEMANDENT —  */
/* une bonne réponse qui bouge sous les pieds de l'élève casserait sa   */
/* série. Le report dans src/data/ reste le geste qui corrige le cours. */
/* ------------------------------------------------------------------ */

const cleCouche = (lang, mot) => `${lang}:${ident(mot)}`

/** Redérive tout ce qui dépend de la forme et du sens — rien ne doit rester périmé. */
function derive(e, { mot, sens, notes }) {
  const s = slug(mot)
  return {
    ...e,
    mot,
    sens,
    note: notes || e.note || '',
    cle: cleRecherche(mot),
    tifinagh: enTifinagh(mot),
    categorie: categorieDe(mot),
    audio: s ? (e.lang === 'kab' ? `${s}.mp3` : `${e.lang}/${s}.mp3`) : null,
    noyaux: [...new Set(sens.map(noyauSens).filter(Boolean))],
  }
}

/**
 * Pose la couche publiée sur le dictionnaire embarqué, et réindexe.
 *
 * Trois gestes, et trois seulement : corriger une entrée, ajouter un mot qui
 * n'est dans aucune leçon, retirer un mot rejeté. Une couche vide rend le
 * dictionnaire embarqué tel quel — hors-ligne ou serveur muet, on ne retire
 * jamais à quelqu'un ce qu'il a déjà dans les mains.
 *
 * @param {{corrections?:object[], ajouts?:object[], retraits?:object[]}} couche
 * @returns {object[]} les entrées en vigueur
 */
export function appliquerCouche(couche) {
  const corrections = couche?.corrections || []
  const ajouts = couche?.ajouts || []
  const retraits = couche?.retraits || []
  if (!corrections.length && !ajouts.length && !retraits.length) {
    // Rien à poser : on revient à la base si une couche traînait.
    return ENTREES === EMBARQUEES ? ENTREES : indexer(EMBARQUEES)
  }

  const retires = new Set(retraits.map((r) => cleCouche(r.lang, r.cle)))
  const parCle = new Map(corrections.map((c) => [cleCouche(c.lang, c.cle), c]))
  const liste = []
  const vues = new Set()

  for (const e of EMBARQUEES) {
    const k = cleCouche(e.lang, e.mot)
    vues.add(k)
    if (retires.has(k)) continue
    const fix = parCle.get(k)
    if (!fix) {
      liste.push(e)
      continue
    }
    liste.push({
      // Publier est un instantané de la fiche relue : la forme ET le sens
      // qu'avait le relecteur sous les yeux partent ensemble. Un sens vide,
      // en revanche, n'efface pas la traduction — il n'a rien à dire.
      ...derive(e, {
        mot: fix.mot || e.mot,
        sens: fix.sens?.length ? fix.sens : e.sens,
        notes: fix.notes,
      }),
      corrigee: true,
    })
  }

  // Les ajouts ne viennent d'aucune leçon : ni unité, ni leçons, ni audio à
  // promettre. Le dire par des champs vides vaut mieux que le laisser croire.
  //
  // Ils rejoignent LEUR langue, à sa place alphabétique — et non la fin de la
  // liste : `ENTREES` est groupée par cours, et une recherche vide en rend le
  // début. Un mot ajouté au tachelhit qui atterrirait après tout le kabyle
  // serait introuvable autrement qu'en le cherchant par son nom.
  const nouvelles = []
  for (const a of ajouts) {
    const k = cleCouche(a.lang, a.mot)
    if (vues.has(k) || retires.has(k)) continue
    vues.add(k)
    const sens = a.sens || []
    nouvelles.push({
      id: `ajout:${k}`,
      lang: a.lang,
      langue: COURSES[a.lang]?.name || a.lang,
      mot: a.mot,
      sens,
      cle: cleRecherche(a.mot),
      categorie: categorieDe(a.mot),
      unite: null,
      uniteTitre: null,
      uniteIndex: 99,
      lecons: [],
      tifinagh: enTifinagh(a.mot),
      emprunt: null,
      etymologie: null,
      audio: null,
      note: a.notes || '',
      noyaux: [...new Set(sens.map(noyauSens).filter(Boolean))],
      alias: [],
      ajoutee: true,
    })
  }

  if (!nouvelles.length) return indexer(liste)

  // Réassemblage cours par cours : l'ordre d'affichage du dictionnaire est
  // ORDRE_LANGUES, puis l'alphabet à l'intérieur de chaque cours.
  const parLangue = new Map()
  for (const e of [...liste, ...nouvelles]) {
    if (!parLangue.has(e.lang)) parLangue.set(e.lang, [])
    parLangue.get(e.lang).push(e)
  }
  const ordonnees = [...ORDRE_LANGUES, ...parLangue.keys()]
    .filter((l, i, t) => t.indexOf(l) === i && parLangue.has(l))
    .flatMap((l) => parLangue.get(l).sort((a, b) => a.mot.localeCompare(b.mot, 'fr')))
  return indexer(ordonnees)
}

// Le premier index, une fois toutes les fonctions définies (`indexer` appelle
// `cousins` pour les vedettes — plus haut, il buterait sur `memeSens`).
indexer(EMBARQUEES)
