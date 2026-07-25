import { isUnitComplete } from './courses.js'
import { lessonsDone } from '../lib/progress.js'

/**
 * Badges/trophées d'une langue — dérivés de la progression (aucun stockage
 * à part). Chaque langue a sa propre collection.
 */
export function makeBadges(course) {
  const [u1, u2] = course.units
  const badges = [
    { id: 'first', icon: '🌱', title: 'Premier pas', desc: 'Terminer une leçon', earned: (p) => lessonsDone(course, p) >= 1 },
    { id: 'perfect', icon: '💎', title: 'Sans faute', desc: 'Réussir une leçon à 100 %', earned: (p) => (p.perfectCount || 0) >= 1 },
    { id: 'streak3', icon: '🔥', title: 'Assidu', desc: 'Série de 3 jours', earned: (p) => (p.streak || 0) >= 3 },
  ]
  if (u1) {
    badges.push({
      id: 'unit1',
      icon: u1.trophy || '⭐',
      title: u1.unitLabel,
      desc: `Terminer l’${u1.unitLabel.toLowerCase()}`,
      earned: (p) => isUnitComplete(p.statuses, u1),
    })
  }
  if (u2) {
    badges.push({
      id: 'unit2',
      icon: u2.trophy || '⭐',
      title: u2.unitLabel,
      desc: `Terminer l’${u2.unitLabel.toLowerCase()}`,
      earned: (p) => isUnitComplete(p.statuses, u2),
    })
  }
  badges.push(
    { id: 'gems', icon: '🪙', title: 'Collectionneur', desc: 'Réunir 50 gemmes', earned: (p) => (p.gems || 0) >= 50 },
    { id: 'daily', icon: '🎯', title: 'Défi relevé', desc: 'Réussir un défi du jour', earned: (p) => !!p.dailyDay },
  )
  return badges
}
