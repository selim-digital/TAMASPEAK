import { units, isUnitComplete } from './units.js'
import { lessonsDone } from '../lib/progress.js'

/**
 * Badges/trophées — dérivés de la progression (aucun stockage à part).
 */
export const BADGES = [
  { id: 'first', icon: '🌱', title: 'Premier pas', desc: 'Terminer une leçon', earned: (p) => lessonsDone(p) >= 1 },
  { id: 'perfect', icon: '💎', title: 'Sans faute', desc: 'Réussir une leçon à 100 %', earned: (p) => (p.perfectCount || 0) >= 1 },
  { id: 'streak3', icon: '🔥', title: 'Assidu', desc: 'Série de 3 jours', earned: (p) => (p.streak || 0) >= 3 },
  { id: 'unit1', icon: '👋', title: 'Unité 1', desc: "Terminer l'Unité 1", earned: (p) => isUnitComplete(p.statuses, units[0]) },
  { id: 'unit2', icon: '🙏', title: 'Unité 2', desc: "Terminer l'Unité 2", earned: (p) => isUnitComplete(p.statuses, units[1]) },
  { id: 'gems', icon: '🪙', title: 'Collectionneur', desc: 'Réunir 50 gemmes', earned: (p) => (p.gems || 0) >= 50 },
  { id: 'daily', icon: '🎯', title: 'Défi relevé', desc: 'Réussir un défi du jour', earned: (p) => !!p.dailyDay },
]

export const earnedBadges = (progress) => BADGES.filter((b) => b.earned(progress))
