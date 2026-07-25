import { FlameIcon, StarIcon, GemIcon } from './jewels/StatIcons.jsx'

/**
 * Barre de stats (v3 « joaillerie ») : série, XP, gemmes — chaque statistique
 * est un petit bijou serti d'argent (plus d'emojis système dans le chrome).
 */
function Stat({ className = '', icon, children }) {
  return (
    <div className={`flex items-center gap-1.5 text-sm font-extrabold tabular-nums ${className}`}>
      {icon} {children}
    </div>
  )
}

export function TopBar({ streak = 0, xp = 0, gems = 0 }) {
  return (
    <div className="flex items-center justify-between px-[18px] pt-1 pb-2.5">
      <Stat className="text-coral-dark" icon={<FlameIcon size={24} />}>
        <span className="sr-only">Série : </span>
        {streak}
        <span className="sr-only"> jours</span>
      </Stat>
      <Stat className="text-cobalt" icon={<StarIcon size={24} />}>
        <span className="sr-only">Points d'expérience : </span>
        <span key={xp} className="animate-pop inline-block">{xp}</span>
      </Stat>
      <Stat className="text-gold-deep" icon={<GemIcon size={24} />}>
        <span className="sr-only">Gemmes : </span>
        {gems}
      </Stat>
    </div>
  )
}
