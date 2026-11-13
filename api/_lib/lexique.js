/**
 * L'ATELIER DU CONTENU — le côté serveur du backoffice « lexique ».
 *
 * Ce module tient une seule promesse, et c'est celle qui décide de tout le
 * reste : LE COURS RESTE LA SOURCE DE VÉRITÉ. `src/data/courses/*.js` est ce
 * que l'app embarque, ce qui la rend hors-ligne, et ce qui est déployé. La
 * table `lexique` n'est pas un second contenu qui vivrait sa vie : c'est
 * l'ATELIER où l'on relit, corrige et enregistre ce contenu-là avant de
 * reporter les corrections dans les fichiers.
 *
 * D'où l'ensemencement : à chaque ouverture du backoffice, le vocabulaire des
 * cours est réinjecté en base. L'opération est idempotente et n'écrase jamais
 * une main humaine — elle ajoute ce qui manque, complète un sens vide, et se
 * tait sur tout le reste. Un mot ajouté à une leçon apparaît donc dans la
 * liste à valider sans qu'on ait rien à lancer ; un mot corrigé au backoffice
 * garde sa correction même si le fichier du cours n'a pas encore bougé.
 *
 * Pourquoi importer directement `src/data/courses.js` plutôt que recopier une
 * liste : une seconde liste divergerait au premier correctif — c'est
 * exactement le raisonnement déjà tenu par `course.vocabulary()`, qu'on
 * réutilise ici plutôt que de refaire son travail (il connaît les pièges :
 * l'énoncé français d'un exercice fr→kab, le mot qui n'existe que dans une
 * illustration…).
 */
import { COURSES } from '../../src/data/courses.js'
import { langueDeBase } from '../../src/data/languages.js'
import { slug } from '../../src/lib/slug.js'
import { sql } from './db.js'

/**
 * Le nom de fichier d'un terme — « Azul fell-ak » → « azul-fell-ak ».
 * Re-exporté depuis `src/lib/slug.js` PLUTÔT QUE RECOPIÉ dans la page admin :
 * c'est ce slug qui nomme les mp3 de `public/audio/`, et deux versions de la
 * règle finiraient par baptiser le même mot de deux façons.
 */
export { slug }

/**
 * Les quatre voix. Un mot n'est pas dit pareil par une grand-mère et par un
 * enfant, et un enfant qui apprend a besoin d'entendre une voix d'enfant.
 * L'ordre est celui de l'affichage.
 */
export const VOIX = ['femme', 'homme', 'fille', 'garcon']
export const VOIX_SET = new Set(VOIX)

export const STATUTS = ['a-valider', 'valide', 'a-revoir', 'rejete']
export const STATUTS_SET = new Set(STATUTS)

/** 'lettre' vient du dictionnaire : les signes tifinagh du cours d'amazighe. */
export const CATEGORIES_SET = new Set(['mot', 'expression', 'lettre'])

/**
 * Formats acceptés. Liste blanche et non liste noire : ce type est renvoyé
 * tel quel en en-tête `Content-Type` quand on relit l'audio — laisser passer
 * n'importe quelle chaîne serait offrir un `text/html` servi depuis notre
 * domaine, sur la route la plus privilégiée du site.
 */
export const TYPES_AUDIO = new Set([
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/ogg',
  'audio/ogg;codecs=opus',
  'audio/mp4',
  'audio/mpeg',
  'audio/aac',
  'audio/x-m4a',
  'audio/wav',
  'audio/x-wav',
])

/** Une expression se reconnaît à son espace ; tout le reste est un mot. */
export const categorieDe = (terme) => (String(terme).trim().includes(' ') ? 'expression' : 'mot')

/* ------------------------------------------------------------------ */
/* Le vocabulaire des cours, à plat                                     */
/* ------------------------------------------------------------------ */

/**
 * Tout le vocabulaire enseigné, une ligne par (langue, terme).
 *
 * `kab-beta` est volontairement absent : c'est le parcours d'essai, il
 * enseigne LE MÊME kabyle avec les mêmes mots (voir data/languages.js). Le
 * ranger sous sa langue de base évite de faire enregistrer deux fois le même
 * mot à la même personne — c'est déjà la règle de `speakerVoice.js`.
 */
export function vocabulaireDesCours() {
  const vus = new Set() // "lang\0terme" — dédoublonne les parcours partagés
  const lignes = []

  for (const [id, cours] of Object.entries(COURSES)) {
    const lang = langueDeBase(id)
    let rang = 0
    for (const unite of cours.vocabulary()) {
      const titre = cours.findUnit(unite.id)?.title
      const etiquette = titre ? `${unite.label} — ${titre}` : unite.label
      for (const { mot, sens } of unite.mots) {
        const terme = String(mot || '').trim()
        if (!terme) continue
        const cle = `${lang}\0${terme}`
        rang++
        if (vus.has(cle)) continue
        vus.add(cle)
        lignes.push({
          lang,
          cle: terme,
          sens: String(sens || '').trim(),
          unite: etiquette,
          lecons: '',
          rang,
          categorie: categorieDe(terme),
        })
      }
    }
  }
  return lignes
}

/* ------------------------------------------------------------------ */
/* Le dictionnaire, s'il est là                                         */
/* ------------------------------------------------------------------ */

/**
 * `src/data/dictionnaire.js` réunit les cinq cours en une base cherchable :
 * mêmes entrées que `course.vocabulary()`, mais mieux extraites (il sait ne
 * pas prendre pour une traduction l'énoncé d'un « que réponds-tu ? »), avec
 * les sens multiples, les leçons d'origine et les lettres du tifinagh. Quand
 * il est présent, C'EST LUI QUI SÈME — l'atelier doit relire ce que l'app
 * montre, jamais une extraction concurrente.
 *
 * Il est chargé À L'EXÉCUTION, et non par un `import` en tête de fichier,
 * parce qu'il arrive par une autre branche : le backoffice devait fonctionner
 * avant elle, et devra en profiter dès qu'elle sera fusionnée, sans qu'on
 * revienne rien changer ici.
 *
 * Le chemin est construit à l'exécution DÉLIBÉRÉMENT : un littéral serait lu
 * par l'analyseur de dépendances de Vercel, qui buterait sur un module
 * introuvable tant que la fusion n'a pas eu lieu. Les fichiers voyagent par
 * `vercel.json` → functions["api/admin.js"].includeFiles.
 */
let dictionnaire // undefined = pas encore tenté ; null = absent

async function chargerDictionnaire() {
  if (dictionnaire !== undefined) return dictionnaire
  dictionnaire = null
  try {
    const { existsSync } = await import('node:fs')
    const { join } = await import('node:path')
    const { pathToFileURL } = await import('node:url')
    const chemin = join(process.cwd(), 'src', 'data', 'dictionnaire.js')
    if (!existsSync(chemin)) return dictionnaire
    const mod = await import(pathToFileURL(chemin).href)
    if (Array.isArray(mod?.ENTREES) && mod.ENTREES.length) dictionnaire = mod.ENTREES
  } catch (e) {
    // Absent ou cassé : on retombe sur le vocabulaire des cours — et on le
    // DIT dans la réponse de l'API. Relire silencieusement une autre source
    // que celle qu'on croit serait pire que n'avoir pas de dictionnaire.
    console.warn('[tama] dictionnaire non chargé :', e?.message)
  }
  return dictionnaire
}

/** Ce que la colonne « Unité » affiche pour un mot qu'aucune leçon n'enseigne. */
const HORS_LECONS = 'Dictionnaire — pas encore dans les leçons'

/** Les entrées du dictionnaire, mises au format de la table `lexique`. */
function lignesDuDictionnaire(entrees) {
  const vus = new Set()
  const lignes = []
  const rangs = {}
  // LES MOTS ENSEIGNÉS D'ABORD, le dictionnaire étendu ensuite. Le dictionnaire
  // range ses entrées par ordre alphabétique, lot étendu compris
  // (src/data/lexique/) : semées telles quelles, les formes que les leçons font
  // dire se retrouveraient noyées parmi des centaines que l'app ne joue nulle
  // part, et celui qui enregistre passerait son temps sur des mots sans leçon.
  // Le tri est stable : l'alphabet est conservé à l'intérieur de chaque groupe.
  const ordonnees = [...entrees].sort(
    (a, b) => Number(a.enseigne === false) - Number(b.enseigne === false),
  )
  for (const e of ordonnees) {
    const lang = langueDeBase(e.lang)
    const terme = String(e.mot || '').trim()
    if (!lang || !terme) continue
    const cle = `${lang} ${terme}`
    rangs[lang] = (rangs[lang] || 0) + 1
    if (vus.has(cle)) continue
    vus.add(cle)
    lignes.push({
      lang,
      cle: terme,
      // Le dictionnaire porte PLUSIEURS sens (« le travail », « l'ouvrage ») ;
      // les réunir vaut mieux que n'en garder qu'un : le relecteur voit tout
      // ce que l'app enseigne sous ce mot, et peut trancher en connaissance.
      sens: (Array.isArray(e.sens) ? e.sens : [e.sens]).filter(Boolean).join(' · ').slice(0, 200),
      // Un mot du lot étendu n'est dans aucune leçon : la colonne « Unité » le
      // dit en toutes lettres, pour qu'on le voie d'un coup d'œil — surtout
      // dans l'onglet des enregistrements.
      unite:
        e.enseigne === false ? HORS_LECONS : e.uniteTitre ? `${e.unite} — ${e.uniteTitre}` : e.unite || '',
      lecons: (e.lecons || []).join(' '),
      rang: rangs[lang],
      categorie: CATEGORIES_SET.has(e.categorie) ? e.categorie : categorieDe(terme),
    })
  }
  return lignes
}

/**
 * Le contenu à relire, et d'où il vient.
 * @returns {Promise<{source: 'dictionnaire'|'cours', lignes: object[]}>}
 */
export async function contenuDeReference() {
  const entrees = await chargerDictionnaire()
  if (entrees) return { source: 'dictionnaire', lignes: lignesDuDictionnaire(entrees) }
  return { source: 'cours', lignes: vocabulaireDesCours() }
}

/* ------------------------------------------------------------------ */
/* Ensemencement                                                        */
/* ------------------------------------------------------------------ */

let sameLe = 0
let derniereSource = 'cours'
const FRAICHEUR = 60_000 // ms : une instance chaude ne réensemence pas à chaque clic

/**
 * Réinjecte le contenu de référence (dictionnaire, ou vocabulaire des cours à
 * défaut) dans `lexique`.
 *
 * Idempotent par construction (index unique sur `lang, cle`) et RESPECTUEUX
 * DES ÉDITIONS : sur conflit on ne touche qu'aux champs que personne n'a pu
 * remplir à la main — un `sens` resté vide, l'unité d'origine, les leçons, le
 * rang. Ni `terme`, ni `notes`, ni `statut` ne sont écrasés : ce sont eux, le
 * travail de relecture.
 *
 * La liste est dédoublonnée EN AMONT (une seule ligne par `lang, cle`) : sans
 * cela Postgres refuserait le lot entier — « ON CONFLICT DO UPDATE cannot
 * affect row a second time ».
 *
 * En un seul aller-retour SQL (UNNEST) : quelques centaines de mots ne valent
 * pas quelques centaines de requêtes.
 *
 * @param {boolean} force ignore le cache de fraîcheur
 * @returns {Promise<{source: string, n: number}>}
 */
export async function semer(force = false) {
  const maintenant = Date.now()
  if (!force && maintenant - sameLe < FRAICHEUR) return { source: derniereSource, n: 0 }

  const { source, lignes } = await contenuDeReference()
  derniereSource = source
  if (!lignes.length) return { source, n: 0 }

  await sql()`
    INSERT INTO lexique (lang, cle, terme, sens, unite, lecons, rang, categorie, source)
    SELECT lang, cle, cle, NULLIF(sens, ''), unite, NULLIF(lecons, ''), rang, categorie, ${source}
    FROM UNNEST(
      ${lignes.map((l) => l.lang)}::text[],
      ${lignes.map((l) => l.cle)}::text[],
      ${lignes.map((l) => l.sens)}::text[],
      ${lignes.map((l) => l.unite)}::text[],
      ${lignes.map((l) => l.lecons)}::text[],
      ${lignes.map((l) => l.rang)}::int[],
      ${lignes.map((l) => l.categorie)}::text[]
    ) AS v(lang, cle, sens, unite, lecons, rang, categorie)
    ON CONFLICT (lang, cle) WHERE cle IS NOT NULL DO UPDATE SET
      sens      = COALESCE(NULLIF(lexique.sens, ''), EXCLUDED.sens),
      unite     = EXCLUDED.unite,
      lecons    = EXCLUDED.lecons,
      rang      = EXCLUDED.rang,
      categorie = EXCLUDED.categorie,
      -- Une entrée semée par les cours puis retrouvée par le dictionnaire
      -- change de provenance ; un ajout manuel, jamais.
      source    = CASE WHEN lexique.source = 'ajout' THEN 'ajout' ELSE EXCLUDED.source END`

  sameLe = maintenant
  return { source, n: lignes.length }
}
