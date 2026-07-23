import { unit1, completeLesson } from '../data/unit1.js'

/**
 * Persistance de la progression.
 * Phase 4 (étape 1) : stockage local (localStorage) — la progression
 * survit au rechargement. Cette couche est isolée pour pouvoir être
 * remplacée par Supabase (auth + base) sans toucher aux écrans.
 */
const KEY = 'tama-speak:v1'

const todayKey = () => new Date().toISOString().slice(0, 10)

export function defaultProgress() {
  const statuses = {}
  unit1.lessons.forEach((l) => {
    statuses[l.id] = l.status
  })
  return { statuses, xp: 0, streak: 0, lastDay: null }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    const base = defaultProgress()
    return {
      ...base,
      ...parsed,
      statuses: { ...base.statuses, ...(parsed.statuses || {}) },
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    /* stockage indisponible (mode privé, etc.) — on ignore */
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

/** Reconstruit l'unité (données statiques) avec les statuts persistés. */
export function applyStatuses(unit, statuses) {
  return {
    ...unit,
    lessons: unit.lessons.map((l) => ({ ...l, status: statuses[l.id] ?? l.status })),
  }
}

/**
 * Enregistre la fin d'une leçon : leçon terminée + suivante débloquée,
 * +XP, et série incrémentée une fois par jour. Renvoie un nouveau
 * `progress` (immutable).
 */
export function recordCompletion(progress, lessonId, { xpGain = 20 } = {}) {
  const updatedUnit = completeLesson(applyStatuses(unit1, progress.statuses), lessonId)
  const statuses = {}
  updatedUnit.lessons.forEach((l) => {
    statuses[l.id] = l.status
  })
  const today = todayKey()
  const streak = progress.lastDay === today ? progress.streak : (progress.streak || 0) + 1
  return {
    statuses,
    xp: (progress.xp || 0) + xpGain,
    streak,
    lastDay: today,
  }
}
