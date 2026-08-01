import { qcm, match, culture } from '../exercises.js'

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
  q('On te demande « Manzakin ? ». Que réponds-tu ?', 'Comment vas-tu ?', 'Labas, lḥamdulillah', [
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
  qk('Que veut dire « Aman » ?', 'Aman', 'L’eau', ['L’eau', 'Le pain', 'Le thé', 'Le lait']),
  qk('Que veut dire « Aɣrum » ?', 'Aɣrum', 'Le pain', ['Le pain', 'L’eau', 'Le sel', 'Le miel']),
  qk('Que veut dire « Tigmmi » ?', 'Tigmmi', 'La maison', ['La maison', 'La porte', 'Le village', 'Le jardin']),
  match([
    { kab: 'Aman', fr: 'L’eau' },
    { kab: 'Aɣrum', fr: 'Le pain' },
    { kab: 'Tigmmi', fr: 'La maison' },
  ]),
]

const shi8 = [
  qk('Que veut dire « Yan » ?', 'Yan', 'Un', ['Un', 'Deux', 'Trois', 'Cinq']),
  q('Comment dit-on « Trois » en tachelhit ?', 'Trois', 'Kraḍ', ['Kraḍ', 'Sin', 'Kkuẓ', 'Smmus']),
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

// -------- Unité 3 — Au travail --------
// Le tachelhit garde « tawuri » (travail, tâche) là où le kabyle passe à
// « axeddim » : même situation que pour les nombres, la langue du Souss a
// conservé davantage de fonds amazigh. Le mot arabe « lxdmt » s'entend
// pourtant tous les jours — les deux sont enseignés, chacun nommé.
const shi10 = [
  qk('Que veut dire « Tawuri » ?', 'Tawuri', 'Le travail', ['Le travail', 'Le marché', 'La maison', 'Le chemin']),
  qk('Que veut dire « Lxdmt » ?', 'Lxdmt', 'Le travail (mot arabe)', [
    'Le travail (mot arabe)',
    'Le repos',
    'Le salaire',
    'Le champ',
  ]),
  qk('Que veut dire « Axddam » ?', 'Axddam', 'Le travailleur', ['Le travailleur', 'Le travail', 'Le patron', 'Le voisin']),
  culture(
    'Pour « travail », le tachelhit a gardé un mot amazigh :',
    'Tawuri',
    ['Tawuri', 'Lxdmt', 'Ssuq', 'Taḥanut'],
  ),
]

const shi11 = [
  qk('Que veut dire « Aslmad » ?', 'Aslmad', 'L’enseignant', ['L’enseignant', 'L’élève', 'Le médecin', 'Le paysan']),
  qk('Que veut dire « Anlmad » ?', 'Anlmad', 'L’élève', ['L’élève', 'L’enseignant', 'L’enfant', 'Le frère']),
  qk('Que veut dire « Afllaḥ » ?', 'Afllaḥ', 'Le paysan', ['Le paysan', 'Le berger', 'Le médecin', 'Le marchand']),
  match([
    { kab: 'Aslmad', fr: 'L’enseignant' },
    { kab: 'Anlmad', fr: 'L’élève' },
    { kab: 'Ṭṭbib', fr: 'Le médecin' },
  ]),
]

const shi12 = [
  qk('Que veut dire « Taḥanut » ?', 'Taḥanut', 'La boutique', ['La boutique', 'Le marché', 'La maison', 'L’école']),
  qk('Que veut dire « Ssuq » ?', 'Ssuq', 'Le marché', ['Le marché', 'La boutique', 'La rue', 'Le champ']),
  qk('Que veut dire « Igr » ?', 'Igr', 'Le champ', ['Le champ', 'Le jardin', 'La montagne', 'Le village']),
  culture(
    'Partout au Maroc, les gens du Souss sont réputés pour…',
    'Le commerce et l’épicerie',
    ['Le commerce et l’épicerie', 'La pêche', 'La forge', 'L’élevage des chevaux'],
  ),
]

const shi13 = [
  match([
    { kab: 'Tawuri', fr: 'Le travail' },
    { kab: 'Axddam', fr: 'Le travailleur' },
    { kab: 'Igr', fr: 'Le champ' },
  ]),
  q('Comment dit-on « La boutique » en tachelhit ?', 'La boutique', 'Taḥanut', ['Taḥanut', 'Ssuq', 'Tigmmi', 'Igr']),
  match([
    { kab: 'Afllaḥ', fr: 'Le paysan' },
    { kab: 'Aslmad', fr: 'L’enseignant' },
    { kab: 'Taḥanut', fr: 'La boutique' },
  ]),
  culture(
    '« Tawuri » et « lxdmt » veulent dire « travail ». Lequel est amazigh ?',
    'Tawuri',
    ['Tawuri', 'Lxdmt', 'Les deux', 'Aucun'],
  ),
]

// -------- Unité 4 — Au sport --------
const shi14 = [
  qk('Que veut dire « Addal » ?', 'Addal', 'Le sport', ['Le sport', 'Le jeu', 'La course', 'Le travail']),
  qk('Que veut dire « Takurt » ?', 'Takurt', 'Le ballon', ['Le ballon', 'Le pied', 'Le jeu', 'La main']),
  qk('Que veut dire « Urar » ?', 'Urar', 'Le jeu', ['Le jeu', 'Le sport', 'Le ballon', 'La course']),
  match([
    { kab: 'Addal', fr: 'Le sport' },
    { kab: 'Takurt', fr: 'Le ballon' },
    { kab: 'Urar', fr: 'Le jeu' },
  ]),
]

const shi15 = [
  qk('Que veut dire « Tazzla » ?', 'Tazzla', 'La course', ['La course', 'Le saut', 'La marche', 'Le jeu']),
  qk('Que veut dire « Azzl ! » ?', 'Azzl !', 'Cours !', ['Cours !', 'Saute !', 'Viens !', 'Arrête !']),
  culture(
    'Le kabyle dit « tazzla » pour la course. Le tachelhit dit…',
    'Tazzla aussi',
    ['Tazzla aussi', 'Tazzřa', 'Ryaḍa', 'Uraren'],
  ),
  match([
    { kab: 'Tazzla', fr: 'La course' },
    { kab: 'Azzl !', fr: 'Cours !' },
    { kab: 'Urar', fr: 'Le jeu' },
  ]),
]

const shi16 = [
  qk('Que veut dire « Aḍar » ?', 'Aḍar', 'Le pied', ['Le pied', 'La main', 'La tête', 'Le bras']),
  qk('Que veut dire « Afus » ?', 'Afus', 'La main', ['La main', 'Le pied', 'La tête', 'Le doigt']),
  qk('Que veut dire « Ixf » ?', 'Ixf', 'La tête', ['La tête', 'Le pied', 'La main', 'Le cœur']),
  match([
    { kab: 'Aḍar', fr: 'Le pied' },
    { kab: 'Afus', fr: 'La main' },
    { kab: 'Ixf', fr: 'La tête' },
  ]),
]

const shi17 = [
  match([
    { kab: 'Addal', fr: 'Le sport' },
    { kab: 'Takurt', fr: 'Le ballon' },
    { kab: 'Tazzla', fr: 'La course' },
    { kab: 'Aḍar', fr: 'Le pied' },
  ]),
  q('Comment dit-on « Le sport » en tachelhit ?', 'Le sport', 'Addal', ['Addal', 'Ryaḍa', 'Urar', 'Tazzla']),
  culture(
    '« Addal » (le sport) est un mot…',
    'Créé au XXᵉ siècle',
    ['Créé au XXᵉ siècle', 'Emprunté à l’arabe', 'Emprunté au français', 'Très ancien'],
  ),
  match([
    { kab: 'Tawuri', fr: 'Le travail' },
    { kab: 'Urar', fr: 'Le jeu' },
    { kab: 'Ixf', fr: 'La tête' },
  ]),
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
      { id: 'shi3', title: 'Merci', icon: '🙏', status: 'locked' },
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
  {
    id: 'shi-u3',
    level: 'Initiation',
    unitLabel: 'Unité 3',
    title: 'Au travail — Tawuri',
    trophy: '🛠️',
    lessons: [
      { id: 'shi10', title: 'Le travail', icon: '🛠️', status: 'locked' },
      { id: 'shi11', title: 'Les métiers', icon: '👷', status: 'locked' },
      { id: 'shi-c3', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'shi12', title: 'Boutique & champ', icon: '🛒', status: 'locked' },
      { id: 'shi13', title: 'Révision du travail', icon: '🏅', status: 'locked' },
    ],
  },
  {
    id: 'shi-u4',
    level: 'Initiation',
    unitLabel: 'Unité 4',
    title: 'Au sport — Addal',
    trophy: '🏃',
    lessons: [
      { id: 'shi14', title: 'Le sport', icon: '🏃', status: 'locked' },
      { id: 'shi15', title: 'Courir', icon: '👟', status: 'locked' },
      { id: 'shi-c4', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'shi16', title: 'Le corps qui bouge', icon: '🖐️', status: 'locked' },
      { id: 'shi17', title: 'Révision du sport', icon: '🏅', status: 'locked' },
    ],
  },
]

export const shiLessons = {
  shi1, shi2, shi3, shi4, shi5, shi6, shi7, shi8, shi9,
  shi10, shi11, shi12, shi13, shi14, shi15, shi16, shi17,
}
