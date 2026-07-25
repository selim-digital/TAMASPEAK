import { qcm, match, culture } from '../exercises.js'

/**
 * Cours d'AMAZIGHE STANDARD MAROCAIN (zgh) — la norme écrite de l'IRCAM,
 * officialisée par décision royale du 10 février 2003 (graphie tifinagh) et
 * constitutionnelle depuis 2011.
 *
 * Sa valeur n'est PAS de parler : cette koinè n'a aucun locuteur natif.
 * Elle sert à LIRE le tifinagh — panneaux, écoles, Tamazight TV — comme
 * l'arabe littéraire sert à lire, sans être une langue maternelle. Le cours
 * est donc bâti sur l'alphabet, puis sur le lexique normalisé.
 *
 * Sources primaires dépouillées :
 *   • PNM 17.1.100 (2004), norme marocaine homologuée, Annexe 1 NORMATIVE :
 *     « liste des caractères de base utilisés dans l'enseignement de
 *     l'amazighe standard au Maroc » (= ISO/IEC JTC1/SC2/WG2 N2739)
 *   • IRCAM, « Initiation à la langue amazighe » (2004), Tableau 3 :
 *     épellation officielle de chaque lettre
 *   • IRCAM, « Dictionnaire général de la langue amazighe » (CAL, 2016)
 *   • IRCAM, « La nouvelle grammaire de l'amazighe » (numéraux §3.4)
 *
 * DÉCOUVERTE QUI FONDE L'UNITÉ 2 : l'IRCAM marque ses propres créations de
 * l'abréviation « néo. » dans son dictionnaire. Or « azul » (n° 5493) et
 * « tanmmirt » (n° 11503) N'EN PORTENT PAS, tandis que « tinml » (école) et
 * « adlis » (livre) SI. C'est exactement ce qui distingue ce cours des trois
 * autres : ici azul et tanmmirt sont la bonne réponse — et l'app peut le
 * justifier au lieu de l'imposer.
 *
 * ORTHOGRAPHE : le schwa ne s'écrit PAS en norme IRCAM. C'est « tanmmirt »
 * (ⵜⴰⵏⵎⵎⵉⵔⵜ), jamais la graphie kabyle « tanemmirt ».
 *
 * ÉCARTÉ FAUTE DE SOURCE : bienvenue, s'il te plaît, au revoir, comment
 * vas-tu, ça va bien. Le dictionnaire IRCAM lexicographie les racines mais
 * pas ces formules figées ; elles ne vivent que dans les manuels scolaires,
 * non dépouillés. On ne devine pas.
 *
 * Pas d'exercice audio : la norme est phonologique, pas phonétique — un même
 * mot écrit se prononce différemment selon les régions (ⵜⴰⵎⵍⵍⴰⵍⵜ tamllalt
 * « œuf » se dit [tamdjatʃ] au Rif). Toute voix enregistrée trahirait une
 * région ; à traiter explicitement le jour où l'audio arrivera.
 */

const q = (prompt, word, answer, choices) => qcm('fr-to-kab', prompt, word, answer, choices, false)
const qk = (prompt, word, answer, choices) => qcm('kab-to-fr', prompt, word, answer, choices, false)

// -------- Unité 1 — Lire le tifinagh --------
// Progression : on n'introduit que des lettres qui composent de vrais mots.
const zgh1 = [
  qk('Quelle lettre latine correspond à ⴰ ?', 'ⴰ', 'a', ['a', 'e', 'o', 'i']),
  qk('Quelle lettre latine correspond à ⵎ ?', 'ⵎ', 'm', ['m', 'n', 'w', 'u']),
  match([
    { kab: 'ⴰ', fr: 'a' },
    { kab: 'ⵎ', fr: 'm' },
    { kab: 'ⵏ', fr: 'n' },
  ]),
  culture(
    'Le tifinagh s’écrit…',
    'De gauche à droite',
    ['De gauche à droite', 'De droite à gauche', 'De haut en bas', 'En spirale'],
  ),
]

const zgh2 = [
  qk('Quelle lettre latine correspond à ⵜ ?', 'ⵜ', 't', ['t', 'd', 'l', 'f']),
  // Premier vrai mot lisible avec les 4 lettres connues.
  qk('Lis ce mot : ⴰⵎⴰⵏ', 'ⴰⵎⴰⵏ', 'aman — l’eau', ['aman — l’eau', 'anam', 'amar', 'taman']),
  match([
    { kab: 'ⵜ', fr: 't' },
    { kab: 'ⴰ', fr: 'a' },
    { kab: 'ⵏ', fr: 'n' },
  ]),
  culture(
    'En tifinagh, les majuscules…',
    'N’existent pas',
    ['N’existent pas', 'S’écrivent en gras', 'Sont plus grandes', 'Se placent à la fin'],
  ),
]

const zgh3 = [
  qk('Quelle lettre latine correspond à ⵔ ?', 'ⵔ', 'r', ['r', 'p', 'b', 'v']),
  qk('Quelle lettre latine correspond à ⴳ ?', 'ⴳ', 'g', ['g', 'k', 'q', 'j']),
  qk('Quelle lettre latine correspond à ⵓ ?', 'ⵓ', 'u (ou)', ['u (ou)', 'o', 'y', 'w']),
  qk('Lis ce mot : ⴰⵔⴳⴰⵣ', 'ⴰⵔⴳⴰⵣ', 'argaz — l’homme', ['argaz — l’homme', 'agraz', 'arzag', 'azrag']),
]

const zgh4 = [
  // ⵣ : le yaz, emblème du drapeau amazigh — bouclage avec le logo de l'app.
  qk('Quelle lettre latine correspond à ⵣ ?', 'ⵣ', 'z', ['z', 's', 'c', 'x']),
  culture(
    'La lettre ⵣ (yaz) est aussi…',
    'Le symbole du drapeau amazigh',
    ['Le symbole du drapeau amazigh', 'Un chiffre', 'Un signe de ponctuation', 'Une lettre arabe'],
  ),
  qk('Lis ce mot : ⴰⵣⵓⵍ', 'ⴰⵣⵓⵍ', 'azul — salut', ['azul — salut', 'aluz', 'azlu', 'zalu']),
  match([
    { kab: 'ⵣ', fr: 'z' },
    { kab: 'ⵓ', fr: 'u' },
    { kab: 'ⵍ', fr: 'l' },
  ]),
]

const zgh5 = [
  // Les sons propres à l'amazighe, sans équivalent français simple.
  qk('ⵖ (yaɣ) se prononce comme…', 'ⵖ', 'Le « r » de Paris', [
    'Le « r » de Paris',
    'Le « g » de gare',
    'Le « j » de jour',
    'Le « h » aspiré',
  ]),
  qk('ⵅ (yax) se prononce comme…', 'ⵅ', 'La « jota » espagnole', [
    'La « jota » espagnole',
    'Le « x » de taxi',
    'Le « ch » de chat',
    'Le « k » de kilo',
  ]),
  qk('Quelle lettre latine correspond à ⵄ (yaɛ) ?', 'ⵄ', 'ɛ', ['ɛ', 'e', 'a', 'ɣ']),
  match([
    { kab: 'ⵖ', fr: 'ɣ' },
    { kab: 'ⵅ', fr: 'x' },
    { kab: 'ⵃ', fr: 'ḥ' },
  ]),
]

const zgh6 = [
  // Les emphatiques : cinq lettres, un trait ajouté à la lettre simple.
  culture(
    'Les lettres ⴹ ⵟ ⵚ ⵥ ⵕ sont dites…',
    'Emphatiques',
    ['Emphatiques', 'Muettes', 'Doubles', 'Étrangères'],
  ),
  qk('Quelle lettre latine correspond à ⴹ ?', 'ⴹ', 'ḍ', ['ḍ', 'd', 'ṭ', 'ḥ']),
  match([
    { kab: 'ⵟ', fr: 'ṭ' },
    { kab: 'ⵚ', fr: 'ṣ' },
    { kab: 'ⵥ', fr: 'ẓ' },
  ]),
  qk('Lis ce mot : ⵜⵉⴼⵉⵏⴰⵖ', 'ⵜⵉⴼⵉⵏⴰⵖ', 'tifinagh — l’écriture amazighe', [
    'tifinagh — l’écriture amazighe',
    'tafinagh',
    'tifinaɣt',
    'tinifagh',
  ]),
]

// -------- Unité 2 — La langue de l'école --------
const zgh7 = [
  qk('Que veut dire ⴰⵣⵓⵍ (azul) ?', 'ⴰⵣⵓⵍ', 'Salut, bonjour', ['Salut, bonjour', 'Merci', 'Oui', 'Au revoir']),
  qk('Que veut dire ⵜⴰⵏⵎⵎⵉⵔⵜ (tanmmirt) ?', 'ⵜⴰⵏⵎⵎⵉⵔⵜ', 'Merci', ['Merci', 'Bonjour', 'Bienvenue', 'Pardon']),
  culture(
    'Pourquoi « azul » est-il la bonne réponse ici, alors qu’il ne l’est pas dans les cours de kabyle, tachelhit ou tarifit ?',
    'C’est la forme officielle de l’école',
    [
      'C’est la forme officielle de l’école',
      'C’est un mot plus ancien',
      'Il n’existe qu’au Maroc',
      'Les autres cours se trompent',
    ],
  ),
  culture(
    'En amazighe standard, « merci » s’écrit…',
    'tanmmirt (sans e)',
    ['tanmmirt (sans e)', 'tanemmirt', 'tanemirt', 'tanmirte'],
  ),
]

const zgh8 = [
  qk('Que veut dire ⵢⵢⵉⵀ (yyih) ?', 'ⵢⵢⵉⵀ', 'Oui', ['Oui', 'Non', 'Merci', 'Peut-être']),
  qk('Que veut dire ⵓⵀⵓ (uhu) ?', 'ⵓⵀⵓ', 'Non', ['Non', 'Oui', 'Rien', 'Encore']),
  match([
    { kab: 'ⵢⵢⵉⵀ', fr: 'Oui' },
    { kab: 'ⵓⵀⵓ', fr: 'Non' },
    { kab: 'ⴰⵣⵓⵍ', fr: 'Salut' },
  ]),
  qk('Que veut dire ⵜⵉⴳⵎⵎⵉ (tigmmi) ?', 'ⵜⵉⴳⵎⵎⵉ', 'La maison', ['La maison', 'L’école', 'Le livre', 'La ville']),
]

const zgh9 = [
  qk('Que veut dire ⴰⵖⵔⵓⵎ (aɣrum) ?', 'ⴰⵖⵔⵓⵎ', 'Le pain', ['Le pain', 'L’eau', 'Le sel', 'Le blé']),
  qk('Que veut dire ⵜⴰⵎⵖⴰⵔⵜ (tamɣart) ?', 'ⵜⴰⵎⵖⴰⵔⵜ', 'La femme', ['La femme', 'L’homme', 'La fille', 'La mère']),
  // Les néologismes assumés : l'IRCAM les marque « néo. » dans son dictionnaire.
  culture(
    'ⴰⴷⵍⵉⵙ (adlis, « livre ») et ⵜⵉⵏⵎⵍ (tinml, « école ») sont…',
    'Des mots créés pour l’école',
    ['Des mots créés pour l’école', 'Des mots très anciens', 'Des emprunts à l’arabe', 'Des mots kabyles'],
  ),
  match([
    { kab: 'ⴰⵎⴰⵏ', fr: 'L’eau' },
    { kab: 'ⴰⵖⵔⵓⵎ', fr: 'Le pain' },
    { kab: 'ⵜⵉⴳⵎⵎⵉ', fr: 'La maison' },
  ]),
]

const zgh10 = [
  qk('Que veut dire ⵢⴰⵏ (yan) ?', 'ⵢⴰⵏ', 'Un', ['Un', 'Deux', 'Trois', 'Dix']),
  q('Comment dit-on « trois » en amazighe standard ?', 'Trois', 'kraḍ', ['kraḍ', 'sin', 'kkuẓ', 'smmus']),
  match([
    { kab: 'ⵢⴰⵏ', fr: 'Un' },
    { kab: 'ⵙⵉⵏ', fr: 'Deux' },
    { kab: 'ⴽⵔⴰⴹ', fr: 'Trois' },
  ]),
  culture(
    'Au féminin, « un » (yan) devient…',
    'yat',
    ['yat', 'yana', 'tyan', 'yant'],
  ),
]

const zgh11 = [
  culture(
    'L’amazighe standard a été construit à partir…',
    'Du tarifit, du tamazight et du tachelhit',
    [
      'Du tarifit, du tamazight et du tachelhit',
      'Du kabyle seulement',
      'De l’arabe classique',
      'Du touareg ancien',
    ],
  ),
  culture(
    'Combien de personnes le parlent comme langue maternelle ?',
    'Aucune',
    ['Aucune', 'Un million', 'Tous les Marocains', 'La moitié du Maroc'],
  ),
  culture(
    'Depuis quelle année le tifinagh est-il la graphie officielle au Maroc ?',
    '2003',
    ['2003', '1990', '2011', '2020'],
  ),
  culture(
    'À quoi sert surtout de savoir lire le tifinagh ?',
    'Lire les panneaux et l’école',
    ['Lire les panneaux et l’école', 'Parler au marché', 'Écrire des SMS', 'Voyager en Algérie'],
  ),
]

export const zghUnits = [
  {
    id: 'zgh-u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Lire le tifinagh — ⵜⵉⴼⵉⵏⴰⵖ',
    trophy: 'ⵣ',
    lessons: [
      { id: 'zgh1', title: 'Premières lettres', icon: 'ⴰ', status: 'current' },
      { id: 'zgh2', title: 'Premier mot', icon: 'ⵎ', status: 'locked' },
      { id: 'zgh3', title: 'Lire une syllabe', icon: 'ⵔ', status: 'locked' },
      { id: 'zgh-c1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'zgh4', title: 'Le yaz ⵣ', icon: 'ⵣ', status: 'locked' },
      { id: 'zgh5', title: 'Les sons amazighs', icon: 'ⵖ', status: 'locked' },
      { id: 'zgh6', title: 'Les emphatiques', icon: 'ⴹ', status: 'locked' },
    ],
  },
  {
    id: 'zgh-u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'La langue de l’école',
    trophy: '📗',
    lessons: [
      { id: 'zgh7', title: 'Azul & tanmmirt', icon: '👋', status: 'locked' },
      { id: 'zgh8', title: 'Oui, non, la maison', icon: '✅', status: 'locked' },
      { id: 'zgh-c2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'zgh9', title: 'Les mots du jour', icon: '🍞', status: 'locked' },
      { id: 'zgh10', title: 'Compter', icon: '🔢', status: 'locked' },
      { id: 'zgh11', title: 'Ce qu’est le standard', icon: '📜', status: 'locked' },
    ],
  },
]

export const zghLessons = { zgh1, zgh2, zgh3, zgh4, zgh5, zgh6, zgh7, zgh8, zgh9, zgh10, zgh11 }
