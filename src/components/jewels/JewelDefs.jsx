/**
 * Dégradés partagés des composants « bijoux » (serti argent, cabochon corail,
 * émaux). Référencés partout via url(#jw-…) — à monter UNE fois dans App.
 */
export function JewelDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="jw-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDF2F7" />
          <stop offset=".55" stopColor="#BFC7CF" />
          <stop offset="1" stopColor="#8E99A5" />
        </linearGradient>
        <radialGradient id="jw-coral" cx=".34" cy=".28" r=".95">
          <stop offset="0" stopColor="#FF9B84" />
          <stop offset=".58" stopColor="#FF6F61" />
          <stop offset="1" stopColor="#D8442E" />
        </radialGradient>
        <radialGradient id="jw-turq" cx=".34" cy=".28" r=".95">
          <stop offset="0" stopColor="#5BDCC6" />
          <stop offset=".58" stopColor="#10C4A8" />
          <stop offset="1" stopColor="#04A88F" />
        </radialGradient>
        <radialGradient id="jw-yellow" cx=".34" cy=".28" r=".95">
          <stop offset="0" stopColor="#FFE18A" />
          <stop offset=".58" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#F0B429" />
        </radialGradient>
      </defs>
    </svg>
  )
}
