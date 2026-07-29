import { DEFAULT_LANG } from '../data/languages.js'
import { lireJson, ecrireJson, effacer } from './storage.js'

/**
 * Persistance de la progression. Le stockage lui-même est dans
 * `lib/storage.js` : c'est le seul fichier qui touche `localStorage`, et donc
 * le seul point à changer le jour où la progression se synchronise avec un
 * serveur.
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
    // Le coin jeux : parties de Mémory gagnées, niveaux de mots croisés
    // réussis (ids) — ces derniers conditionnent la récompense unique.
    jeux: { memoryVictoires: 0, motsFaits: [] },
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
/* Le coin jeux — Mémory et Mots croisés                                */
/* ------------------------------------------------------------------ */

/** Partie de Mémory gagnée : +XP, compteur de victoires. */
export function recordMemoryWin(progress, { xpGain = 10 } = {}) {
  const jeux = progress.jeux || {}
  return {
    ...progress,
    ...addXp(progress, xpGain),
    jeux: { ...jeux, memoryVictoires: (jeux.memoryVictoires || 0) + 1 },
  }
}

/**
 * Niveau de mots croisés terminé. La première réussite paie plein pot
 * (XP + gemmes) ; les suivantes un petit XP — rejouer reste utile pour
 * réviser, sans devenir une machine à gemmes.
 */
export function recordMotsNiveau(progress, niveauId, { xpGain = 15, gems = 10, xpRejoue = 5 } = {}) {
  const jeux = progress.jeux || {}
  const faits = jeux.motsFaits || []
  if (faits.includes(niveauId)) {
    return { ...progress, ...addXp(progress, xpRejoue) }
  }
  return {
    ...progress,
    ...addXp(progress, xpGain),
    gems: (progress.gems || 0) + gems,
    jeux: { ...jeux, motsFaits: [...faits, niveauId] },
  }
}

/** Dépense de gemmes (indice) — refuse net plutôt que de passer en négatif. */
export function depenserGemmes(progress, cout) {
  if ((progress.gems || 0) < cout) return progress
  return { ...progress, gems: progress.gems - cout }
}

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

/**
 * Répare les profils touchés par les statuts de démonstration qui ont
 * traîné dans les données du cours kabyle (Azul et Politesse « done »
 * d'origine, départ à la leçon 3). L'invariant qui permet de trancher :
 * TERMINER UNE LEÇON RAPPORTE TOUJOURS DES XP — une langue à 0 XP ne peut
 * donc avoir aucune leçon « done ». Ces statuts-là sont l'héritage du
 * maquettage : on les jette, le parcours repart d'Azul.
 * (Une langue avec des XP réels n'est pas touchée : impossible d'y
 * distinguer le vrai du semé — c'est le bouton « recommencer » qui sert.)
 */
function reparerStatutsSemes(byLang) {
  const repare = {}
  for (const [lang, p] of Object.entries(byLang || {})) {
    if (!p || (p.xp || 0) > 0 || !p.statuses) {
      repare[lang] = p
      continue
    }
    const pollue = Object.values(p.statuses).some((s) => s === 'done')
    repare[lang] = pollue ? { ...p, statuses: undefined } : p
  }
  return repare
}

export function loadStore() {
  try {
    const parsed = lireJson(KEY)
    if (parsed) {
      return { ...defaultStore(), ...parsed, byLang: reparerStatutsSemes(parsed.byLang || {}) }
    }
    // Migration depuis la v2 (mono-langue kabyle).
    const old = lireJson(LEGACY_KEY)
    if (old) {
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

export const saveStore = (store) => ecrireJson(KEY, store)

export function resetStore() {
  effacer(KEY)
  effacer(LEGACY_KEY)
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

/**
 * Recommencer une langue à zéro — voulu et assumé par l'élève, donc on
 * supprime sa progression au lieu de la fusionner. L'appelant doit AUSSI
 * pousser ce store au serveur tel quel (pushStore, sans fusion) : sinon la
 * fusion max/union de la prochaine connexion ressusciterait tout.
 */
export function resetLanguage(store, langId) {
  const byLang = { ...store.byLang }
  delete byLang[langId]
  return { ...store, byLang }
}

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

/* ------------------------------------------------------------------ */
/* Fusion de deux stores — le cœur de la synchronisation.              */
/* ------------------------------------------------------------------ */

const RANG_STATUT = { locked: 0, available: 1, current: 2, done: 3 }

/** Fusionne la progression d'UNE langue : rien ne se perd, jamais. */
function mergeProgress(a = {}, b = {}) {
  const statuses = { ...(a.statuses || {}) }
  for (const [id, st] of Object.entries(b.statuses || {})) {
    if ((RANG_STATUT[st] ?? 0) > (RANG_STATUT[statuses[id]] ?? 0)) statuses[id] = st
  }
  const parMot = new Map()
  for (const e of [...(a.lexique || []), ...(b.lexique || [])]) parMot.set(e.mot.toLowerCase(), e)
  return {
    ...a,
    ...b,
    statuses,
    xp: Math.max(a.xp || 0, b.xp || 0),
    gems: Math.max(a.gems || 0, b.gems || 0),
    streak: Math.max(a.streak || 0, b.streak || 0),
    perfectCount: Math.max(a.perfectCount || 0, b.perfectCount || 0),
    // Le jour le plus récent gagne les compteurs quotidiens.
    ...((a.xpDay || '') > (b.xpDay || '')
      ? { xpDay: a.xpDay, xpToday: a.xpToday }
      : { xpDay: b.xpDay, xpToday: b.xpToday }),
    lastDay: (a.lastDay || '') > (b.lastDay || '') ? a.lastDay : b.lastDay,
    lexique: [...parMot.values()],
    missionsFaites: [...new Set([...(a.missionsFaites || []), ...(b.missionsFaites || [])])],
    jeux: {
      memoryVictoires: Math.max(a.jeux?.memoryVictoires || 0, b.jeux?.memoryVictoires || 0),
      motsFaits: [...new Set([...(a.jeux?.motsFaits || []), ...(b.jeux?.motsFaits || [])])],
    },
  }
}

/**
 * Fusionne le store local et l'instantané du serveur, par MAXIMUM et UNION :
 * le pire cas d'une fusion est « rien de nouveau », jamais « j'ai perdu mes
 * 200 XP » — c'est LE piège classique de la première connexion.
 */
export function mergeStores(local, remote) {
  if (!remote) return local
  if (!local) return remote
  // L'instantané serveur d'un compte existant peut porter les statuts semés
  // par l'ancien maquettage : même réparation qu'au chargement local, sinon
  // la fusion max/union les ressuscite à chaque connexion.
  remote = { ...remote, byLang: reparerStatutsSemes(remote.byLang || {}) }
  const langs = new Set([...Object.keys(local.byLang || {}), ...Object.keys(remote.byLang || {})])
  const byLang = {}
  for (const l of langs) byLang[l] = mergeProgress(remote.byLang?.[l], local.byLang?.[l])
  return {
    ...remote,
    ...local, // les préférences de CET appareil (langue active, profil) priment
    profile: { ...(remote.profile || {}), ...(local.profile || {}) },
    byLang,
  }
}
