/**
 * Cours de KABYLE (taqbaylit) — contenu PROVISOIRE, à valider par un
 * locuteur natif. Orthographe latine usuelle.
 *
 * Les fabriques d'exercices sont partagées par tous les cours de langue :
 * voir data/exercises.js.
 */
import { qcm, listen, match, image, culture, sentence } from './exercises.js'

// -------- Unité 1 — Salutations --------
//
// Cette unité a été RÉORDONNÉE (palier 1) sur trois principes :
//
//   1. Une PHRASE dès la leçon 1. « Azul fell-ak », « Aql-i labas »,
//      « Ansuf yes-k » existaient déjà dans ce cours — mais en leçon 17, soit
//      trois quarts d'heure de jeu plus loin. Aucun mot n'est inventé ici :
//      les énoncés sont remontés là où ils servent.
//   2. Des énoncés SITUATIONNELS plutôt que métalinguistiques. « On te dit X,
//      que réponds-tu ? » au lieu de « Que signifie X ? ». Le patron vient du
//      cours de tarifit (courses/rif.js), où il avait été inventé — il
//      manquait au kabyle, qui est pourtant le cours vaisseau.
//   3. Un LOCUTEUR sur les énoncés, jamais sur le vocabulaire isolé. Yemma
//      accueille et salue, Aqcic demande, Baba explique, Taqcict énumère,
//      Setti porte les mots anciens. Toujours les mêmes : c'est la constance
//      qui les rend reconnaissables.
const l1 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Azul', 'Bonjour', ['Bonjour', 'Merci', 'Au revoir', 'Bienvenue']),
  // La première phrase de tout le cours, dès le deuxième exercice — en `qcm`
  // et non en `sentence` : `sentence` cache le texte tant qu'on n'a pas
  // répondu, ce qui est trop rude au deuxième écran d'une vie d'apprenant. Ici
  // la phrase se voit ET s'entend. Elle reviendra en écoute seule plus tard.
  //
  // LE GENRE DU DESTINATAIRE — signalé par Selim, et c'est la première vraie
  // leçon de grammaire amazighe qu'on puisse faire produire : on ne salue pas
  // un homme et une femme avec les mêmes mots. `fell-ak` s'adresse à un
  // homme, `fell-am` à une femme. Le français n'a pas cela.
  //
  // La version précédente disait « Yemma te salue, que réponds-tu ? →
  // Azul fell-ak » : on répondait à une FEMME au masculin. Faux. Et le piège
  // était structurel — tant que le destinataire est « toi », l'app ignore le
  // genre de l'élève et aucune des deux formes n'est justifiable.
  //
  // D'où le choix de mise en scène : c'est TOUJOURS Yemma qui parle, et ce
  // qui change est la personne qu'elle salue. Aqcic puis Taqcict — deux
  // destinataires dont le genre est connu, un seul locuteur, et le contraste
  // saute aux yeux.
  qcm(
    'kab-to-fr',
    'Yemma salue Aqcic, le garçon. Que dit-elle ?',
    'Azul fell-ak',
    'Bonjour à toi (à un homme)',
    ['Bonjour à toi (à un homme)', 'Merci beaucoup', 'À demain', 'Comment vas-tu ?'],
    true,
    'yemma',
  ),
  qcm(
    'fr-to-kab',
    'Maintenant Yemma salue Taqcict, la fille. Que dit-elle ?',
    'Bonjour à toi (à une femme)',
    'Azul fell-am',
    ['Azul fell-am', 'Azul fell-ak', 'Ansuf', 'Tanemmirt'],
    false,
    'yemma',
  ),
  qcm('kab-to-fr', 'Que signifie ?', 'Ansuf', 'Bienvenue', ['Bienvenue', 'Merci', 'Oui', 'Bonjour']),
]
const l2 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanemmirt', 'Merci', ['Merci', 'Bonjour', 'Non', 'Bienvenue']),
  qcm(
    'fr-to-kab',
    'Setti te tend un verre de thé. Que dis-tu ?',
    'Merci',
    'Tanemmirt',
    ['Tanemmirt', 'Azul', 'Ala', 'Labas'],
    false,
    'setti',
  ),
  listen('Ih', 'Oui', ['Oui', 'Non', 'Merci', 'Bonjour']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ala', 'Non', ['Bonjour', 'Non', 'Oui', 'Au revoir']),
]
const l3 = [
  qcm(
    'fr-to-kab',
    'Aqcic te demande si tu viens. Tu es d’accord — que dis-tu ?',
    'Oui',
    'Ih',
    ['Ih', 'Ala', 'Azul', 'Ar tufat'],
    false,
    'aqcic',
  ),
  qcm('fr-to-kab', 'Comment dit-on « Non » ?', 'Non', 'Ala', ['Ansuf', 'Ala', 'Ih', 'Tanemmirt']),
  listen('Labas ?', 'Ça va ?', ['Ça va ?', 'Merci', 'À demain', 'Bienvenue'], 'aqcic'),
  match([
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
]
const l4 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Labas', 'Ça va (bien)', ['Ça va (bien)', 'Non', 'Bienvenue', 'À demain']),
  // Une vraie paire de dialogue : on te demande, tu réponds par une phrase.
  qcm(
    'fr-to-kab',
    'Baba te demande « Labas ? ». Que réponds-tu ?',
    'Je vais bien',
    'Aql-i labas',
    ['Aql-i labas', 'Ar tufat', 'Ansuf yes-k', 'Ala'],
    false,
    'baba',
  ),
  sentence('Aql-i labas', 'Je vais bien', ['Je vais bien', 'Au revoir', 'Merci beaucoup', 'Bonjour'], 'baba'),
  qcm('fr-to-kab', 'Comment dit-on « Bienvenue » ?', 'Bienvenue', 'Ansuf', ['Ansuf', 'Ih', 'Ar tufat', 'Labas']),
]
const l5 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ar tufat', 'À demain', ['À demain', 'Bonjour', 'Merci', 'Oui']),
  // La même paire qu'en l1, sur un autre support : les suffixes de 2ᵉ
  // personne du kabyle sont -k au masculin, -m au féminin, et ils se posent
  // sur la préposition comme sur « fell- ». D'où fell-ak / fell-am en l1, et
  // yes-k / yes-m ici. C'est un seul fait de grammaire, revu deux fois dans
  // deux formules d'accueil : c'est ainsi qu'un paradigme s'installe.
  //
  // On NOMME toujours qui est accueilli. Tant que le destinataire est
  // « toi », l'app ignore le genre de l'élève et aucune des deux formes
  // n'est justifiable — c'est le défaut que Selim a relevé en l1.
  sentence('Ansuf yes-k', 'Bienvenue à toi (à un homme)', ['Bienvenue à toi (à un homme)', 'Bonjour', 'Merci beaucoup', 'À demain'], 'yemma'),
  qcm(
    'fr-to-kab',
    'Jeddi arrive chez toi. Tu l’accueilles — que dis-tu ?',
    'Bienvenue à toi (à un homme)',
    'Ansuf yes-k',
    ['Ansuf yes-k', 'Ar tufat', 'Aql-i labas', 'Ala'],
    false,
    'jeddi',
  ),
  qcm(
    'fr-to-kab',
    'Et quand c’est Setti qui arrive ?',
    'Bienvenue à toi (à une femme)',
    'Ansuf yes-m',
    ['Ansuf yes-m', 'Ansuf yes-k', 'Azul fell-ak', 'Ar tufat'],
    false,
    'setti',
  ),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Ansuf', fr: 'Bienvenue' },
  ]),
  qcm('fr-to-kab', 'Tu t’en vas, et tu reviendras demain. Que dis-tu ?', 'À demain', 'Ar tufat', ['Ar tufat', 'Azul', 'Ansuf', 'Ih'], false, 'jeddi'),
]

// -------- Unité 2 — Réponses & politesse (révision + associations) --------
const l6 = [
  listen('Ih', 'Oui', ['Oui', 'Non', 'Merci', 'Au revoir']),
  listen('Ala', 'Non', ['Non', 'Oui', 'Bonjour', 'Bienvenue']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Labas', fr: 'Ça va' },
  ]),
  qcm('fr-to-kab', 'Comment dit-on « Oui » ?', 'Oui', 'Ih', ['Ih', 'Ala', 'Ansuf', 'Azul']),
]
const l7 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanemmirt', 'Merci', ['Merci', 'Oui', 'À demain', 'Bonjour']),
  listen('Tanemmirt', 'Merci', ['Merci', 'Bienvenue', 'Non', 'Bonjour']),
  qcm('fr-to-kab', 'Comment dit-on « Merci » ?', 'Merci', 'Tanemmirt', ['Tanemmirt', 'Azul', 'Labas', 'Ih']),
  match([
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
]
const l8 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ansuf', 'Bienvenue', ['Bienvenue', 'Merci', 'Non', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Bienvenue » ?', 'Bienvenue', 'Ansuf', ['Ansuf', 'Azul', 'Ih', 'Labas']),
  listen('Azul', 'Bonjour', ['Bonjour', 'Merci', 'Oui', 'Bienvenue']),
  qcm('fr-to-kab', 'Comment dit-on « Bonjour » ?', 'Bonjour', 'Azul', ['Azul', 'Ansuf', 'Ala', 'Ar tufat']),
]
const l9 = [
  match([
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Ansuf', fr: 'Bienvenue' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
  qcm('kab-to-fr', 'Que signifie ?', 'Labas ?', 'Ça va ?', ['Ça va ?', 'Merci', 'Oui', 'Bonjour']),
  listen('Ala', 'Non', ['Non', 'Oui', 'Merci', 'À demain']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Labas', fr: 'Ça va' },
    { kab: 'Tanemmirt', fr: 'Merci' },
  ]),
]

// -------- Unité 3 — À la maison (vocabulaire du quotidien + images) --------
const l10 = [
  image('house', 'Axxam', ['Axxam', 'Tawwurt', 'Aman', 'Adlis']),
  qcm('kab-to-fr', 'Que signifie ?', 'Axxam', 'Maison', ['Maison', 'Porte', 'Eau', 'Livre']),
  image('door', 'Tawwurt', ['Tawwurt', 'Axxam', 'Amcic', 'Atay']),
  qcm('fr-to-kab', 'Comment dit-on « Porte » ?', 'Porte', 'Tawwurt', ['Tawwurt', 'Axxam', 'Aman', 'Taddart']),
]
const l11 = [
  image('water', 'Aman', ['Aman', 'Aɣrum', 'Atay', 'Axxam']),
  image('bread', 'Aɣrum', ['Aɣrum', 'Aman', 'Amcic', 'Tawwurt']),
  listen('Aman', 'Eau', ['Eau', 'Pain', 'Thé', 'Maison']),
  match([
    { kab: 'Aman', fr: 'Eau' },
    { kab: 'Aɣrum', fr: 'Pain' },
    { kab: 'Atay', fr: 'Thé' },
  ]),
]
const l12 = [
  image('tea', 'Atay', ['Atay', 'Aman', 'Adlis', 'Taddart']),
  qcm('kab-to-fr', 'Que signifie ?', 'Atay', 'Thé', ['Thé', 'Eau', 'Pain', 'Porte']),
  sentence('Tanemmirt aṭas', 'Merci beaucoup', ['Merci beaucoup', 'Bonjour à toi', 'À demain', 'Bienvenue']),
  match([
    { kab: 'Atay', fr: 'Thé' },
    { kab: 'Axxam', fr: 'Maison' },
    { kab: 'Tawwurt', fr: 'Porte' },
  ]),
]
const l13 = [
  image('cat', 'Amcic', ['Amcic', 'Adlis', 'Tawwurt', 'Aman']),
  image('village', 'Taddart', ['Taddart', 'Axxam', 'Atay', 'Aɣrum']),
  image('book', 'Adlis', ['Adlis', 'Amcic', 'Tawwurt', 'Aman']),
  qcm('kab-to-fr', 'Que signifie ?', 'Taddart', 'Village', ['Village', 'Maison', 'Chat', 'Livre']),
  qcm('kab-to-fr', 'Que signifie ?', 'Adlis', 'Livre', ['Livre', 'Chat', 'Village', 'Eau']),
]

// -------- Unité 4 — La famille & les phrases --------
const l14 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Baba', 'Père', ['Père', 'Mère', 'Frère', 'Sœur']),
  qcm('kab-to-fr', 'Que signifie ?', 'Yemma', 'Mère', ['Mère', 'Père', 'Sœur', 'Maison']),
  match([
    { kab: 'Baba', fr: 'Père' },
    { kab: 'Yemma', fr: 'Mère' },
    { kab: 'Gma', fr: 'Frère' },
  ]),
  listen('Yemma', 'Mère', ['Mère', 'Père', 'Frère', 'Eau']),
]
const l15 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Gma', 'Frère', ['Frère', 'Sœur', 'Père', 'Chat']),
  qcm('fr-to-kab', 'Comment dit-on « Sœur » ?', 'Sœur', 'Weltma', ['Weltma', 'Gma', 'Yemma', 'Baba']),
  match([
    { kab: 'Gma', fr: 'Frère' },
    { kab: 'Weltma', fr: 'Sœur' },
    { kab: 'Baba', fr: 'Père' },
  ]),
  listen('Gma', 'Frère', ['Frère', 'Sœur', 'Mère', 'Village']),
]
const l16 = [
  sentence('Azul, amek telliḍ ?', 'Bonjour, comment vas-tu ?', ['Bonjour, comment vas-tu ?', 'Merci beaucoup', 'Bienvenue à toi', 'À demain']),
  sentence('Aql-i labas', 'Je vais bien', ['Je vais bien', 'Au revoir', 'Merci beaucoup', 'Bonjour']),
  // Glose alignée sur l5 : « Bienvenue à toi » tout court laisserait croire
  // que la formule est neutre, alors qu'elle porte le masculin.
  sentence('Ansuf yes-k', 'Bienvenue à toi (à un homme)', ['Bienvenue à toi (à un homme)', 'Bonjour', 'Merci beaucoup', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Merci beaucoup » ?', 'Merci beaucoup', 'Tanemmirt aṭas', ['Tanemmirt aṭas', 'Azul fell-ak', 'Ar tufat', 'Ansuf yes-k']),
]
const l17 = [
  image('tea', 'Atay', ['Atay', 'Aman', 'Aɣrum', 'Axxam']),
  match([
    { kab: 'Axxam', fr: 'Maison' },
    { kab: 'Baba', fr: 'Père' },
    { kab: 'Aman', fr: 'Eau' },
    { kab: 'Amcic', fr: 'Chat' },
  ]),
  sentence('Tanemmirt aṭas', 'Merci beaucoup', ['Merci beaucoup', 'Bonjour', 'Oui', 'Village']),
  image('house', 'Axxam', ['Axxam', 'Taddart', 'Tawwurt', 'Adlis']),
]

// -------- Unité 5 — Les nombres --------
//
// NOTE D'USAGE, demandée par Selim, et c'est la même honnêteté que celle des
// autres cours : la série berbère (yiwen, sin, kraḍ, kkuẓ, semmus) s'enseigne,
// mais le kabyle COURANT compte en arabe au-delà de deux ou trois. Le cours de
// tarifit le disait déjà de sa propre langue (courses/rif.js) et le tachelhit
// signale l'inverse — sa série tient mieux. Le kabyle ne disait rien, ce qui
// laissait croire que la série scolaire est ce qu'on entend au marché.
//
// On enseigne donc la série ET son usage réel. Ne pas transformer cela en
// leçon de morale sur l'emprunt : une langue qui emprunte est une langue
// vivante, et c'est aussi ce que dit l'app ailleurs.
const l18 = [
  image('count-1', 'Yiwen', ['Yiwen', 'Sin', 'Kraḍ', 'Kkuẓ']),
  image('count-2', 'Sin', ['Sin', 'Yiwen', 'Semmus', 'Kraḍ']),
  image('count-3', 'Kraḍ', ['Kraḍ', 'Sin', 'Kkuẓ', 'Yiwen']),
  qcm('kab-to-fr', 'Que signifie ?', 'Sin', 'Deux', ['Deux', 'Un', 'Trois', 'Cinq']),
]
const l19 = [
  image('count-4', 'Kkuẓ', ['Kkuẓ', 'Semmus', 'Kraḍ', 'Sin']),
  image('count-5', 'Semmus', ['Semmus', 'Kkuẓ', 'Yiwen', 'Sin']),
  qcm('kab-to-fr', 'Que signifie ?', 'Semmus', 'Cinq', ['Cinq', 'Quatre', 'Deux', 'Trois']),
  listen('Kkuẓ', 'Quatre', ['Quatre', 'Cinq', 'Un', 'Trois']),
]
const l20 = [
  match([
    { kab: 'Yiwen', fr: 'Un' },
    { kab: 'Sin', fr: 'Deux' },
    { kab: 'Kraḍ', fr: 'Trois' },
  ]),
  qcm('fr-to-kab', 'Comment dit-on « Trois » ?', 'Trois', 'Kraḍ', ['Kraḍ', 'Sin', 'Kkuẓ', 'Semmus']),
  match([
    { kab: 'Kkuẓ', fr: 'Quatre' },
    { kab: 'Semmus', fr: 'Cinq' },
    { kab: 'Yiwen', fr: 'Un' },
  ]),
  image('count-3', 'Kraḍ', ['Kraḍ', 'Semmus', 'Sin', 'Kkuẓ']),
  // La note d'usage, dite à l'élève et pas seulement au relecteur du code.
  culture(
    'Au marché, en Kabylie, on compte le plus souvent…',
    'En arabe au-delà de deux ou trois',
    [
      'En arabe au-delà de deux ou trois',
      'Toujours en kabyle',
      'Toujours en français',
      'On ne compte pas à voix haute',
    ],
  ),
]

// -------- Unité 6 — Les couleurs --------
const l21 = [
  image('color-red', 'Azeggaɣ', ['Azeggaɣ', 'Azegzaw', 'Awraɣ', 'Aberkan']),
  image('color-green', 'Azegzaw', ['Azegzaw', 'Azeggaɣ', 'Amellal', 'Awraɣ']),
  qcm('kab-to-fr', 'Que signifie ?', 'Azeggaɣ', 'Rouge', ['Rouge', 'Vert', 'Jaune', 'Noir']),
  listen('Azegzaw', 'Vert', ['Vert', 'Rouge', 'Blanc', 'Jaune']),
]
const l22 = [
  image('color-yellow', 'Awraɣ', ['Awraɣ', 'Aberkan', 'Amellal', 'Azeggaɣ']),
  image('color-black', 'Aberkan', ['Aberkan', 'Amellal', 'Awraɣ', 'Azegzaw']),
  image('color-white', 'Amellal', ['Amellal', 'Aberkan', 'Azeggaɣ', 'Awraɣ']),
  qcm('kab-to-fr', 'Que signifie ?', 'Amellal', 'Blanc', ['Blanc', 'Noir', 'Jaune', 'Vert']),
]
const l23 = [
  match([
    { kab: 'Azeggaɣ', fr: 'Rouge' },
    { kab: 'Azegzaw', fr: 'Vert' },
    { kab: 'Awraɣ', fr: 'Jaune' },
  ]),
  qcm('fr-to-kab', 'Comment dit-on « Noir » ?', 'Noir', 'Aberkan', ['Aberkan', 'Amellal', 'Awraɣ', 'Azegzaw']),
  match([
    { kab: 'Aberkan', fr: 'Noir' },
    { kab: 'Amellal', fr: 'Blanc' },
    { kab: 'Azeggaɣ', fr: 'Rouge' },
  ]),
  image('color-green', 'Azegzaw', ['Azegzaw', 'Aberkan', 'Amellal', 'Azeggaɣ']),
]

// -------- Unité 7 — Au marché --------
const l24 = [
  image('souk', 'Ssuq', ['Ssuq', 'Axxam', 'Taddart', 'Tawwurt']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ssuq', 'Marché', ['Marché', 'Maison', 'Village', 'Porte']),
  listen('Ssuq', 'Marché', ['Marché', 'Village', 'Eau', 'Pain']),
  qcm('fr-to-kab', 'Comment dit-on « Marché » ?', 'Marché', 'Ssuq', ['Ssuq', 'Taddart', 'Axxam', 'Adlis']),
]
const l25 = [
  image('honey', 'Tament', ['Tament', 'Aẓemmur', 'Aman', 'Atay']),
  image('olives', 'Aẓemmur', ['Aẓemmur', 'Tament', 'Aɣrum', 'Ssuq']),
  qcm('kab-to-fr', 'Que signifie ?', 'Tament', 'Miel', ['Miel', 'Olives', 'Pain', 'Thé']),
  match([
    { kab: 'Tament', fr: 'Miel' },
    { kab: 'Aẓemmur', fr: 'Olives' },
    { kab: 'Ssuq', fr: 'Marché' },
  ]),
]
const l26 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Idrimen', 'Argent', ['Argent', 'Miel', 'Marché', 'Olives']),
  listen('Idrimen', 'Argent', ['Argent', 'Olives', 'Marché', 'Pain']),
  match([
    { kab: 'Idrimen', fr: 'Argent' },
    { kab: 'Ssuq', fr: 'Marché' },
    { kab: 'Tament', fr: 'Miel' },
  ]),
  image('souk', 'Ssuq', ['Ssuq', 'Idrimen', 'Tament', 'Aẓemmur']),
]

// -------- Unité 8 — La météo --------
const l27 = [
  image('sun', 'Tafukt', ['Tafukt', 'Ageffur', 'Adfel', 'Aḍu']),
  image('rain', 'Ageffur', ['Ageffur', 'Tafukt', 'Asigna', 'Adfel']),
  qcm('kab-to-fr', 'Que signifie ?', 'Tafukt', 'Soleil', ['Soleil', 'Pluie', 'Neige', 'Vent']),
  listen('Ageffur', 'Pluie', ['Pluie', 'Soleil', 'Nuage', 'Vent']),
]
const l28 = [
  image('snow', 'Adfel', ['Adfel', 'Aḍu', 'Asigna', 'Tafukt']),
  image('wind', 'Aḍu', ['Aḍu', 'Adfel', 'Ageffur', 'Tafukt']),
  image('cloud', 'Asigna', ['Asigna', 'Adfel', 'Aḍu', 'Tafukt']),
  qcm('kab-to-fr', 'Que signifie ?', 'Adfel', 'Neige', ['Neige', 'Vent', 'Nuage', 'Soleil']),
]
const l29 = [
  match([
    { kab: 'Tafukt', fr: 'Soleil' },
    { kab: 'Ageffur', fr: 'Pluie' },
    { kab: 'Adfel', fr: 'Neige' },
  ]),
  qcm('fr-to-kab', 'Comment dit-on « Vent » ?', 'Vent', 'Aḍu', ['Aḍu', 'Adfel', 'Asigna', 'Ageffur']),
  match([
    { kab: 'Aḍu', fr: 'Vent' },
    { kab: 'Asigna', fr: 'Nuage' },
    { kab: 'Tafukt', fr: 'Soleil' },
  ]),
  image('sun', 'Tafukt', ['Tafukt', 'Asigna', 'Aḍu', 'Ageffur']),
]

// -------- Unité 9 — Peuples & territoires (culture) --------
const l30 = [
  culture('Que signifie « Amazigh » ?', 'Homme libre', ['Homme libre', 'Montagnard', 'Voyageur', 'Berger']),
  culture('Comment appelle-t-on la langue berbère ?', 'Tamazight', ['Tamazight', 'Tifinagh', 'Tamazgha', 'Yennayer']),
  culture('« Imazighen » est le pluriel de…', 'Amazigh', ['Amazigh', 'Tamazight', 'Tifinagh', 'Taddart']),
  culture('Comment dit-on « le kabyle » (la langue) ?', 'Taqbaylit', ['Taqbaylit', 'Tarifit', 'Tacelḥit', 'Tamazgha']),
]
const l31 = [
  culture('Où se trouve la Kabylie ?', 'En Algérie', ['En Algérie', 'Au Maroc', 'En Libye', 'En Tunisie'], 'village'),
  culture('Le Rif est une région…', 'du Maroc', ['du Maroc', "d'Algérie", 'de Tunisie', 'du Mali']),
  culture('Les Touaregs vivent surtout…', 'au Sahara', ['au Sahara', 'en Kabylie', 'dans le Rif', 'au Souss']),
  culture('Comment dit-on « la Kabylie » en kabyle ?', 'Tamurt n Leqbayel', ['Tamurt n Leqbayel', 'Tamazgha', 'Tifinagh', 'Taddart']),
]
const l32 = [
  culture('Que représente le symbole rouge du drapeau amazigh ?', "Le yaz (ⵣ), l'homme libre", ["Le yaz (ⵣ), l'homme libre", 'Une montagne', 'Un soleil', 'Une rivière'], 'flag'),
  culture('Le bleu du drapeau amazigh représente…', 'La mer', ['La mer', 'La nuit', 'Le froid', 'Le ciel seul'], 'flag'),
  culture('Le vert du drapeau représente…', 'La nature et les montagnes', ['La nature et les montagnes', 'La paix', "L'espoir", 'Les oliviers seuls']),
  culture('Le jaune du drapeau représente…', 'Le sable du Sahara', ['Le sable du Sahara', "L'or", 'Le blé', 'Le soleil']),
]

// -------- Unité 10 — Histoire & culture --------
const l33 = [
  culture('Le tifinagh est…', "L'alphabet amazigh", ["L'alphabet amazigh", 'Une danse', 'Un plat', 'Une région'], 'tifinagh'),
  culture("Quel signe tifinagh est l'emblème amazigh ?", 'ⵣ (yaz)', ['ⵣ (yaz)', 'ⴰ (ya)', 'ⵎ (yam)', 'ⵏ (yan)'], 'tifinagh'),
  culture("Aujourd'hui, le kabyle s'écrit surtout en…", 'Alphabet latin', ['Alphabet latin', 'Tifinagh uniquement', 'Alphabet grec', 'Idéogrammes']),
  culture('« Tamazgha » désigne…', "L'ensemble des terres amazighes", ["L'ensemble des terres amazighes", 'Une ville', 'Un roi', 'Une fête']),
]
const l34 = [
  culture('Yennayer est…', 'Le nouvel an amazigh', ['Le nouvel an amazigh', 'Une montagne', 'Un plat', 'Un roi']),
  culture('Yennayer est célébré en…', 'Janvier', ['Janvier', 'Mars', 'Juillet', 'Octobre']),
  culture('Massinissa était…', 'Un roi numide', ['Un roi numide', 'Un poète', 'Un navigateur', 'Un peintre']),
  culture('Dihya (la Kahina) était…', 'Une reine guerrière amazighe', ['Une reine guerrière amazighe', 'Une chanteuse', 'Une déesse', 'Une ville']),
]
const l35 = [
  image('count-5', 'Semmus', ['Semmus', 'Kkuẓ', 'Kraḍ', 'Sin']),
  image('color-red', 'Azeggaɣ', ['Azeggaɣ', 'Azegzaw', 'Awraɣ', 'Amellal']),
  match([
    { kab: 'Tafukt', fr: 'Soleil' },
    { kab: 'Ssuq', fr: 'Marché' },
    { kab: 'Tament', fr: 'Miel' },
    { kab: 'Adfel', fr: 'Neige' },
  ]),
  culture('Que signifie « Amazigh » ?', 'Homme libre', ['Homme libre', 'Montagnard', 'Berger', 'Voyageur'], 'flag'),
]

// -------- NIVEAU CONFIRMÉ --------
// -------- Unité 11 — Le corps & les gens --------
const l36 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Aqerruy', 'Tête', ['Tête', 'Main', 'Pied', 'Cœur']),
  qcm('kab-to-fr', 'Que signifie ?', 'Afus', 'Main', ['Main', 'Tête', 'Cœur', 'Pied']),
  qcm('fr-to-kab', 'Comment dit-on « Pied » ?', 'Pied', 'Aḍar', ['Aḍar', 'Afus', 'Aqerruy', 'Ul']),
  match([
    { kab: 'Aqerruy', fr: 'Tête' },
    { kab: 'Afus', fr: 'Main' },
    { kab: 'Ul', fr: 'Cœur' },
  ]),
  listen('Ul', 'Cœur', ['Cœur', 'Main', 'Pied', 'Tête']),
]
const l37 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Argaz', 'Homme', ['Homme', 'Femme', 'Garçon', 'Fille']),
  qcm('kab-to-fr', 'Que signifie ?', 'Tameṭṭut', 'Femme', ['Femme', 'Homme', 'Fille', 'Mère']),
  qcm('fr-to-kab', 'Comment dit-on « Garçon » ?', 'Garçon', 'Aqcic', ['Aqcic', 'Taqcict', 'Argaz', 'Gma']),
  qcm('kab-to-fr', 'Que signifie ?', 'Taqcict', 'Fille', ['Fille', 'Garçon', 'Sœur', 'Femme']),
  match([
    { kab: 'Argaz', fr: 'Homme' },
    { kab: 'Tameṭṭut', fr: 'Femme' },
    { kab: 'Aqcic', fr: 'Garçon' },
    { kab: 'Taqcict', fr: 'Fille' },
  ]),
]
const l38 = [
  listen('Afus', 'Main', ['Main', 'Pied', 'Tête', 'Cœur']),
  qcm('fr-to-kab', 'Comment dit-on « Tête » ?', 'Tête', 'Aqerruy', ['Aqerruy', 'Aḍar', 'Ul', 'Afus']),
  match([
    { kab: 'Aḍar', fr: 'Pied' },
    { kab: 'Argaz', fr: 'Homme' },
    { kab: 'Taqcict', fr: 'Fille' },
  ]),
  qcm('kab-to-fr', 'Que signifie ?', 'Aqcic', 'Garçon', ['Garçon', 'Homme', 'Frère', 'Fille']),
  // Remarque de langue : le féminin en t…t, déjà croisé dans les faits.
  culture('Tameṭṭut, Taqcict, Taddart… que signale le t…t autour du mot ?', 'Le féminin', ['Le féminin', 'Le pluriel', 'Le passé', 'La négation']),
]

// -------- Unité 12 — Le temps qui passe --------
const l39 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ass', 'Jour', ['Jour', 'Nuit', 'Matin', 'Soir']),
  qcm('kab-to-fr', 'Que signifie ?', 'Iḍ', 'Nuit', ['Nuit', 'Jour', 'Soir', 'Demain']),
  qcm('fr-to-kab', 'Comment dit-on « Aujourd’hui » ?', 'Aujourd’hui', 'Ass-a', ['Ass-a', 'Azekka', 'Iḍelli', 'Tura']),
  match([
    { kab: 'Ass', fr: 'Jour' },
    { kab: 'Iḍ', fr: 'Nuit' },
    { kab: 'Ass-a', fr: 'Aujourd’hui' },
  ]),
]
const l40 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanezzayt', 'Le matin', ['Le matin', 'Le soir', 'La nuit', 'Demain']),
  qcm('kab-to-fr', 'Que signifie ?', 'Tameddit', 'Le soir', ['Le soir', 'Le matin', 'Le jour', 'Hier']),
  listen('Tameddit', 'Le soir', ['Le soir', 'Le matin', 'La nuit', 'Aujourd’hui']),
  match([
    { kab: 'Tanezzayt', fr: 'Le matin' },
    { kab: 'Tameddit', fr: 'Le soir' },
    { kab: 'Iḍ', fr: 'Nuit' },
  ]),
]
const l41 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Iḍelli', 'Hier', ['Hier', 'Demain', 'Aujourd’hui', 'Maintenant']),
  qcm('kab-to-fr', 'Que signifie ?', 'Azekka', 'Demain', ['Demain', 'Hier', 'Le soir', 'Le matin']),
  qcm('fr-to-kab', 'Comment dit-on « Maintenant » ?', 'Maintenant', 'Tura', ['Tura', 'Melmi', 'Ass-a', 'Azekka']),
  qcm('kab-to-fr', 'Que signifie ?', 'Melmi ?', 'Quand ?', ['Quand ?', 'Où ?', 'Comment ?', 'Pourquoi ?']),
  match([
    { kab: 'Iḍelli', fr: 'Hier' },
    { kab: 'Azekka', fr: 'Demain' },
    { kab: 'Tura', fr: 'Maintenant' },
  ]),
]

// -------- Unité 13 — Parler & agir --------
const l42 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Nekk', 'Moi', ['Moi', 'Toi', 'Lui', 'Elle']),
  qcm('kab-to-fr', 'Que signifie ?', 'Kečč', 'Toi (à un homme)', ['Toi (à un homme)', 'Toi (à une femme)', 'Lui', 'Moi']),
  qcm('kab-to-fr', 'Que signifie ?', 'Kemm', 'Toi (à une femme)', ['Toi (à une femme)', 'Toi (à un homme)', 'Elle', 'Moi']),
  match([
    { kab: 'Nekk', fr: 'Moi' },
    { kab: 'Netta', fr: 'Lui' },
    { kab: 'Nettat', fr: 'Elle' },
  ]),
]
const l43 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ečč !', 'Mange !', ['Mange !', 'Bois !', 'Viens !', 'Va !']),
  qcm('kab-to-fr', 'Que signifie ?', 'Sew !', 'Bois !', ['Bois !', 'Mange !', 'Sors !', 'Entre !']),
  sentence('Sew atay', 'Bois du thé', ['Bois du thé', 'Mange du pain', 'Bois de l’eau', 'Le thé est chaud']),
  qcm('fr-to-kab', 'Comment dit-on « Viens ! » ?', 'Viens !', 'As-d !', ['As-d !', 'Ṛuḥ !', 'Ečč !', 'Sew !']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ṛuḥ !', 'Va ! / Pars !', ['Va ! / Pars !', 'Viens !', 'Reste !', 'Attends !']),
]
const l44 = [
  sentence('D acu-yagi ?', 'Qu’est-ce que c’est ?', ['Qu’est-ce que c’est ?', 'Où es-tu ?', 'Comment vas-tu ?', 'Qui est-ce ?']),
  sentence('Anda telliḍ ?', 'Où es-tu ?', ['Où es-tu ?', 'Quand viens-tu ?', 'Que fais-tu ?', 'Comment vas-tu ?']),
  sentence('Ur fhimeɣ ara', 'Je ne comprends pas', ['Je ne comprends pas', 'Je ne sais pas', 'Je n’entends pas', 'Je ne veux pas']),
  qcm('fr-to-kab', 'Comment dit-on « S’il te plaît » (à un homme) ?', 'S’il te plaît', 'Ttxil-k', ['Ttxil-k', 'Tanemmirt', 'Semmeḥ-iyi', 'Ansuf']),
  qcm('kab-to-fr', 'Que signifie ?', 'Semmeḥ-iyi', 'Excuse-moi', ['Excuse-moi', 'S’il te plaît', 'Merci', 'De rien']),
]
const l45 = [
  match([
    { kab: 'Nekk', fr: 'Moi' },
    { kab: 'Ass-a', fr: 'Aujourd’hui' },
    { kab: 'Afus', fr: 'Main' },
    { kab: 'Tameṭṭut', fr: 'Femme' },
  ]),
  sentence('Ur fhimeɣ ara', 'Je ne comprends pas', ['Je ne comprends pas', 'Je vais bien', 'À demain', 'Excuse-moi']),
  qcm('fr-to-kab', 'Comment dit-on « Demain » ?', 'Demain', 'Azekka', ['Azekka', 'Iḍelli', 'Tura', 'Melmi']),
  match([
    { kab: 'Ečč !', fr: 'Mange !' },
    { kab: 'Sew !', fr: 'Bois !' },
    { kab: 'As-d !', fr: 'Viens !' },
    { kab: 'Ṛuḥ !', fr: 'Va !' },
  ]),
  culture('« Azul, amek telliḍ ? » — que demande-t-on ?', 'Comment tu vas', ['Comment tu vas', 'Où tu habites', 'Ton prénom', 'L’heure qu’il est']),
]

export const byLesson = {
  l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17,
  l18, l19, l20, l21, l22, l23, l24, l25, l26, l27, l28, l29, l30, l31, l32, l33, l34, l35,
  l36, l37, l38, l39, l40, l41, l42, l43, l44, l45,
}

export function getExercises(lessonId) {
  return byLesson[lessonId] ?? l1
}

/** Banque plate de questions à choix (QCM, écoute, phrase, image) pour le Défi du jour. */
export function challengePool() {
  return Object.values(byLesson)
    .flat()
    .filter((ex) => ['qcm', 'listen', 'sentence', 'image', 'culture'].includes(ex.type))
}
