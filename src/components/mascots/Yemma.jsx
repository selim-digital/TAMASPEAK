/**
 * Yemma (la maman) — Tama Speak mascot.
 * House style: no face, no eyes. Personality via posture, dress
 * (taqendurt + coral foudha) and subtle coral blush.
 */
export function Yemma({ height = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 140 170"
      height={height}
      width={(height * 140) / 170}
      className={className}
      role="img"
      aria-label="Yemma, la maman"
    >
      <ellipse cx="70" cy="164" rx="36" ry="6" fill="#1E2530" opacity=".08" />
      <path d="M70 66 L102 156 Q70 165 38 156 Z" fill="#10C4A8" />
      <path d="M70 66 L70 156" stroke="#04A88F" strokeWidth="3" />
      <path
        d="M70 86 l5 -7 l5 7 l5 -7 l5 7 M70 86 l-5 -7 l-5 7 l-5 -7 l-5 7"
        stroke="#FF6F61"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 148 Q70 156 100 148" stroke="#FF6F61" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M42 80 Q30 100 34 126" stroke="#10C4A8" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="128" r="7" fill="#E7B085" />
      <path d="M98 80 Q110 100 106 126" stroke="#10C4A8" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="105" cy="128" r="7" fill="#E7B085" />
      <circle cx="70" cy="46" r="22" fill="#E7B085" />
      {/* foudha (headscarf) */}
      <path
        d="M45 50 Q43 18 70 18 Q97 18 95 50 Q95 36 87 66 L83 62 Q89 38 70 36 Q51 38 57 62 L53 66 Q45 36 45 50 Z"
        fill="#ef5646"
      />
      <path d="M47 34 Q70 18 93 34 Q70 26 47 34 Z" fill="#FF8577" />
      <path
        d="M52 34 l4.5 -5 l4.5 5 l4.5 -5 l4.5 5 l4.5 -5 l4.5 5"
        stroke="#F6EEE0"
        strokeWidth="2.1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* fibula */}
      <circle cx="70" cy="72" r="4.5" fill="#F6EEE0" stroke="#04A88F" strokeWidth="1.6" />
      <circle cx="70" cy="72" r="1.8" fill="#FF6F61" />
      {/* blush */}
      <ellipse cx="59" cy="52" rx="4.2" ry="2.8" fill="#FF6F61" opacity=".5" />
      <ellipse cx="81" cy="52" rx="4.2" ry="2.8" fill="#FF6F61" opacity=".5" />
    </svg>
  )
}
