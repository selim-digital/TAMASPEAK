import { useMemo, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { FAITS, faitsVus } from '../data/faits.js'
import { RECITS } from '../data/history.js'
import { JEUX } from '../data/economy.js'
import { sfx } from '../lib/sfx.js'

/**
 * Le Quiz Tamazgha — là où les cartes « Le savais-tu ? » se retrouvent.
 *
 * Toutes les réponses viennent des faits déjà croisés en respirant dans
 * l'app (et de l'écran Histoire) : le quiz ne piège pas, il fait revenir.
 * En solo, six questions. À deux sur le même téléphone, on alterne :
 * chacun ses questions, tirées du même panier — comparaison honnête.
 *
 * Après CHAQUE réponse, le fait complet s'affiche : même une erreur
 * instruit. C'est un quiz qui enseigne, pas un examen.
 */

const melange = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Tire n questions. Le panier : les faits déjà VUS (cartes croisées en
 * naviguant) + les questions des récits d'histoire déjà LUS — lire
 * l'Histoire enrichit littéralement le quiz. Complété par des faits
 * encore inconnus si le panier est court (le retour pédagogique après
 * chaque réponse fait qu'on apprend alors en jouant).
 */
function tirerQuestions(faitIndex, recitsLus, n) {
  const recits = RECITS.filter((r) => recitsLus.includes(r.id)).map((r) => ({
    cat: 'histoire',
    texte: r.texte[r.texte.length - 1],
    question: r.question,
  }))
  const panier = melange([...faitsVus(faitIndex), ...recits])
  const dejaVu = new Set(panier.map((f) => f.question.prompt))
  const restants = melange(FAITS.filter((f) => !dejaVu.has(f.question.prompt)))
  return [...panier, ...restants].slice(0, n).map((f) => ({
    ...f.question,
    faitTexte: f.texte,
    cat: f.cat,
    choicesMelangees: melange(f.question.choices),
  }))
}

export function QuizScreen({ faitIndex = 0, recitsLus = [], onRecompense, onBack }) {
  const [mode, setMode] = useState(null) // null | 'solo' | 'grand' | 'duo'
  const [tour, setTour] = useState(0)
  const [choix, setChoix] = useState(null) // réponse sélectionnée (feedback affiché)
  const [scores, setScores] = useState([0, 0]) // [solo] ou [J1, J2]
  const [fini, setFini] = useState(false)

  // Solo : 6 questions ; grande partie : 12. Duo : 8, alternées — chacun 4,
  // jamais les mêmes (voir le voisin répondre donnerait la réponse).
  const TAILLES = { solo: 6, grand: 12, duo: 8 }
  const questions = useMemo(
    () => (mode ? tirerQuestions(faitIndex, recitsLus, TAILLES[mode]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, faitIndex],
  )

  const joueur = mode === 'duo' ? tour % 2 : 0
  const q = questions[tour]

  function repondre(c) {
    if (choix != null) return
    setChoix(c)
    const bonne = c === q.answer
    if (bonne) {
      sfx.correct()
      setScores((s) => {
        const n = [...s]
        n[joueur] += 1
        return n
      })
    } else {
      sfx.wrong?.()
    }
  }

  function continuer() {
    sfx.click()
    setChoix(null)
    if (tour + 1 >= questions.length) {
      setFini(true)
      // La récompense : un petit XP par bonne réponse, jamais de punition.
      const total = mode === 'duo' ? scores[0] + scores[1] : scores[0]
      onRecompense?.(total * JEUX.quiz.xpParBonne)
    } else {
      setTour(tour + 1)
    }
  }

  /* ---------------- choix du mode ---------------- */
  if (!mode) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-8 text-center">
        <div className="mb-1 flex w-full items-center gap-3 text-left">
          <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
            ←
          </button>
          <h2 className="text-lg font-extrabold">Quiz Tamazgha ⵣ</h2>
        </div>
        <Akermus height={110} state="curious" float />
        <p className="mt-3 max-w-[300px] text-[12.5px] leading-snug text-ink-soft">
          Histoire, langue, culture : toutes les réponses sont dans les cartes{' '}
          <b className="text-ink">« Le savais-tu ? »</b> qui apparaissent en naviguant, et dans
          l’écran <b className="text-ink">Histoire</b>.
        </p>
        <p className="mt-2 rounded-xl bg-sand px-3 py-2 text-[10.5px] leading-snug text-ink-soft">
          {faitIndex > 0 || recitsLus.length > 0
            ? `Dans ton panier : ${Math.min(faitIndex, FAITS.length)} fait${faitIndex > 1 ? 's' : ''} croisé${faitIndex > 1 ? 's' : ''} sur ${FAITS.length}` +
              (recitsLus.length > 0 ? ` et ${recitsLus.length} récit${recitsLus.length > 1 ? 's' : ''} d’histoire lu${recitsLus.length > 1 ? 's' : ''}.` : '.')
            : 'Rien de croisé pour l’instant — le quiz t’apprendra en jouant.'}
        </p>
        <div className="min-h-4 flex-1" />
        <div className="flex w-full flex-col gap-2">
          <Button variant="primary" onClick={() => { sfx.click(); setMode('solo') }}>
            Jouer en solo — 6 questions
          </Button>
          <Button variant="neutral" onClick={() => { sfx.click(); setMode('grand') }}>
            Grande partie — 12 questions
          </Button>
          <Button variant="neutral" onClick={() => { sfx.click(); setMode('duo') }}>
            À deux sur ce téléphone — 4 questions chacun
          </Button>
        </div>
      </div>
    )
  }

  /* ---------------- fin de partie ---------------- */
  if (fini) {
    const [s1, s2] = scores
    const duo = mode === 'duo'
    const gagne = duo ? (s1 > s2 ? 'Joueur 1' : s2 > s1 ? 'Joueur 2' : null) : null
    return (
      <div className="animate-enter relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-10 text-center">
        <Confetti count={26} />
        <Akermus height={120} state="celebrate" />
        <h2 className="mt-3 text-[21px] font-extrabold leading-tight">
          {duo ? (gagne ? `${gagne} l’emporte !` : 'Égalité !') : `${s1}/${questions.length} — Igerrez !`}
        </h2>
        {duo && (
          <div className="mt-3 w-full rounded-2xl border border-line bg-cream px-4 py-3 text-[13px] font-extrabold tabular-nums">
            <div className="flex justify-between"><span>Joueur 1</span><span>{s1}/4</span></div>
            <div className="mt-1 flex justify-between border-t border-line pt-1"><span>Joueur 2</span><span>{s2}/4</span></div>
          </div>
        )}
        <p className="mt-2 text-[11.5px] text-ink-soft">
          + {(duo ? s1 + s2 : s1) * JEUX.quiz.xpParBonne} XP — et les cartes continuent d’arriver en naviguant.
        </p>
        <div className="min-h-4 flex-1" />
        <div className="flex w-full flex-col gap-2">
          <Button variant="primary" onClick={() => { setMode(null); setTour(0); setScores([0, 0]); setFini(false) }}>
            Rejouer
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Retour aux jeux
          </Button>
        </div>
      </div>
    )
  }

  /* ---------------- une question ---------------- */
  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <div className="flex flex-1 gap-1">
          {questions.map((x, i) => (
            <div key={x.prompt} className={`h-1.5 flex-1 rounded-full ${i < tour ? 'bg-turquoise' : i === tour ? 'bg-coral' : 'bg-sand-2'}`} />
          ))}
        </div>
      </div>

      {mode === 'duo' && (
        <div className={`mx-auto mt-3 rounded-full px-3 py-1 text-[11px] font-extrabold text-white ${joueur === 0 ? 'bg-turquoise' : 'bg-coral'}`}>
          Au tour du Joueur {joueur + 1}
        </div>
      )}

      <h3 className="mt-4 text-[16px] font-extrabold leading-snug">{q.prompt}</h3>

      <div className="mt-4 flex flex-col gap-2">
        {q.choicesMelangees.map((c) => {
          const etat =
            choix == null ? 'neutre' : c === q.answer ? 'bonne' : c === choix ? 'mauvaise' : 'eteinte'
          return (
            <button
              key={c}
              type="button"
              onClick={() => repondre(c)}
              disabled={choix != null}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-[13px] font-bold transition ${
                etat === 'bonne'
                  ? 'border-green-vif bg-green-vif/10 text-ink'
                  : etat === 'mauvaise'
                    ? 'border-coral bg-coral/10 text-ink'
                    : etat === 'eteinte'
                      ? 'border-line bg-cream text-ink-soft opacity-60'
                      : 'border-line bg-cream text-ink active:scale-[0.99]'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      {choix != null && (
        <div className="animate-rise mt-3 rounded-2xl border border-turquoise/40 bg-turquoise/5 px-3 py-2.5">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-turquoise-deep">
            {choix === q.answer ? 'Exact !' : 'La réponse était : ' + q.answer}
          </div>
          <p className="mt-1 text-[11.5px] leading-snug text-ink">{q.faitTexte}</p>
        </div>
      )}

      <div className="min-h-3 flex-1" />
      <Button variant="primary" disabled={choix == null} onClick={continuer}>
        {tour + 1 >= questions.length ? 'Voir le résultat' : 'Continuer'}
      </Button>
    </div>
  )
}
