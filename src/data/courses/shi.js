import { qcm, match, culture, image } from '../exercises.js'

/**
 * Cours de TACHELHIT (tacelḥit) — Souss, Anti-Atlas, Haut-Atlas occidental.
 *
 * Contenu établi d'après des corpus de terrain, puis À VALIDER par un
 * locuteur natif comme tout le contenu de l'app :
 *   • Peace Corps Morocco, « TashlHeet Textbook » (2007) et son
 *     dictionnaire (2011) — collectés dans le Souss
 *   • Wikivoyage Tashelhit, Encyclopédie berbère (néologie, R. Achab),
 *     Centre de Recherche Berbère (INALCO)
 *
 * Arbitrages documentés :
 *   1. « Azul » n'apparaît AUCUNE fois dans les deux corpus Peace Corps :
 *      c'est un néologisme (Amawal, 1974), minoritaire au Souss. On
 *      enseigne « Tifawin » (vrai mot berbère, racine FAW « lumière ») et
 *      « Ssalamu ɛlikum » (ce qu'on entend vraiment), azul étant présenté
 *      comme le bonjour amazigh moderne.
 *   2. « Ar tufat » (à demain) est KABYLE — le tachelhit dit « azkka ».
 *   3. Le tachelhit conserve la série de nombres berbères mieux que le
 *      kabyle (yan, sin, kraḍ, kkuẓ, smmus) : on l'enseigne, avec une note
 *      d'usage (au souk, on compte souvent en arabe).
 *
 * Pas d'exercice audio tant qu'aucun enregistrement natif n'existe — et
 * les enregistrements kabyles ne pourront JAMAIS être recyclés ici : le
 * tachelhit est occlusif (t, d, k pleins) là où le kabyle spirantise.
 */

const q = (prompt, word, answer, choices) => qcm('fr-to-kab', prompt, word, answer, choices, false)
const qk = (prompt, word, answer, choices) => qcm('kab-to-fr', prompt, word, answer, choices, false)

// -------- Unité 1 — Tifawin, les salutations --------
const shi1 = [
  qk('Que veut dire « Tifawin » ?', 'Tifawin', 'Bonjour (le matin)', [
    'Bonjour (le matin)',
    'Bonne nuit',
    'Merci',
    'Au revoir',
  ]),
  culture(
    '« Tifawin » vient d’une racine amazighe qui signifie…',
    'La lumière',
    ['La lumière', 'Le matin', 'La paix', 'Le soleil'],
  ),
  qk('Que veut dire « Ssalamu ɛlikum » ?', 'Ssalamu ɛlikum', 'Bonjour (la paix sur vous)', [
    'Bonjour (la paix sur vous)',
    'Bonne journée',
    'Merci beaucoup',
    'À bientôt',
  ]),
  q('On te dit « Ssalamu ɛlikum ». Que réponds-tu ?', 'Ssalamu ɛlikum', 'Wa ɛlikum ssalam', [
    'Wa ɛlikum ssalam',
    'Tifawin',
    'Bslama',
    'Labas',
  ]),
]

const shi2 = [
  qk('Que veut dire « Yah » ?', 'Yah', 'Oui', ['Oui', 'Non', 'Merci', 'Bonjour']),
  qk('Que veut dire « Uhu » ?', 'Uhu', 'Non', ['Non', 'Oui', 'Peut-être', 'Rien']),
  q('Comment dit-on « Oui » en tachelhit ?', 'Oui', 'Yah', ['Yah', 'Ih', 'Uhu', 'Wah']),
  match([
    { kab: 'Yah', fr: 'Oui' },
    { kab: 'Uhu', fr: 'Non' },
    { kab: 'Tifawin', fr: 'Bonjour' },
  ]),
]

const shi3 = [
  qk('Que veut dire « Tanmmirt » ?', 'Tanmmirt', 'Merci', ['Merci', 'Bonjour', 'Pardon', 'Bienvenue']),
  qk('Que veut dire « Ak isrbḥ rbbi » ?', 'Ak isrbḥ rbbi', 'Merci (que Dieu te fasse réussir)', [
    'Merci (que Dieu te fasse réussir)',
    'Bonne route',
    'Sois le bienvenu',
    'Bonne nuit',
  ]),
  qk('Que veut dire « Afak » ?', 'Afak', 'S’il te plaît', ['S’il te plaît', 'Merci', 'Pardon', 'Voilà']),
  culture(
    'À une femme, « s’il te plaît » se dit…',
    'Afakm',
    ['Afakm', 'Afak', 'Afakt', 'Afakn'],
  ),
]

const shi4 = [
  qk('Que veut dire « Manzakin ? » ?', 'Manzakin ?', 'Comment vas-tu ?', [
    'Comment vas-tu ?',
    'Où vas-tu ?',
    'Comment t’appelles-tu ?',
    'D’où viens-tu ?',
  ]),
  culture(
    'On demande « Manzakin ? » à un homme. Et à une femme ?',
    'Manzakmin ?',
    ['Manzakmin ?', 'Manzakin ?', 'Manzakt ?', 'Manzant ?'],
  ),
  qk('Que veut dire « Labas » ?', 'Labas', 'Ça va', ['Ça va', 'Ça ne va pas', 'Merci', 'Bienvenue']),
  // Ce cours vient d'enseigner que « Manzakin ? » s'adresse à un homme et
  // « Manzakmin ? » à une femme. Poser ensuite « Manzakin ? » à un « toi »
  // dont l'app ignore le genre contredisait la leçon d'avant. On applique
  // donc la règle à l'exercice lui-même : le genre du destinataire est
  // toujours celui de quelqu'un qu'on nomme.
  q('Tu demandes « Manzakin ? » à un homme. Que va-t-il répondre ?', 'Comment vas-tu ?', 'Labas, lḥamdulillah', [
    'Labas, lḥamdulillah',
    'Wa ɛlikum ssalam',
    'Ar azkka',
    'Afak',
  ]),
]

const shi5 = [
  qk('Que veut dire « Brrk » ?', 'Brrk', 'Bienvenue', ['Bienvenue', 'Au revoir', 'Merci', 'Pardon']),
  qk('Que veut dire « Bslama » ?', 'Bslama', 'Au revoir', ['Au revoir', 'Bonjour', 'Bienvenue', 'Merci']),
  qk('Que veut dire « Azkka » ?', 'Azkka', 'Demain', ['Demain', 'Hier', 'Ce soir', 'Aujourd’hui']),
  match([
    { kab: 'Brrk', fr: 'Bienvenue' },
    { kab: 'Bslama', fr: 'Au revoir' },
    { kab: 'Azkka', fr: 'Demain' },
  ]),
]

// -------- Unité 2 — Les premiers mots --------
const shi6 = [
  qk('Que veut dire « Baba » ?', 'Baba', 'Papa', ['Papa', 'Maman', 'Frère', 'Grand-père']),
  qk('Que veut dire « Immi » ?', 'Immi', 'Maman', ['Maman', 'Papa', 'Sœur', 'Fille']),
  q('Comment dit-on « Maman » en tachelhit ?', 'Maman', 'Immi', ['Immi', 'Yemma', 'Inna-s', 'Tamɣart']),
  culture(
    'En kabyle on dit « yemma » pour maman. En tachelhit on dit…',
    'Immi',
    ['Immi', 'Yemma', 'Imma-s', 'Tayemmat'],
  ),
]

const shi7 = [
  // Voir un objet et le nommer, plutôt que traduire un mot par un mot : les
  // scènes de Scenes.jsx ne portent aucune langue et se partagent entre tous
  // les cours (contrairement à l'audio, qui ne se recycle jamais).
  image('water', 'Aman', ['Aman', 'Aɣrum', 'Tigmmi']),
  image('bread', 'Aɣrum', ['Aɣrum', 'Aman', 'Tigmmi']),
  image('house', 'Tigmmi', ['Tigmmi', 'Aman', 'Aɣrum']),
  match([
    { kab: 'Aman', fr: 'L’eau' },
    { kab: 'Aɣrum', fr: 'Le pain' },
    { kab: 'Tigmmi', fr: 'La maison' },
  ]),
]

const shi8 = [
  // Le tachelhit garde la série berbère complète (voir l'en-tête) : on peut
  // donc illustrer les quantités sans emprunter un seul numéral.
  image('count-1', 'Yan', ['Yan', 'Sin', 'Kraḍ', 'Kkuẓ']),
  image('count-3', 'Kraḍ', ['Kraḍ', 'Sin', 'Kkuẓ', 'Smmus']),
  match([
    { kab: 'Yan', fr: 'Un' },
    { kab: 'Sin', fr: 'Deux' },
    { kab: 'Kraḍ', fr: 'Trois' },
  ]),
  match([
    { kab: 'Kkuẓ', fr: 'Quatre' },
    { kab: 'Smmus', fr: 'Cinq' },
    { kab: 'Yan', fr: 'Un' },
  ]),
]

const shi9 = [
  culture(
    'Le tachelhit prononce les « t » et « k » de façon…',
    'Pleine et nette',
    ['Pleine et nette', 'Soufflée comme en kabyle', 'Muette', 'Roulée'],
  ),
  culture(
    'Quels mots sont identiques en tachelhit et en kabyle ?',
    'Aman et aɣrum',
    ['Aman et aɣrum', 'Immi et yemma', 'Yah et ih', 'Tigmmi et axxam'],
  ),
  qk('Le kabyle dit « axxam » pour la maison. Le tachelhit dit…', 'Tigmmi', 'Tigmmi', [
    'Tigmmi',
    'Axxam',
    'Taddart',
    'Tigemmi-s',
  ]),
  culture(
    'Le tachelhit garde la série des nombres berbères…',
    'Mieux que le kabyle',
    ['Mieux que le kabyle', 'Moins bien que le kabyle', 'Pas du tout', 'Uniquement à l’écrit'],
  ),
]

export const shiUnits = [
  {
    id: 'shi-u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Tifawin — les salutations',
    trophy: '👋',
    lessons: [
      { id: 'shi1', title: 'Se saluer', icon: '👋', status: 'current' },
      { id: 'shi2', title: 'Oui & non', icon: '✅', status: 'locked' },
      { id: 'shi3', title: 'Merci', icon: '💐', status: 'locked' },
      { id: 'shi-c1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'shi4', title: 'Ça va ?', icon: '💬', status: 'locked' },
      { id: 'shi5', title: 'Se quitter', icon: '🌙', status: 'locked' },
    ],
  },
  {
    id: 'shi-u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'Les premiers mots',
    trophy: '🏠',
    lessons: [
      { id: 'shi6', title: 'La famille', icon: '🪢', status: 'locked' },
      { id: 'shi7', title: 'Le quotidien', icon: '🍞', status: 'locked' },
      { id: 'shi-c2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'shi8', title: 'Compter', icon: '🔢', status: 'locked' },
      { id: 'shi9', title: 'Le son du Souss', icon: 'ⵣ', status: 'locked' },
    ],
  },
]

export const shiLessons = { shi1, shi2, shi3, shi4, shi5, shi6, shi7, shi8, shi9 }
