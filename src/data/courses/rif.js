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
  // Ces deux questions montraient la réponse sur la carte : en kab→fr, c'est
  // le mot amazigh qui s'affiche, et il figurait aussi dans les choix. On
  // demande donc le SENS, et la règle l → ř reste portée par les questions de
  // culture qui encadrent — c'est leur travail.
  qk('Que veut dire « Uř » ?', 'Uř', 'Le cœur', ['Le cœur', 'La tête', 'La main', 'Le sang']),
  qk('Que veut dire « Aryaz » ?', 'Aryaz', 'L’homme', ['L’homme', 'La femme', 'Le garçon', 'Le frère']),
  culture(
    'Le kabyle dit « argaz », le tarifit « aryaz ». Qu’est-ce qui change ?',
    'Le g devient y',
    ['Le g devient y', 'Le r devient ř', 'Le a devient i', 'Rien du tout'],
  ),
  culture(
    'Comment dit-on « ma sœur » en tarifit (kabyle : weltma) ?',
    'Učma',
    ['Učma', 'Weltma', 'Ultma', 'Tacma'],
  ),
]

// -------- Unité 3 — Au travail --------
// Le Rif est la région amazighe qui emprunte le plus : à l'arabe pour le
// travail, à l'espagnol pour tout ce qui est venu du protectorat de Melilla
// et de Nador (Kossmann, « Loanwords in Tarifiyt »). Le cours l'enseigne
// tel quel, en nommant chaque emprunt — c'est la vérité du terrain, et
// c'est aussi ce que l'apprenant entendra là-bas.
const rif10 = [
  qk('Que veut dire « Lxedmet » ?', 'Lxedmet', 'Le travail', ['Le travail', 'Le marché', 'La maison', 'Le chemin']),
  qk('Que veut dire « Axeddam » ?', 'Axeddam', 'Le travailleur', [
    'Le travailleur',
    'Le travail',
    'Le voisin',
    'Le patron',
  ]),
  q('Comment dit-on « Le travail » en tarifit ?', 'Le travail', 'Lxedmet', ['Lxedmet', 'Tawuri', 'Ssuq', 'Uraren']),
  culture(
    'Le mot amazigh pour « travail », vivant au Souss et dans l’Atlas, est…',
    'Tawuri',
    ['Tawuri', 'Lxedmet', 'Ssuq', 'Ryaḍa'],
  ),
]

const rif11 = [
  qk('Que veut dire « Afellaḥ » ?', 'Afellaḥ', 'Le paysan', ['Le paysan', 'Le médecin', 'Le berger', 'Le maçon']),
  qk('Que veut dire « Ṭṭbib » ?', 'Ṭṭbib', 'Le médecin', ['Le médecin', 'Le paysan', 'Le maître', 'Le marchand']),
  qk('Que veut dire « Lmɛellem » ?', 'Lmɛellem', 'Le patron, le maître artisan', [
    'Le patron, le maître artisan',
    'L’apprenti',
    'Le voisin',
    'Le vieil homme',
  ]),
  culture(
    'Ces trois noms de métiers viennent…',
    'De l’arabe',
    ['De l’arabe', 'De l’espagnol', 'Du berbère ancien', 'Du français'],
  ),
]

const rif12 = [
  qk('Que veut dire « Ssuq » ?', 'Ssuq', 'Le marché', ['Le marché', 'La boutique', 'Le champ', 'La rue']),
  qk('Que veut dire « Taḥanut » ?', 'Taḥanut', 'La boutique', ['La boutique', 'Le marché', 'La maison', 'La porte']),
  qk('Que veut dire « Iger » ?', 'Iger', 'Le champ', ['Le champ', 'Le jardin', 'La montagne', 'Le village']),
  culture(
    'Le tarifit emprunte aussi à l’espagnol. Lequel de ces mots en vient ?',
    'Simana (la semaine)',
    ['Simana (la semaine)', 'Lxedmet (le travail)', 'Iger (le champ)', 'Afellaḥ (le paysan)'],
  ),
]

const rif13 = [
  match([
    { kab: 'Lxedmet', fr: 'Le travail' },
    { kab: 'Axeddam', fr: 'Le travailleur' },
    { kab: 'Ssuq', fr: 'Le marché' },
  ]),
  q('Comment dit-on « Le champ » en tarifit ?', 'Le champ', 'Iger', ['Iger', 'Taḥanut', 'Ssuq', 'Lxedmet']),
  match([
    { kab: 'Afellaḥ', fr: 'Le paysan' },
    { kab: 'Ṭṭbib', fr: 'Le médecin' },
    { kab: 'Taḥanut', fr: 'La boutique' },
  ]),
  culture(
    'Dans le Rif, les mots du travail moderne sont surtout…',
    'Empruntés à l’arabe',
    ['Empruntés à l’arabe', 'Empruntés au français', 'Tous amazighs', 'Empruntés au turc'],
  ),
]

// -------- Unité 4 — Au sport --------
const rif14 = [
  qk('Que veut dire « Ryaḍa » ?', 'Ryaḍa', 'Le sport', ['Le sport', 'Le jeu', 'La course', 'La fête']),
  qk('Que veut dire « Lkuṛa » ?', 'Lkuṛa', 'Le ballon', ['Le ballon', 'Le pied', 'Le jeu', 'La main']),
  qk('Que veut dire « Uraren » ?', 'Uraren', 'Les jeux', ['Les jeux', 'Les enfants', 'Les mains', 'Les jours']),
  culture(
    'Au Rif, « le sport » se dit tous les jours…',
    'Ryaḍa',
    ['Ryaḍa', 'Addal', 'Uraren', 'Lkuṛa'],
  ),
]

const rif15 = [
  qk('Que veut dire « Tazzřa » ?', 'Tazzřa', 'La course', ['La course', 'Le saut', 'La marche', 'Le jeu']),
  qk('Que veut dire « Azzeř ! » ?', 'Azzeř !', 'Cours !', ['Cours !', 'Saute !', 'Viens !', 'Assieds-toi !']),
  culture(
    'Pourquoi dit-on « tazzřa » et non « tazzla » ?',
    'Le tarifit change le « l » en « ř »',
    [
      'Le tarifit change le « l » en « ř »',
      'C’est un emprunt à l’espagnol',
      'C’est le pluriel',
      'C’est le féminin',
    ],
  ),
  match([
    { kab: 'Tazzřa', fr: 'La course' },
    { kab: 'Azzeř !', fr: 'Cours !' },
    { kab: 'Uraren', fr: 'Les jeux' },
  ]),
]

const rif16 = [
  qk('Que veut dire « Takurt » ?', 'Takurt', 'Le ballon (mot amazigh)', [
    'Le ballon (mot amazigh)',
    'La course',
    'Le jeu',
    'Le pied',
  ]),
  qk('Que veut dire « Addal » ?', 'Addal', 'Le sport (mot amazigh)', [
    'Le sport (mot amazigh)',
    'Le jeu',
    'Le ballon',
    'Le travail',
  ]),
  culture(
    '« Lkuṛa » et « takurt » désignent le ballon. Lequel est amazigh ?',
    'Takurt',
    ['Takurt', 'Lkuṛa', 'Les deux', 'Aucun'],
  ),
  match([
    { kab: 'Addal', fr: 'Le sport' },
    { kab: 'Takurt', fr: 'Le ballon' },
    { kab: 'Ryaḍa', fr: 'Le sport (arabe)' },
  ]),
]

const rif17 = [
  match([
    { kab: 'Ryaḍa', fr: 'Le sport' },
    { kab: 'Lkuṛa', fr: 'Le ballon' },
    { kab: 'Tazzřa', fr: 'La course' },
    { kab: 'Uraren', fr: 'Les jeux' },
  ]),
  q('Comment dit-on « Cours ! » en tarifit ?', 'Cours !', 'Azzeř !', ['Azzeř !', 'Azzel !', 'Tazzřa', 'Uraren']),
  culture(
    'Ce que le Rif dit du sport et du travail, en un mot…',
    'Les mots d’usage sont empruntés, les mots amazighs existent aussi',
    [
      'Les mots d’usage sont empruntés, les mots amazighs existent aussi',
      'Tout est amazigh',
      'Tout est arabe',
      'Aucun mot n’existe',
    ],
  ),
  match([
    { kab: 'Lxedmet', fr: 'Le travail' },
    { kab: 'Addal', fr: 'Le sport' },
    { kab: 'Iger', fr: 'Le champ' },
  ]),
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
      { id: 'rif3', title: 'Merci', icon: '🙏', status: 'locked' },
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
  {
    id: 'rif-u3',
    level: 'Initiation',
    unitLabel: 'Unité 3',
    title: 'Au travail — Lxedmet',
    trophy: '🛠️',
    lessons: [
      { id: 'rif10', title: 'Le travail', icon: '🛠️', status: 'locked' },
      { id: 'rif11', title: 'Les métiers', icon: '👷', status: 'locked' },
      { id: 'rif-c3', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'rif12', title: 'Marché & champ', icon: '🛒', status: 'locked' },
      { id: 'rif13', title: 'Révision du travail', icon: '🏅', status: 'locked' },
    ],
  },
  {
    id: 'rif-u4',
    level: 'Initiation',
    unitLabel: 'Unité 4',
    title: 'Au sport — Ryaḍa',
    trophy: '🏃',
    lessons: [
      { id: 'rif14', title: 'Le sport', icon: '🏃', status: 'locked' },
      { id: 'rif15', title: 'Courir', icon: '👟', status: 'locked' },
      { id: 'rif-c4', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'rif16', title: 'Lkuṛa ou takurt ?', icon: '⚖️', status: 'locked' },
      { id: 'rif17', title: 'Révision du sport', icon: '🏅', status: 'locked' },
    ],
  },
]

export const rifLessons = {
  rif1, rif2, rif3, rif4, rif5, rif6, rif7, rif8, rif9,
  rif10, rif11, rif12, rif13, rif14, rif15, rif16, rif17,
}
