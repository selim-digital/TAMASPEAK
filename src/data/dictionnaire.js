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
import { LANGUAGES } from './languages.js'
import { EMPRUNTS } from './emprunts.js'
import { etymologieDe, ORIGINES } from './etymologies.js'
import { lexiqueEtendu, THEMES, TYPES } from './lexique/index.js'
import { cleRecherche, enTifinagh } from '../lib/translit.js'
import { slug } from '../lib/slug.js'

export { ORIGINES, THEMES, TYPES }

/**
 * L'ordre d'affichage des cours — le kabyle d'abord, il porte le plus de
 * contenu.
 *
 * LES PARCOURS D'ESSAI EN SONT EXCLUS, et il faut le dire explicitement :
 * « kab-beta » est bâti sur les MÊMES unités et les MÊMES leçons que le
 * kabyle (voir data/courses.js) — il raconte le même contenu autrement. Le
 * laisser entrer dupliquerait chaque mot kabyle du dictionnaire, et ferait
 * apparaître « Kabyle — Le voyage » dans la liste des cousins d'un mot,
 * comme si c'était une autre langue.
 *
 * La liste est dérivée plutôt qu'écrite à la main : le jour où une deuxième
 * bêta arrive, elle sera écartée sans que personne ait à y penser.
 */
const PREFERENCE = ['kab', 'shi', 'rif', 'tzm', 'zgh']
export const ORDRE_LANGUES = LANGUAGES.filter((l) => !l.beta && COURSES[l.id])
  .map((l) => l.id)
  .sort((a, b) => {
    const ia = PREFERENCE.indexOf(a)
    const ib = PREFERENCE.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

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
              enseigne: true,
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

  // Le lot étendu (data/lexique/) vient PAR-DESSUS, jamais à côté : un mot
  // déjà enseigné garde son unité et ses leçons, et gagne seulement ce que le
  // lot apporte de plus (type, genre, thème). Sans cette fusion, « aḍar »
  // apparaîtrait deux fois dans les résultats — une fois comme leçon, une
  // fois comme entrée de dictionnaire. C'est le même mot.
  for (const brut of lexiqueEtendu(course.id)) {
    const id = ident(brut.mot)
    const cle = cleRecherche(brut.mot)
    if (!id || !cle) continue
    const deja = vues.get(id)
    if (deja) {
      deja.type = brut.type
      deja.genre = brut.genre
      deja.theme = brut.theme
      if (brut.note && !deja.noteLot) deja.noteLot = brut.note
      for (const s of brut.sens) if (!deja.sens.includes(s)) deja.sens.push(s)
      continue
    }
    vues.set(id, {
      id: `${course.id}:${id}`,
      cle,
      lang: course.id,
      langue: course.name,
      mot: brut.mot,
      sens: [...brut.sens],
      categorie: categorieDe(brut.mot),
      type: brut.type,
      genre: brut.genre,
      theme: brut.theme,
      noteLot: brut.note,
      // Aucune unité, donc aucune unité libre — c'est ce qui met ces mots
      // derrière l'abonnement (voir entreeDicoOuverte).
      unite: null,
      uniteTitre: null,
      uniteIndex: null,
      lecons: [],
      enseigne: false,
      tifinagh: enTifinagh(brut.mot),
    })
  }

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
    //
    // Un mot du lot étendu n'a PAS de fichier attendu : la fiche
    // d'enregistrement liste ce que les leçons font dire, et trois cents mots
    // de plus à lire décourageraient le locuteur pour un son que l'app ne
    // jouerait nulle part. Le jour où l'un d'eux entre dans une leçon, il
    // gagne son fichier comme les autres — automatiquement.
    const s = e.enseigne ? slug(e.mot) : ''
    e.audio = s ? (e.lang === 'kab' ? `${s}.mp3` : `${e.lang}/${s}.mp3`) : null
    e.noyaux = [...new Set(e.sens.map(noyauSens).filter(Boolean))]
    // Les autres façons de chercher ce mot — aujourd'hui le nom des lettres
    // tifinagh (« yaz » pour ⵣ), qui ne s'écrit nulle part dans l'entrée.
    e.alias = (e.etymologie?.alias || []).map(cleRecherche).filter(Boolean)
  }
  return [...vues.values()]
}

/** Toutes les entrées, tous cours confondus, dans l'ordre d'affichage. */
export const ENTREES = ORDRE_LANGUES.filter((id) => COURSES[id]).flatMap((id) =>
  entreesDe(COURSES[id]).sort((a, b) => a.mot.localeCompare(b.mot, 'fr')),
)

const PAR_ID = new Map(ENTREES.map((e) => [e.id, e]))

/** Index noyau de sens → entrées, pour les synonymes et les cousins. */
const PAR_NOYAU = new Map()
for (const e of ENTREES) {
  for (const n of e.noyaux) {
    if (!PAR_NOYAU.has(n)) PAR_NOYAU.set(n, [])
    PAR_NOYAU.get(n).push(e)
  }
}

export const entree = (id) => PAR_ID.get(id) || null

/** Combien d'entrées par cours — affiché en tête du dictionnaire. */
export const STATS = ORDRE_LANGUES.filter((id) => COURSES[id]).map((id) => ({
  lang: id,
  nom: COURSES[id].name,
  autonym: COURSES[id].autonym,
  accent: COURSES[id].accent,
  total: ENTREES.filter((e) => e.lang === id).length,
}))

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

/** Quelques entrées à montrer quand la recherche est vide — les plus reliées. */
export const VEDETTES = ENTREES.filter((e) => e.lang === 'kab' && e.categorie === 'mot')
  .map((e) => ({ e, n: cousins(e).length }))
  .sort((a, b) => b.n - a.n || a.e.mot.localeCompare(b.e.mot, 'fr'))
  .slice(0, 12)
  .map((x) => x.e)
