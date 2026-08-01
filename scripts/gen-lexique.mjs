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
import { slug } from '../src/lib/slug.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const ORDRE = ['kab', 'shi', 'rif', 'tzm', 'zgh']

// Le tifinagh ne se translittère pas en nom de fichier : le cours d'amazighe
// standard n'a de toute façon pas d'audio (la norme est phonologique, un même
// mot écrit se prononce autrement selon les régions — voir courses/zgh.js).
const TIFINAGH = /[ⴰ-⵿]/
const fichierAudio = (mot, lang) => {
  const s = slug(mot)
  if (!s) return '' // que du tifinagh : rien à nommer
  return lang === 'kab' ? `${s}.mp3` : `${lang}/${s}.mp3`
}

const categorie = (mot) => {
  if (TIFINAGH.test(mot) && [...mot].length === 1) return 'lettre'
  if (!TIFINAGH.test(mot) && mot.length === 1) return 'lettre'
  return mot.trim().includes(' ') ? 'expression' : 'mot'
}

/** Les emprunts, indexés comme dans l'app (« Labas ? » = « labas »). */
const cle = (m) =>
  String(m || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[?!.…]+$/, '').trim()
const EMPRUNT_PAR_LANG = Object.fromEntries(
  Object.entries(EMPRUNTS).map(([lang, l]) => [lang, new Map(l.map((e) => [cle(e.mot), e]))]),
)
const TRANCHER_PAR_LANG = A_TRANCHER.reduce((acc, e) => {
  ;(acc[e.lang] ||= new Map()).set(cle(e.mot), e)
  return acc
}, {})

/**
 * Les paires (mot amazigh, sens français) d'un exercice.
 * Même règle que courses.js : en fr→kab l'énoncé est FRANÇAIS et le mot
 * amazigh est la réponse — les confondre ferait enregistrer « Oui » à la
 * place de « Ih ». Les questions de culture n'ont pas de mot amazigh à
 * enregistrer : leurs deux faces sont en français.
 *
 * UN PIÈGE, corrigé ici. Sur les questions « on te dit X, que réponds-tu ? »,
 * le champ `word` porte le CONTEXTE affiché sur la carte, pas une traduction :
 * « Wa ɛlikum ssalam » se retrouverait dans la fiche avec pour sens
 * « Ssalamu ɛlikum », et le locuteur n'aurait aucun moyen de le voir. On
 * préfère laisser le sens vide — « à préciser » se corrige, une fausse
 * traduction se recopie.
 */
const REPONSE = /réponds-tu|répond-on|que réponds/i
function pairesDe(ex) {
  if (ex.type === 'match') return ex.pairs.map((p) => ({ mot: p.kab, sens: p.fr }))
  if (ex.type === 'culture') return []
  if (ex.type === 'image') return [{ mot: ex.answer, sens: '' }]
  if (!ex.word) return []
  if (ex.kind !== 'fr-to-kab') return [{ mot: ex.word, sens: ex.answer }]
  return [{ mot: ex.answer, sens: REPONSE.test(ex.prompt || '') ? '' : ex.word }]
}

function lexiqueDe(course) {
  const vus = new Map() // clé -> ligne
  for (const unit of course.units) {
    for (const node of unit.lessons) {
      if (node.type === 'chest') continue
      for (const ex of course.getExercises(node.id)) {
        for (const { mot, sens } of pairesDe(ex)) {
          if (!mot) continue
          const k = cle(mot)
          if (!vus.has(k)) {
            vus.set(k, {
              lang: course.id,
              langue: course.name,
              unite: unit.unitLabel,
              theme: unit.title,
              mot,
              sens: sens || '',
              categorie: categorie(mot),
              lecons: new Set(),
            })
          }
          const ligne = vus.get(k)
          if (!ligne.sens && sens) ligne.sens = sens // une image complète le sens plus tard
          ligne.lecons.add(node.id)
        }
      }
    }
  }
  // Un sens qui est lui-même un mot amazigh du cours n'est pas une
  // traduction : c'est le mot de l'énoncé qui a débordé (« Uř » = « Uř »).
  const motsConnus = new Set(vus.keys())
  return [...vus.values()].map((l) => {
    const emprunt = EMPRUNT_PAR_LANG[l.lang]?.get(cle(l.mot))
    const trancher = TRANCHER_PAR_LANG[l.lang]?.get(cle(l.mot))
    if (motsConnus.has(cle(l.sens))) l.sens = ''
    // Le registre des emprunts, lui, porte des traductions écrites à la main :
    // elles font foi sur celles qu'on devine depuis les exercices.
    if (!l.sens) l.sens = emprunt?.sens || trancher?.sens || ''
    return {
      ...l,
      lecons: [...l.lecons].join(' '),
      fichier: fichierAudio(l.mot, l.lang),
      emprunt: emprunt ? 'arabe' : trancher ? 'à trancher' : '',
      classique: emprunt?.classique || '',
    }
  })
}

const parLangue = ORDRE.filter((id) => COURSES[id]).map((id) => ({
  course: COURSES[id],
  lignes: lexiqueDe(COURSES[id]).sort((a, b) => a.mot.localeCompare(b.mot, 'fr')),
}))
const total = parLangue.reduce((n, l) => n + l.lignes.length, 0)

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
  'Fichier audio à enregistrer',
  'Leçons',
  'Correction proposée',
  'OK ?',
]
const csv = [
  COLS.map(esc).join(';'),
  ...parLangue.flatMap(({ lignes }) =>
    lignes.map((r) =>
      [r.langue, r.unite, r.theme, r.mot, r.sens, r.categorie, r.emprunt, r.classique, r.fichier, r.lecons, '', '']
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
md.push(
  '> Généré depuis le contenu des cours (`node scripts/gen-lexique.mjs`) — ne pas éditer à la main.',
)
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
  md.push('| # | Mot / expression | Français | Type | Emprunt | Fichier audio | Leçons |')
  md.push('| ---: | --- | --- | --- | --- | --- | --- |')
  lignes.forEach((r, i) => {
    const emprunt =
      r.emprunt === 'arabe' ? (r.classique ? `arabe → ${cellule(r.classique)}` : 'arabe') : r.emprunt
    md.push(
      `| ${i + 1} | **${cellule(r.mot)}** | ${cellule(r.sens) || '_à préciser_'} | ${r.categorie} | ${emprunt} | ${
        r.fichier ? `\`${r.fichier}\`` : '—'
      } | ${cellule(r.lecons)} |`,
    )
  })
  md.push('')
}

md.push('## Emprunts à l’arabe — les modales du cours')
md.push('')
md.push(
  'Chaque ligne déclenche, après une bonne réponse, la modale « ce mot vient de l’arabe » (`src/data/emprunts.js`).',
)
md.push('')
md.push('| Cours | Expression | Français | Mot amazigh classique | Note affichée |')
md.push('| --- | --- | --- | --- | --- |')
for (const lang of ORDRE) {
  for (const e of EMPRUNTS[lang] || []) {
    md.push(
      `| ${COURSES[lang].name} | **${cellule(e.mot)}** | ${cellule(e.sens)} | ${
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
for (const { course, lignes } of parLangue) console.log(`  ${course.name.padEnd(20)} ${lignes.length}`)
console.log('  lexique.csv')
console.log('  lexique.md')
