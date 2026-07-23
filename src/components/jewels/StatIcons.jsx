/**
 * Icônes-bijoux des statistiques (v3) : petit serti d'argent + matière émaillée.
 * Remplacent les emojis 🔥 ◆ 🪙 du chrome. Nécessitent <JewelDefs/> monté dans App.
 */
function Bezel({ size, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="25" fill="url(#jw-silver)" />
      <circle cx="28" cy="28" r="20.5" fill="var(--color-cream)" />
      {children}
    </svg>
  )
}

/** Série (streak) — flamme en cabochon de corail. */
export function FlameIcon({ size = 22 }) {
  return (
    <Bezel size={size}>
      <path
        d="M28 12c5 6.5 9 10.5 9 16.6 0 5.6-4 9.4-9 9.4s-9-3.8-9-9.4c0-4.1 1.8-6.9 4.2-10 .9 1.9 2 3.1 3.3 3.9-.4-3.6.1-7 1.5-10.5z"
        fill="url(#jw-coral)"
      />
      <ellipse cx="24.6" cy="22" rx="3" ry="4.4" fill="rgba(255,255,255,.34)" transform="rotate(-18 24.6 22)" />
    </Bezel>
  )
}

/** XP — étoile en émail bleu cobalt. */
export function StarIcon({ size = 22 }) {
  return (
    <Bezel size={size}>
      <path d="M28 11.5l4.1 8.6 9.4 1.2-6.9 6.5 1.8 9.3L28 32.6l-8.4 4.5 1.8-9.3-6.9-6.5 9.4-1.2z" fill="#2E7BDA" />
      <ellipse cx="24" cy="20.6" rx="3.4" ry="2.5" fill="rgba(255,255,255,.35)" transform="rotate(-20 24 20.6)" />
    </Bezel>
  )
}

/** Gemmes — taillée en émail jaune. */
export function GemIcon({ size = 22 }) {
  return (
    <Bezel size={size}>
      <path d="M19.5 16h17L42 24.5 28 42 14 24.5z" fill="url(#jw-yellow)" />
      <path d="M14 24.5h28M19.5 16L28 24.5 36.5 16M28 24.5V42" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" />
    </Bezel>
  )
}
