import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { FeedbackBar } from '../components/FeedbackBar.jsx'
import { playWord, isProvisional } from '../lib/audio.js'

const LETTERS = ['A', 'B', 'C', 'D']
const PRAISES = ['Igerrez !', 'Yelha !', 'Bravo !', 'Excellent !', 'Continue !']

/** Small speaker button — visual pulse only (real audio arrives in Phase 2). */
function SpeakerButton({ onPlay }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label="Écouter la prononciation"
      className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-turquoise-dark text-white transition-transform active:scale-90"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        <path d="M16 8c1.5 1.2 1.5 6.8 0 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/**
 * Screen 3 — Moteur de leçon (boucle d'exercices) + animations
 * d'encouragement : éloge flottant, combo, cœur qui tremble.
 */
export function LessonScreen({ exercises, onExit, onFinish }) {
  const total = exercises.length
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [pulse, setPulse] = useState(0)
  const [praise, setPraise] = useState(null) // { text, key }
  const [shakeKey, setShakeKey] = useState(0)
  const [audioMode, setAudioMode] = useState(null) // 'file' | 'tts' | 'none'

  const ex = exercises[index]
  const isLast = index === total - 1
  const isCorrect = answered && selected === ex.answer
  const progress = answered ? ((index + 1) / total) * 100 : (index / total) * 100

  function choiceState(choice) {
    if (!answered) return selected === choice ? 'selected' : 'idle'
    if (choice === ex.answer) return 'correct'
    if (choice === selected) return 'wrong'
    return 'dim'
  }

  function praiseFor(n) {
    if (n >= 3) return `En feu ! ×${n} 🔥`
    if (n === 2) return 'Combo ×2 ! 🔥'
    return PRAISES[Math.floor((index + n) % PRAISES.length)]
  }

  function handleAction() {
    if (!answered) {
      const ok = selected === ex.answer
      setAnswered(true)
      if (ok) {
        const nextCombo = combo + 1
        setCombo(nextCombo)
        setCorrectCount((c) => c + 1)
        setPraise({ text: praiseFor(nextCombo), key: Date.now() })
      } else {
        setCombo(0)
        setHearts((h) => Math.max(0, h - 1))
        setShakeKey((k) => k + 1)
      }
      return
    }
    if (isLast) {
      onFinish?.({ correct: correctCount, total, hearts })
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
    setAudioMode(null)
  }

  function handlePlay() {
    setPulse((p) => p + 1)
    playWord(ex.word).then(setAudioMode)
  }

  return (
    <div className="animate-enter flex flex-1 flex-col bg-cream">
      {/* Top: close, progress, hearts */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-2">
        <button type="button" onClick={onExit} aria-label="Quitter la leçon" className="text-xl font-extrabold text-ink-soft">
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-sand-2">
          <div className="h-full rounded-full bg-turquoise transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div key={shakeKey} className={`flex items-center gap-1 text-sm font-extrabold text-coral ${shakeKey ? 'animate-shake' : ''}`}>
          <span aria-hidden="true">♥</span> {hearts}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col overflow-y-auto px-4 pt-4">
        {/* Floating praise on correct answers */}
        {answered && isCorrect && praise && (
          <div
            key={praise.key}
            className="animate-float-up pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-turquoise px-3 py-1 text-sm font-extrabold text-white shadow-lg"
          >
            {praise.text}
          </div>
        )}

        <h2 className="text-[18px] font-extrabold tracking-tight">{ex.prompt}</h2>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-line bg-sand p-3.5">
          {ex.audio && <SpeakerButton onPlay={handlePlay} />}
          <div>
            <div key={pulse} className={ex.audio ? 'animate-pop text-[17px] font-extrabold' : 'text-[17px] font-extrabold'}>
              {ex.word}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-ink-soft">
              {ex.audio ? '▶ écouter la prononciation' : 'traduis en kabyle'}
              {isProvisional(audioMode) && (
                <span className="rounded-full bg-sand-2 px-1.5 py-0.5 text-[9px] font-bold text-ink-soft" title="Voix de synthèse — enregistrement natif à venir">
                  voix provisoire
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2.5 pb-2">
          {ex.choices.map((choice, i) => (
            <ExerciseChoice
              key={choice}
              letter={LETTERS[i]}
              text={choice}
              state={choiceState(choice)}
              disabled={answered}
              onClick={() => setSelected(choice)}
            />
          ))}
        </div>
      </div>

      {/* Footer: feedback (in flow) + action button — never overlap */}
      <div className="flex flex-col gap-3 px-4 pb-5 pt-3">
        {answered && <FeedbackBar correct={isCorrect} word={ex.word} answer={ex.answer} />}
        <Button variant={answered && !isCorrect ? 'coral' : 'primary'} disabled={!answered && !selected} onClick={handleAction}>
          {!answered ? 'Vérifier' : isLast ? 'Terminer' : 'Continuer'}
        </Button>
      </div>
    </div>
  )
}
