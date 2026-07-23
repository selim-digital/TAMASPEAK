/**
 * Unités & chemin d'apprentissage.
 * status lesson: 'locked' | 'current' | 'done'
 * status chest : 'locked' | 'available' | 'done'
 * type: 'lesson' (défaut) | 'chest'
 */
export const units = [
  {
    id: 'u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Les salutations — Azul !',
    trophy: '👋',
    lessons: [
      { id: 'l1', title: 'Azul', icon: '👋', status: 'done' },
      { id: 'l2', title: 'Politesse', icon: '🙏', status: 'done' },
      { id: 'l3', title: 'Se présenter', icon: '★', status: 'current' },
      { id: 'chest1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l4', title: 'Ça va ?', icon: '💬', status: 'locked' },
      { id: 'l5', title: 'Au revoir', icon: '👋', status: 'locked' },
    ],
  },
  {
    id: 'u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'Réponses & politesse',
    trophy: '🙏',
    lessons: [
      { id: 'l6', title: 'Oui / Non', icon: '✅', status: 'locked' },
      { id: 'l7', title: 'Dire merci', icon: '🙏', status: 'locked' },
      { id: 'chest2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l8', title: 'Accueillir', icon: '🚪', status: 'locked' },
      { id: 'l9', title: 'Révision', icon: '🔁', status: 'locked' },
    ],
  },
  {
    id: 'u3',
    level: 'Initiation',
    unitLabel: 'Unité 3',
    title: 'À la maison — Axxam',
    trophy: '🏠',
    lessons: [
      { id: 'l10', title: 'La maison', icon: '🏠', status: 'locked' },
      { id: 'l11', title: 'Manger & boire', icon: '🍞', status: 'locked' },
      { id: 'chest3', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l12', title: 'Le thé', icon: '🫖', status: 'locked' },
      { id: 'l13', title: 'Autour de moi', icon: '🐈', status: 'locked' },
    ],
  },
  {
    id: 'u4',
    level: 'Initiation',
    unitLabel: 'Unité 4',
    title: 'La famille & les phrases',
    trophy: '👨‍👩‍👧',
    lessons: [
      { id: 'l14', title: 'La famille', icon: '👪', status: 'locked' },
      { id: 'l15', title: 'Frère & sœur', icon: '🧒', status: 'locked' },
      { id: 'chest4', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l16', title: 'Phrases du jour', icon: '💬', status: 'locked' },
      { id: 'l17', title: 'Grande révision', icon: '🏅', status: 'locked' },
    ],
  },
]

/** Liste ordonnée à plat de tous les nœuds (leçons + coffres). */
export const orderedNodes = units.flatMap((u) => u.lessons)

export const findUnit = (unitId) => units.find((u) => u.id === unitId)

export const unitOfLesson = (lessonId) => units.find((u) => u.lessons.some((l) => l.id === lessonId))

/** Statuts initiaux (id -> status). */
export function initialStatuses() {
  const s = {}
  orderedNodes.forEach((n) => {
    s[n.id] = n.status
  })
  return s
}

/** Une unité est terminée quand toutes ses LEÇONS (hors coffres) sont faites. */
export function isUnitComplete(statuses, unit) {
  return unit.lessons.filter((l) => l.type !== 'chest').every((l) => statuses[l.id] === 'done')
}
