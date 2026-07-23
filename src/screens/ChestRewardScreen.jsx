import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { GemIcon } from '../components/jewels/StatIcons.jsx'
import { dishForChest } from '../components/jewels/Dishes.jsx'

/**
 * Écran d'ouverture de coffre (v3.1) : le médaillon tabzimt s'ouvre sur un
 * plat berbère + des gemmes. Deux plats (aghrum, atay) sont des mots du
 * vocabulaire : la récompense devient une mini-leçon.
 */
export function ChestRewardScreen({ gems = 15, chest, onContinue }) {
  const [open, setOpen] = useState(false)
  const dish = dishForChest(chest?.id)
  const Art = dish.Art

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-enter relative flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_16%,rgba(240,180,41,0.2),var(--color-cream)_64%)]">
      {open && <Confetti count={30} />}

      {open ? (
        <div className="animate-pop" aria-hidden="true">
          <Art width={190} />
        </div>
      ) : (
        <div className="animate-bob" aria-hidden="true">
          <Tabzimt size={150} />
        </div>
      )}

      <h2 className="mt-4 text-2xl font-extrabold">{open ? `${dish.name} !` : 'Un cadeau !'}</h2>

      {open ? (
        <>
          <p className="animate-rise mt-1 text-[13.5px] font-semibold text-ink-soft">
            {dish.name} — {dish.fr}. {dish.note}
          </p>
          <div className="animate-pop-in mt-4 flex items-center gap-2 rounded-2xl border border-line bg-cream px-5 py-3 text-xl font-extrabold text-[#C08A10]">
            <GemIcon size={26} /> +{gems} gemmes
          </div>
        </>
      ) : (
        <p className="mt-2 text-[13.5px] text-ink-soft">Le médaillon s'ouvre…</p>
      )}

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue} disabled={!open}>
        Super !
      </Button>
    </div>
  )
}
