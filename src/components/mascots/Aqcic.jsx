/**
 * Aqcic (le petit garçon) — celebrating, arms up.
 * House style: no face, no eyes; blush + posture only.
 *
 * NOTE (v3) : plus référencé depuis qu'Akermus (mascotte figuier de barbarie)
 * anime les leçons — conservé délibérément : la famille (Aqcic, Taqcict,
 * Yemma, Baba, Setti, Jeddi) reviendra sur l'accueil et les écrans du monde.
 */
export function Aqcic({ height = 150, className = '' }) {
  return (
    <svg
      viewBox="0 0 140 170"
      height={height}
      width={(height * 140) / 170}
      className={className}
      role="img"
      aria-label="Aqcic, bravo"
    >
      <ellipse cx="70" cy="162" rx="32" ry="6" fill="#1E2530" opacity=".08" />
      <rect x="58" y="118" width="11" height="28" rx="5.5" fill="#3a4250" />
      <rect x="71" y="118" width="11" height="28" rx="5.5" fill="#3a4250" />
      <ellipse cx="61" cy="147" rx="9" ry="4.5" fill="#FF6F61" />
      <ellipse cx="79" cy="147" rx="9" ry="4.5" fill="#FF6F61" />
      <path d="M48 120 L48 84 Q48 66 70 66 Q92 66 92 84 L92 120 Q70 128 48 120 Z" fill="#10C4A8" />
      <path
        d="M60 80 l4 -6 l4 6 l4 -6 l4 6"
        stroke="#FF6F61"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M50 84 Q36 74 34 56" stroke="#10C4A8" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="53" r="6.5" fill="#EBB98F" />
      <path d="M90 84 Q104 74 106 56" stroke="#10C4A8" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="107" cy="53" r="6.5" fill="#EBB98F" />
      <circle cx="70" cy="42" r="23" fill="#EBB98F" />
      <circle cx="47" cy="42" r="4.5" fill="#EBB98F" />
      <circle cx="93" cy="42" r="4.5" fill="#EBB98F" />
      <path
        d="M47 40 Q46 15 70 15 Q94 15 93 40 Q90 29 80 28 Q78 21 70 21 Q62 21 60 28 Q50 29 47 40 Z"
        fill="#2b2118"
      />
      <ellipse cx="59" cy="48" rx="4" ry="2.6" fill="#FF6F61" opacity=".5" />
      <ellipse cx="81" cy="48" rx="4" ry="2.6" fill="#FF6F61" opacity=".5" />
    </svg>
  )
}
