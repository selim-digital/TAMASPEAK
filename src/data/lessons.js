/**
 * Contenu des exercices — PROVISOIRE.
 * ⚠️ À faire valider / enrichir par un locuteur kabyle natif (Phase 2),
 * avec l'audio réel de chaque mot. Ici : orthographe latine usuelle.
 *
 * Modèle d'exercice :
 *   {
 *     kind: 'kab-to-fr' | 'fr-to-kab',  // sens de traduction
 *     prompt: string,                    // consigne
 *     word: string,                      // mot/phrase montré
 *     audio: boolean,                    // bouton écoute (audio réel en P2)
 *     answer: string,                    // bonne réponse
 *     choices: string[],                 // 3–4 options (dont la bonne)
 *   }
 */
const salutations = [
  {
    kind: 'kab-to-fr',
    prompt: 'Que signifie ?',
    word: 'Azul fell-ak',
    audio: true,
    answer: 'Bonjour à toi',
    choices: ['Bonjour à toi', 'Merci beaucoup', 'Au revoir', 'Comment vas-tu ?'],
  },
  {
    kind: 'fr-to-kab',
    prompt: 'Comment dit-on « Merci » ?',
    word: 'Merci',
    audio: false,
    answer: 'Tanemmirt',
    choices: ['Azul', 'Tanemmirt', 'Ar tufat', 'Labas'],
  },
  {
    kind: 'kab-to-fr',
    prompt: 'Que signifie ?',
    word: 'Ar tufat',
    audio: true,
    answer: 'À demain',
    choices: ['Bienvenue', 'S’il te plaît', 'À demain', 'Bonne nuit'],
  },
]

/** Exercices par identifiant de leçon. Défaut = salutations. */
const byLesson = {
  l1: salutations,
  l2: salutations,
  l3: salutations,
  l4: salutations,
  l5: salutations,
}

export function getExercises(lessonId) {
  return byLesson[lessonId] ?? salutations
}
