/**
 * LE LEXIQUE COMPLET — tout ce que l'app fait dire, dans les cinq langues.
 *
 * Demande de Selim : « fais-moi un tableau complet et je te les enregistre ».
 * Ce script le fabrique à partir du contenu réel des cours, jamais d'une
 * liste tenue à la main — une seconde liste divergerait dès la leçon
 * suivante. Il produit :
 *
 *   lexique.csv  toutes langues, une ligne par mot (séparateur ; pour Excel FR)
 *   lexique.md   le même tableau, lisible tel quel dans GitHub
 *
 * L'EXTRACTION N'EST PAS ICI : elle vit dans src/data/dictionnaire.js, que
 * l'app utilise aussi pour son moteur de recherche. Deux extractions auraient
 * fini par ne plus dire la même chose, et la fiche remise au locuteur natif
 * n'aurait plus décrit l'app. Ce script n'est qu'une mise en page.
 *
 * Le kabyle garde en plus sa fiche historique (content-review.csv), générée
 * par gen-audio-manifest.mjs : c'est elle qui pilote les mp3 déjà enregistrés.
 *
 * Lancer : node scripts/gen-lexique.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { COURSES } from '../src/data/courses.js'
import { EMPRUNTS, A_TRANCHER } from '../src/data/emprunts.js'
import { ORIGINES } from '../src/data/etymologies.js'
import { ENTREES, ORDRE_LANGUES, STATS } from '../src/data/dictionnaire.js'
import { cleRecherche } from '../src/lib/translit.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const TRANCHER = A_TRANCHER.reduce((acc, e) => {
  ;(acc[e.lang] ||= new Set()).add(cleRecherche(e.mot))
  return acc
}, {})

const ligne = (e) => ({
  langue: e.langue,
  unite: e.unite,
  theme: e.uniteTitre,
  mot: e.mot,
  sens: e.sens.join(' / '),
  categorie: e.categorie,
  emprunt: e.emprunt ? e.emprunt.origine || 'arabe' : TRANCHER[e.lang]?.has(e.cle) ? 'à trancher' : '',
  classique: e.emprunt?.classique || '',
  // Une case vide se lirait « pas concerné ». Elle veut dire « pas encore
  // écrit » : le dictionnaire affiche d'ailleurs la même chose à l'élève.
  origine: e.etymologie?.origine || 'à préciser',
  fichier: e.audio || '',
  lecons: e.lecons.join(' '),
})

const parLangue = ORDRE_LANGUES.filter((id) => COURSES[id]).map((id) => ({
  course: COURSES[id],
  lignes: ENTREES.filter((e) => e.lang === id).map(ligne),
}))
const total = ENTREES.length

/* ---------------- lexique.csv ---------------- */
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
const COLS = [
  'Langue',
  'Unité',
  'Thème',
  'Mot / expression (à valider)',
  'Français',
  'Type',
  'Emprunt',
  'Mot amazigh classique',
  'Origine (dictionnaire)',
  'Fichier audio à enregistrer',
  'Leçons',
  'Correction proposée',
  'OK ?',
]
const csv = [
  COLS.map(esc).join(';'),
  ...parLangue.flatMap(({ lignes }) =>
    lignes.map((r) =>
      [r.langue, r.unite, r.theme, r.mot, r.sens, r.categorie, r.emprunt, r.classique, r.origine, r.fichier, r.lecons, '', '']
        .map(esc)
        .join(';'),
    ),
  ),
].join('\r\n')
writeFileSync(join(root, 'lexique.csv'), '﻿' + csv) // BOM : Excel FR ouvre en UTF-8

/* ---------------- lexique.md ---------------- */
const cellule = (s) => String(s ?? '').replace(/\|/g, '\\|')
const md = []
md.push('# Lexique complet — Tama Speak')
md.push('')
md.push('> Généré depuis le contenu des cours (`npm run gen:lexique`) — ne pas éditer à la main.')
md.push(
  `> **${total} entrées** dans ${parLangue.length} langues. Tout est **provisoire** tant qu'un locuteur natif ne l'a pas validé.`,
)
md.push('')
md.push('| Cours | Entrées | Audio |')
md.push('| --- | ---: | --- |')
for (const { course, lignes } of parLangue) {
  const audio = course.id === 'zgh' ? 'aucun (norme écrite)' : course.id === 'kab' ? 'en cours' : 'à enregistrer'
  md.push(`| ${course.name} (${course.autonym}) | ${lignes.length} | ${audio} |`)
}
md.push('')

for (const { course, lignes } of parLangue) {
  md.push(`## ${course.name} — ${course.autonym} (${lignes.length})`)
  md.push('')
  md.push('| # | Mot / expression | Français | Type | Origine | Fichier audio | Leçons |')
  md.push('| ---: | --- | --- | --- | --- | --- | --- |')
  lignes.forEach((r, i) => {
    const origine = ['arabe', 'espagnol'].includes(r.emprunt)
      ? r.classique
        ? `${r.emprunt} → ${cellule(r.classique)}`
        : r.emprunt
      : r.emprunt || r.origine
    md.push(
      `| ${i + 1} | **${cellule(r.mot)}** | ${cellule(r.sens) || '_à préciser_'} | ${r.categorie} | ${origine} | ${
        r.fichier ? `\`${r.fichier}\`` : '—'
      } | ${cellule(r.lecons)} |`,
    )
  })
  md.push('')
}

/* ---------------- étymologies ---------------- */
// Une même note sert souvent plusieurs cours — « aman » est le même mot du Rif
// au Souss. On regroupe donc par NOTE, pas par mot : Selim valide une fois ce
// qui vaut pour cinq entrées, au lieu de relire cinq fois la même phrase.
const parEtymo = new Map()
const sansEtymo = []
for (const e of ENTREES) {
  if (!e.etymologie) {
    sansEtymo.push(e)
    continue
  }
  if (!parEtymo.has(e.etymologie)) parEtymo.set(e.etymologie, [])
  parEtymo.get(e.etymologie).push(e)
}
const formes = (liste) => [...new Set(liste.map((e) => e.mot))].join(' · ')
const cours = (liste) => [...new Set(liste.map((e) => e.lang))].join(' ')

md.push('## Étymologies — la couche écrite à la main')
md.push('')
md.push(
  '> `src/data/etymologies.js`. C’est la SEULE partie du dictionnaire qui ne soit pas dérivée du contenu des cours : elle est à valider ligne par ligne. « Discuté » signale que les sources ne s’accordent pas — l’app l’affiche alors à l’élève.',
)
md.push('')
for (const [famille, o] of Object.entries(ORIGINES)) {
  const lignes = [...parEtymo.entries()]
    .filter(([et]) => et.origine === famille)
    .sort((a, b) => a[1][0].mot.localeCompare(b[1][0].mot, 'fr'))
  if (!lignes.length) continue
  md.push(`### ${o.label} (${lignes.length})`)
  md.push('')
  md.push('| Forme(s) | Cours | Racine | Note affichée | Discuté | OK ? |')
  md.push('| --- | --- | --- | --- | :-: | :-: |')
  for (const [et, liste] of lignes) {
    md.push(
      `| **${cellule(formes(liste))}** | ${cours(liste)} | ${et.racine || '—'} | ${cellule(et.note || '')} | ${
        et.discute ? '⚠️' : ''
      } | ☐ |`,
    )
  }
  md.push('')
}
if (sansEtymo.length) {
  md.push(`### Sans étymologie — à écrire (${sansEtymo.length})`)
  md.push('')
  md.push(
    'Le dictionnaire affiche pour ces entrées : « L’origine de ce mot n’est pas encore écrite. Elle sera ajoutée après validation par un locuteur ou un linguiste, bi-idniLlah. »',
  )
  md.push('')
  md.push('| Forme | Cours | Français |')
  md.push('| --- | --- | --- |')
  for (const e of sansEtymo) {
    md.push(`| **${cellule(e.mot)}** | ${e.lang} | ${cellule(e.sens.join(' / ')) || '—'} |`)
  }
  md.push('')
}

md.push('## Emprunts — les modales du cours')
md.push('')
md.push(
  'Chaque ligne déclenche, après une bonne réponse, la modale « ce mot vient d’ailleurs » (`src/data/emprunts.js`).',
)
md.push('')
md.push('| Cours | Expression | Français | Vient de | Mot amazigh classique | Note affichée |')
md.push('| --- | --- | --- | --- | --- | --- |')
for (const lang of ORDRE_LANGUES) {
  for (const e of EMPRUNTS[lang] || []) {
    md.push(
      `| ${COURSES[lang].name} | **${cellule(e.mot)}** | ${cellule(e.sens)} | ${e.origine || 'arabe'} | ${
        e.classique ? `**${cellule(e.classique)}**` : '—'
      } | ${cellule(e.usage || '')} |`,
    )
  }
}
md.push('')
md.push('### En attente d’une décision (aucune modale affichée)')
md.push('')
md.push('| Cours | Expression | Français | Pourquoi c’est en attente |')
md.push('| --- | --- | --- | --- |')
for (const e of A_TRANCHER) {
  md.push(
    `| ${COURSES[e.lang]?.name || e.lang} | **${cellule(e.mot)}** | ${cellule(e.sens)} | ${cellule(e.raison)} |`,
  )
}
md.push('')
writeFileSync(join(root, 'lexique.md'), md.join('\n'))

const nbEmprunts = Object.values(EMPRUNTS).reduce((n, l) => n + l.length, 0)
console.log(`OK — ${total} entrées, ${nbEmprunts} emprunts affichés, ${A_TRANCHER.length} en attente.`)
for (const s of STATS) console.log(`  ${s.nom.padEnd(20)} ${s.total}`)
console.log(
  `  ${parEtymo.size} étymologies écrites, ${sansEtymo.length} entrées sans (« sera ajoutée plus tard » dans l'app).`,
)
console.log('  lexique.csv')
console.log('  lexique.md')
