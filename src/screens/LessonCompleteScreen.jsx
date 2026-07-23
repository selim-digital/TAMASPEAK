import { Button } from '../components/Button.jsx'
import { Aqcic } from '../components/mascots/Aqcic.jsx'

function Reward({ value, label, tone = 'turquoise' }) {
  const toneCls = tone === 'coral' ? 'text-coral' : 'text-turquoise-deep'
  return (
    <div className="flex-1 rounded-2xl border border-line bg-cream px-2 py-3.5 text-center">
      <div className={`text-xl font-extrabold ${toneCls}`}>{value}</div>
      <div className="mt-1 text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}

/**
 * Screen 4 — Fin de leçon (réussite).
 */
export function LessonCompleteScreen({ correct = 0, total = 0, xp = 20, streak = 4, onContinue }) {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(16,196,168,0.2),var(--color-cream)_62%)]">
      <div className="animate-pop">
        <Aqcic height={150} />
      </div>

      <h2 className="mt-3 text-2xl font-extrabold">
        Igerrez ! <span className="text-turquoise-deep">Bravo !</span>
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">
        Tu as terminé ta leçon.
        <br />« Igerrez » veut dire « c'est excellent » en kabyle.
      </p>

      <div className="mt-5 flex w-full gap-3">
        <Reward value={`+${xp}`} label="XP gagnés" />
        <Reward value={`${streak} 🔥`} label="Série de jours" tone="coral" />
        <Reward value={`${correct}/${total}`} label="Bonnes réponses" />
      </div>

      <div className="flex-1" />

      <Button variant="primary" onClick={onContinue}>
        Continuer
      </Button>
    </div>
  )
}
