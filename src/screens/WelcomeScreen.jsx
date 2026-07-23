import { Wordmark, YazMark } from '../components/Logo.jsx'
import { Button } from '../components/Button.jsx'
import { Yemma } from '../components/mascots/Yemma.jsx'

/**
 * Screen 1 — Onboarding / welcome.
 * Built entirely from design-system components.
 */
export function WelcomeScreen({ onStart }) {
  return (
    <div className="animate-enter flex flex-1 flex-col items-center px-6 pt-12 pb-6 text-center bg-[radial-gradient(130%_80%_at_50%_6%,rgba(16,196,168,0.18),var(--color-cream)_60%)]">
      <div className="grid place-items-center w-20 h-20 rounded-[22px] bg-gradient-to-br from-turquoise to-turquoise-dark text-white shadow-lg shadow-turquoise/30">
        <YazMark size={44} />
      </div>

      <Wordmark className="mt-5 text-3xl" />
      <p className="mt-2 text-sm text-ink-soft leading-snug">
        Apprends le kabyle,
        <br />
        un mot après l'autre.
      </p>

      <div className="my-4 animate-float">
        <Yemma height={150} />
      </div>

      <div className="flex-1" />

      <div className="w-full flex flex-col gap-2">
        <Button variant="primary" onClick={onStart}>
          Commencer
        </Button>
        <Button variant="ghost" onClick={onStart}>
          J'ai déjà un compte
        </Button>
      </div>

      <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-sand-2 px-3 py-1.5 text-xs font-semibold text-ink">
        ◇ Niveau : Initiation
      </span>
    </div>
  )
}
