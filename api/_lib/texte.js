/**
 * Règle maison (Selim) : aucun emoji à visage ou à yeux, nulle part —
 * pas même dans le texte que les UTILISATEURS tapent (feedback, demandes
 * de mots). Ce filtre est appliqué à l'écriture, et par /api/setup sur
 * les données déjà en base.
 *
 * Plages retirées : émoticônes (dont chats et singes), personnes et
 * silhouettes, parties du visage (yeux, œil, oreille…), animaux (un
 * animal dessiné a des yeux), astres à visage, super-héros, visages
 * récents, plus les modificateurs orphelins (teintes de peau, ZWJ).
 * Les MAINS et les traces de pattes restent — pas d'yeux : U+1F64C et
 * U+1F64F (mains levées, mains jointes), U+1F918–1F91F et U+1F932–1F933
 * (gestes de main), U+1F43E (empreintes).
 */
const PLAGE_VISAGES =
  /[\u{2639}\u{263A}\u{1F31A}-\u{1F31E}\u{1F400}-\u{1F43D}\u{1F43F}-\u{1F445}\u{1F464}-\u{1F487}\u{1F600}-\u{1F64B}\u{1F64D}\u{1F64E}\u{1F910}-\u{1F917}\u{1F920}-\u{1F931}\u{1F934}-\u{1F93E}\u{1F970}-\u{1F97A}\u{1F9B8}\u{1F9B9}\u{1F980}-\u{1F9AE}\u{1F9D0}-\u{1F9DF}\u{1FAC2}\u{1FAE0}-\u{1FAE8}\u{1F3FB}-\u{1F3FF}\u{200D}]/gu

/** Retire tout visage d'un texte (null/undefined passent tels quels). */
export function sansVisages(texte) {
  if (texte == null) return texte
  return String(texte).replace(PLAGE_VISAGES, '').replace(/[ \t]{2,}/g, ' ').trim()
}

/** Le texte contient-il un visage ? (pour compter sans modifier) */
export function contientVisage(texte) {
  if (!texte) return false
  PLAGE_VISAGES.lastIndex = 0
  return PLAGE_VISAGES.test(String(texte))
}
