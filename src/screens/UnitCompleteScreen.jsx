import { useEffect } from 'react'
import { Button } from '../components/Button.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { GemIcon } from '../components/jewels/StatIcons.jsx'
import { sfx } from '../lib/sfx.js'

/**
 * Écran « Unité terminée » (v3) : le médaillon tabzimt — la fibule émaillée
 * d'Ath Yenni — surgit avec un effet ressort. Un bijou d'artisanat en trophée.
 */
export function UnitCompleteScreen({ unit, gems = 25, hasNext = true, onContinue }) {
  useEffect(() => {
    sfx.chest()
    const t = setTimeout(() => sfx.complete(), 350)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-12 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(16,196,168,0.22),var(--color-cream)_64%)]">
      <Confetti count={40} />

      <Tabzimt size={168} animate rays />

      <div className="animate-pop-in mt-2 grid h-12 w-12 place-items-center rounded-2xl bg-turquoise text-2xl shadow-lg" style={{ animationDelay: '260ms' }}>
        {unit?.trophy || '⭐'}
      </div>

      <h2 className="mt-3 text-2xl font-extrabold">
        Unité terminée ! <span className="text-turquoise-deep">Igerrez !</span>
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
        Tu as terminé <b className="text-ink">{unit?.title}</b>.
        <br />
        Le médaillon <b className="text-ink">« {unit?.unitLabel} »</b> rejoint ta collection.
      </p>

      <div className="animate-pop-in mt-5 flex items-center gap-2 rounded-2xl border border-line bg-cream px-5 py-3 text-lg font-extrabold text-gold-deep" style={{ animationDelay: '380ms' }}>
        <GemIcon size={24} /> +{gems} gemmes bonus
      </div>

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue}>
        {hasNext ? 'Unité suivante' : 'Retour au chemin'}
      </Button>
    </div>
  )
}
