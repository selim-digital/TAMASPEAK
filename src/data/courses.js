import { LANGUAGES, DEFAULT_LANG } from './languages.js'
import { SENS_SCENE } from './exercises.js'
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

    /**
     * Vocabulaire du cours, unité par unité — la liste qu'un locuteur peut
     * enregistrer pour rendre le cours sonore. On la dérive du contenu
     * existant plutôt que de tenir une seconde liste qui divergerait :
     * tout mot amazigh qui apparaît dans un exercice y figure une seule fois,
     * dans l'ordre du parcours.
     */
    vocabulary: () => {
      const vus = new Set()
      return units
        .map((u) => {
          const mots = []
          for (const lesson of u.lessons) {
            for (const ex of byLesson[lesson.id] ?? []) {
              // Attention : en fr→kab l'énoncé est FRANÇAIS et le mot amazigh
              // est la réponse. Prendre `ex.word` sans distinguer ferait
              // enregistrer « Oui » ou « Merci » à la grand-mère.
              const paires =
                ex.type === 'match'
                  ? ex.pairs.map((p) => ({ mot: p.kab, sens: p.fr }))
                  : // Un exercice `image` n'a pas de `word` : le dessin tient
                    // lieu d'énoncé et le mot amazigh est la RÉPONSE. Sans ce
                    // cas, un mot enseigné seulement par l'image sortirait
                    // d'ici — et personne ne serait jamais invité à
                    // l'enregistrer. Le dessin le rendrait muet.
                    ex.type === 'image'
                    ? [{ mot: ex.answer, sens: SENS_SCENE[ex.scene] || '' }]
                    : ex.word
                      ? [
                          ex.kind === 'fr-to-kab'
                            ? { mot: ex.answer, sens: ex.word }
                            : { mot: ex.word, sens: ex.answer },
                        ]
                      : []
              for (const p of paires) {
                if (!p.mot || vus.has(p.mot)) continue
                vus.add(p.mot)
                mots.push(p)
              }
            }
          }
          return { id: u.id, label: u.unitLabel, mots }
        })
        .filter((u) => u.mots.length > 0)
    },

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
  // Le parcours bêta : MÊMES unités, MÊMES exercices que le kabyle. Seul le
  // récit qui les entoure change (data/voyage.js, lu par l'écran du chemin).
  // Partager les données plutôt que les recopier est délibéré — une copie
  // divergerait au premier correctif, et l'app enseignerait deux kabyles.
  // Les identifiants de leçon sont donc identiques : sans danger, la
  // progression étant rangée par langue (lib/progress.js, byLang).
  'kab-beta': makeCourse(byId('kab-beta'), kabUnits, kabLessons),
  rif: makeCourse(byId('rif'), rifUnits, rifLessons),
  shi: makeCourse(byId('shi'), shiUnits, shiLessons),
  tzm: makeCourse(byId('tzm'), tzmUnits, tzmLessons),
  zgh: makeCourse(byId('zgh'), zghUnits, zghLessons),
}

export const hasCourse = (langId) => !!COURSES[langId]

export const getCourse = (langId) => COURSES[langId] || COURSES[DEFAULT_LANG]
