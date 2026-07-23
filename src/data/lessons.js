/**
 * Contenu des exercices — PROVISOIRE.
 * ⚠️ À faire valider / enrichir par un locuteur kabyle natif (Phase 2),
 * avec l'audio réel de chaque mot. Orthographe latine usuelle.
 *
 * Modèle d'exercice :
 *   {
 *     kind: 'kab-to-fr' | 'fr-to-kab',
 *     prompt: string,     // consigne
 *     word: string,       // mot/phrase montré
 *     audio: boolean,     // bouton écoute (audio réel en P2)
 *     answer: string,     // bonne réponse
 *     choices: string[],  // 3–4 options (dont la bonne)
 *   }
 */

const l1 = [
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Azul', audio: true, answer: 'Bonjour', choices: ['Bonjour', 'Merci', 'Au revoir', 'Bienvenue'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Azul fell-ak', audio: true, answer: 'Bonjour à toi', choices: ['Bonjour à toi', 'Merci beaucoup', 'À demain', 'Comment vas-tu ?'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Bonjour » ?', word: 'Bonjour', audio: false, answer: 'Azul', choices: ['Azul', 'Tanemmirt', 'Ar tufat', 'Ansuf'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Ansuf', audio: true, answer: 'Bienvenue', choices: ['Bienvenue', 'Merci', 'Oui', 'Bonjour'] },
]

const l2 = [
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Tanemmirt', audio: true, answer: 'Merci', choices: ['Merci', 'Bonjour', 'Non', 'Bienvenue'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Merci » ?', word: 'Merci', audio: false, answer: 'Tanemmirt', choices: ['Azul', 'Tanemmirt', 'Ala', 'Labas'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Ih', audio: true, answer: 'Oui', choices: ['Oui', 'Non', 'Merci', 'Bonjour'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Ala', audio: true, answer: 'Non', choices: ['Bonjour', 'Non', 'Oui', 'Au revoir'] },
]

const l3 = [
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Oui » ?', word: 'Oui', audio: false, answer: 'Ih', choices: ['Ih', 'Ala', 'Azul', 'Ar tufat'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Non » ?', word: 'Non', audio: false, answer: 'Ala', choices: ['Ansuf', 'Ala', 'Ih', 'Tanemmirt'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Labas ?', audio: true, answer: 'Ça va ?', choices: ['Ça va ?', 'Merci', 'À demain', 'Bienvenue'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Ar tufat', audio: true, answer: 'À demain', choices: ['À demain', 'Bonjour', 'Oui', 'Merci'] },
]

const l4 = [
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Labas', audio: true, answer: 'Ça va (bien)', choices: ['Ça va (bien)', 'Non', 'Bienvenue', 'À demain'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Ça va ? » ?', word: 'Ça va ?', audio: false, answer: 'Labas ?', choices: ['Labas ?', 'Azul', 'Tanemmirt', 'Ala'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Azul fell-ak', audio: true, answer: 'Bonjour à toi', choices: ['Bonjour à toi', 'Merci', 'À demain', 'Oui'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Bienvenue » ?', word: 'Bienvenue', audio: false, answer: 'Ansuf', choices: ['Ansuf', 'Ih', 'Ar tufat', 'Labas'] },
]

const l5 = [
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Ar tufat', audio: true, answer: 'À demain', choices: ['À demain', 'Bonjour', 'Merci', 'Oui'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « À demain » ?', word: 'À demain', audio: false, answer: 'Ar tufat', choices: ['Ar tufat', 'Azul', 'Ansuf', 'Ih'] },
  { kind: 'fr-to-kab', prompt: 'Comment dit-on « Merci » ?', word: 'Merci', audio: false, answer: 'Tanemmirt', choices: ['Tanemmirt', 'Ala', 'Labas', 'Azul'] },
  { kind: 'kab-to-fr', prompt: 'Que signifie ?', word: 'Azul', audio: true, answer: 'Bonjour', choices: ['Bonjour', 'Bienvenue', 'Non', 'Merci'] },
]

const byLesson = { l1, l2, l3, l4, l5 }

export function getExercises(lessonId) {
  return byLesson[lessonId] ?? l1
}
