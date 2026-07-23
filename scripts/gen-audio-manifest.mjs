/**
 * Génère, à partir du contenu des leçons :
 *  - public/audio/manifest.json  → liste des enregistrements attendus
 *  - content-review.csv          → fiche à remettre au locuteur natif
 *
 * Lancer : node scripts/gen-audio-manifest.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { byLesson } from '../src/data/lessons.js'
import { slug } from '../src/lib/audio.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// Collecte des termes kabyles uniques (avec leur traduction française).
const terms = new Map() // slug -> { kab, fr, lessons:Set }
function addTerm(kab, fr, lessonId) {
  if (!kab) return
  const id = slug(kab)
  if (!terms.has(id)) terms.set(id, { kab, fr: fr || '', lessons: new Set() })
  const t = terms.get(id)
  if (!t.fr && fr) t.fr = fr // complète la traduction si elle manquait
  t.lessons.add(lessonId)
}
for (const [lessonId, exercises] of Object.entries(byLesson)) {
  for (const ex of exercises) {
    if (ex.type === 'match') {
      for (const p of ex.pairs) addTerm(p.kab, p.fr, lessonId)
      continue
    }
    if (ex.type === 'image') {
      // la bonne réponse est le mot kabyle ; la traduction vient d'autres exercices
      addTerm(ex.answer, '', lessonId)
      continue
    }
    const kab = ex.kind === 'kab-to-fr' ? ex.word : ex.answer
    const fr = ex.kind === 'kab-to-fr' ? ex.answer : ex.word
    addTerm(kab, fr, lessonId)
  }
}

const rows = [...terms.entries()]
  .map(([id, t]) => ({
    id,
    kab: t.kab,
    fr: t.fr,
    file: `${id}.mp3`,
    lessons: [...t.lessons].sort().join(' '),
  }))
  .sort((a, b) => a.kab.localeCompare(b.kab))

// 1) manifest.json
mkdirSync(join(root, 'public', 'audio'), { recursive: true })
writeFileSync(join(root, 'public', 'audio', 'manifest.json'), JSON.stringify(rows, null, 2) + '\n')

// 2) content-review.csv (séparateur ; pour Excel FR)
const esc = (s) => `"${String(s).replace(/"/g, '""')}"`
const header = ['Kabyle (à valider)', 'Français', 'Fichier audio à enregistrer', 'Leçons', 'Correction proposée', 'OK ?']
const csv = [
  header.map(esc).join(';'),
  ...rows.map((r) => [r.kab, r.fr, r.file, r.lessons, '', ''].map(esc).join(';')),
].join('\r\n')
writeFileSync(join(root, 'content-review.csv'), '﻿' + csv) // BOM pour Excel

console.log(`OK — ${rows.length} termes.`)
console.log('  public/audio/manifest.json')
console.log('  content-review.csv')
