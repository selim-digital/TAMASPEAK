import { useState, useEffect } from 'react'
import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { PathScreen } from './screens/PathScreen.jsx'
import { LessonScreen } from './screens/LessonScreen.jsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { unit1 } from './data/unit1.js'
import { getExercises } from './data/lessons.js'
import { loadProgress, saveProgress, resetProgress, applyStatuses, recordCompletion } from './lib/progress.js'

const XP_PER_LESSON = 20

/**
 * App shell for the MVP — screen router:
 * Welcome → Path → Lesson → Complete → (back to Path, progress updated).
 * Progression is persisted locally (Phase 4, étape 1). Supabase auth
 * remplacera cette couche ensuite.
 */
export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [progress, setProgress] = useState(loadProgress)
  const [activeLesson, setActiveLesson] = useState(null)
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 })

  // Sauvegarde à chaque changement de progression.
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const unit = applyStatuses(unit1, progress.statuses)

  function startLesson(node) {
    setActiveLesson(node)
    setScreen('lesson')
  }

  function finishLesson(result) {
    setLastResult(result)
    setProgress((p) => recordCompletion(p, activeLesson.id, { xpGain: XP_PER_LESSON }))
    setScreen('complete')
  }

  function handleReset() {
    setProgress(resetProgress())
    setScreen('welcome')
  }

  return (
    <div className="min-h-full bg-sand text-ink">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8">
        <header className="mb-6 flex w-full items-center justify-between">
          <LogoLockup iconSize={38} />
          <span className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            MVP · {progress.xp} XP · série {progress.streak}
          </span>
        </header>

        <PhoneFrame>
          {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('path')} />}

          {screen === 'path' && (
            <PathScreen unit={unit} onSelectLesson={startLesson} xp={progress.xp} streak={progress.streak} hearts={5} />
          )}

          {screen === 'lesson' && (
            <LessonScreen
              exercises={getExercises(activeLesson?.id)}
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
              onContinue={() => setScreen('path')}
            />
          )}
        </PhoneFrame>

        {/* Dev navigation (temporaire) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
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
