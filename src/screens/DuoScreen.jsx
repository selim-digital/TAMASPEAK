import { useEffect, useState } from 'react'
import { Avatar, AVATARS } from '../components/Avatar.jsx'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { Scene } from '../components/illustrations/Scenes.jsx'
import { seededPick, makeSeed } from '../lib/challenge.js'
import { playWord } from '../lib/audio.js'
import { sfx } from '../lib/sfx.js'

const LETTERS = ['A', 'B', 'C', 'D']
const TOURS = 6 // pair : chacun joue autant de fois

/** Les deux joueurs ont chacun leur couleur, pour ne jamais se tromper de tour. */
const COULEURS = [
  { nom: 'turquoise', bg: 'var(--color-turquoise)', ombre: 'var(--color-turquoise-dark)' },
  { nom: 'coral', bg: 'var(--color-coral)', ombre: 'var(--color-coral-dark)' },
]

function ChoixAvatar({ valeur, onChange, exclu }) {
  return (
    <div className="mt-1 flex gap-1.5 overflow-x-auto pb-1">
      {AVATARS.filter((a) => a.id !== exclu).map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => {
            onChange(a.id)
            sfx.click()
          }}
          aria-label={a.name}
          className={`flex-none rounded-full border-2 transition ${
            valeur === a.id ? 'border-turquoise' : 'border-transparent'
          }`}
        >
          <Avatar id={a.id} size={40} className="border-0" />
        </button>
      ))}
    </div>
  )
}

/**
 * « À deux » — deux personnes apprennent sur le même téléphone, en alternant
 * question par question.
 *
 * C'est la seule chose que Duolingo ne peut pas faire : son offre famille
 * n'est qu'une facture partagée, chacun jouant seul de son côté. Ici, un
 * parent et son enfant, ou deux frères, se passent l'appareil — et c'est
 * exactement la situation de transmission qu'on cherche à provoquer.
 *
 * La série est figée par une graine partagée (`seededPick`) : les deux
 * joueurs répondent aux mêmes questions, dans le même ordre, donc le score
 * veut dire quelque chose.
 *
 * Ni cœurs ni vies : perdre son tour parce qu'on s'est trompé ferait
 * exactement l'inverse de ce qu'on veut quand un enfant joue contre son père.
 */
export function DuoScreen({ course, joueurParDefaut, onBack }) {
  const [phase, setPhase] = useState('setup')
  const [joueurs, setJoueurs] = useState([
    { nom: joueurParDefaut?.name || '', avatar: joueurParDefaut?.avatar || 'akermus', score: 0 },
    { nom: '', avatar: 'yemma', score: 0 },
  ])
  const [exercices, setExercices] = useState([])
  const [index, setIndex] = useState(0)
  const [choisi, setChoisi] = useState(null)
  const [repondu, setRepondu] = useState(false)

  const tour = index % 2 // 0 = joueur A, 1 = joueur B
  const ex = exercices[index]
  const couleur = COULEURS[tour]

  // Les exercices « écoute » se jouent d'abord à l'oreille.
  useEffect(() => {
    if (phase === 'play' && ex?.audio) playWord(ex.word, course.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase])

  function majJoueur(i, champ, valeur) {
    setJoueurs((j) => j.map((p, k) => (k === i ? { ...p, [champ]: valeur } : p)))
  }

  function lancer() {
    const pool = course.challengePool()
    setExercices(seededPick(pool, TOURS, makeSeed()))
    setJoueurs((j) => j.map((p) => ({ ...p, score: 0 })))
    setIndex(0)
    setChoisi(null)
    setRepondu(false)
    setPhase('play')
    sfx.hello()
  }

  function valider() {
    if (repondu || choisi === null) return
    const juste = choisi === ex.answer
    setRepondu(true)
    if (juste) {
      setJoueurs((j) => j.map((p, k) => (k === tour ? { ...p, score: p.score + 1 } : p)))
      sfx.correct()
      sfx.pop(0.3)
    } else {
      sfx.wrong()
    }
  }

  function suivant() {
    if (index === exercices.length - 1) {
      setPhase('result')
      sfx.complete()
      return
    }
    setIndex((i) => i + 1)
    setChoisi(null)
    setRepondu(false)
  }

  const etatChoix = (c) => {
    if (!repondu) return choisi === c ? 'selected' : 'idle'
    if (c === ex.answer) return 'correct'
    if (c === choisi) return 'wrong'
    return 'dim'
  }

  const nomDe = (i) => joueurs[i].nom.trim() || (i === 0 ? 'Joueur 1' : 'Joueur 2')

  /* ---------------------------------------------------------------- */
  /* Mise en place                                                     */
  /* ---------------------------------------------------------------- */
  if (phase === 'setup') {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        <div className="flex items-center gap-3 px-4 pt-8 pb-1">
          <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
            ←
          </button>
          <h2 className="text-lg font-extrabold">À deux</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
          <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
            <Akermus height={64} state="curious" className="flex-none" />
            <p className="text-[11.5px] leading-snug text-ink">
              Un seul téléphone, deux joueurs : vous répondez chacun votre tour, aux{' '}
              <strong>mêmes {TOURS} questions</strong>.
              <span className="mt-1 block text-ink-soft">
                Pas de cœurs, pas de vies. Se tromper ne fait perdre que le point.
              </span>
            </p>
          </div>

          {joueurs.map((p, i) => (
            <div
              key={i}
              className="mt-4 rounded-2xl border-2 px-3.5 py-3"
              style={{ borderColor: COULEURS[i].bg }}
            >
              <div className="flex items-center gap-2.5">
                <Avatar id={p.avatar} size={44} />
                <div className="flex-1">
                  <label
                    htmlFor={`joueur-${i}`}
                    className="text-[10px] font-extrabold uppercase tracking-wide"
                    style={{ color: COULEURS[i].bg }}
                  >
                    Joueur {i + 1}
                  </label>
                  <input
                    id={`joueur-${i}`}
                    value={p.nom}
                    onChange={(e) => majJoueur(i, 'nom', e.target.value.slice(0, 16))}
                    placeholder={i === 0 ? 'Ton prénom' : 'Son prénom'}
                    className="mt-0.5 w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-[14px] font-bold outline-none focus:border-turquoise"
                  />
                </div>
              </div>
              <ChoixAvatar
                valeur={p.avatar}
                exclu={joueurs[1 - i].avatar}
                onChange={(v) => majJoueur(i, 'avatar', v)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={lancer}
            className="mt-5 w-full rounded-2xl bg-turquoise py-3 text-[15px] font-extrabold text-white shadow-[0_4px_0_var(--color-turquoise-dark)]"
          >
            Commencer
          </button>
          <p className="mt-3 text-center text-[10px] leading-snug text-ink-soft">
            Rien n’est envoyé : la partie se joue entièrement sur cet appareil.
          </p>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- */
  /* Résultat                                                          */
  /* ---------------------------------------------------------------- */
  if (phase === 'result') {
    const [a, b] = joueurs
    const egalite = a.score === b.score
    const gagnant = a.score > b.score ? 0 : 1
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col items-center justify-center bg-cream px-5 text-center">
        <Akermus height={110} state="celebrate" float />
        <h2 className="mt-3 text-[22px] font-extrabold">
          {egalite ? 'Égalité !' : `Bravo ${nomDe(gagnant)} !`}
        </h2>
        <p className="mt-1 text-[12px] text-ink-soft">
          {egalite ? 'Vous avez fait le même score.' : 'Mais l’important, c’est d’avoir joué ensemble.'}
        </p>

        <div className="mt-6 flex w-full gap-3">
          {joueurs.map((p, i) => (
            <div
              key={i}
              className="flex-1 rounded-2xl border-2 px-2 py-3"
              style={{ borderColor: COULEURS[i].bg, background: !egalite && gagnant === i ? `${COULEURS[i].bg}14` : 'transparent' }}
            >
              <Avatar id={p.avatar} size={44} className="mx-auto" />
              <div className="mt-1.5 truncate text-[12px] font-extrabold">{nomDe(i)}</div>
              <div className="text-[26px] font-extrabold tabular-nums" style={{ color: COULEURS[i].bg }}>
                {p.score}
              </div>
              <div className="text-[9.5px] font-bold uppercase tracking-wide text-ink-soft">
                sur {TOURS / 2}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={lancer}
            className="w-full rounded-2xl bg-turquoise py-3 text-[15px] font-extrabold text-white shadow-[0_4px_0_var(--color-turquoise-dark)]"
          >
            Rejouer
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl border-2 border-line bg-cream py-3 text-[14px] font-extrabold text-ink-soft"
          >
            Terminer
          </button>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- */
  /* Partie                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      {/* Bandeau du joueur dont c'est le tour — la couleur change à chaque
          question, c'est le signal le plus lisible quand on se passe le
          téléphone. */}
      <div className="flex items-center gap-2.5 px-4 pt-7 pb-2 transition-colors" style={{ background: `${couleur.bg}18` }}>
        <button type="button" onClick={onBack} aria-label="Quitter" className="text-lg font-extrabold text-ink-soft">
          ✕
        </button>
        <Avatar id={joueurs[tour].avatar} size={38} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-extrabold" style={{ color: couleur.bg }}>
            À {nomDe(tour)}
          </div>
          <div className="text-[10px] font-bold text-ink-soft">
            Question {index + 1} sur {exercices.length}
          </div>
        </div>
        <div className="flex flex-none items-center gap-2 text-[13px] font-extrabold tabular-nums">
          <span style={{ color: COULEURS[0].bg }}>{joueurs[0].score}</span>
          <span className="text-ink-soft">–</span>
          <span style={{ color: COULEURS[1].bg }}>{joueurs[1].score}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
        <h3 className="mt-4 text-[17px] font-extrabold tracking-tight">{ex.prompt}</h3>

        {ex.scene && (
          <div className="animate-pop-in relative mx-auto mt-3 w-full max-w-[210px] overflow-hidden rounded-2xl border-2 border-line">
            <Scene id={ex.scene} />
          </div>
        )}

        {ex.word && !ex.audio && (
          <div className="mt-3 rounded-2xl border-2 border-line bg-sand px-3.5 py-3 text-[17px] font-extrabold">
            {ex.word}
          </div>
        )}

        {ex.audio && (
          <button
            type="button"
            onClick={() => playWord(ex.word, course.id)}
            aria-label="Réécouter"
            className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-2xl bg-turquoise-dark text-white transition-transform active:scale-90"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M4 9v6h4l5 5V4L8 9H4z" />
              <path d="M16 8c1.5 1.2 1.5 6.8 0 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <div className="mt-4 flex flex-col gap-2.5">
          {ex.choices.map((c, i) => (
            <ExerciseChoice
              key={c}
              letter={LETTERS[i]}
              text={c}
              state={etatChoix(c)}
              disabled={repondu}
              onClick={() => {
                setChoisi(c)
                sfx.click()
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-none border-t border-line bg-cream px-5 py-3">
        {repondu && (
          <p
            className="mb-2 text-center text-[12px] font-extrabold"
            style={{ color: choisi === ex.answer ? 'var(--color-turquoise-deep)' : 'var(--color-coral-dark)' }}
          >
            {choisi === ex.answer ? 'Juste !' : `C’était « ${ex.answer} »`}
          </p>
        )}
        <button
          type="button"
          onClick={repondu ? suivant : valider}
          disabled={choisi === null}
          className="w-full rounded-2xl py-3 text-[15px] font-extrabold text-white transition disabled:bg-sand-2 disabled:text-ink-soft disabled:shadow-none"
          style={
            choisi === null
              ? undefined
              : { background: couleur.bg, boxShadow: `0 4px 0 ${couleur.ombre}` }
          }
        >
          {repondu
            ? index === exercices.length - 1
              ? 'Voir le score'
              : `Au tour de ${nomDe(1 - tour)}`
            : 'Vérifier'}
        </button>
      </div>
    </div>
  )
}
