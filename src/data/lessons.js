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
/** Image d'une situation quotidienne → trouver la bonne description (mot kabyle). */
const image = (scene, answer, choices, prompt = 'Que montre l’image ?') => ({ type: 'image', prompt, scene, answer, choices })
/** Écouter une PHRASE entière → choisir son sens. */
const sentence = (phrase, answer, choices) => ({
  type: 'sentence',
  kind: 'kab-to-fr',
  prompt: 'Écoute la phrase',
  word: phrase,
  audio: true,
  answer,
  choices,
})

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

// -------- Unité 3 — À la maison (vocabulaire du quotidien + images) --------
const l10 = [
  image('house', 'Axxam', ['Axxam', 'Tawwurt', 'Aman', 'Adlis']),
  qcm('kab-to-fr', 'Que signifie ?', 'Axxam', 'Maison', ['Maison', 'Porte', 'Eau', 'Livre']),
  image('door', 'Tawwurt', ['Tawwurt', 'Axxam', 'Amcic', 'Atay']),
  qcm('fr-to-kab', 'Comment dit-on « Porte » ?', 'Porte', 'Tawwurt', ['Tawwurt', 'Axxam', 'Aman', 'Taddart']),
]
const l11 = [
  image('water', 'Aman', ['Aman', 'Aɣrum', 'Atay', 'Axxam']),
  image('bread', 'Aɣrum', ['Aɣrum', 'Aman', 'Amcic', 'Tawwurt']),
  listen('Aman', 'Eau', ['Eau', 'Pain', 'Thé', 'Maison']),
  match([
    { kab: 'Aman', fr: 'Eau' },
    { kab: 'Aɣrum', fr: 'Pain' },
    { kab: 'Atay', fr: 'Thé' },
  ]),
]
const l12 = [
  image('tea', 'Atay', ['Atay', 'Aman', 'Adlis', 'Taddart']),
  qcm('kab-to-fr', 'Que signifie ?', 'Atay', 'Thé', ['Thé', 'Eau', 'Pain', 'Porte']),
  sentence('Tanemmirt aṭas', 'Merci beaucoup', ['Merci beaucoup', 'Bonjour à toi', 'À demain', 'Bienvenue']),
  match([
    { kab: 'Atay', fr: 'Thé' },
    { kab: 'Axxam', fr: 'Maison' },
    { kab: 'Tawwurt', fr: 'Porte' },
  ]),
]
const l13 = [
  image('cat', 'Amcic', ['Amcic', 'Adlis', 'Tawwurt', 'Aman']),
  image('village', 'Taddart', ['Taddart', 'Axxam', 'Atay', 'Aɣrum']),
  image('book', 'Adlis', ['Adlis', 'Amcic', 'Tawwurt', 'Aman']),
  qcm('kab-to-fr', 'Que signifie ?', 'Taddart', 'Village', ['Village', 'Maison', 'Chat', 'Livre']),
  qcm('kab-to-fr', 'Que signifie ?', 'Adlis', 'Livre', ['Livre', 'Chat', 'Village', 'Eau']),
]

// -------- Unité 4 — La famille & les phrases --------
const l14 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Baba', 'Père', ['Père', 'Mère', 'Frère', 'Sœur']),
  qcm('kab-to-fr', 'Que signifie ?', 'Yemma', 'Mère', ['Mère', 'Père', 'Sœur', 'Maison']),
  match([
    { kab: 'Baba', fr: 'Père' },
    { kab: 'Yemma', fr: 'Mère' },
    { kab: 'Gma', fr: 'Frère' },
  ]),
  listen('Yemma', 'Mère', ['Mère', 'Père', 'Frère', 'Eau']),
]
const l15 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Gma', 'Frère', ['Frère', 'Sœur', 'Père', 'Chat']),
  qcm('fr-to-kab', 'Comment dit-on « Sœur » ?', 'Sœur', 'Weltma', ['Weltma', 'Gma', 'Yemma', 'Baba']),
  match([
    { kab: 'Gma', fr: 'Frère' },
    { kab: 'Weltma', fr: 'Sœur' },
    { kab: 'Baba', fr: 'Père' },
  ]),
  listen('Gma', 'Frère', ['Frère', 'Sœur', 'Mère', 'Village']),
]
const l16 = [
  sentence('Azul, amek telliḍ ?', 'Bonjour, comment vas-tu ?', ['Bonjour, comment vas-tu ?', 'Merci beaucoup', 'Bienvenue à toi', 'À demain']),
  sentence('Aql-i labas', 'Je vais bien', ['Je vais bien', 'Au revoir', 'Merci beaucoup', 'Bonjour']),
  sentence('Ansuf yes-k', 'Bienvenue à toi', ['Bienvenue à toi', 'Bonjour', 'Merci beaucoup', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Merci beaucoup » ?', 'Merci beaucoup', 'Tanemmirt aṭas', ['Tanemmirt aṭas', 'Azul fell-ak', 'Ar tufat', 'Ansuf yes-k']),
]
const l17 = [
  image('tea', 'Atay', ['Atay', 'Aman', 'Aɣrum', 'Axxam']),
  match([
    { kab: 'Axxam', fr: 'Maison' },
    { kab: 'Baba', fr: 'Père' },
    { kab: 'Aman', fr: 'Eau' },
    { kab: 'Amcic', fr: 'Chat' },
  ]),
  sentence('Tanemmirt aṭas', 'Merci beaucoup', ['Merci beaucoup', 'Bonjour', 'Oui', 'Village']),
  image('house', 'Axxam', ['Axxam', 'Taddart', 'Tawwurt', 'Adlis']),
]

export const byLesson = { l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17 }

export function getExercises(lessonId) {
  return byLesson[lessonId] ?? l1
}

/** Banque plate de questions à choix (QCM, écoute, phrase, image) pour le Défi du jour. */
export function challengePool() {
  return Object.values(byLesson)
    .flat()
    .filter((ex) => ['qcm', 'listen', 'sentence', 'image'].includes(ex.type))
}
