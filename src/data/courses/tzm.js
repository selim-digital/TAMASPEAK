import { qcm, match, culture } from '../exercises.js'

/**
 * Cours de TAMAZIGHT DU MAROC CENTRAL (tamaziɣt) — Moyen Atlas de
 * référence : Khénifra, Azrou, Ifrane, El Hajeb.
 *
 * Contenu établi d'après des corpus de terrain, puis À VALIDER par un
 * locuteur natif comme tout le contenu de l'app :
 *   • Peace Corps Morocco, « Tamazight Textbook » (2007, ~210 p.)
 *   • Dictionnaire du tamazight du Maroc central, A. Roux / S. Chaker
 *     (Centre de Recherche Berbère)
 *   • Wikipedia « Central Atlas Tamazight » (parler Ayt Ayache), IRCAM
 *
 * Arbitrages documentés :
 *   1. « Azul » ET « tanmmirt » sont ABSENTS des 210 pages du manuel de
 *      terrain. Ce sont des formes scolaires/emblématiques (enseignées par
 *      l'IRCAM), pas la parole du Moyen Atlas. Le cours ouvre donc sur
 *      « Ssalamu ɛlikum » et « Lla yɛawn », et présente azul/tanmmirt pour
 *      ce qu'ils sont : la forme de l'école et des pancartes.
 *   2. « Ansuf » (bienvenue) est kabyle : ici c'est « mrḥba ».
 *   3. FAUX-AMI CRITIQUE avec le kabyle : « taddart » = la MAISON au Maroc
 *      central, alors qu'en kabyle c'est le VILLAGE. Une leçon entière y
 *      est consacrée.
 *   4. Le tifinagh n'est pas un ornement ici : c'est l'écriture OFFICIELLE
 *      du Maroc (décret de 2003), celle de l'école et de la signalétique.
 *
 * Pas d'exercice audio tant qu'aucun enregistrement natif n'existe — la
 * transcription des emphatiques et des labiovélaires (k°, g°, ɣ°, absentes
 * du kabyle) doit d'abord être validée par un locuteur du Moyen Atlas.
 */

const q = (prompt, word, answer, choices) => qcm('fr-to-kab', prompt, word, answer, choices, false)
const qk = (prompt, word, answer, choices) => qcm('kab-to-fr', prompt, word, answer, choices, false)

// -------- Unité 1 — Les salutations --------
const tzm1 = [
  qk('Que veut dire « Ssalamu ɛlikum » ?', 'Ssalamu ɛlikum', 'Bonjour (la paix sur vous)', [
    'Bonjour (la paix sur vous)',
    'Au revoir',
    'Merci',
    'Bienvenue',
  ]),
  q('On te dit « Ssalamu ɛlikum ». Que réponds-tu ?', 'Ssalamu ɛlikum', 'Ɛlikum ssalam', [
    'Ɛlikum ssalam',
    'Lla ysllm',
    'Bla jmil',
    'Labas',
  ]),
  qk('Que veut dire « Lla yɛawn » ?', 'Lla yɛawn', 'Que Dieu t’aide', [
    'Que Dieu t’aide',
    'Que Dieu te pardonne',
    'Bonne nuit',
    'Bon appétit',
  ]),
  culture(
    'On salue « Lla yɛawn » surtout…',
    'Une personne au travail',
    ['Une personne au travail', 'Un enfant', 'Un invité qui part', 'Un commerçant'],
  ),
]

const tzm2 = [
  qk('Que veut dire « Uhu » ?', 'Uhu', 'Non', ['Non', 'Oui', 'Merci', 'Peut-être']),
  qk('Que veut dire « Yah » ?', 'Yah', 'Oui', ['Oui', 'Non', 'Bonjour', 'Voilà']),
  qk('Que veut dire « Waxxa » ?', 'Waxxa', 'D’accord', ['D’accord', 'Jamais', 'Merci', 'Pardon']),
  match([
    { kab: 'Yah', fr: 'Oui' },
    { kab: 'Uhu', fr: 'Non' },
    { kab: 'Waxxa', fr: 'D’accord' },
  ]),
]

const tzm3 = [
  qk('Que veut dire « Cukran » ?', 'Cukran', 'Merci', ['Merci', 'Pardon', 'Bonjour', 'De rien']),
  qk('Que répond-on à « Cukran » ?', 'Bla jmil', 'De rien', ['De rien', 'Merci à toi', 'Bienvenue', 'Au revoir']),
  qk('Que veut dire « Ɛafak » ?', 'Ɛafak', 'S’il te plaît', ['S’il te plaît', 'Merci', 'Pardon', 'Voilà']),
  culture(
    '« Tanmmirt » (merci) s’emploie au Maroc central surtout…',
    'À l’écrit et à l’école',
    ['À l’écrit et à l’école', 'Partout dans la rue', 'Seulement entre amis', 'Jamais'],
  ),
]

const tzm4 = [
  qk('Que veut dire « Mayd tɛnit ? » ?', 'Mayd tɛnit ?', 'Comment vas-tu ?', [
    'Comment vas-tu ?',
    'Où vas-tu ?',
    'Que veux-tu ?',
    'Qui es-tu ?',
  ]),
  qk('Que veut dire « Labas, l-ḥamdullah » ?', 'Labas, l-ḥamdullah', 'Ça va, Dieu merci', [
    'Ça va, Dieu merci',
    'Ça ne va pas',
    'Merci beaucoup',
    'À bientôt',
  ]),
  qk('Que veut dire « Is thnna ɣur-k ? » ?', 'Is thnna ɣur-k ?', 'Tout est tranquille chez toi ?', [
    'Tout est tranquille chez toi ?',
    'Habites-tu ici ?',
    'As-tu faim ?',
    'Es-tu fatigué ?',
  ]),
  match([
    { kab: 'Mayd tɛnit ?', fr: 'Comment vas-tu ?' },
    { kab: 'Labas', fr: 'Ça va' },
    { kab: 'Ɛafak', fr: 'S’il te plaît' },
  ]),
]

const tzm5 = [
  qk('Que veut dire « Mrḥba » ?', 'Mrḥba', 'Bienvenue', ['Bienvenue', 'Au revoir', 'Merci', 'Bonjour']),
  qk('Que veut dire « Qqim g lman » ?', 'Qqim g lman', 'Au revoir (reste dans la paix)', [
    'Au revoir (reste dans la paix)',
    'Assieds-toi ici',
    'Bonne nuit',
    'Sois le bienvenu',
  ]),
  qk('Que veut dire « Askka » ?', 'Askka', 'Demain', ['Demain', 'Hier', 'Ce soir', 'Maintenant']),
  culture(
    'Celui qui PART dit « Qqim g lman ». Celui qui reste répond…',
    'Tmunt d wayḍ',
    ['Tmunt d wayḍ', 'Qqim g lman', 'Bla jmil', 'Mrḥba'],
  ),
]

// -------- Unité 2 — Les premiers mots --------
const tzm6 = [
  qk('Que veut dire « Bba » ?', 'Bba', 'Mon père', ['Mon père', 'Ma mère', 'Mon frère', 'Mon oncle']),
  qk('Que veut dire « Mma » ?', 'Mma', 'Ma mère', ['Ma mère', 'Mon père', 'Ma sœur', 'Ma tante']),
  qk('Que veut dire « Bbaḥllu » ?', 'Bbaḥllu', 'Grand-père', ['Grand-père', 'Grand-mère', 'Oncle', 'Cousin']),
  match([
    { kab: 'Bba', fr: 'Mon père' },
    { kab: 'Mma', fr: 'Ma mère' },
    { kab: 'Mmaḥllu', fr: 'Grand-mère' },
  ]),
]

const tzm7 = [
  qk('Que veut dire « Aman » ?', 'Aman', 'L’eau', ['L’eau', 'Le pain', 'Le lait', 'Le thé']),
  qk('Que veut dire « Aɣrum » ?', 'Aɣrum', 'Le pain', ['Le pain', 'L’eau', 'Le sel', 'Le beurre']),
  qk('Que veut dire « Taddart » au Maroc central ?', 'Taddart', 'La maison', [
    'La maison',
    'Le village',
    'La porte',
    'La cour',
  ]),
  culture(
    'Attention : en kabyle, « taddart » veut dire…',
    'Le village',
    ['Le village', 'La maison', 'La montagne', 'La famille'],
  ),
]

const tzm8 = [
  qk('Que veut dire « Yan » ?', 'Yan', 'Un', ['Un', 'Deux', 'Trois', 'Quatre']),
  q('Comment dit-on « Trois » en tamazight ?', 'Trois', 'Kraḍ', ['Kraḍ', 'Sin', 'Kkuẓ', 'Smmus']),
  match([
    { kab: 'Yan', fr: 'Un' },
    { kab: 'Sin', fr: 'Deux' },
    { kab: 'Kraḍ', fr: 'Trois' },
  ]),
  match([
    { kab: 'Kkuẓ', fr: 'Quatre' },
    { kab: 'Smmus', fr: 'Cinq' },
    { kab: 'Yat', fr: 'Une' },
  ]),
]

const tzm9 = [
  culture(
    'Au Maroc, le tifinagh (ⵜⵉⴼⵉⵏⴰⵖ) est…',
    'L’écriture officielle de l’amazigh',
    ['L’écriture officielle de l’amazigh', 'Un alphabet décoratif', 'Une écriture disparue', 'Un dialecte'],
  ),
  qk('Le kabyle dit « yiwen » pour un. Le tamazight dit…', 'Yan', 'Yan', ['Yan', 'Yiwen', 'Yun', 'Yat']),
  culture(
    'Quels mots sont identiques en tamazight et en kabyle ?',
    'Aman et aɣrum',
    ['Aman et aɣrum', 'Taddart et taddart', 'Mma et yemma', 'Ɛafak et ttxil-k'],
  ),
  culture(
    'Le kabyle dit « azekka » pour demain. Le tamazight dit…',
    'Askka',
    ['Askka', 'Azekka', 'Aska-nnaɣ', 'Tufat'],
  ),
]

export const tzmUnits = [
  {
    id: 'tzm-u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Les salutations du Moyen Atlas',
    trophy: '👋',
    lessons: [
      { id: 'tzm1', title: 'Se saluer', icon: '👋', status: 'current' },
      { id: 'tzm2', title: 'Oui & non', icon: '✅', status: 'locked' },
      { id: 'tzm3', title: 'Merci', icon: '💐', status: 'locked' },
      { id: 'tzm-c1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'tzm4', title: 'Ça va ?', icon: '💬', status: 'locked' },
      { id: 'tzm5', title: 'Se quitter', icon: '🌙', status: 'locked' },
    ],
  },
  {
    id: 'tzm-u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'Les premiers mots',
    trophy: '🏠',
    lessons: [
      { id: 'tzm6', title: 'La famille', icon: '🪢', status: 'locked' },
      { id: 'tzm7', title: 'À la maison', icon: '🏠', status: 'locked' },
      { id: 'tzm-c2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'tzm8', title: 'Compter', icon: '🔢', status: 'locked' },
      { id: 'tzm9', title: 'Tifinagh & cousins', icon: 'ⵣ', status: 'locked' },
    ],
  },
]

export const tzmLessons = { tzm1, tzm2, tzm3, tzm4, tzm5, tzm6, tzm7, tzm8, tzm9 }
