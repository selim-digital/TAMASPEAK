import { useState, useEffect } from 'react'
import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { OnboardingScreen } from './screens/OnboardingScreen.jsx'
import { PathScreen } from './screens/PathScreen.jsx'
import { LessonScreen } from './screens/LessonScreen.jsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.jsx'
import { ChestRewardScreen } from './screens/ChestRewardScreen.jsx'
import { UnitCompleteScreen } from './screens/UnitCompleteScreen.jsx'
import { ChallengeCompleteScreen } from './screens/ChallengeCompleteScreen.jsx'
import { TrophiesScreen } from './screens/TrophiesScreen.jsx'
import { LanguagesScreen } from './screens/LanguagesScreen.jsx'
import { ProfileScreen } from './screens/ProfileScreen.jsx'
import { DuelIntroScreen, DuelResultScreen } from './screens/DuelScreen.jsx'
import { makeSeed, seededPick, readDuelFromUrl, clearDuelFromUrl } from './lib/challenge.js'
import { FamilyCarousel } from './components/mascots/FamilyCarousel.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { JewelDefs } from './components/jewels/JewelDefs.jsx'
import { GemIcon } from './components/jewels/StatIcons.jsx'
import { getCourse, isUnitComplete } from './data/courses.js'
import {
  loadStore,
  saveStore,
  resetStore,
  progressOf,
  withProgress,
  hasProfile,
  applyStatuses,
  completeLesson,
  openChest,
  recordChallenge,
  challengeAvailable,
  xpToday,
  lessonsDone,
} from './lib/progress.js'

const XP_PER_LESSON = 20
const CHEST_GEMS = 15
const UNIT_BONUS = 25
const CHALLENGE = { xpGain: 15, gems: 10, size: 5 }

function pickRandom(arr, n) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [store, setStore] = useState(loadStore)
  const [pendingLang, setPendingLang] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeChest, setActiveChest] = useState(null)
  const [completedUnit, setCompletedUnit] = useState(null)
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 })
  const [challengeExercises, setChallengeExercises] = useState([])
  const [duel, setDuel] = useState(null)

  useEffect(() => {
    saveStore(store)
  }, [store])

  // Un lien de défi ouvre directement l'écran d'annonce — au chargement, mais
  // aussi si l'app est DÉJÀ ouverte (cas de la PWA : le clic sur le lien ne
  // change alors que le fragment, sans recharger la page).
  useEffect(() => {
    const handle = () => {
      const incoming = readDuelFromUrl()
      if (!incoming) return
      setDuel(incoming)
      setScreen('duelintro')
      clearDuelFromUrl()
    }
    handle()
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])

  // Langue active → son cours et sa progression.
  const course = getCourse(store.lang)
  const progress = progressOf(store, course)
  // Un défi peut porter sur une langue que l'élève n'a pas commencée : on
  // utilise son cours sans toucher à sa langue active.
  const duelCourse = duel ? getCourse(duel.lang) : null

  /** Met à jour la progression de la langue active. */
  const setProgress = (updater) =>
    setStore((s) => {
      const current = progressOf(s, getCourse(s.lang))
      const next = typeof updater === 'function' ? updater(current) : updater
      return withProgress(s, s.lang, next)
    })

  const unitsWithStatuses = course.units.map((u) => applyStatuses(u, progress.statuses))
  const canChallenge = challengeAvailable(progress)

  /** Bascule vers une langue : déjà commencée → chemin, sinon onboarding court. */
  function pickLanguage(langId) {
    if (store.byLang?.[langId]) {
      setStore((s) => ({ ...s, lang: langId }))
      setScreen('path')
    } else {
      setPendingLang(langId)
      setScreen('onboarding')
    }
  }

  function finishOnboarding({ lang, level, reason, dailyGoalXp }) {
    const langId = lang || store.lang
    setStore((s) => {
      const next = {
        ...s,
        lang: langId,
        profile: s.profile || { reason, dailyGoalXp },
      }
      const langProgress = progressOf(next, getCourse(langId))
      return withProgress(next, langId, { ...langProgress, level })
    })
    setPendingLang(null)
    setScreen('path')
  }

  function startLesson(node) {
    setActiveLesson(node)
    setScreen('lesson')
  }

  function finishLesson(result) {
    const unit = course.unitOfLesson(activeLesson.id)
    const before = isUnitComplete(progress.statuses, unit)
    let np = completeLesson(course, progress, activeLesson.id, { xpGain: XP_PER_LESSON, perfect: result.perfect })
    const justDone = !before && isUnitComplete(np.statuses, unit)
    if (justDone) np = { ...np, gems: (np.gems || 0) + UNIT_BONUS }
    setProgress(np)
    setLastResult(result)
    setCompletedUnit(justDone ? unit : null)
    setScreen('complete')
  }

  function afterLessonComplete() {
    setScreen(completedUnit ? 'unitcomplete' : 'path')
  }

  function startChallenge() {
    setChallengeExercises(pickRandom(course.challengePool(), CHALLENGE.size))
    setScreen('challenge')
  }

  function finishChallenge(result) {
    setLastResult(result)
    const passed = result.correct >= Math.ceil(result.total * 0.6)
    if (passed) setProgress((p) => recordChallenge(p, { xpGain: CHALLENGE.xpGain, gems: CHALLENGE.gems }))
    setScreen('challengecomplete')
  }

  /** Lance un défi sur la langue en cours (le lien sera créé à la fin). */
  function startDuel() {
    setDuel({ lang: course.id, seed: makeSeed(), size: CHALLENGE.size, correct: null, total: null, from: '' })
    setScreen('duelintro')
  }

  function finishDuel(result) {
    setLastResult(result)
    setScreen('duelresult')
  }

  function handleReset() {
    setStore(resetStore())
    setPendingLang(null)
    setScreen('welcome')
  }

  const nextUnitExists = completedUnit
    ? course.units.findIndex((u) => u.id === completedUnit.id) < course.units.length - 1
    : false

  return (
    <div className="min-h-full bg-sand text-ink">
      <JewelDefs />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-0 py-0 sm:px-4 sm:py-8">
        <header className="mb-6 hidden w-full items-center justify-between sm:flex">
          <LogoLockup iconSize={38} />
          <span className="flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            {course.name} · {progress.xp} XP · <GemIcon size={15} /> {progress.gems}
          </span>
        </header>

        <PhoneFrame>
          {screen === 'welcome' && (
            <WelcomeScreen onStart={() => setScreen(hasProfile(store) ? 'path' : 'onboarding')} />
          )}

          {screen === 'onboarding' && (
            <OnboardingScreen hasProfile={hasProfile(store)} presetLang={pendingLang} onFinish={finishOnboarding} />
          )}

          {screen === 'path' && (
            <PathScreen
              course={course}
              units={unitsWithStatuses}
              xp={progress.xp}
              gems={progress.gems}
              streak={progress.streak}
              xpTodayValue={xpToday(progress)}
              dailyGoalXp={store.profile?.dailyGoalXp}
              cheerCount={lessonsDone(course, progress)}
              canChallenge={canChallenge}
              onSelectLesson={startLesson}
              onOpenChest={(node) => {
                setActiveChest(node)
                setScreen('chest')
              }}
              onChallenge={startChallenge}
              onTrophies={() => setScreen('trophies')}
              onFamily={() => setScreen('famille')}
              onLanguages={() => setScreen('langues')}
              onProfile={() => setScreen('profil')}
              avatar={store.profile?.avatar}
            />
          )}

          {screen === 'profil' && (
            <ProfileScreen
              store={store}
              onSave={setStore}
              onDuel={startDuel}
              onBack={() => setScreen('path')}
            />
          )}

          {screen === 'duelintro' && duelCourse && (
            <DuelIntroScreen
              duel={duel}
              course={duelCourse}
              avatar={store.profile?.avatar}
              onStart={() => setScreen('duel')}
              onCancel={() => {
                setDuel(null)
                setScreen('path')
              }}
            />
          )}

          {screen === 'duel' && duelCourse && (
            <LessonScreen
              exercises={seededPick(duelCourse.challengePool(), duel.size, duel.seed)}
              lang={duelCourse.id}
              onExit={() => setScreen('path')}
              onFinish={finishDuel}
            />
          )}

          {screen === 'duelresult' && duelCourse && (
            <DuelResultScreen
              duel={duel}
              course={duelCourse}
              result={lastResult}
              name={store.profile?.name}
              avatar={store.profile?.avatar}
              onDone={() => {
                setDuel(null)
                setScreen('path')
              }}
            />
          )}

          {screen === 'langues' && (
            <LanguagesScreen store={store} onPick={pickLanguage} onBack={() => setScreen('path')} />
          )}

          {screen === 'famille' && (
            <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-8 pb-5 text-center">
              <div className="mb-2 flex items-center gap-3 text-left">
                <button type="button" onClick={() => setScreen('path')} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
                  ←
                </button>
                <h2 className="text-lg font-extrabold">La famille</h2>
              </div>
              <FamilyCarousel />
            </div>
          )}

          {screen === 'lesson' && (
            <LessonScreen
              exercises={course.getExercises(activeLesson?.id)}
              lang={course.id}
              onExit={() => setScreen('path')}
              onFinish={finishLesson}
            />
          )}

          {screen === 'complete' && (
            <LessonCompleteScreen
              correct={lastResult.correct}
              total={lastResult.total}
              xp={XP_PER_LESSON}
              streak={progress.streak}
              cheerCount={lessonsDone(course, progress)}
              courseName={course.name}
              onContinue={afterLessonComplete}
            />
          )}

          {screen === 'chest' && (
            <ChestRewardScreen
              gems={CHEST_GEMS}
              chest={activeChest}
              course={course}
              onContinue={() => {
                setProgress((p) => openChest(course, p, activeChest.id, { gems: CHEST_GEMS }))
                setScreen('path')
              }}
            />
          )}

          {screen === 'unitcomplete' && (
            <UnitCompleteScreen
              unit={completedUnit}
              gems={UNIT_BONUS}
              hasNext={nextUnitExists}
              courseName={course.name}
              onContinue={() => {
                setCompletedUnit(null)
                setScreen('path')
              }}
            />
          )}

          {screen === 'challenge' && (
            <LessonScreen
              exercises={challengeExercises}
              lang={course.id}
              onExit={() => setScreen('path')}
              onFinish={finishChallenge}
            />
          )}

          {screen === 'challengecomplete' && (
            <ChallengeCompleteScreen
              correct={lastResult.correct}
              total={lastResult.total}
              xp={CHALLENGE.xpGain}
              gems={CHALLENGE.gems}
              onContinue={() => setScreen('path')}
            />
          )}

          {screen === 'trophies' && (
            <TrophiesScreen course={course} progress={progress} onBack={() => setScreen('path')} />
          )}
        </PhoneFrame>

        <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 text-sm sm:flex">
          {[
            ['welcome', 'Accueil'],
            ['path', 'Chemin'],
            ['langues', 'Langues'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`rounded-full px-4 py-2 font-bold transition ${
                screen === id ? 'bg-turquoise text-white' : 'border border-line bg-cream text-ink-soft'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="rounded-full border border-line bg-cream px-4 py-2 font-bold text-ink-soft transition hover:text-coral-dark"
            title="Efface la progression sauvegardée"
          >
            ↺ Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
