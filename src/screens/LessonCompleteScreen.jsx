import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { cheerFor } from '../components/mascots/Family.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { sfx } from '../lib/sfx.js'

/** Anime un nombre de 0 → target. */
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // Filet de sécurité : garantit la valeur finale même si rAF est
    // suspendu (onglet non peint / arrière-plan).
    const fallback = setTimeout(() => setValue(target), duration + 120)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
  }, [target, duration])
  return value
}

function Reward({ value, label, tone = 'turquoise', delay = 0 }) {
  const toneCls = tone === 'coral' ? 'text-coral' : 'text-turquoise-deep'
  return (
    <div
      className="animate-pop-in flex-1 rounded-2xl border border-line bg-cream px-2 py-3.5 text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`text-xl font-extrabold ${toneCls}`}>{value}</div>
      <div className="mt-1 text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}

/**
 * Screen 4 — Fin de leçon (réussite) : confettis, XP qui grimpe,
 * récompenses en cascade, mascotte qui surgit.
 */
export function LessonCompleteScreen({ correct = 0, total = 0, xp = 20, streak = 4, cheerCount = 0, onContinue }) {
  const xpShown = useCountUp(xp)
  const { member, message } = cheerFor(cheerCount)
  useEffect(() => {
    sfx.complete()
    sfx.pop(0.5) // atterrissage du saut d'Akermus
  }, [])

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(16,196,168,0.2),var(--color-cream)_62%)]">
      <Confetti count={34} />

      <div className="animate-pop">
        <Akermus height={150} state="celebrate" />
      </div>

      <h2 className="mt-3 text-2xl font-extrabold">
        Igerrez ! <span className="text-turquoise-deep">Bravo !</span>
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
        Tu as terminé ta leçon.
        <br />« Igerrez » veut dire « c'est excellent » en kabyle.
      </p>

      <div className="mt-5 flex w-full gap-3">
        <Reward value={`+${xpShown}`} label="XP gagnés" delay={80} />
        <Reward value={streak} label="Série de jours" tone="coral" delay={200} />
        <Reward value={`${correct}/${total}`} label="Bonnes réponses" delay={320} />
      </div>

      {/* Un membre de la famille vient féliciter l'élève. */}
      <div className="animate-rise mt-4 flex w-full items-end gap-2 text-left" style={{ animationDelay: '450ms' }}>
        <div className="fam-anim flex-none">
          <member.Comp height={58} />
        </div>
        <div className="mb-1.5 flex-1 rounded-2xl rounded-bl-md border border-line bg-cream p-2.5 text-[11.5px] font-semibold leading-snug">
          <b className="text-turquoise-deep">{member.name}</b> — {message}
        </div>
      </div>

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue}>
        Continuer
      </Button>
    </div>
  )
}
