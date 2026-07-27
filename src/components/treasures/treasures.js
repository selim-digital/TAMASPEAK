import { DISHES } from '../jewels/Dishes.jsx'
import { OBJETS } from './Objects.jsx'

/**
 * La collection des trésors — ce que les coffres offrent.
 *
 * Plats et objets sont ENTRELACÉS, et l'ordre n'est pas décoratif : les
 * cours récents (rif, shi, tzm, zgh) n'ont que DEUX coffres. Sans cet
 * entrelacement, leurs élèves ne verraient que des plats — et toute la
 * partie historique de la collection resterait invisible à quiconque
 * n'apprend pas le kabyle.
 *
 * Avec 13 trésors pour 7 coffres au maximum (cours kabyle), plus aucune
 * récompense ne se répète — c'était le défaut d'origine : 4 plats en
 * rotation modulo sur 7 coffres, les trois derniers répétant les trois
 * premiers.
 */
export const TREASURES = [
  DISHES[0], // seksu — le couscous
  OBJETS[0], // aqbuc — la poterie peinte
  DISHES[1], // aghrum — la galette
  OBJETS[6], // la stèle de Dougga
  DISHES[2], // atay — le thé
  OBJETS[1], // tasirt — le moulin à bras
  DISHES[3], // tiɣrifin — les crêpes
  OBJETS[7], // le Medracen
  OBJETS[2], // azetta — le métier à tisser
  OBJETS[3], // taqecwalt — le panier d'alfa
  OBJETS[8], // la roche gravée du Tassili
  OBJETS[4], // tazerbit — le tapis
  OBJETS[5], // abernus — le burnous
]

/** Les coffres d'un cours, dans l'ordre du chemin. */
const chestsOf = (course) => (course?.orderedNodes || []).filter((n) => n.type === 'chest')

/** Trésor d'un coffre : par POSITION du coffre sur le chemin du cours. */
export function treasureForChest(course, chestId) {
  const i = chestsOf(course).findIndex((c) => c.id === chestId)
  return TREASURES[Math.max(0, i) % TREASURES.length]
}

/**
 * État de la collection pour un cours : chaque trésor avec `earned`, selon
 * les coffres déjà ouverts. Sert à l'écran Trophées.
 */
export function treasureCollection(course, statuses) {
  const acquis = new Set()
  chestsOf(course).forEach((chest, i) => {
    if (statuses?.[chest.id] === 'done') acquis.add(i % TREASURES.length)
  })
  return TREASURES.map((t, i) => ({ ...t, earned: acquis.has(i) }))
}

/** Nombre de trésors atteignables dans ce cours (= son nombre de coffres). */
export const treasureGoal = (course) => Math.min(chestsOf(course).length, TREASURES.length)
