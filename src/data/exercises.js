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
 *
 * QUI PARLE — le champ `qui`
 * --------------------------
 * Toute fabrique accepte en dernier argument un identifiant de personnage
 * (`'yemma'`, `'aqcic'`… voir components/mascots/Family.jsx). L'énoncé est
 * alors présenté comme SA phrase, silhouette à l'appui.
 *
 * L'attribution n'est pas un ornement, elle est GRAMMATICALE : chaque
 * personnage porte toujours la même forme — Aqcic les questions, Yemma les
 * salutations et l'accueil, Baba les impératifs et les explications, Taqcict
 * les énumérations et les nombres, Setti les mots anciens et les formules de
 * bénédiction. C'est la constance qui les rend reconnaissables : au bout de
 * quelques unités, on sait qui va parler avant d'avoir lu le nom.
 *
 * Deux règles pour que le procédé ne s'use pas :
 *   • un MOT isolé n'a pas de locuteur — on attribue les énoncés, pas le
 *     vocabulaire (environ un exercice sur trois) ;
 *   • le personnage ne juge jamais : sur erreur il reformule.
 */
export const qcm = (kind, prompt, word, answer, choices, audio = kind === 'kab-to-fr', qui) => ({
  type: 'qcm',
  kind,
  prompt,
  word,
  audio,
  answer,
  choices,
  qui,
})

export const listen = (word, answer, choices, qui) => ({
  type: 'listen',
  kind: 'kab-to-fr',
  prompt: 'Écoute et choisis',
  word,
  audio: true,
  answer,
  choices,
  qui,
})

export const match = (pairs, prompt = 'Associe les paires') => ({ type: 'match', prompt, pairs })

export const image = (scene, answer, choices, prompt = 'Que montre l’image ?', qui) => ({
  type: 'image',
  prompt,
  scene,
  answer,
  choices,
  qui,
})

export const culture = (prompt, answer, choices, scene) => ({ type: 'culture', prompt, scene, answer, choices })

/**
 * Ce que MONTRE chaque scène, en français.
 *
 * Un exercice `image` n'a pas de `word` : l'énoncé est un dessin, et le mot
 * amazigh est la RÉPONSE. Sans cette table, ces mots-là sortiraient de
 * `vocabulary()` (data/courses.js) — c'est-à-dire de la liste que l'on
 * propose à un locuteur natif pour rendre le cours sonore. Un mot enseigné
 * uniquement par l'image deviendrait alors un mot que personne n'est jamais
 * invité à enregistrer : le dessin le rendrait muet.
 *
 * La table est volontairement ici, à côté des fabriques, pour qu'ajouter une
 * scène et oublier sa glose se voie tout de suite.
 */
export const SENS_SCENE = {
  tea: 'Le thé',
  bread: 'Le pain',
  water: 'L’eau',
  house: 'La maison',
  cat: 'Le chat',
  village: 'Le village',
  door: 'La porte',
  book: 'Le livre',
  sun: 'Le soleil',
  rain: 'La pluie',
  snow: 'La neige',
  cloud: 'Le nuage',
  wind: 'Le vent',
  souk: 'Le marché',
  honey: 'Le miel',
  olives: 'Les olives',
  flag: 'Le drapeau',
  tifinagh: 'Le tifinagh',
  'color-green': 'Vert',
  'color-red': 'Rouge',
  'color-yellow': 'Jaune',
  'color-black': 'Noir',
  'color-white': 'Blanc',
  'count-1': 'Un',
  'count-2': 'Deux',
  'count-3': 'Trois',
  'count-4': 'Quatre',
  'count-5': 'Cinq',
}

export const sentence = (phrase, answer, choices, qui) => ({
  type: 'sentence',
  kind: 'kab-to-fr',
  prompt: 'Écoute la phrase',
  word: phrase,
  audio: true,
  answer,
  choices,
  qui,
})
