/**
 * Contenu des exercices — PROVISOIRE (à valider par un locuteur natif).
 * Orthographe latine usuelle.
 *
 * Types d'exercices :
 *   - 'qcm'    : choix multiple. kind = 'kab-to-fr' | 'fr-to-kab'.
 *   - 'listen' : écoute puis choisis (audio d'abord). kind = 'kab-to-fr'.
 *   - 'match'  : associe des paires kabyle ↔ français.
 */

const qcm = (kind, prompt, word, answer, choices, audio = kind === 'kab-to-fr') => ({
  type: 'qcm',
  kind,
  prompt,
  word,
  audio,
  answer,
  choices,
})
const listen = (word, answer, choices) => ({
  type: 'listen',
  kind: 'kab-to-fr',
  prompt: 'Écoute et choisis',
  word,
  audio: true,
  answer,
  choices,
})
const match = (pairs, prompt = 'Associe les paires') => ({ type: 'match', prompt, pairs })
/** Image d'une situation quotidienne → trouver la bonne description (mot kabyle). */
const image = (scene, answer, choices, prompt = 'Que montre l’image ?') => ({ type: 'image', prompt, scene, answer, choices })
/** Question de culture/histoire (réponses en français, illustration facultative). */
const culture = (prompt, answer, choices, scene) => ({ type: 'culture', prompt, scene, answer, choices })
/** Écouter une PHRASE entière → choisir son sens. */
const sentence = (phrase, answer, choices) => ({
  type: 'sentence',
  kind: 'kab-to-fr',
  prompt: 'Écoute la phrase',
  word: phrase,
  audio: true,
  answer,
  choices,
})

// -------- Unité 1 — Salutations --------
const l1 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Azul', 'Bonjour', ['Bonjour', 'Merci', 'Au revoir', 'Bienvenue']),
  qcm('kab-to-fr', 'Que signifie ?', 'Azul fell-ak', 'Bonjour à toi', ['Bonjour à toi', 'Merci beaucoup', 'À demain', 'Comment vas-tu ?']),
  qcm('fr-to-kab', 'Comment dit-on « Bonjour » ?', 'Bonjour', 'Azul', ['Azul', 'Tanemmirt', 'Ar tufat', 'Ansuf']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ansuf', 'Bienvenue', ['Bienvenue', 'Merci', 'Oui', 'Bonjour']),
]
const l2 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Tanemmirt', 'Merci', ['Merci', 'Bonjour', 'Non', 'Bienvenue']),
  qcm('fr-to-kab', 'Comment dit-on « Merci » ?', 'Merci', 'Tanemmirt', ['Azul', 'Tanemmirt', 'Ala', 'Labas']),
  listen('Ih', 'Oui', ['Oui', 'Non', 'Merci', 'Bonjour']),
  qcm('kab-to-fr', 'Que signifie ?', 'Ala', 'Non', ['Bonjour', 'Non', 'Oui', 'Au revoir']),
]
const l3 = [
  qcm('fr-to-kab', 'Comment dit-on « Oui » ?', 'Oui', 'Ih', ['Ih', 'Ala', 'Azul', 'Ar tufat']),
  qcm('fr-to-kab', 'Comment dit-on « Non » ?', 'Non', 'Ala', ['Ansuf', 'Ala', 'Ih', 'Tanemmirt']),
  listen('Labas ?', 'Ça va ?', ['Ça va ?', 'Merci', 'À demain', 'Bienvenue']),
  match([
    { kab: 'Azul', fr: 'Bonjour' },
    { kab: 'Tanemmirt', fr: 'Merci' },
    { kab: 'Ar tufat', fr: 'À demain' },
  ]),
]
const l4 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Labas', 'Ça va (bien)', ['Ça va (bien)', 'Non', 'Bienvenue', 'À demain']),
  qcm('fr-to-kab', 'Comment dit-on « Ça va ? » ?', 'Ça va ?', 'Labas ?', ['Labas ?', 'Azul', 'Tanemmirt', 'Ala']),
  listen('Azul fell-ak', 'Bonjour à toi', ['Bonjour à toi', 'Merci', 'À demain', 'Oui']),
  qcm('fr-to-kab', 'Comment dit-on « Bienvenue » ?', 'Bienvenue', 'Ansuf', ['Ansuf', 'Ih', 'Ar tufat', 'Labas']),
]
const l5 = [
  qcm('kab-to-fr', 'Que signifie ?', 'Ar tufat', 'À demain', ['À demain', 'Bonjour', 'Merci', 'Oui']),
  qcm('fr-to-kab', 'Comment dit-on « À demain » ?', 'À demain', 'Ar tufat', ['Ar tufat', 'Azul', 'Ansuf', 'Ih']),
  match([
    { kab: 'Ih', fr: 'Oui' },
    { kab: 'Ala', fr: 'Non' },
    { kab: 'Ansuf', fr: 'Bienvenue' },
  ]),
  qcm('kab-to-fr', 'Que signifie ?', 'Azul', 'Bonjour', ['Bonjour', 'Bienvenue', 'Non', 'Merci']),
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
  sentence('Ansuf yes-k', 'Bienvenue à toi', ['Bienvenue à toi', 'Bonjour', 'Merci beaucoup', 'À demain']),
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

export const byLesson = {
  l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17,
  l18, l19, l20, l21, l22, l23, l24, l25, l26, l27, l28, l29, l30, l31, l32, l33, l34, l35,
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
