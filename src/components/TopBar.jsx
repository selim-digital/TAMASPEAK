/** Barre de stats des écrans d'apprentissage : série, XP, gemmes. */
function Stat({ className = '', icon, children }) {
  return (
    <div className={`flex items-center gap-1.5 text-sm font-extrabold ${className}`}>
      <span aria-hidden="true">{icon}</span> {children}
    </div>
  )
}

export function TopBar({ streak = 0, xp = 0, gems = 0 }) {
  return (
    <div className="flex items-center justify-between px-[18px] pt-8 pb-2.5">
      <Stat className="text-coral" icon="🔥">
        {streak}
      </Stat>
      <Stat className="text-turquoise-deep" icon="◆">
        {xp}
      </Stat>
      <Stat className="text-gold" icon="🪙">
        {gems}
      </Stat>
    </div>
  )
}
