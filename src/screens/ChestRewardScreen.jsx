import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Confetti } from '../components/Confetti.jsx'

/** Écran d'ouverture de coffre : le coffre s'ouvre et révèle des gemmes. */
export function ChestRewardScreen({ gems = 15, onContinue }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-enter relative flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_16%,rgba(224,168,62,0.22),var(--color-cream)_64%)]">
      {open && <Confetti count={30} />}

      <div className={open ? 'animate-pop text-[92px] leading-none' : 'animate-bob text-[92px] leading-none'} aria-hidden="true">
        {open ? '🎉' : '🎁'}
      </div>

      <h2 className="mt-4 text-2xl font-extrabold">{open ? 'Cadeau ouvert !' : 'Un cadeau !'}</h2>

      {open ? (
        <div className="animate-pop-in mt-4 flex items-center gap-2 rounded-2xl border border-line bg-cream px-5 py-3 text-xl font-extrabold text-turquoise-deep">
          <span aria-hidden="true">🪙</span> +{gems} gemmes
        </div>
      ) : (
        <p className="mt-2 text-[13.5px] text-ink-soft">Touche pour l'ouvrir…</p>
      )}

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue} disabled={!open}>
        Super !
      </Button>
    </div>
  )
}
