import { LANGUAGES, DEFAULT_LANG } from './languages.js'
import { units as kabUnits } from './units.js'
import { byLesson as kabLessons } from './lessons.js'
import { rifUnits, rifLessons } from './courses/rif.js'
import { shiUnits, shiLessons } from './courses/shi.js'
import { tzmUnits, tzmLessons } from './courses/tzm.js'
import { zghUnits, zghLessons } from './courses/zgh.js'

/**
 * Un « cours » = une langue amazighe + son contenu + les helpers liés.
 * Chaque cours est indépendant : l'élève peut en suivre plusieurs en
 * parallèle, chacun avec sa propre progression (voir lib/progress.js).
 */
function makeCourse(lang, units, byLesson) {
  const orderedNodes = units.flatMap((u) => u.lessons)

  return {
    ...lang,
    units,
    orderedNodes,

    getExercises: (lessonId) => byLesson[lessonId] ?? Object.values(byLesson)[0] ?? [],

    /** Banque plate de questions à choix pour le Défi du jour. */
    challengePool: () =>
      Object.values(byLesson)
        .flat()
        .filter((ex) => ['qcm', 'listen', 'sentence', 'image', 'culture'].includes(ex.type)),

    findUnit: (unitId) => units.find((u) => u.id === unitId),
    unitOfLesson: (lessonId) => units.find((u) => u.lessons.some((l) => l.id === lessonId)),

    /** Statuts initiaux (id -> status). */
    initialStatuses: () => {
      const s = {}
      orderedNodes.forEach((n) => {
        s[n.id] = n.status
      })
      return s
    },

    /** Nombre total de leçons (hors coffres) — pour la barre de progression. */
    lessonCount: orderedNodes.filter((n) => n.type !== 'chest').length,
  }
}

/** Une unité est terminée quand toutes ses LEÇONS (hors coffres) sont faites. */
export function isUnitComplete(statuses, unit) {
  return unit.lessons.filter((l) => l.type !== 'chest').every((l) => statuses[l.id] === 'done')
}

const byId = (id) => LANGUAGES.find((l) => l.id === id)

/**
 * Contenus disponibles. Une langue peut figurer au registre sans cours :
 * elle s'affiche alors « bientôt » et n'est pas sélectionnable — c'est le
 * cas tant que son vocabulaire n'a pas été établi puis validé.
 */
export const COURSES = {
  kab: makeCourse(byId('kab'), kabUnits, kabLessons),
  rif: makeCourse(byId('rif'), rifUnits, rifLessons),
  shi: makeCourse(byId('shi'), shiUnits, shiLessons),
  tzm: makeCourse(byId('tzm'), tzmUnits, tzmLessons),
  zgh: makeCourse(byId('zgh'), zghUnits, zghLessons),
}

export const hasCourse = (langId) => !!COURSES[langId]

export const getCourse = (langId) => COURSES[langId] || COURSES[DEFAULT_LANG]
