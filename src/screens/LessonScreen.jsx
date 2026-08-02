import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { FeedbackBar } from '../components/FeedbackBar.jsx'
import { MatchExercise } from '../components/MatchExercise.jsx'
import { EmpruntModal } from '../components/EmpruntModal.jsx'
import { Scene } from '../components/illustrations/Scenes.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { findMember, REFORMULE } from '../components/mascots/Family.jsx'
import { playWord, isProvisional } from '../lib/audio.js'
import { hasVoice } from '../lib/speakerVoice.js'
import { trouverEmprunt } from '../data/emprunts.js'
import { dejaVu, marquerVu } from '../lib/emprunts.js'
import { sfx } from '../lib/sfx.js'

const LETTERS = ['A', 'B', 'C', 'D']
const PRAISES = ['Igerrez !', 'Yelha !', 'Bravo !', 'Excellent !', 'Continue !']

/**
 * Qui pose l'énoncé — la bulle du personnage, au-dessus de la question.
 *
 * On n'annonce pas « untel dit » : on MONTRE la silhouette et le nom, et la
 * question suit. C'est la mise en page de FamilyCheer (écran du chemin),
 * réduite à la hauteur d'un exercice pour ne pas manger l'écran.
 */
function QuiParle({ member }) {
  if (!member) return null
  return (
    <div className="animate-rise mb-2 flex items-center gap-2">
      <div className="fam-anim flex-none" aria-hidden="true">
        <member.Comp height={44} />
      </div>
      <span className="text-[11px] font-extrabold text-turquoise-deep">{member.name}</span>
    </div>
  )
}

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
 * D'où vient le son qu'on vient d'entendre. Une contribution enregistrée par
 * un locuteur est signalée comme telle — c'est une vraie voix humaine, pas la
 * voix de l'app ; la synthèse est signalée comme provisoire ; l'enregistrement
 * natif, lui, ne dit rien — c'est la référence attendue.
 */
function AudioBadge({ mode }) {
  if (mode === 'contrib')
    return (
      <span className="rounded-full bg-turquoise/15 px-1.5 py-0.5 text-[9px] font-bold text-turquoise-deep">
        voix d’un locuteur
      </span>
    )
  if (isProvisional(mode))
    return (
      <span
        className="rounded-full bg-sand-2 px-1.5 py-0.5 text-[9px] font-bold text-ink-soft"
        title="Voix de synthèse — enregistrement natif à venir"
      >
        voix provisoire
      </span>
    )
  return null
}

/**
 * Moteur de leçon — gère QCM, « écoute » (audio d'abord) et « associe ».
 * Animations d'encouragement : éloge flottant, combo, cœur qui tremble.
 */
export function LessonScreen({ exercises, lang, onExit, onFinish }) {
  const total = exercises.length
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  // Les cœurs restent (choix de Selim). Ils sont DÉCORATIFS et doivent le
  // rester : rien ne se passe à zéro, la leçon continue. C'est ce qui les rend
  // compatibles avec la règle de data/economy.js — « aucune de ces valeurs ne
  // doit servir à INTERROMPRE une session en cours ». Ne jamais les brancher
  // sur une interruption, un mur ou un achat : ce serait enfreindre la règle,
  // pas l'étendre.
  const [hearts, setHearts] = useState(5)
  // Ce qu'on compte VRAIMENT pour l'apprentissage, à côté : les mots ratés,
  // qui reviennent au quiz de fin de leçon.
  const [aRevoir, setARevoir] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [pulse, setPulse] = useState(0)
  const [praise, setPraise] = useState(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [audioMode, setAudioMode] = useState(null)
  const [emprunt, setEmprunt] = useState(null)

  const ex = exercises[index]
  const isMatch = ex.type === 'match'
  const isImage = ex.type === 'image' || ex.type === 'culture' // même rendu : énoncé + illustration facultative + choix
  const isSentence = ex.type === 'sentence'
  const isListen = ex.type === 'listen'
  const audioFirst = isListen || isSentence // audio d'abord, texte révélé après
  const isLast = index === total - 1
  // Le mot amazigh de l'exercice : c'est `word`, sauf en fr→kab où l'énoncé
  // est français et où le mot à prononcer est la réponse.
  const motAmazigh = ex.kind === 'fr-to-kab' ? ex.answer : ex.word
  // Sur un exercice « image », l'énoncé est un dessin : le mot amazigh est la
  // bonne réponse. Ailleurs, `motAmazigh` suffit — et les questions de
  // culture, dont les deux faces sont françaises, ne matchent rien.
  const motDeLExercice = ex.type === 'image' ? ex.answer : motAmazigh
  // Une contribution rend audible un mot qui ne l'était pas : c'est ainsi que
  // les langues sans aucun enregistrement natif gagnent du son. On ne dévoile
  // jamais la réponse avant l'heure (fr→kab : après validation).
  const contribution = motAmazigh ? hasVoice(lang, motAmazigh) : false
  const montreSon =
    ex.audio || (answered && ex.kind === 'fr-to-kab') || (contribution && ex.kind !== 'fr-to-kab')
  const isCorrect = answered && (isMatch || selected === ex.answer)
  const progress = answered ? ((index + 1) / total) * 100 : (index / total) * 100
  // Qui porte cet énoncé. Le quiz de fin rejoue des exercices d'autres leçons :
  // le personnage vient avec, c'est même ce qui fait qu'on le reconnaît.
  const quiParle = findMember(ex.qui)

  // Auto-lecture pour les exercices « écoute ».
  useEffect(() => {
    if (audioFirst) playWord(ex.word, lang).then(setAudioMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function praiseFor(n) {
    if (n >= 3) return `En feu ! ×${n} 🔥`
    if (n === 2) return 'Combo ×2 ! 🔥'
    // Quand quelqu'un a posé la question, c'est lui qui félicite : un éloge
    // anonyme ne construit personne, celui d'un personnage qu'on retrouve si.
    if (quiParle) return quiParle.cheers[(index + n) % quiParle.cheers.length]
    return PRAISES[Math.floor((index + n) % PRAISES.length)]
  }
  function markCorrect() {
    const nextCombo = combo + 1
    setCombo(nextCombo)
    setCorrectCount((c) => c + 1)
    setPraise({ text: praiseFor(nextCombo), key: Date.now() })
    if (nextCombo >= 2) sfx.combo(nextCombo)
    else sfx.correct()
    // « boing » du saut d'Akermus + de l'éloge qui s'envole
    sfx.pop(0.3)
  }
  function markWrong() {
    setCombo(0)
    setHearts((h) => Math.max(0, h - 1))
    setARevoir((n) => n + 1)
    setShakeKey((k) => k + 1)
    sfx.wrong()
  }

  /**
   * La modale « ce mot vient de l'arabe » — demandée par Selim.
   *
   * Elle ne s'ouvre qu'APRÈS une bonne réponse : c'est un cadeau de fin de
   * question, pas un avertissement. Une fois par mot et par langue (voir
   * lib/emprunts.js), et jamais sur un exercice « associe » — une grille
   * porte plusieurs paires, on n'empile pas trois explications d'un coup.
   */
  function montrerEmprunt() {
    if (!motDeLExercice) return
    const e = trouverEmprunt(lang, motDeLExercice)
    if (!e || dejaVu(lang, e.mot)) return
    marquerVu(lang, e.mot)
    setEmprunt(e)
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
    // fr→kab : le mot affiché est français — on prononce la réponse amazighe.
    playWord(motAmazigh, lang).then(setAudioMode)
  }

  function goNext() {
    if (isLast) {
      onFinish?.({ correct: correctCount, total, hearts, aRevoir, perfect: correctCount === total })
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
    setAudioMode(null)
    setPraise(null)
    setEmprunt(null)
  }

  function handleAction() {
    if (!answered) {
      if (isMatch) return
      if (selected === ex.answer) {
        markCorrect()
        montrerEmprunt()
      } else markWrong()
      setAnswered(true)
      // fr→kab : on fait entendre la bonne réponse en kabyle.
      if (!ex.audio && ex.kind === 'fr-to-kab') playWord(ex.answer, lang).then(setAudioMode)
      return
    }
    goNext()
  }

  const actionLabel = !answered ? (isMatch ? 'Associe les paires' : 'Vérifier') : isLast ? 'Terminer' : 'Continuer'
  const actionDisabled = !answered && (isMatch || !selected)

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-2">
        <button type="button" onClick={onExit} aria-label="Quitter la leçon" className="text-xl font-extrabold text-ink-soft">
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-sand-2">
          <div className="h-full rounded-full bg-turquoise transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        {/* Les cœurs, et à côté le nombre de mots à revoir — celui-ci ne
            s'affiche que s'il y a quelque chose à revoir, et en encre douce :
            il informe, il ne menace pas. Ces mots-là reviendront au quiz de
            fin de leçon. */}
        <div key={shakeKey} className={`flex items-center gap-2 ${shakeKey ? 'animate-shake' : ''}`}>
          {aRevoir > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-ink-soft">
              <span aria-hidden="true">↺</span> {aRevoir}
            </span>
          )}
          <span className="flex items-center gap-1 text-sm font-extrabold text-coral">
            <span aria-hidden="true">♥</span> {hearts}
          </span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pt-4">
        {/* La bulle s'élargit quand c'est un personnage qui félicite : ses
            répliques sont des phrases, pas des interjections — « nowrap » les
            ferait déborder de l'écran. */}
        {answered && isCorrect && praise && (
          <div
            key={praise.key}
            className={`animate-float-up pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-2xl bg-turquoise px-3 py-1 text-center text-sm font-extrabold text-white shadow-lg ${
              quiParle ? 'max-w-[80%] text-[12.5px] leading-snug' : 'whitespace-nowrap'
            }`}
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

        {/* Le quiz de fin de leçon : 3 questions de révision, signalées pour
            ce qu'elles sont — on revoit, on ne découvre pas. */}
        {ex.quizFin && (
          <span className="animate-rise mb-1.5 self-start rounded-full bg-coral/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-coral-dark">
            Quiz de fin de leçon — on révise !
          </span>
        )}
        <QuiParle member={quiParle} />
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
                  {montreSon && <SpeakerButton onPlay={handlePlay} big={audioFirst} />}
                  {!audioFirst && (
                    <div>
                      <div key={pulse} className="animate-pop text-[17px] font-extrabold">
                        {ex.word}
                      </div>
                      {montreSon && (
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-ink-soft">
                          {ex.kind === 'fr-to-kab' ? `▶ écouter « ${ex.answer} »` : '▶ écouter la prononciation'}
                          <AudioBadge mode={audioMode} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {audioFirst && (
                  <div className="mt-1.5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-ink-soft">
                    {answered ? `« ${ex.word} »` : isSentence ? 'écoute la phrase, puis choisis' : 'appuie pour réécouter'}
                    <AudioBadge mode={audioMode} />
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
        {answered && !isMatch && (
          <FeedbackBar
            correct={isCorrect}
            word={ex.word}
            answer={ex.answer}
            reformule={quiParle ? REFORMULE[quiParle.id] : null}
          />
        )}
        <Button variant={answered && !isCorrect ? 'coral' : 'primary'} disabled={actionDisabled} onClick={handleAction}>
          {actionLabel}
        </Button>
      </div>

      <EmpruntModal emprunt={emprunt} onClose={() => setEmprunt(null)} />
    </div>
  )
}
