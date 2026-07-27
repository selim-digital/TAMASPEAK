import { DEFAULT_LANG } from '../data/languages.js'

/**
 * Persistance de la progression (localStorage). Couche isolée,
 * remplaçable par Supabase.
 *
 * L'élève peut apprendre PLUSIEURS langues amazighes en parallèle : le
 * stockage est un « store » global
 *
 *   { lang, profile, byLang: { kab: {...}, rif: {...} } }
 *
 * où chaque langue possède ses propres statuts de nœuds, XP, gemmes, série
 * et défi du jour. `profile` (pourquoi j'apprends, objectif quotidien) est
 * commun à la personne ; le niveau déclaré est propre à chaque langue.
 */
const KEY = 'tama-speak:v3'
const LEGACY_KEY = 'tama-speak:v2'

const todayKey = () => new Date().toISOString().slice(0, 10)

/* ------------------------------------------------------------------ */
/* Progression d'UNE langue                                            */
/* ------------------------------------------------------------------ */

export function defaultProgress(course) {
  return {
    statuses: course.initialStatuses(),
    xp: 0,
    gems: 0,
    streak: 0,
    lastDay: null,
    dailyDay: null,
    perfectCount: 0,
    // Niveau déclaré pour CETTE langue ('debutant' | 'comprend' | 'parle').
    level: null,
    // XP gagnés aujourd'hui (pour l'objectif quotidien).
    xpToday: 0,
    xpDay: null,
    // Mots rapportés d'une mission auprès d'un proche : le seul contenu de
    // l'app que l'élève a écrit lui-même, et donc le seul qui porte le parler
    // de sa famille plutôt qu'une norme.
    lexique: [],
    // Missions déjà accomplies (ids), pour ne pas les reproposer.
    missionsFaites: [],
    // Récits d'histoire lus et dont la question a été trouvée.
    recitsLus: [],
  }
}

/** Ajoute des XP en tenant le compteur du jour (objectif quotidien). */
function addXp(progress, xpGain) {
  const today = todayKey()
  const xpToday = (progress.xpDay === today ? progress.xpToday || 0 : 0) + xpGain
  return { xp: (progress.xp || 0) + xpGain, xpToday, xpDay: today }
}

/** XP gagnés aujourd'hui (0 si le jour a changé depuis la sauvegarde). */
export const xpToday = (progress) => (progress.xpDay === todayKey() ? progress.xpToday || 0 : 0)

/** Reconstruit une unité (données statiques) avec les statuts persistés. */
export function applyStatuses(unit, statuses) {
  return { ...unit, lessons: unit.lessons.map((l) => ({ ...l, status: statuses[l.id] ?? l.status })) }
}

/** Débloque le nœud qui suit `nodeId` (coffre → available, leçon → current). */
function unlockNext(course, statuses, nodeId) {
  const idx = course.orderedNodes.findIndex((n) => n.id === nodeId)
  const next = course.orderedNodes[idx + 1]
  if (!next) return
  if (next.type === 'chest') {
    if (statuses[next.id] === 'locked') statuses[next.id] = 'available'
  } else if (statuses[next.id] === 'locked') {
    statuses[next.id] = 'current'
  }
}

/** Fin de leçon : leçon terminée + nœud suivant débloqué, +XP, série/jour. */
export function completeLesson(course, progress, lessonId, { xpGain = 20, perfect = false } = {}) {
  const statuses = { ...progress.statuses }
  statuses[lessonId] = 'done'
  unlockNext(course, statuses, lessonId)
  const today = todayKey()
  const streak = progress.lastDay === today ? progress.streak : (progress.streak || 0) + 1
  return {
    ...progress,
    ...addXp(progress, xpGain),
    statuses,
    streak,
    lastDay: today,
    perfectCount: (progress.perfectCount || 0) + (perfect ? 1 : 0),
  }
}

/** Ouverture d'un coffre : +gemmes, nœud suivant débloqué. */
export function openChest(course, progress, chestId, { gems = 15 } = {}) {
  const statuses = { ...progress.statuses }
  statuses[chestId] = 'done'
  unlockNext(course, statuses, chestId)
  return { ...progress, statuses, gems: (progress.gems || 0) + gems }
}

/** Défi du jour relevé : +XP, +gemmes, marqué pour aujourd'hui. */
export function recordChallenge(progress, { xpGain = 15, gems = 10 } = {}) {
  return { ...progress, ...addXp(progress, xpGain), gems: (progress.gems || 0) + gems, dailyDay: todayKey() }
}

export const challengeAvailable = (progress) => progress.dailyDay !== todayKey()

/* ------------------------------------------------------------------ */
/* Lexique personnel — les mots rapportés d'une mission                 */
/* ------------------------------------------------------------------ */

/**
 * Ajoute un mot recueilli auprès d'un proche. On garde qui l'a dit : c'est
 * l'attribution qui donne sa valeur à l'entrée — « chez nous on dit ça » n'a
 * de sens que si l'on sait qui est « nous ».
 *
 * Un même mot rapporté deux fois remplace l'ancien plutôt que de doubler.
 */
export function addToLexique(progress, { mot, sens, de, missionId }) {
  const propre = (mot || '').trim()
  if (!propre) return progress
  const lexique = (progress.lexique || []).filter((e) => e.mot.toLowerCase() !== propre.toLowerCase())
  return {
    ...progress,
    lexique: [
      ...lexique,
      { mot: propre, sens: (sens || '').trim(), de: (de || '').trim(), at: todayKey() },
    ],
    missionsFaites: missionId
      ? [...new Set([...(progress.missionsFaites || []), missionId])]
      : progress.missionsFaites || [],
  }
}

export function removeFromLexique(progress, mot) {
  return { ...progress, lexique: (progress.lexique || []).filter((e) => e.mot !== mot) }
}

export const lexiqueSize = (progress) => (progress.lexique || []).length

/* ------------------------------------------------------------------ */
/* Récits d'histoire                                                    */
/* ------------------------------------------------------------------ */

/** Marque un récit comme lu et sa question trouvée. Les XP ne comptent qu'une fois. */
export function recordRecit(progress, recitId, { xpGain = 10 } = {}) {
  if ((progress.recitsLus || []).includes(recitId)) return progress
  return {
    ...progress,
    ...addXp(progress, xpGain),
    recitsLus: [...(progress.recitsLus || []), recitId],
  }
}

export const recitLu = (progress, recitId) => (progress.recitsLus || []).includes(recitId)
export const recitsLus = (progress) => (progress.recitsLus || []).length

/** Nombre de leçons terminées (hors coffres) dans cette langue. */
export const lessonsDone = (course, progress) =>
  course.orderedNodes.filter((n) => n.type !== 'chest' && progress.statuses[n.id] === 'done').length

/* ------------------------------------------------------------------ */
/* Store multi-langues                                                  */
/* ------------------------------------------------------------------ */

export function defaultStore() {
  return { lang: DEFAULT_LANG, profile: null, byLang: {} }
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultStore(), ...parsed, byLang: parsed.byLang || {} }
    }
    // Migration depuis la v2 (mono-langue kabyle).
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const old = JSON.parse(legacy)
      const { profile, ...rest } = old
      return {
        lang: DEFAULT_LANG,
        profile: profile || null,
        byLang: { [DEFAULT_LANG]: { ...rest, level: profile?.level ?? null } },
      }
    }
    return defaultStore()
  } catch {
    return defaultStore()
  }
}

export function saveStore(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* stockage indisponible */
  }
}

export function resetStore() {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignore */
  }
  return defaultStore()
}

/** Progression de la langue demandée (créée à la volée si absente). */
export function progressOf(store, course) {
  const saved = store.byLang?.[course.id]
  const base = defaultProgress(course)
  if (!saved) return base
  return { ...base, ...saved, statuses: { ...base.statuses, ...(saved.statuses || {}) } }
}

/** Remplace la progression d'une langue et renvoie un nouveau store. */
export function withProgress(store, langId, progress) {
  return { ...store, byLang: { ...store.byLang, [langId]: progress } }
}

/** Langues déjà commencées par l'élève. */
export const startedLangs = (store) => Object.keys(store.byLang || {})

/** Identité publique (pseudo + avatar) — utilisée par le profil et les défis. */
export function setIdentity(store, { name, avatar }) {
  return { ...store, profile: { ...(store.profile || {}), name, avatar } }
}

/** Bilan cumulé sur toutes les langues, pour le profil et le partage. */
export function globalStats(store, courses) {
  let xp = 0
  let gems = 0
  let lessons = 0
  let medals = 0
  let bestStreak = 0
  const perLang = []
  for (const [langId, saved] of Object.entries(store.byLang || {})) {
    const course = courses[langId]
    if (!course) continue
    const p = progressOf(store, course)
    const done = lessonsDone(course, p)
    const units = course.units.filter((u) =>
      u.lessons.filter((l) => l.type !== 'chest').every((l) => p.statuses[l.id] === 'done'),
    ).length
    xp += p.xp || 0
    gems += p.gems || 0
    lessons += done
    medals += units
    bestStreak = Math.max(bestStreak, p.streak || 0)
    perLang.push({ course, xp: p.xp || 0, streak: p.streak || 0, done, total: course.lessonCount, medals: units })
  }
  perLang.sort((a, b) => b.xp - a.xp)
  return { xp, gems, lessons, medals, bestStreak, perLang }
}

/** L'élève a-t-il déjà fait l'onboarding général (pourquoi / objectif) ? */
export const hasProfile = (store) => !!store.profile
