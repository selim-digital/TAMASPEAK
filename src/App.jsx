import { useState } from 'react'
import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { PathScreen } from './screens/PathScreen.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { unit1 } from './data/unit1.js'

/**
 * App shell for the MVP. Simple screen router (Welcome → Path → …).
 * The lesson engine (exercises) is the next brick — selecting the
 * active lesson is stubbed for now.
 */
export default function App() {
  const [screen, setScreen] = useState('welcome')

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
          {screen === 'path' && (
            <PathScreen
              unit={unit1}
              onSelectLesson={(lesson) =>
                alert(`Leçon « ${lesson.title} » — prochaine brique : le moteur d'exercices, in shā'a Llāh.`)
              }
            />
          )}
        </PhoneFrame>

        {/* Dev navigation (temporaire) */}
        <div className="mt-5 flex items-center gap-2 text-sm">
          <button
            onClick={() => setScreen('welcome')}
            className={`rounded-full px-4 py-2 font-bold transition ${
              screen === 'welcome' ? 'bg-turquoise text-white' : 'bg-cream border border-line text-ink-soft'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => setScreen('path')}
            className={`rounded-full px-4 py-2 font-bold transition ${
              screen === 'path' ? 'bg-turquoise text-white' : 'bg-cream border border-line text-ink-soft'
            }`}
          >
            Chemin
          </button>
        </div>
      </div>
    </div>
  )
}
