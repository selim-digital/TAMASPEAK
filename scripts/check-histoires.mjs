/**
 * Vérifie les histoires de Titiche et Tomatiche (src/data/histoires.js).
 *
 *   npm run check:histoires
 *
 * Ce que le script garantit, et qu'aucune relecture ne garantit durablement :
 *   1. chaque jeton `{mot}` d'une histoire existe dans la table MOTS ;
 *   2. chaque mot amazigh de cette table existe DANS LE VOCABULAIRE DU COURS
 *      correspondant — une histoire ne fait jamais lire un mot que les leçons
 *      n'enseignent pas. Seules exceptions : la liste HORS_LEXIQUE, courte et
 *      assumée ;
 *   3. chaque question a sa réponse parmi ses choix ;
 *   4. le début gratuit ne dépasse pas l'histoire, et seules les premières
 *      histoires en ont un.
 * Il affiche aussi, par cours, combien de mots amazighs chaque histoire porte.
 */
import { COURSES } from '../src/data/courses.js'
import {
  HISTOIRES,
  MOTS,
  HORS_LEXIQUE,
  NB_GRATUITES_EN_PARTIE,
  composer,
  motsDe,
  uniteRequise,
} from '../src/data/histoires.js'

const LANGUES = ['kab', 'rif', 'shi', 'tzm', 'zgh']
const erreurs = []

/** Compare sans la casse ni la ponctuation : « As-d ! » = « as-d ». */
const norme = (s) =>
  s
    .toLowerCase()
    .replace(/[!?.,…«»"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// 2 — les mots viennent du vocabulaire du cours.
for (const lang of LANGUES) {
  const connus = new Set()
  for (const u of COURSES[lang].vocabulary()) for (const m of u.mots) connus.add(norme(m.mot))
  const permis = new Set((HORS_LEXIQUE[lang] || []).map(norme))
  for (const [cle, entree] of Object.entries(MOTS)) {
    const mot = entree[lang]
    if (!mot) continue
    if (!connus.has(norme(mot)) && !permis.has(norme(mot))) {
      erreurs.push(`[${lang}] « ${mot} » (${cle}) n'est pas dans le vocabulaire du cours`)
    }
  }
}

// 1, 3, 4 — la tenue de chaque histoire.
HISTOIRES.forEach((h, i) => {
  for (const lang of LANGUES) {
    try {
      composer(h, lang)
    } catch (e) {
      erreurs.push(`[${h.id}] ${e.message}`)
    }
  }
  if (!h.question.choices.includes(h.question.answer)) {
    erreurs.push(`[${h.id}] la réponse n'est pas parmi les choix`)
  }
  if (h.debutLibre && i >= NB_GRATUITES_EN_PARTIE) {
    erreurs.push(`[${h.id}] début gratuit hors des ${NB_GRATUITES_EN_PARTIE} premières histoires`)
  }
  if ((h.debutLibre || 0) >= h.texte.length) {
    erreurs.push(`[${h.id}] le début gratuit couvre toute l'histoire`)
  }
  if (i < NB_GRATUITES_EN_PARTIE && !h.debutLibre) {
    erreurs.push(`[${h.id}] une des premières histoires n'a pas de début gratuit`)
  }
})

// Le tableau de bord : mots amazighs par histoire, et unité qui la débloque.
const colonne = (s, n) => String(s).padEnd(n)
console.log(colonne('histoire', 10) + LANGUES.map((l) => colonne(l, 15)).join(''))
HISTOIRES.forEach((h, i) => {
  console.log(
    colonne(h.id, 10) +
      LANGUES.map((l) =>
        colonne(`${motsDe(h, l).length} mots · u${uniteRequise(COURSES[l], i + 1)}`, 15),
      ).join(''),
  )
})

if (erreurs.length) {
  console.error(`\n${erreurs.length} erreur(s) :`)
  for (const e of erreurs) console.error('  ✗ ' + e)
  process.exit(1)
}
console.log(`\n✓ ${HISTOIRES.length} histoires, ${Object.keys(MOTS).length} mots : tout vient des cours.`)
