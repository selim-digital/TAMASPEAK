/**
 * Médaillon « tabzimt » — la fibule ronde émaillée d'Ath Yenni, langage des
 * récompenses de Tama Speak. Serti argent, 4 émaux (cobalt/vert/jaune/bleu vif)
 * qui se relaient (dashoffsets multiples de 21), cabochons de corail.
 * Présenté comme un bijou d'artisanat — jamais comme un talisman.
 * Nécessite <JewelDefs/> monté dans App.
 */
export function Tabzimt({ size = 120, animate = false, rays = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      aria-hidden="true"
      className={`${animate ? 'animate-tabz-in' : ''} ${className}`}
    >
      {rays && (
        <g stroke="#FFC93C" strokeWidth="3" strokeLinecap="round" className="animate-pop" style={{ animationDelay: '450ms' }}>
          <line x1="75" y1="6" x2="75" y2="18" />
          <line x1="75" y1="132" x2="75" y2="144" />
          <line x1="6" y1="75" x2="18" y2="75" />
          <line x1="132" y1="75" x2="144" y2="75" />
          <line x1="26" y1="26" x2="35" y2="35" />
          <line x1="115" y1="115" x2="124" y2="124" />
          <line x1="124" y1="26" x2="115" y2="35" />
          <line x1="35" y1="115" x2="26" y2="124" />
        </g>
      )}
      <circle cx="75" cy="75" r="52" fill="url(#jw-silver)" />
      <g fill="url(#jw-coral)">
        <circle cx="75" cy="20" r="5" />
        <circle cx="75" cy="130" r="5" />
        <circle cx="20" cy="75" r="5" />
        <circle cx="130" cy="75" r="5" />
        <circle cx="36" cy="36" r="4" />
        <circle cx="114" cy="36" r="4" />
        <circle cx="36" cy="114" r="4" />
        <circle cx="114" cy="114" r="4" />
      </g>
      <circle cx="75" cy="75" r="40" fill="none" stroke="#1F5AA8" strokeWidth="11" strokeDasharray="21 63" transform="rotate(-90 75 75)" />
      <circle cx="75" cy="75" r="40" fill="none" stroke="#2C7F4F" strokeWidth="11" strokeDasharray="21 63" strokeDashoffset="-21" transform="rotate(-90 75 75)" />
      <circle cx="75" cy="75" r="40" fill="none" stroke="#F0B429" strokeWidth="11" strokeDasharray="21 63" strokeDashoffset="-42" transform="rotate(-90 75 75)" />
      <circle cx="75" cy="75" r="40" fill="none" stroke="#2E7BDA" strokeWidth="11" strokeDasharray="21 63" strokeDashoffset="-63" transform="rotate(-90 75 75)" />
      <circle cx="75" cy="75" r="46" fill="none" stroke="url(#jw-silver)" strokeWidth="3.5" />
      <circle cx="75" cy="75" r="33" fill="none" stroke="url(#jw-silver)" strokeWidth="3.5" />
      <circle cx="75" cy="75" r="29" fill="url(#jw-silver)" />
      <circle cx="75" cy="75" r="14" fill="url(#jw-coral)" />
      <ellipse cx="70" cy="69" rx="5" ry="3.5" fill="rgba(255,255,255,.35)" transform="rotate(-24 70 69)" />
    </svg>
  )
}
