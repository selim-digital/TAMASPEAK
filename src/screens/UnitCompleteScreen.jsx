import { Button } from '../components/Button.jsx'
import { Confetti } from '../components/Confetti.jsx'

/** Écran « Unité terminée » : trophée + badge + bonus. */
export function UnitCompleteScreen({ unit, gems = 25, hasNext = true, onContinue }) {
  return (
    <div className="animate-enter relative flex flex-1 flex-col items-center px-6 pb-6 pt-12 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(16,196,168,0.22),var(--color-cream)_64%)]">
      <Confetti count={40} />

      <div className="animate-pop text-[86px] leading-none" aria-hidden="true">
        🏆
      </div>
      <div className="animate-pop-in mt-1 grid h-14 w-14 place-items-center rounded-2xl bg-turquoise text-3xl shadow-lg" style={{ animationDelay: '150ms' }}>
        {unit?.trophy || '⭐'}
      </div>

      <h2 className="mt-4 text-2xl font-extrabold">
        Unité terminée ! <span className="text-turquoise-deep">Igerrez !</span>
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
        Tu as terminé <b className="text-ink">{unit?.title}</b>.
        <br />
        Badge <b className="text-ink">« {unit?.unitLabel} »</b> débloqué 🎖️
      </p>

      <div className="animate-pop-in mt-5 flex items-center gap-2 rounded-2xl border border-line bg-cream px-5 py-3 text-lg font-extrabold text-turquoise-deep" style={{ animationDelay: '300ms' }}>
        <span aria-hidden="true">🪙</span> +{gems} gemmes bonus
      </div>

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue}>
        {hasNext ? 'Unité suivante' : 'Retour au chemin'}
      </Button>
    </div>
  )
}
