import { useState } from 'react'
import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { PathScreen } from './screens/PathScreen.jsx'
import { LessonScreen } from './screens/LessonScreen.jsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { unit1, completeLesson } from './data/unit1.js'
import { getExercises } from './data/lessons.js'

/**
 * App shell for the MVP — screen router:
 * Welcome → Path → Lesson → Complete → (back to Path, progress updated).
 * Progression is kept in local state for now; persistence (Supabase)
 * comes in Phase 4.
 */
export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [unit, setUnit] = useState(unit1)
  const [activeLesson, setActiveLesson] = useState(null)
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 })

  function startLesson(node) {
    setActiveLesson(node)
    setScreen('lesson')
  }

  function finishLesson(result) {
    setLastResult(result)
    setUnit((u) => completeLesson(u, activeLesson.id))
    setScreen('complete')
  }

  return (
    <div className="min-h-full bg-sand text-ink">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8">
        <header className="mb-6 flex w-full items-center justify-between">
          <LogoLockup iconSize={38} />
          <span className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            MVP · en construction
          </span>
        </header>

        <PhoneFrame>
          {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('path')} />}

          {screen === 'path' && <PathScreen unit={unit} onSelectLesson={startLesson} />}

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
              onContinue={() => setScreen('path')}
            />
          )}
        </PhoneFrame>

        {/* Dev navigation (temporaire) */}
        <div className="mt-5 flex items-center gap-2 text-sm">
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
        </div>
      </div>
    </div>
  )
}
