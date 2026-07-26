/**
 * Écrire le tifinagh — le contenu des trois niveaux.
 *
 * Rien n'est inventé ici :
 *  • les 33 lettres sont l'alphabet tifinaghe-IRCAM, officialisé au Maroc par
 *    décision royale du 10 février 2003, et leurs valeurs latines sont celles
 *    des noms Unicode du bloc U+2D30–U+2D7F (YAB → b, YAGH → ɣ, etc.).
 *  • l'ordre d'apprentissage suit celui du cours d'amazighe standard
 *    (src/data/courses/zgh.js), qui commence par ⴰ ⵎ ⵏ ⵜ pour que le premier
 *    mot lisible arrive vite — puis complète l'alphabet.
 *  • les mots sont ceux du cours, déjà écrits et relus là-bas. Aucun mot
 *    nouveau n'est introduit par cet écran.
 *
 * NIVEAU 3 — pourquoi des suites de mots et non des phrases. Écrire une phrase
 * amazighe correcte demande l'état d'annexion et des règles de liaison que le
 * cours n'enseigne pas encore, et qu'aucune source relue ne nous fournit sous
 * forme de phrases en tifinagh. Plutôt que d'en fabriquer, le niveau 3 fait
 * travailler ce qui manque réellement après le mot isolé : tenir la ligne,
 * espacer, enchaîner sans relever le doigt trop souvent. Les vraies phrases
 * viendront quand un locuteur les aura validées, comme le reste du cours.
 */

/** Niveau 1 — les 33 lettres, dans l'ordre où le cours les présente. */
export const LETTRES = [
  { c: 'ⴰ', lat: 'a' },
  { c: 'ⵎ', lat: 'm' },
  { c: 'ⵏ', lat: 'n' },
  { c: 'ⵜ', lat: 't' },
  { c: 'ⵔ', lat: 'r' },
  { c: 'ⴳ', lat: 'g' },
  { c: 'ⵓ', lat: 'u' },
  { c: 'ⵣ', lat: 'z' },
  { c: 'ⵍ', lat: 'l' },
  { c: 'ⵉ', lat: 'i' },
  { c: 'ⴼ', lat: 'f' },
  { c: 'ⵖ', lat: 'ɣ' },
  { c: 'ⵅ', lat: 'x' },
  { c: 'ⵄ', lat: 'ɛ' },
  { c: 'ⵃ', lat: 'ḥ' },
  { c: 'ⴹ', lat: 'ḍ' },
  { c: 'ⵟ', lat: 'ṭ' },
  { c: 'ⵚ', lat: 'ṣ' },
  { c: 'ⵥ', lat: 'ẓ' },
  { c: 'ⵕ', lat: 'ṛ' },
  { c: 'ⴱ', lat: 'b' },
  { c: 'ⴷ', lat: 'd' },
  { c: 'ⴻ', lat: 'e' },
  { c: 'ⴽ', lat: 'k' },
  { c: 'ⵀ', lat: 'h' },
  { c: 'ⵇ', lat: 'q' },
  { c: 'ⵊ', lat: 'j' },
  { c: 'ⵙ', lat: 's' },
  { c: 'ⵛ', lat: 'c' },
  { c: 'ⵡ', lat: 'w' },
  { c: 'ⵢ', lat: 'y' },
  { c: 'ⴳⵯ', lat: 'gʷ' },
  { c: 'ⴽⵯ', lat: 'kʷ' },
]

/** Niveau 2 — des mots entiers, tous repris du cours d'amazighe standard. */
export const MOTS = [
  { c: 'ⴰⵎⴰⵏ', lat: 'aman', fr: 'l’eau' },
  { c: 'ⴰⵣⵓⵍ', lat: 'azul', fr: 'salut' },
  { c: 'ⵢⴰⵏ', lat: 'yan', fr: 'un' },
  { c: 'ⵓⵀⵓ', lat: 'uhu', fr: 'non' },
  { c: 'ⵢⵢⵉⵀ', lat: 'yyih', fr: 'oui' },
  { c: 'ⵙⵉⵏ', lat: 'sin', fr: 'deux' },
  { c: 'ⴰⵔⴳⴰⵣ', lat: 'argaz', fr: 'l’homme' },
  { c: 'ⴰⴷⵍⵉⵙ', lat: 'adlis', fr: 'le livre' },
  { c: 'ⴽⵔⴰⴹ', lat: 'kraḍ', fr: 'trois' },
  { c: 'ⵜⵉⴳⵎⵎⵉ', lat: 'tigmmi', fr: 'la maison' },
  { c: 'ⴰⵖⵔⵓⵎ', lat: 'aɣrum', fr: 'le pain' },
  { c: 'ⵜⵉⴼⵉⵏⴰⵖ', lat: 'tifinagh', fr: 'l’écriture amazighe' },
  { c: 'ⵜⴰⵎⵖⴰⵔⵜ', lat: 'tamɣart', fr: 'la femme' },
  { c: 'ⵜⴰⵏⵎⵎⵉⵔⵜ', lat: 'tanmmirt', fr: 'merci' },
  { c: 'ⵜⴰⵎⵍⵍⴰⵍⵜ', lat: 'tamllalt', fr: 'l’œuf' },
]

/** Niveau 3 — enchaîner plusieurs mots sur une même ligne. */
export const SUITES = [
  { c: 'ⵢⴰⵏ ⵙⵉⵏ', lat: 'yan sin', fr: 'un, deux' },
  { c: 'ⴰⵣⵓⵍ ⴰⵔⴳⴰⵣ', lat: 'azul argaz', fr: 'salut, l’homme' },
  { c: 'ⴰⵎⴰⵏ ⴰⵖⵔⵓⵎ', lat: 'aman aɣrum', fr: 'l’eau, le pain' },
  { c: 'ⵢⴰⵏ ⵙⵉⵏ ⴽⵔⴰⴹ', lat: 'yan sin kraḍ', fr: 'un, deux, trois' },
  { c: 'ⵜⴰⵏⵎⵎⵉⵔⵜ ⴰⵣⵓⵍ', lat: 'tanmmirt azul', fr: 'merci, salut' },
  { c: 'ⵜⵉⴳⵎⵎⵉ ⵜⴰⵎⵖⴰⵔⵜ', lat: 'tigmmi tamɣart', fr: 'la maison, la femme' },
]

/**
 * `tolerance` est la largeur, en pixels, de la marge admise autour du tracé.
 * Elle a été calibrée par mesure sur une ardoise de 260 px, en balayant les
 * 33 lettres avec quatre faux tracés (diagonale, croix, trait vertical, case
 * noircie) et un tracé honnête mais approximatif. Résultat retenu : le pire
 * tracé honnête obtient 89 sur 100, les faux tracés restent sous le seuil de
 * 55 — à une exception près, le trait vertical sur ⵏ, qui n'en est pas une
 * puisque ⵏ EST un trait vertical.
 *
 * Elle diminue avec la taille du glyphe : un mot entier s'écrit plus petit
 * qu'une lettre isolée, la marge doit suivre.
 */
export const NIVEAUX = [
  {
    id: 'lettres',
    titre: 'Lettres',
    detail: 'Les 33 lettres, une par une',
    items: LETTRES,
    plume: 16,
    tolerance: 10,
  },
  {
    id: 'mots',
    titre: 'Mots',
    detail: 'Des mots entiers du cours',
    items: MOTS,
    plume: 11,
    tolerance: 8,
  },
  {
    id: 'suites',
    titre: 'Suites',
    detail: 'Plusieurs mots à la file',
    items: SUITES,
    plume: 8,
    tolerance: 6,
    note: 'Les vraies phrases arriveront quand un locuteur les aura validées — comme le reste du cours.',
  },
]

export const niveauParId = (id) => NIVEAUX.find((n) => n.id === id) || NIVEAUX[0]
