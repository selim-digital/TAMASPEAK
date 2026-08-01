import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { FamilyCarousel } from '../components/mascots/FamilyCarousel.jsx'
import { LANGUAGES, findLanguage } from '../data/languages.js'
import { hasCourse } from '../data/courses.js'
import { LAND_BY_ID } from '../data/journey.js'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { YazMark } from '../components/Logo.jsx'
import { ONGLETS } from '../components/TabBar.jsx'
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

/**
 * Opt-in email — RGPD et délivrabilité : rien n'est précoché, et « non »
 * est une réponse aussi légitime que les autres. Le ton annonce ce que
 * seront les emails : une raison de revenir, jamais un reproche.
 */
const CONTACT_STEP = {
  id: 'contact',
  bubble:
    'Veux-tu que je t’écrive parfois par email ? Jamais de reproche — juste un rappel doux, ou le bilan de ta semaine.',
  options: [
    { value: 'rappels', label: '🔔 Oui, un rappel de temps en temps' },
    { value: 'tout', label: '📬 Oui, rappels + résumé de ma semaine' },
    { value: 'non', label: '🌿 Non merci, je viendrai de moi-même' },
  ],
}

const DAILY_STEP = {
  id: 'daily',
  bubble: 'Et quel objectif chaque jour ? Je te le rappellerai sur le chemin.',
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

/**
 * La présentation de l'app — trois diapos AVANT les questions (demande de
 * Selim : « un onboarding plus complet »). On montre ce qui rend Tama Speak
 * différent avant de demander quoi que ce soit : c'est l'app qui se
 * présente d'abord, pas l'élève qu'on interroge.
 */
const DIAPOS = [
  {
    id: 'mission',
    etat: 'celebrate',
    titre: 'Azul, ansuf ! ⵣ',
    texte:
      'Tama Speak t’aide à retrouver la langue de ta famille — kabyle, tachelhit, tarifit, tamazight… Un mot après l’autre, et personne n’est jamais noté.',
  },
  {
    id: 'ensemble',
    etat: 'curious',
    titre: 'On apprend en famille',
    texte:
      'Invite tes proches dans ton cercle : défiez-vous à distance, chacun sur son téléphone — et demande-leur d’enregistrer un mot avec leur voix : c’est elle que tu entendras dans tes leçons.',
  },
  {
    id: 'tresors',
    etat: 'idle',
    titre: 'Écris, découvre, collectionne',
    texte:
      'Trace le tifinagh au doigt, traverse l’histoire amazighe — des origines à aujourd’hui —, réponds aux quiz et ouvre des coffres : toute une culture t’attend.',
  },
  {
    id: 'navigation',
    etat: 'celebrate',
    titre: 'Tout est sous ton pouce',
    texte:
      'En bas de l’écran : Aujourd’hui pour ta leçon du jour, le Chemin pour voir le voyage, les Jeux, ton Cercle — et Moi pour tout ce qui est à toi.',
  },
]

/**
 * Le visuel de chaque diapo (demande de Selim : MONTRER ce qui est décrit).
 * Tout est composé avec les pièces déjà dessinées de l'app — paysages,
 * tabzimt, barre d'onglets — pour que la promesse ressemble au produit.
 */
function VisuelDiapo({ id }) {
  if (id === 'mission') {
    // Les terres amazighes : trois paysages du voyage, Akermus devant.
    return (
      <div className="relative mx-auto w-fit">
        <div className="flex gap-1.5">
          {['kmont', 'dunes', 'rif'].map((land, i) => (
            <img
              key={land}
              src={LAND_BY_ID[land]}
              alt=""
              className={`h-16 w-20 rounded-xl border-2 border-white object-cover shadow-md ${i === 1 ? '-mt-2' : 'mt-1'}`}
            />
          ))}
        </div>
        <div className="-mt-8">
          <Akermus height={96} state="celebrate" />
        </div>
      </div>
    )
  }

  if (id === 'ensemble') {
    // Deux téléphones reliés — le cercle : un défi part, une voix revient.
    const Tel = ({ pastille }) => (
      <div className="flex h-24 w-14 flex-col items-center justify-center gap-1 rounded-xl border-2 border-ink/20 bg-white shadow-md">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-turquoise to-turquoise-dark text-white">
          <YazMark size={18} />
        </span>
        <span className="text-[13px]" aria-hidden="true">{pastille}</span>
      </div>
    )
    return (
      <div className="mx-auto flex w-fit items-center gap-2">
        <Tel pastille="⚔️" />
        <svg width="46" height="24" viewBox="0 0 46 24" aria-hidden="true" className="text-turquoise">
          <path d="M2 8 C 16 0, 30 0, 44 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 6" />
          <path d="M44 16 C 30 24, 16 24, 2 16" fill="none" stroke="var(--color-coral)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 6" />
          <path d="M40 4l5 4-6 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 20l-5-4 6-2" fill="none" stroke="var(--color-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Tel pastille="🎙️" />
      </div>
    )
  }

  if (id === 'tresors') {
    // Écrire (ⵣ), découvrir (un récit sur son paysage), collectionner (tabzimt).
    return (
      <div className="mx-auto flex w-fit items-end gap-2">
        <span className="tifinagh grid h-16 w-16 place-items-center rounded-2xl border-2 border-line bg-white text-[34px] font-extrabold text-turquoise-deep shadow-md">
          ⵣ
        </span>
        <span className="relative -mt-2 block h-[72px] w-[72px] overflow-hidden rounded-2xl border-2 border-white shadow-md">
          <img src={LAND_BY_ID.tassili} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-0.5 text-center text-[8px] font-extrabold uppercase tracking-wide text-white">
            Histoire
          </span>
        </span>
        <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-line bg-white shadow-md">
          <Tabzimt size={44} />
        </span>
      </div>
    )
  }

  // 'navigation' : la vraie barre d'onglets, en miniature inerte.
  return (
    <div className="mx-auto w-[250px] rounded-2xl border-2 border-ink/15 bg-white p-1.5 shadow-md">
      <div className="flex">
        {ONGLETS.map((o, i) => (
          <span
            key={o.id}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 ${i === 0 ? 'bg-turquoise/10 text-turquoise-deep' : 'text-ink-soft'}`}
          >
            <span className="grid h-5 scale-90 place-items-center">{o.icone}</span>
            <span className={`text-[7.5px] ${i === 0 ? 'font-extrabold' : 'font-bold'}`}>{o.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Presentation({ onDone }) {
  const [i, setI] = useState(0)
  const d = DIAPOS[i]
  const derniere = i === DIAPOS.length - 1
  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-10 pb-5 text-center bg-[radial-gradient(130%_80%_at_50%_6%,rgba(16,196,168,0.15),var(--color-cream)_60%)]">
      {/* Chaque diapo MONTRE ce qu'elle raconte (demande de Selim) —
          composé avec les pièces déjà dessinées de l'app. */}
      <div key={d.id} className="animate-pop-in mx-auto flex min-h-[120px] items-center">
        <VisuelDiapo id={d.id} />
      </div>
      <h2 key={`t-${d.id}`} className="animate-rise mt-4 text-[21px] font-extrabold leading-tight">{d.titre}</h2>
      <p key={`p-${d.id}`} className="animate-rise mx-auto mt-2 max-w-[300px] text-[13px] leading-snug text-ink-soft">
        {d.texte}
      </p>

      <div className="min-h-4 flex-1" />

      {/* Les points de position, tapables pour naviguer librement. */}
      <div className="mb-3 flex justify-center gap-1.5">
        {DIAPOS.map((x, k) => (
          <button
            key={x.id}
            type="button"
            aria-label={`Diapo ${k + 1}`}
            onClick={() => setI(k)}
            className={`h-2 rounded-full transition-all ${k === i ? 'w-5 bg-turquoise' : 'w-2 bg-sand-2'}`}
          />
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => {
          sfx.click()
          derniere ? onDone() : setI(i + 1)
        }}
      >
        {derniere ? 'C’est parti !' : 'Suivant'}
      </Button>
      {!derniere && (
        <button type="button" onClick={onDone} className="mt-2 text-[11px] font-bold text-ink-soft underline">
          Passer la présentation
        </button>
      )}
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
  // Première fois : l'app se présente AVANT de poser des questions.
  const [presentationVue, setPresentationVue] = useState(hasProfile)

  if (!presentationVue) return <Presentation onDone={() => setPresentationVue(true)} />

  // Le parcours est composé à la volée selon ce qu'on sait déjà de l'élève.
  const chosenLang = answers.lang || presetLang
  const steps = [
    ...(presetLang ? [] : [{ id: 'lang', bubble: 'Azul ! Moi c’est Akermus. Quelle langue amazighe veux-tu apprendre ?' }]),
    ...(hasProfile ? [] : [REASON_STEP]),
    levelStep(chosenLang ? findLanguage(chosenLang).name : 'cette langue'),
    ...(hasProfile ? [] : [DAILY_STEP, CONTACT_STEP]),
  ]

  const done = (extra = {}) => {
    const a = { ...answers, ...extra }
    onFinish?.({
      lang: a.lang || presetLang,
      level: a.level,
      reason: a.reason,
      dailyGoalXp: a.daily,
      contact: a.contact, // 'rappels' | 'tout' | 'non' — l'opt-in email
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
