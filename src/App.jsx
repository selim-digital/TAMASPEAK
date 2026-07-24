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
import { FamilyCarousel } from './components/mascots/FamilyCarousel.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { JewelDefs } from './components/jewels/JewelDefs.jsx'
import { GemIcon } from './components/jewels/StatIcons.jsx'
import { units, unitOfLesson, isUnitComplete } from './data/units.js'
import { getExercises, challengePool } from './data/lessons.js'
import {
  loadProgress,
  saveProgress,
  resetProgress,
  applyStatuses,
  completeLesson,
  openChest,
  recordChallenge,
  challengeAvailable,
  setProfile,
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
  const [progress, setProgress] = useState(loadProgress)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeChest, setActiveChest] = useState(null)
  const [completedUnit, setCompletedUnit] = useState(null)
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 })
  const [challengeExercises, setChallengeExercises] = useState([])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const unitsWithStatuses = units.map((u) => applyStatuses(u, progress.statuses))
  const canChallenge = challengeAvailable(progress)

  function startLesson(node) {
    setActiveLesson(node)
    setScreen('lesson')
  }

  function finishLesson(result) {
    const unit = unitOfLesson(activeLesson.id)
    const before = isUnitComplete(progress.statuses, unit)
    let np = completeLesson(progress, activeLesson.id, { xpGain: XP_PER_LESSON, perfect: result.perfect })
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
    setChallengeExercises(pickRandom(challengePool(), CHALLENGE.size))
    setScreen('challenge')
  }

  function finishChallenge(result) {
    setLastResult(result)
    const passed = result.correct >= Math.ceil(result.total * 0.6)
    if (passed) setProgress((p) => recordChallenge(p, { xpGain: CHALLENGE.xpGain, gems: CHALLENGE.gems }))
    setScreen('challengecomplete')
  }

  function handleReset() {
    setProgress(resetProgress())
    setScreen('welcome')
  }

  const nextUnitExists = completedUnit ? units.findIndex((u) => u.id === completedUnit.id) < units.length - 1 : false

  return (
    <div className="min-h-full bg-sand text-ink">
      <JewelDefs />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-0 py-0 sm:px-4 sm:py-8">
        <header className="mb-6 hidden w-full items-center justify-between sm:flex">
          <LogoLockup iconSize={38} />
          <span className="flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            {progress.xp} XP · <GemIcon size={15} /> {progress.gems}
          </span>
        </header>

        <PhoneFrame>
          {screen === 'welcome' && (
            <WelcomeScreen onStart={() => setScreen(progress.profile ? 'path' : 'onboarding')} />
          )}

          {screen === 'onboarding' && (
            <OnboardingScreen
              onFinish={(profile) => {
                setProgress((p) => setProfile(p, profile))
                setScreen('path')
              }}
            />
          )}

          {screen === 'path' && (
            <PathScreen
              units={unitsWithStatuses}
              xp={progress.xp}
              gems={progress.gems}
              streak={progress.streak}
              xpTodayValue={xpToday(progress)}
              dailyGoalXp={progress.profile?.dailyGoalXp}
              cheerCount={lessonsDone(progress)}
              canChallenge={canChallenge}
              onSelectLesson={startLesson}
              onOpenChest={(node) => {
                setActiveChest(node)
                setScreen('chest')
              }}
              onChallenge={startChallenge}
              onTrophies={() => setScreen('trophies')}
              onFamily={() => setScreen('famille')}
            />
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
            <LessonScreen exercises={getExercises(activeLesson?.id)} onExit={() => setScreen('path')} onFinish={finishLesson} />
          )}

          {screen === 'complete' && (
            <LessonCompleteScreen
              correct={lastResult.correct}
              total={lastResult.total}
              xp={XP_PER_LESSON}
              streak={progress.streak}
              cheerCount={lessonsDone(progress)}
              onContinue={afterLessonComplete}
            />
          )}

          {screen === 'chest' && (
            <ChestRewardScreen
              gems={CHEST_GEMS}
              chest={activeChest}
              onContinue={() => {
                setProgress((p) => openChest(p, activeChest.id, { gems: CHEST_GEMS }))
                setScreen('path')
              }}
            />
          )}

          {screen === 'unitcomplete' && (
            <UnitCompleteScreen
              unit={completedUnit}
              gems={UNIT_BONUS}
              hasNext={nextUnitExists}
              onContinue={() => {
                setCompletedUnit(null)
                setScreen('path')
              }}
            />
          )}

          {screen === 'challenge' && (
            <LessonScreen exercises={challengeExercises} onExit={() => setScreen('path')} onFinish={finishChallenge} />
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

          {screen === 'trophies' && <TrophiesScreen progress={progress} onBack={() => setScreen('path')} />}
        </PhoneFrame>

        <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 text-sm sm:flex">
          {[
            ['welcome', 'Accueil'],
            ['path', 'Chemin'],
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
