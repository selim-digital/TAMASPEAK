/**
 * Tama Speak logo system.
 * The yaz (ⵣ) — mark of Amazigh identity — drawn as SVG.
 * `YazMark` uses currentColor for the strokes so it adapts to context
 * (white on turquoise, ink on sand, etc.); the head-dot stays coral.
 */
export function YazMark({ size = 48, className = '', headColor = 'var(--color-coral)' }) {
  return (
    <svg
      width={size}
      height={(size * 46) / 42}
      viewBox="0 0 42 46"
      className={className}
      role="img"
      aria-label="Symbole yaz"
    >
      <g stroke="currentColor" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M21 12V40" />
        <path d="M8 6 C8 16,34 16,34 6" />
        <path d="M12 40H30" />
      </g>
      <circle cx="21" cy="7" r="4.7" fill={headColor} />
    </svg>
  )
}

/** Rounded-square app icon: white yaz on a turquoise tile. */
export function AppIcon({ size = 72, className = '' }) {
  return (
    <div
      className={`grid place-items-center rounded-[22px] bg-gradient-to-br from-turquoise to-turquoise-dark text-white shadow-lg shadow-turquoise/30 ${className}`}
      style={{ width: size, height: size }}
    >
      <YazMark size={size * 0.55} />
    </div>
  )
}

/** Duo-tone wordmark: "Tama" (turquoise) + "Speak" (coral). */
export function Wordmark({ className = '' }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      <span className="text-turquoise-deep">Tama</span>
      <span className="text-coral-dark">Speak</span>
    </span>
  )
}

/** Full horizontal lockup: icon + wordmark. */
export function LogoLockup({ iconSize = 44, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AppIcon size={iconSize} className="rounded-[13px]" />
      <Wordmark className="text-2xl" />
    </div>
  )
}
