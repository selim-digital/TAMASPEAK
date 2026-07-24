import { useEffect } from 'react'
import { Button } from '../components/Button.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { sfx } from '../lib/sfx.js'

/** Récompense du Défi du jour. */
export function ChallengeCompleteScreen({ correct = 0, total = 0, xp = 15, gems = 10, onContinue }) {
  const passed = correct >= Math.ceil(total * 0.6)
  useEffect(() => {
    if (passed) sfx.complete()
  }, [passed])
  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-12 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(255,111,97,0.18),var(--color-cream)_64%)]">
      {passed && <Confetti count={32} />}

      <div className="animate-pop text-[80px] leading-none" aria-hidden="true">
        {passed ? '🎯' : '💪'}
      </div>
      <h2 className="mt-3 text-2xl font-extrabold">
        {passed ? 'Défi relevé !' : 'Bien essayé !'}
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
        Score : <b className="text-ink">{correct}/{total}</b>
        <br />
        {passed ? 'Reviens demain pour un nouveau défi.' : 'Réessaie demain, in shā’a Llāh.'}
      </p>

      {passed && (
        <div className="mt-5 flex gap-3">
          <div className="animate-pop-in rounded-2xl border border-line bg-cream px-4 py-3 font-extrabold text-turquoise-deep" style={{ animationDelay: '80ms' }}>
            +{xp} XP
          </div>
          <div className="animate-pop-in rounded-2xl border border-line bg-cream px-4 py-3 font-extrabold text-coral" style={{ animationDelay: '200ms' }}>
            🪙 +{gems}
          </div>
        </div>
      )}

      <div className="flex-1" />
      <Button variant="primary" onClick={onContinue}>
        Continuer
      </Button>
    </div>
  )
}
