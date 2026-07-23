/**
 * Unité 1 — Les salutations (niveau Initiation).
 * Structure de données minimale du chemin d'apprentissage.
 * Le contenu réel des exercices (mots kabyles + audio) sera ajouté
 * en Phase 2 avec un locuteur natif.
 *
 * status: 'done' | 'current' | 'locked'
 * type:   'lesson' (défaut) | 'chest'
 */
export const unit1 = {
  id: 'u1',
  level: 'Initiation',
  unitLabel: 'Unité 1',
  title: 'Les salutations — Azul !',
  lessons: [
    { id: 'l1', title: 'Azul', icon: '👋', status: 'done' },
    { id: 'l2', title: 'Politesse', icon: '🙏', status: 'done' },
    { id: 'l3', title: 'Se présenter', icon: '★', status: 'current' },
    { id: 'chest1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
    { id: 'l4', title: 'Ça va ?', icon: '💬', status: 'locked' },
    { id: 'l5', title: 'Au revoir', icon: '👋', status: 'locked' },
  ],
}

/**
 * Marque une leçon comme terminée et débloque la prochaine leçon
 * (on saute les coffres). Renvoie une NOUVELLE unité (immutable).
 */
export function completeLesson(unit, lessonId) {
  const lessons = unit.lessons.map((l) => ({ ...l }))
  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx === -1) return unit
  lessons[idx].status = 'done'
  for (let j = idx + 1; j < lessons.length; j++) {
    if (lessons[j].type !== 'chest') {
      if (lessons[j].status === 'locked') lessons[j].status = 'current'
      break
    }
  }
  return { ...unit, lessons }
}
