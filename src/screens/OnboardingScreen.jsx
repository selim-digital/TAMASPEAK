import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { FAMILY } from '../components/mascots/Family.jsx'

/**
 * Onboarding (v3.3) — Akermus, le partenaire d'apprentissage, fait
 * connaissance : pourquoi, quel niveau, quel objectif quotidien. Dernière
 * étape : présentation de la famille d'accueil. Le profil est stocké dans
 * la progression et pilote l'objectif du jour sur le chemin.
 */

const STEPS = [
  {
    id: 'reason',
    bubble: 'Azul ! Moi c’est Akermus, ton compagnon de route. Dis-moi : pourquoi veux-tu apprendre le kabyle ?',
    options: [
      { value: 'racines', label: '🌱 Mes racines & ma famille' },
      { value: 'proches', label: '💬 Parler avec mes proches' },
      { value: 'culture', label: 'ⵣ La culture amazighe' },
      { value: 'defi', label: '🎯 Le plaisir d’apprendre' },
    ],
  },
  {
    id: 'level',
    bubble: 'Très beau choix ! Et aujourd’hui, tu en es où ?',
    options: [
      { value: 'debutant', label: 'Je pars de zéro' },
      { value: 'comprend', label: 'Je comprends un peu' },
      { value: 'parle', label: 'Je parle un peu' },
    ],
  },
  {
    id: 'daily',
    bubble: 'Dernier détail : quel objectif chaque jour ? Je te le rappellerai sur le chemin.',
    options: [
      { value: 20, label: 'Tranquille — 5 min / jour (20 XP)' },
      { value: 40, label: 'Régulier — 10 min / jour (40 XP)' },
      { value: 60, label: 'Intensif — 15 min / jour (60 XP)' },
    ],
  },
]

function FamilyIntro({ onDone }) {
  return (
    <div className="animate-enter flex flex-1 flex-col px-5 pt-10 pb-5 text-center">
      <h2 className="text-xl font-extrabold tracking-tight">Ta famille d'accueil</h2>
      <p className="mx-auto mt-1 max-w-[300px] text-[12.5px] leading-snug text-ink-soft">
        Ils t'attendent sur le chemin et t'encourageront à chaque étape. Deux d'entre eux sont déjà
        dans tes leçons : <b className="text-ink">yemma</b> (maman) et <b className="text-ink">baba</b> (papa).
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {FAMILY.map(({ id, name, role, Comp }, i) => (
          <div
            key={id}
            className="animate-pop-in flex flex-col items-center rounded-2xl border border-line bg-cream px-1 pb-2 pt-3"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <Comp height={64} />
            <div className="mt-1 text-[11px] font-extrabold">{name}</div>
            <div className="text-[9px] text-ink-soft">{role}</div>
          </div>
        ))}
      </div>

      <div className="flex-1" />
      <Button variant="primary" onClick={onDone}>
        Commencer le voyage
      </Button>
    </div>
  )
}

export function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  if (step >= STEPS.length) {
    return (
      <FamilyIntro
        onDone={() =>
          onFinish?.({ reason: answers.reason, level: answers.level, dailyGoalXp: answers.daily || 40 })
        }
      />
    )
  }

  const { id, bubble, options } = STEPS[step]

  function next() {
    if (selected == null) return
    setAnswers((a) => ({ ...a, [id]: selected }))
    setSelected(null)
    setStep((s) => s + 1)
  }

  return (
    <div className="animate-enter flex flex-1 flex-col px-5 pt-9 pb-5">
      {/* progression de l'onboarding */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-turquoise' : 'bg-sand-2'}`}
          />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="flex-none">
          <Akermus height={96} state={step === 0 ? 'curious' : 'idle'} float={step > 0} />
        </div>
        <div className="relative mt-2 flex-1 rounded-2xl rounded-bl-md border border-line bg-cream p-3 text-[13px] font-semibold leading-snug">
          {bubble}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => setSelected(o.value)}
            className={`rounded-2xl border-2 px-4 py-3 text-left text-[13.5px] font-bold transition ${
              selected === o.value
                ? 'border-turquoise bg-turquoise/10 text-turquoise-deep'
                : 'border-line bg-cream text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <Button variant="primary" disabled={selected == null} onClick={next}>
        Continuer
      </Button>
    </div>
  )
}
