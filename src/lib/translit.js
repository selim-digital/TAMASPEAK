/**
 * Tifinagh → latin, et la clé de recherche qui va avec.
 *
 * POURQUOI. Le cours d'amazighe standard écrit tout en tifinagh : ⴰⵣⵓⵍ,
 * ⵜⴰⵡⵓⵔⵉ, ⵜⵉⴳⵎⵎⵉ. Sans translittération, quelqu'un qui tape « azul » dans le
 * dictionnaire ne trouverait rien de ce cours — et n'aurait aucun moyen de
 * deviner qu'il faut un clavier tifinagh. On indexe donc chaque mot tifinagh
 * sous sa forme latine ; l'affichage, lui, ne change jamais : ce cours
 * s'apprend en tifinagh, c'est tout son propos.
 *
 * La table suit l'alphabet homologué au Maroc (PNM 17.1.100, 2004) — le même
 * que celui enseigné dans src/data/courses/zgh.js.
 *
 * Sens inverse volontairement absent : le latin ne se convertit PAS en
 * tifinagh automatiquement. « e » (schwa) ne s'écrit pas en norme IRCAM, les
 * tensions et les labiovélaires ne se déduisent pas d'une graphie latine
 * régionale — une conversion mécanique fabriquerait des mots faux.
 */

/** Alphabet tifinagh IRCAM → latin usuel. */
export const TIFINAGH = Object.freeze({
  ⴰ: 'a',
  ⴱ: 'b',
  ⴳ: 'g',
  ⴷ: 'd',
  ⴹ: 'ḍ',
  ⴻ: 'e',
  ⴼ: 'f',
  ⴽ: 'k',
  ⵀ: 'h',
  ⵃ: 'ḥ',
  ⵄ: 'ɛ',
  ⵅ: 'x',
  ⵇ: 'q',
  ⵉ: 'i',
  ⵊ: 'j',
  ⵍ: 'l',
  ⵎ: 'm',
  ⵏ: 'n',
  ⵓ: 'u',
  ⵔ: 'r',
  ⵕ: 'ṛ',
  ⵖ: 'ɣ',
  ⵙ: 's',
  ⵚ: 'ṣ',
  ⵛ: 'c',
  ⵜ: 't',
  ⵟ: 'ṭ',
  ⵡ: 'w',
  ⵢ: 'y',
  ⵣ: 'z',
  ⵥ: 'ẓ',
  ⵒ: 'p',
  ⵠ: 'v',
  ⵯ: 'ʷ', // marque de labiovélarisation, portée par la lettre précédente
})

const EST_TIFINAGH = /[ⴰ-⵿]/

/** Ce mot est-il écrit en tifinagh ? */
export const enTifinagh = (mot) => EST_TIFINAGH.test(String(mot || ''))

/** « ⵜⴰⵡⵓⵔⵉ » → « tawuri ». Les caractères inconnus sont laissés tels quels. */
export function versLatin(mot) {
  return [...String(mot || '')].map((c) => TIFINAGH[c] ?? c).join('')
}

/**
 * La clé sous laquelle un mot est cherché : tifinagh translittéré, minuscules,
 * signes diacritiques et ponctuation retirés.
 *
 * Les diacritiques sautent EXPRÈS : personne ne tape « aḍar » ni « aɣrum » sur
 * un clavier de téléphone. « adar » et « aghrum » doivent trouver. C'est la
 * même translittération que les noms de fichiers audio (lib/slug.js), à ceci
 * près qu'on garde ici les espaces comme séparateurs de mots.
 */
export function cleRecherche(texte) {
  return versLatin(texte)
    .toLowerCase()
    .replace(/ɣ/g, 'gh')
    .replace(/ɛ/g, 'e')
    .replace(/ʷ/g, 'w')
    .replace(/’/g, "'")
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
