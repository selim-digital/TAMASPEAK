import { qcm, match, culture } from '../exercises.js'

/**
 * Cours de TARIFIT (rifain) — Rif, nord-est du Maroc.
 *
 * Contenu établi à partir de sources universitaires, puis À VALIDER par un
 * locuteur natif comme tout le contenu de l'app :
 *   • Mourigh & Kossmann, « An Introduction to Tarifiyt Berber (Nador) », 2019
 *   • Serhoual, « Dictionnaire tarifit-français », 2002
 *   • Kossmann, « Loanwords in Tarifiyt »
 *
 * Deux pièges explicitement écartés (documentés par ces sources) :
 *   1. « Azul » n'est PAS la salutation traditionnelle du Rif — c'est un
 *      néologisme militant ; la formule normale est « Ssalamu ɛlikum ».
 *      Il est enseigné, mais présenté pour ce qu'il est.
 *   2. « Tanemmirt » est KABYLE, pas rifain : on ne recycle pas l'entrée du
 *      cours kabyle. Merci se dit « Barek llahu fik ».
 * De même, les numéraux sont empruntés à l'arabe au-delà de « un » : on
 * n'invente pas de sin/kraḍ scolaires.
 *
 * Pas d'exercice audio tant qu'aucun enregistrement natif n'existe pour
 * cette langue (audio: false partout) — mieux vaut le silence qu'une voix
 * de synthèse qui déforme la prononciation.
 */

const q = (prompt, word, answer, choices) => qcm('fr-to-kab', prompt, word, answer, choices, false)
const qk = (prompt, word, answer, choices) => qcm('kab-to-fr', prompt, word, answer, choices, false)

// -------- Unité 1 — Salutations --------
const rif1 = [
  qk('Que veut dire « Ssalamu ɛlikum » ?', 'Ssalamu ɛlikum', 'Bonjour (la paix sur vous)', [
    'Bonjour (la paix sur vous)',
    'Au revoir',
    'Merci beaucoup',
    'Bienvenue',
  ]),
  q('On te dit « Ssalamu ɛlikum ». Que réponds-tu ?', 'Ssalamu ɛlikum', 'Wa ɛlikum ssalam', [
    'Wa ɛlikum ssalam',
    'Barek llahu fik',
    'B-essalama',
    'Mliḥ',
  ]),
  qk('Que veut dire « Marḥba » ?', 'Marḥba', 'Bienvenue', ['Bienvenue', 'Bonjour', 'Merci', 'Au revoir']),
  culture(
    'Au Rif, quelle est la salutation la plus courante au quotidien ?',
    'Ssalamu ɛlikum',
    ['Ssalamu ɛlikum', 'Azul', 'Marḥba', 'Mliḥ'],
  ),
]

const rif2 = [
  qk('Que veut dire « Wah » ?', 'Wah', 'Oui', ['Oui', 'Non', 'Merci', 'Peut-être']),
  qk('Que veut dire « Lla » ?', 'Lla', 'Non', ['Non', 'Oui', 'Bonjour', 'Rien']),
  q('Comment dit-on « Oui » en tarifit ?', 'Oui', 'Wah', ['Wah', 'Lla', 'Ih', 'Ala']),
  match([
    { kab: 'Wah', fr: 'Oui' },
    { kab: 'Lla', fr: 'Non' },
    { kab: 'Marḥba', fr: 'Bienvenue' },
  ]),
]

const rif3 = [
  qk('Que veut dire « Barek llahu fik » ?', 'Barek llahu fik', 'Merci (que Dieu te bénisse)', [
    'Merci (que Dieu te bénisse)',
    'Bonjour',
    'S’il te plaît',
    'Au revoir',
  ]),
  q('Comment dit-on « Merci » en tarifit ?', 'Merci', 'Barek llahu fik', [
    'Barek llahu fik',
    'Tanemmirt',
    'Ṣaḥḥa nnec',
    'Marḥba',
  ]),
  qk('Que veut dire « Ɛafak » ?', 'Ɛafak', 'S’il te plaît', ['S’il te plaît', 'Merci', 'Pardon', 'Bonjour']),
  culture(
    '« Tanemmirt » (merci) appartient à quelle langue amazighe ?',
    'Au kabyle',
    ['Au kabyle', 'Au tarifit', 'Au tachelhit', 'À toutes'],
  ),
]

const rif4 = [
  qk('Que veut dire « Mamec teǧǧid ? » ?', 'Mamec teǧǧid ?', 'Comment vas-tu ?', [
    'Comment vas-tu ?',
    'Où vas-tu ?',
    'Qui es-tu ?',
    'Que fais-tu ?',
  ]),
  qk('Que veut dire « Mliḥ » ?', 'Mliḥ', 'Ça va bien', ['Ça va bien', 'Ça va mal', 'Merci', 'Bonjour']),
  q('On te demande « Mamec teǧǧid ? ». Que réponds-tu ?', 'Comment vas-tu ?', 'Mliḥ, l-ḥamdu li-llah', [
    'Mliḥ, l-ḥamdu li-llah',
    'Wa ɛlikum ssalam',
    'Aṛ tiwecca',
    'Ɛafak',
  ]),
  match([
    { kab: 'Mamec teǧǧid ?', fr: 'Comment vas-tu ?' },
    { kab: 'Mliḥ', fr: 'Ça va bien' },
    { kab: 'Barek llahu fik', fr: 'Merci' },
  ]),
]

const rif5 = [
  qk('Que veut dire « B-essalama » ?', 'B-essalama', 'Au revoir', ['Au revoir', 'Bonjour', 'Merci', 'Bienvenue']),
  qk('Que veut dire « Tiwecca » ?', 'Tiwecca', 'Demain', ['Demain', 'Hier', 'Aujourd’hui', 'Ce soir']),
  q('Comment dit-on « Au revoir » en tarifit ?', 'Au revoir', 'B-essalama', [
    'B-essalama',
    'Marḥba',
    'Ɛafak',
    'Wah',
  ]),
  match([
    { kab: 'B-essalama', fr: 'Au revoir' },
    { kab: 'Tiwecca', fr: 'Demain' },
    { kab: 'Ɛafak', fr: 'S’il te plaît' },
  ]),
]

// -------- Unité 2 — Les premiers mots --------
const rif6 = [
  qk('Que veut dire « Baba » ?', 'Baba', 'Papa', ['Papa', 'Maman', 'Frère', 'Grand-père']),
  qk('Que veut dire « Yemma » ?', 'Yemma', 'Maman', ['Maman', 'Papa', 'Sœur', 'Grand-mère']),
  q('Comment dit-on « Maman » en tarifit ?', 'Maman', 'Yemma', ['Yemma', 'Baba', 'Učma', 'Setti']),
  culture(
    'En tarifit, « baba » et « yemma » se disent aussi…',
    'Comme en kabyle',
    ['Comme en kabyle', 'Différemment', 'Seulement au pluriel', 'Uniquement en arabe'],
  ),
]

const rif7 = [
  qk('Que veut dire « Aman » ?', 'Aman', 'L’eau', ['L’eau', 'Le pain', 'Le lait', 'Le thé']),
  qk('Que veut dire « Aɣrum » ?', 'Aɣrum', 'Le pain', ['Le pain', 'L’eau', 'Le sel', 'L’huile']),
  q('Comment dit-on « L’eau » en tarifit ?', 'L’eau', 'Aman', ['Aman', 'Aɣrum', 'Atay', 'Uḍi']),
  match([
    { kab: 'Aman', fr: 'L’eau' },
    { kab: 'Aɣrum', fr: 'Le pain' },
    { kab: 'Baba', fr: 'Papa' },
  ]),
]

const rif8 = [
  qk('Que veut dire « Ijjen » ?', 'Ijjen', 'Un', ['Un', 'Deux', 'Trois', 'Dix']),
  q('Comment dit-on « Deux » en tarifit ?', 'Deux', 'Tnayen', ['Tnayen', 'Sin', 'Ijjen', 'Tlata']),
  culture(
    'En tarifit, les nombres à partir de deux viennent…',
    'De l’arabe',
    ['De l’arabe', 'Du berbère ancien', 'De l’espagnol', 'Du français'],
  ),
  match([
    { kab: 'Ijjen', fr: 'Un' },
    { kab: 'Tnayen', fr: 'Deux' },
    { kab: 'Tlata', fr: 'Trois' },
  ]),
]

const rif9 = [
  culture(
    'Le tarifit transforme souvent le « l » des autres langues amazighes en…',
    'ř',
    ['ř', 'n', 'd', 'g'],
  ),
  qk('Le mot kabyle « ul » (cœur) devient en tarifit…', 'Uř', 'Uř', ['Uř', 'Ul', 'Un', 'Ud']),
  qk('Le mot kabyle « argaz » (homme) devient en tarifit…', 'Aryaz', 'Aryaz', ['Aryaz', 'Argaz', 'Arjaz', 'Aryal']),
  culture(
    'Comment dit-on « ma sœur » en tarifit (kabyle : weltma) ?',
    'Učma',
    ['Učma', 'Weltma', 'Ultma', 'Tacma'],
  ),
]

export const rifUnits = [
  {
    id: 'rif-u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Ssalamu ɛlikum — les salutations',
    trophy: '👋',
    lessons: [
      { id: 'rif1', title: 'Se saluer', icon: '👋', status: 'current' },
      { id: 'rif2', title: 'Oui & non', icon: '✅', status: 'locked' },
      { id: 'rif3', title: 'Merci', icon: '💐', status: 'locked' },
      { id: 'rif-c1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'rif4', title: 'Ça va ?', icon: '💬', status: 'locked' },
      { id: 'rif5', title: 'Se quitter', icon: '🌙', status: 'locked' },
    ],
  },
  {
    id: 'rif-u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'Les premiers mots',
    trophy: '🏠',
    lessons: [
      { id: 'rif6', title: 'La famille', icon: '🪢', status: 'locked' },
      { id: 'rif7', title: 'Le quotidien', icon: '🍞', status: 'locked' },
      { id: 'rif-c2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'rif8', title: 'Compter', icon: '🔢', status: 'locked' },
      { id: 'rif9', title: 'Le son du Rif', icon: 'ⵣ', status: 'locked' },
    ],
  },
]

export const rifLessons = { rif1, rif2, rif3, rif4, rif5, rif6, rif7, rif8, rif9 }
