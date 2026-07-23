/**
 * Contenu des exercices — PROVISOIRE (à valider par un locuteur natif).
 * Orthographe latine usuelle.
 *
 * Types d'exercices :
 *   - 'qcm'    : choix multiple. kind = 'kab-to-fr' | 'fr-to-kab'.
 *   - 'listen' : écoute puis choisis (audio d'abord). kind = 'kab-to-fr'.
 *   - 'match'  : associe des paires kabyle ↔ français.
 */

const qcm = (kind, prompt, word, answer, choices, audio = kind === 'kab-to-fr') => ({
  type: 'qcm',
  kind,
  prompt,
  word,
  audio,
  answer,
  choices,
})
const listen = (word, answer, choices) => ({
  type: 'listen',
  kind: 'kab-to-fr',
  prompt: 'Écoute et choisis',
  word,
  audio: true,
  answer,
  choices,
})
const match = (pairs, prompt = 'Associe les paires') => ({ type: 'match', prompt, pairs })

// -------- Unité 1 — Salutations --------
const l1 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Azul', 'Bonjour', ['Bonjour', 'Merci', 'Au revoir', 'Bienvenue']),
  qcm('kab-to-fr', 'Que signifie ?', 'Azul fell-ak', 'Bonjour à toi', ['Bonjour à toi', 'Merci beaucoup', 'À demain', 'Comment vas-tu ?']),
  qcm('fr-to-kab', 'Comment dit-on « Bonjour » ?', 'Bonjour', 'Azul', ['Azul', 'Tanemmirt', 'Ar tufat', 'Ansuf']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ansuf', 'Bienvenue', ['Bienvenue', 'Merci', 'Oui', 'Bonjour']),
]
const l2 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanemmirt', 'Merci', ['Merci', 'Bonjour', 'Non', 'Bienvenue']),
  qcm('fr-to-kab', 'Comment dit-on « Merci » ?', 'Merci', 'Tanemmirt', ['Azul', 'Tanemmirt', 'Ala', 'Labas']),
  listen('Ih', 'Oui', ['Oui', 'Non', 'Merci', 'Bonjour']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ala', 'Non', ['Bonjour', 'Non', 'Oui', 'Au revoir']),
]
const l3 = [
  qcm('fr-to-kab', 'Comment dit-on « Oui » ?', 'Oui', 'Ih', ['Ih', 'Ala', 'Azul', 'Ar tufat']),
  qcm('fr-to-kab', 'Comment dit-on « Non » ?', 'Non', 'Ala', ['Ansuf', 'Ala', 'Ih', 'Tanemmirt']),
  listen('Labas ?', 'Ça va ?', ['Ça va ?', 'Merci', 'À demain', 'Bienvenue']),
  match([
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
]
const l4 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Labas', 'Ça va (bien)', ['Ça va (bien)', 'Non', 'Bienvenue', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Ça va ? » ?', 'Ça va ?', 'Labas ?', ['Labas ?', 'Azul', 'Tanemmirt', 'Ala']),
  listen('Azul fell-ak', 'Bonjour à toi', ['Bonjour à toi', 'Merci', 'À demain', 'Oui']),
  qcm('fr-to-kab', 'Comment dit-on « Bienvenue » ?', 'Bienvenue', 'Ansuf', ['Ansuf', 'Ih', 'Ar tufat', 'Labas']),
]
const l5 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ar tufat', 'À demain', ['À demain', 'Bonjour', 'Merci', 'Oui']),
  qcm('fr-to-kab', 'Comment dit-on « À demain » ?', 'À demain', 'Ar tufat', ['Ar tufat', 'Azul', 'Ansuf', 'Ih']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Ansuf', fr: 'Bienvenue' },
  ]),
  qcm('kab-to-fr', 'Que signifie ?', 'Azul', 'Bonjour', ['Bonjour', 'Bienvenue', 'Non', 'Merci']),
]

// -------- Unité 2 — Réponses & politesse (révision + associations) --------
const l6 = [
  listen('Ih', 'Oui', ['Oui', 'Non', 'Merci', 'Au revoir']),
  listen('Ala', 'Non', ['Non', 'Oui', 'Bonjour', 'Bienvenue']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Labas', fr: 'Ça va' },
  ]),
  qcm('fr-to-kab', 'Comment dit-on « Oui » ?', 'Oui', 'Ih', ['Ih', 'Ala', 'Ansuf', 'Azul']),
]
const l7 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanemmirt', 'Merci', ['Merci', 'Oui', 'À demain', 'Bonjour']),
  listen('Tanemmirt', 'Merci', ['Merci', 'Bienvenue', 'Non', 'Bonjour']),
  qcm('fr-to-kab', 'Comment dit-on « Merci » ?', 'Merci', 'Tanemmirt', ['Tanemmirt', 'Azul', 'Labas', 'Ih']),
  match([
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
]
const l8 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ansuf', 'Bienvenue', ['Bienvenue', 'Merci', 'Non', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Bienvenue » ?', 'Bienvenue', 'Ansuf', ['Ansuf', 'Azul', 'Ih', 'Labas']),
  listen('Azul', 'Bonjour', ['Bonjour', 'Merci', 'Oui', 'Bienvenue']),
  qcm('fr-to-kab', 'Comment dit-on « Bonjour » ?', 'Bonjour', 'Azul', ['Azul', 'Ansuf', 'Ala', 'Ar tufat']),
]
const l9 = [
  match([
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Ansuf', fr: 'Bienvenue' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
  qcm('kab-to-fr', 'Que signifie ?', 'Labas ?', 'Ça va ?', ['Ça va ?', 'Merci', 'Oui', 'Bonjour']),
  listen('Ala', 'Non', ['Non', 'Oui', 'Merci', 'À demain']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Labas', fr: 'Ça va' },
    { kab: 'Tanemmirt', fr: 'Merci' },
  ]),
]

export const byLesson = { l1, l2, l3, l4, l5, l6, l7, l8, l9 }

export function getExercises(lessonId) {
  return byLesson[lessonId] ?? l1
}

/** Banque plate de questions QCM/écoute pour le Défi du jour. */
export function challengePool() {
  return Object.values(byLesson)
    .flat()
    .filter((ex) => ex.type === 'qcm' || ex.type === 'listen')
}
