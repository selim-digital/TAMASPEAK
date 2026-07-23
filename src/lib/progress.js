import { initialStatuses, orderedNodes } from '../data/units.js'

/**
 * Persistance de la progression (localStorage). Couche isolée,
 * remplaçable par Supabase. Gère : statuts des nœuds (leçons + coffres),
 * XP, gemmes, série (streak), défi quotidien, leçons parfaites.
 */
const KEY = 'tama-speak:v2'

const todayKey = () => new Date().toISOString().slice(0, 10)

export function defaultProgress() {
  return { statuses: initialStatuses(), xp: 0, gems: 0, streak: 0, lastDay: null, dailyDay: null, perfectCount: 0 }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    const base = defaultProgress()
    return { ...base, ...parsed, statuses: { ...base.statuses, ...(parsed.statuses || {}) } }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    /* stockage indisponible */
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  return defaultProgress()
}

/** Reconstruit une unité (données statiques) avec les statuts persistés. */
export function applyStatuses(unit, statuses) {
  return { ...unit, lessons: unit.lessons.map((l) => ({ ...l, status: statuses[l.id] ?? l.status })) }
}

/** Débloque le nœud qui suit `nodeId` (coffre → available, leçon → current). */
function unlockNext(statuses, nodeId) {
  const idx = orderedNodes.findIndex((n) => n.id === nodeId)
  const next = orderedNodes[idx + 1]
  if (!next) return
  if (next.type === 'chest') {
    if (statuses[next.id] === 'locked') statuses[next.id] = 'available'
  } else if (statuses[next.id] === 'locked') {
    statuses[next.id] = 'current'
  }
}

/** Fin de leçon : leçon terminée + nœud suivant débloqué, +XP, série/jour. */
export function completeLesson(progress, lessonId, { xpGain = 20, perfect = false } = {}) {
  const statuses = { ...progress.statuses }
  statuses[lessonId] = 'done'
  unlockNext(statuses, lessonId)
  const today = todayKey()
  const streak = progress.lastDay === today ? progress.streak : (progress.streak || 0) + 1
  return {
    ...progress,
    statuses,
    xp: (progress.xp || 0) + xpGain,
    streak,
    lastDay: today,
    perfectCount: (progress.perfectCount || 0) + (perfect ? 1 : 0),
  }
}

/** Ouverture d'un coffre : +gemmes, nœud suivant débloqué. */
export function openChest(progress, chestId, { gems = 15 } = {}) {
  const statuses = { ...progress.statuses }
  statuses[chestId] = 'done'
  unlockNext(statuses, chestId)
  return { ...progress, statuses, gems: (progress.gems || 0) + gems }
}

/** Défi du jour relevé : +XP, +gemmes, marqué pour aujourd'hui. */
export function recordChallenge(progress, { xpGain = 15, gems = 10 } = {}) {
  return { ...progress, xp: (progress.xp || 0) + xpGain, gems: (progress.gems || 0) + gems, dailyDay: todayKey() }
}

export const challengeAvailable = (progress) => progress.dailyDay !== todayKey()

/** Nombre de leçons terminées (hors coffres). */
export const lessonsDone = (progress) =>
  orderedNodes.filter((n) => n.type !== 'chest' && progress.statuses[n.id] === 'done').length
