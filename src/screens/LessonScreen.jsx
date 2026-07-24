import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { FeedbackBar } from '../components/FeedbackBar.jsx'
import { MatchExercise } from '../components/MatchExercise.jsx'
import { Scene } from '../components/illustrations/Scenes.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { playWord, isProvisional } from '../lib/audio.js'
import { sfx } from '../lib/sfx.js'

const LETTERS = ['A', 'B', 'C', 'D']
const PRAISES = ['Igerrez !', 'Yelha !', 'Bravo !', 'Excellent !', 'Continue !']

function SpeakerButton({ onPlay, big }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label="Écouter la prononciation"
      className={`grid flex-none place-items-center rounded-xl bg-turquoise-dark text-white transition-transform active:scale-90 ${big ? 'h-16 w-16' : 'h-11 w-11'}`}
    >
      <svg width={big ? 28 : 20} height={big ? 28 : 20} viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        <path d="M16 8c1.5 1.2 1.5 6.8 0 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/**
 * Moteur de leçon — gère QCM, « écoute » (audio d'abord) et « associe ».
 * Animations d'encouragement : éloge flottant, combo, cœur qui tremble.
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
  const [praise, setPraise] = useState(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [audioMode, setAudioMode] = useState(null)

  const ex = exercises[index]
  const isMatch = ex.type === 'match'
  const isImage = ex.type === 'image' || ex.type === 'culture' // même rendu : énoncé + illustration facultative + choix
  const isSentence = ex.type === 'sentence'
  const isListen = ex.type === 'listen'
  const audioFirst = isListen || isSentence // audio d'abord, texte révélé après
  const isLast = index === total - 1
  const isCorrect = answered && (isMatch || selected === ex.answer)
  const progress = answered ? ((index + 1) / total) * 100 : (index / total) * 100

  // Auto-lecture pour les exercices « écoute ».
  useEffect(() => {
    if (audioFirst) playWord(ex.word).then(setAudioMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function praiseFor(n) {
    if (n >= 3) return `En feu ! ×${n} 🔥`
    if (n === 2) return 'Combo ×2 ! 🔥'
    return PRAISES[Math.floor((index + n) % PRAISES.length)]
  }
  function markCorrect() {
    const nextCombo = combo + 1
    setCombo(nextCombo)
    setCorrectCount((c) => c + 1)
    setPraise({ text: praiseFor(nextCombo), key: Date.now() })
    if (nextCombo >= 2) sfx.combo(nextCombo)
    else sfx.correct()
  }
  function markWrong() {
    setCombo(0)
    setHearts((h) => Math.max(0, h - 1))
    setShakeKey((k) => k + 1)
    sfx.wrong()
  }

  function choiceState(choice) {
    if (!answered) return selected === choice ? 'selected' : 'idle'
    if (choice === ex.answer) return 'correct'
    if (choice === selected) return 'wrong'
    return 'dim'
  }

  function onMatchComplete() {
    if (answered) return
    markCorrect()
    setAnswered(true)
  }

  function handlePlay() {
    setPulse((p) => p + 1)
    // fr→kab : le mot affiché est français — on prononce la réponse kabyle.
    playWord(ex.audio ? ex.word : ex.answer).then(setAudioMode)
  }

  function goNext() {
    if (isLast) {
      onFinish?.({ correct: correctCount, total, hearts, perfect: correctCount === total })
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
    setAudioMode(null)
    setPraise(null)
  }

  function handleAction() {
    if (!answered) {
      if (isMatch) return
      if (selected === ex.answer) markCorrect()
      else markWrong()
      setAnswered(true)
      // fr→kab : on fait entendre la bonne réponse en kabyle.
      if (!ex.audio && ex.kind === 'fr-to-kab') playWord(ex.answer).then(setAudioMode)
      return
    }
    goNext()
  }

  const actionLabel = !answered ? (isMatch ? 'Associe les paires' : 'Vérifier') : isLast ? 'Terminer' : 'Continuer'
  const actionDisabled = !answered && (isMatch || !selected)

  return (
    <div className="animate-enter flex flex-1 flex-col bg-cream">
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

      <div className="relative flex flex-1 flex-col overflow-y-auto px-4 pt-4">
        {answered && isCorrect && praise && (
          <div
            key={praise.key}
            className="animate-float-up pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-turquoise px-3 py-1 text-sm font-extrabold text-white shadow-lg"
          >
            {praise.text}
          </div>
        )}

        {/* Akermus vit la leçon : curieux à l'écoute, il exulte ou console.
            Placé derrière les cartes (elles sont `relative`, déclarées après lui). */}
        <div className="pointer-events-none absolute right-1 top-0" aria-hidden="true">
          <Akermus
            key={`${index}-${answered ? (isCorrect ? 'c' : 'w') : 'q'}`}
            height={78}
            state={answered ? (isCorrect ? 'celebrate' : 'console') : audioFirst ? 'curious' : 'idle'}
          />
        </div>

        <h2 className="pr-16 text-[18px] font-extrabold tracking-tight">{ex.prompt}</h2>

        {isMatch ? (
          <MatchExercise key={index} pairs={ex.pairs} onComplete={onMatchComplete} />
        ) : (
          <>
            {isImage ? (
              ex.scene ? (
                <div className="animate-pop-in relative mx-auto mt-4 w-full max-w-[230px] overflow-hidden rounded-2xl border-2 border-line shadow-sm">
                  <Scene id={ex.scene} />
                </div>
              ) : (
                <div className="mt-3" />
              )
            ) : (
              <>
                <div className={`relative mt-4 flex items-center gap-3 rounded-2xl border-2 border-line bg-sand p-3.5 ${audioFirst ? 'justify-center' : ''}`}>
                  {(ex.audio || (answered && ex.kind === 'fr-to-kab')) && <SpeakerButton onPlay={handlePlay} big={audioFirst} />}
                  {!audioFirst && (
                    <div>
                      <div key={pulse} className="animate-pop text-[17px] font-extrabold">
                        {ex.word}
                      </div>
                      {(ex.audio || (answered && ex.kind === 'fr-to-kab')) && (
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-ink-soft">
                          {ex.audio ? '▶ écouter la prononciation' : `▶ écouter « ${ex.answer} »`}
                          {isProvisional(audioMode) && (
                            <span className="rounded-full bg-sand-2 px-1.5 py-0.5 text-[9px] font-bold text-ink-soft" title="Voix de synthèse — enregistrement natif à venir">
                              voix provisoire
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {audioFirst && (
                  <div className="mt-1.5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-ink-soft">
                    {answered ? `« ${ex.word} »` : isSentence ? 'écoute la phrase, puis choisis' : 'appuie pour réécouter'}
                    {isProvisional(audioMode) && (
                      <span className="rounded-full bg-sand-2 px-1.5 py-0.5 text-[9px] font-bold text-ink-soft">voix provisoire</span>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="mt-3 flex flex-col gap-2.5 pb-2">
              {ex.choices.map((choice, i) => (
                <div key={`${index}-${i}`} className={choiceState(choice) === 'correct' ? 'animate-spring-pick' : ''}>
                  <ExerciseChoice
                    letter={LETTERS[i]}
                    text={choice}
                    state={choiceState(choice)}
                    disabled={answered}
                    onClick={() => setSelected(choice)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-5 pt-3">
        {answered && !isMatch && <FeedbackBar correct={isCorrect} word={ex.word} answer={ex.answer} />}
        <Button variant={answered && !isCorrect ? 'coral' : 'primary'} disabled={actionDisabled} onClick={handleAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}
