/**
 * Fabriques d'exercices, partagées par tous les cours de langue.
 *
 * Types :
 *   - 'qcm'      : choix multiple. kind = 'kab-to-fr' | 'fr-to-kab'.
 *                  (« kab » = langue amazighe étudiée, quelle qu'elle soit.)
 *   - 'listen'   : écoute puis choisis (audio d'abord).
 *   - 'match'    : associe des paires amazigh ↔ français.
 *   - 'image'    : illustration d'une scène → trouver la bonne description.
 *   - 'culture'  : question de culture/histoire (réponses en français).
 *   - 'sentence' : écouter une phrase entière → choisir son sens.
 */
export const qcm = (kind, prompt, word, answer, choices, audio = kind === 'kab-to-fr') => ({
  type: 'qcm',
  kind,
  prompt,
  word,
  audio,
  answer,
  choices,
})

export const listen = (word, answer, choices) => ({
  type: 'listen',
  kind: 'kab-to-fr',
  prompt: 'Écoute et choisis',
  word,
  audio: true,
  answer,
  choices,
})

export const match = (pairs, prompt = 'Associe les paires') => ({ type: 'match', prompt, pairs })

export const image = (scene, answer, choices, prompt = 'Que montre l’image ?') => ({
  type: 'image',
  prompt,
  scene,
  answer,
  choices,
})

export const culture = (prompt, answer, choices, scene) => ({ type: 'culture', prompt, scene, answer, choices })

export const sentence = (phrase, answer, choices) => ({
  type: 'sentence',
  kind: 'kab-to-fr',
  prompt: 'Écoute la phrase',
  word: phrase,
  audio: true,
  answer,
  choices,
})
