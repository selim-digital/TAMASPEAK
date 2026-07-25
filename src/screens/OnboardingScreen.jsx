import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { FamilyCarousel } from '../components/mascots/FamilyCarousel.jsx'
import { LANGUAGES, findLanguage } from '../data/languages.js'
import { hasCourse } from '../data/courses.js'
import { LAND_BY_ID } from '../data/journey.js'
import { sfx } from '../lib/sfx.js'

/**
 * Onboarding — Akermus, le partenaire d'apprentissage, fait connaissance.
 *
 * Le parcours s'adapte :
 *   • première fois  → langue, pourquoi, niveau, objectif, famille
 *   • langue ajoutée → langue, niveau (le reste est déjà connu)
 */

const REASON_STEP = {
  id: 'reason',
  bubble: 'Azul ! Moi c’est Akermus, ton compagnon de route. Dis-moi : pourquoi veux-tu apprendre cette langue ?',
  options: [
    { value: 'racines', label: '🌱 Mes racines & ma famille' },
    { value: 'proches', label: '💬 Parler avec mes proches' },
    { value: 'culture', label: 'ⵣ La culture amazighe' },
    { value: 'defi', label: '🎯 Le plaisir d’apprendre' },
  ],
}

const levelStep = (langName) => ({
  id: 'level',
  bubble: `Et en ${langName}, tu en es où aujourd’hui ?`,
  options: [
    { value: 'debutant', label: 'Je pars de zéro' },
    { value: 'comprend', label: 'Je comprends un peu' },
    { value: 'parle', label: 'Je parle un peu' },
  ],
})

const DAILY_STEP = {
  id: 'daily',
  bubble: 'Dernier détail : quel objectif chaque jour ? Je te le rappellerai sur le chemin.',
  options: [
    { value: 20, label: 'Tranquille — 5 min / jour (20 XP)' },
    { value: 40, label: 'Régulier — 10 min / jour (40 XP)' },
    { value: 60, label: 'Intensif — 15 min / jour (60 XP)' },
  ],
}

/** Étape de choix de la langue — cartes illustrées par leur paysage. */
function LangStep({ selected, onSelect }) {
  return (
    <div className="mt-5 flex flex-col gap-2.5">
      {LANGUAGES.map((lang) => {
        const active = selected === lang.id
        const ready = hasCourse(lang.id)
        return (
          <button
            key={lang.id}
            type="button"
            disabled={!ready}
            onClick={() => ready && onSelect(lang.id)}
            className={`relative h-[62px] overflow-hidden rounded-2xl border-2 text-left transition ${
              active ? 'border-turquoise' : 'border-line'
            } ${ready ? '' : 'opacity-60'}`}
          >
            <img src={LAND_BY_ID[lang.land]} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, ${lang.accentDeep}e6, ${lang.accentDeep}70 65%, rgba(30,37,48,.12))` }}
            />
            <div className="relative flex h-full items-center justify-between px-3.5 text-white">
              <div>
                <div className="text-[14.5px] font-extrabold leading-tight drop-shadow-sm">{lang.name}</div>
                <div className="text-[10px] font-bold opacity-90">
                  {lang.autonym} · {lang.region}
                </div>
              </div>
              {active && <span className="text-lg font-extrabold">✓</span>}
              {!ready && <span className="rounded-full bg-white/85 px-2 py-0.5 text-[9.5px] font-extrabold text-ink-soft">bientôt</span>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function FamilyIntro({ onDone }) {
  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-8 pb-5 text-center">
      <h2 className="text-xl font-extrabold tracking-tight">Ta famille d'accueil</h2>
      <p className="mx-auto mt-1 max-w-[300px] text-[12.5px] leading-snug text-ink-soft">
        Fais leur connaissance — <b className="text-ink">balaie</b> ou <b className="text-ink">touche un visage</b>.
        Ils t'encourageront tout au long du chemin.
      </p>

      <div className="mt-3">
        <FamilyCarousel />
      </div>

      <div className="min-h-3 flex-1" />
      <Button variant="primary" onClick={onDone}>
        Commencer le voyage
      </Button>
    </div>
  )
}

export function OnboardingScreen({ hasProfile = false, presetLang = null, onFinish }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ lang: presetLang })
  const [selected, setSelected] = useState(null)

  // Le parcours est composé à la volée selon ce qu'on sait déjà de l'élève.
  const chosenLang = answers.lang || presetLang
  const steps = [
    ...(presetLang ? [] : [{ id: 'lang', bubble: 'Azul ! Moi c’est Akermus. Quelle langue amazighe veux-tu apprendre ?' }]),
    ...(hasProfile ? [] : [REASON_STEP]),
    levelStep(chosenLang ? findLanguage(chosenLang).name : 'cette langue'),
    ...(hasProfile ? [] : [DAILY_STEP]),
  ]

  const done = (extra = {}) => {
    const a = { ...answers, ...extra }
    onFinish?.({
      lang: a.lang || presetLang,
      level: a.level,
      reason: a.reason,
      dailyGoalXp: a.daily,
    })
  }

  if (step >= steps.length) {
    // Première fois : on présente la famille avant de partir.
    if (!hasProfile) return <FamilyIntro onDone={() => done()} />
    done()
    return null
  }

  const current = steps[step]

  function next() {
    if (selected == null) return
    sfx.click()
    const filled = { ...answers, [current.id]: selected }
    setAnswers(filled)
    setSelected(null)
    // Dernière étape d'une langue ajoutée : on termine directement.
    if (step === steps.length - 1 && hasProfile) {
      onFinish?.({ lang: filled.lang || presetLang, level: filled.level })
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-9 pb-5">
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-turquoise' : 'bg-sand-2'}`} />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="flex-none">
          <Akermus height={96} state={step === 0 ? 'curious' : 'idle'} float={step > 0} />
        </div>
        <div className="relative mt-2 flex-1 rounded-2xl rounded-bl-md border border-line bg-cream p-3 text-[13px] font-semibold leading-snug">
          {current.bubble}
        </div>
      </div>

      {current.id === 'lang' ? (
        <LangStep selected={selected} onSelect={setSelected} />
      ) : (
        <div className="mt-5 flex flex-col gap-2.5">
          {current.options.map((o) => (
            <button
              key={String(o.value)}
              type="button"
              onClick={() => setSelected(o.value)}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-[13.5px] font-bold transition ${
                selected === o.value ? 'border-turquoise bg-turquoise/10 text-turquoise-deep' : 'border-line bg-cream text-ink'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-3 flex-1" />
      <Button variant="primary" disabled={selected == null} onClick={next}>
        Continuer
      </Button>
    </div>
  )
}
