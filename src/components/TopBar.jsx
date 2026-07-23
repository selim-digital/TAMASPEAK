/**
 * Top stats bar for the learning screens: streak, gems (XP), hearts.
 */
function Stat({ className = '', children }) {
  return <div className={`flex items-center gap-1.5 text-sm font-extrabold ${className}`}>{children}</div>
}

export function TopBar({ streak = 3, gems = 240, hearts = 5 }) {
  return (
    <div className="flex items-center justify-between px-[18px] pt-8 pb-2.5">
      <Stat className="text-coral">
        <span aria-hidden="true">🔥</span> {streak}
      </Stat>
      <Stat className="text-turquoise-deep">
        <span aria-hidden="true">◆</span> {gems}
      </Stat>
      <Stat className="text-coral">
        <span aria-hidden="true">♥</span> {hearts}
      </Stat>
    </div>
  )
}
