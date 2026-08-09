import { LANGUAGES } from '../data/languages.js'
import { COURSES, hasCourse } from '../data/courses.js'
import { LAND_BY_ID } from '../data/journey.js'
import { progressOf, lessonsDone } from '../lib/progress.js'
import { FlameIcon, StarIcon } from '../components/jewels/StatIcons.jsx'
import { sfx } from '../lib/sfx.js'

/**
 * « Mes langues » — le tableau de bord multilingue. Chaque langue amazighe
 * est un cours indépendant : on voit sa progression, et on bascule de l'une
 * à l'autre d'un geste. Apprendre plusieurs langues en parallèle est
 * l'usage attendu, pas une exception.
 */
export function LanguagesScreen({ store, onPick, onBack }) {
  const started = store.byLang || {}

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
            ←
          </button>
        )}
        <h2 className="text-lg font-extrabold">Mes langues</h2>
      </div>
      <p className="px-4 pb-2 text-[11.5px] leading-snug text-ink-soft">
        Tu peux en apprendre plusieurs en parallèle — chacune garde sa propre progression.
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="flex flex-col gap-2.5">
          {LANGUAGES.map((lang) => {
            const ready = hasCourse(lang.id)
            const course = COURSES[lang.id]
            const isActive = store.lang === lang.id
            const hasStarted = ready && !!started[lang.id]
            const progress = hasStarted ? progressOf(store, course) : null
            const done = progress ? lessonsDone(course, progress) : 0
            const pct = progress && course.lessonCount ? Math.round((done / course.lessonCount) * 100) : 0

            return (
              <button
                key={lang.id}
                type="button"
                disabled={!ready}
                onClick={() => {
                  if (!ready) return
                  sfx.click()
                  onPick(lang.id)
                }}
                className={`relative overflow-hidden rounded-2xl border-2 text-left transition ${
                  isActive ? 'border-turquoise shadow-[0_6px_16px_-10px_rgba(10,122,105,.6)]' : 'border-line'
                } ${ready ? '' : 'opacity-70'}`}
              >
                <div className="relative h-[68px]">
                  <img src={LAND_BY_ID[lang.land]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(100deg, ${lang.accentDeep}e6, ${lang.accentDeep}77 60%, rgba(30,37,48,.15))` }}
                  />
                  <div className="relative flex h-full items-center justify-between px-3.5 text-white">
                    <div>
                      <div className="text-[15px] font-extrabold leading-tight drop-shadow-sm">
                        {lang.name}
                        {lang.autonym !== lang.name && (
                          <span className="text-[11.5px] font-bold opacity-90"> · {lang.autonym}</span>
                        )}
                      </div>
                      <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] opacity-90">{lang.region}</div>
                    </div>
                    <span className="flex flex-none items-center gap-1.5">
                      {/* Le mot BÊTA se voit SUR la carte, pas seulement dans
                          un écran de détail : on n'embarque personne dans une
                          version d'essai sans le lui dire en face. */}
                      {lang.beta && (
                        <span className="rounded-full bg-coral px-2 py-0.5 text-[9.5px] font-extrabold text-white">
                          BÊTA
                        </span>
                      )}
                      {isActive && (
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9.5px] font-extrabold" style={{ color: lang.accentDeep }}>
                          EN COURS
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-cream px-3.5 py-2">
                  {hasStarted ? (
                    <>
                      <div className="flex items-center gap-3 text-[11px] font-extrabold text-ink-soft tabular-nums">
                        <span className="flex items-center gap-1">
                          <StarIcon size={16} /> {progress.xp} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <FlameIcon size={16} /> {progress.streak}
                        </span>
                        <span className="ml-auto">
                          {done} / {course.lessonCount} leçons
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-2">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: lang.accent }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11.5px] text-ink-soft">{lang.blurb}</span>
                      <span
                        className="flex-none text-[11.5px] font-extrabold"
                        style={{ color: ready ? lang.accentDeep : 'var(--color-ink-soft)' }}
                      >
                        {!ready ? 'Bientôt' : lang.beta ? 'Essayer →' : 'Commencer →'}
                      </span>
                    </div>
                  )}
                  {lang.note && <p className="mt-1.5 text-[10px] leading-snug text-ink-soft">{lang.note}</p>}
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-center text-[10.5px] leading-snug text-ink-soft">
          Le cours de kabyle est le plus avancé. Les trois autres démarrent par deux unités —
          le contenu s'étoffera, et reste à valider par des locuteurs natifs.
        </p>
      </div>
    </div>
  )
}
