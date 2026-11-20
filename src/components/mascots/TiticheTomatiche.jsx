/**
 * Titiche et Tomatiche — le frère et la sœur des histoires
 * (data/histoires.js). Deux personnages NOUVEAUX, distincts d'Aqcic et de
 * Taqcict, mais dessinés à la même main que la famille (mascots/Family.jsx) :
 * silhouettes SANS VISAGE — jamais d'yeux —, l'émotion par la posture et les
 * joues corail posées bas, sous la bouche ; habits kabyles reconnaissables.
 *
 * Ce qui les distingue de la famille : Titiche porte le gilet safran et la
 * calotte rouge ; Tomatiche le foulard corail et la fouta rayée.
 */

export function Titiche({ height = 90 }) {
  const width = Math.round((height * 90) / 106)
  return (
    <svg width={width} height={height} viewBox="0 0 90 106" aria-hidden="true">
      <ellipse cx="45" cy="101" rx="19" ry="4" fill="rgba(0,0,0,.10)" />
      <rect x="20" y="52" width="8" height="23" rx="4" fill="#F1E4CE" />
      <rect x="62" y="52" width="8" height="23" rx="4" fill="#F1E4CE" />
      <path d="M45 46c11 0 17 7 17 17l3 25c1 7-9 10-20 10s-21-3-20-10l3-25c0-10 6-17 17-17z" fill="#FFF6E9" />
      {/* Le gilet safran, ouvert sur la tunique. */}
      <path d="M31 56c0-3.5 2-6 5-7v32c-3-1-5-3-5-6z" fill="#F0B429" />
      <path d="M59 56c0-3.5-2-6-5-7v32c3-1 5-3 5-6z" fill="#F0B429" />
      <rect x="29" y="74" width="32" height="5" rx="2.5" fill="#10C4A8" />
      <line x1="29" y1="76.5" x2="61" y2="76.5" stroke="#1E2530" strokeWidth="1.2" />
      <circle cx="45" cy="32" r="15" fill="#F5DFC2" />
      <path d="M45 15c12 0 19 8 19 19l-4 2c-1-9-7-13-15-13s-14 4-15 13l-4-2c0-11 7-19 19-19z" fill="#2b2420" />
      {/* La calotte rouge, posée sur le haut du crâne. */}
      <path d="M33 21c2-7 7-10 12-10s10 3 12 10c-4-2-8-3-12-3s-8 1-12 3z" fill="#D8442E" />
      <circle cx="45" cy="10.5" r="2" fill="#F0B429" />
      <path d="M41 42q4 3.5 8 0" fill="none" stroke="#C77E5E" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="36" cy="45" rx="4.8" ry="2.5" fill="#FF6F61" opacity=".5" />
      <ellipse cx="54" cy="45" rx="4.8" ry="2.5" fill="#FF6F61" opacity=".5" />
      <ellipse cx="38" cy="98" rx="5.5" ry="3" fill="#2b2420" />
      <ellipse cx="52" cy="98" rx="5.5" ry="3" fill="#2b2420" />
    </svg>
  )
}

export function Tomatiche({ height = 90 }) {
  const width = Math.round((height * 90) / 108)
  return (
    <svg width={width} height={height} viewBox="0 0 90 108" aria-hidden="true">
      <ellipse cx="45" cy="103" rx="20" ry="4" fill="rgba(0,0,0,.10)" />
      {/* Une seule natte, sur l'épaule, nouée d'une perle turquoise. */}
      <rect x="63" y="36" width="8" height="30" rx="4" fill="#2b2420" />
      <circle cx="67" cy="68" r="3.4" fill="#10C4A8" />
      <path d="M45 20c14 0 20 9 20 22l6 42c1 8-12 12-26 12s-27-4-26-12l6-42c0-13 6-22 20-22z" fill="#FFF3E2" />
      {/* La fouta rayée, nouée à la taille. */}
      <path d="M25 70h40l3 22c-7 3-39 3-46 0z" fill="#D8442E" />
      <path d="M24 77h42M23 84h44" stroke="#F0B429" strokeWidth="2.4" />
      <path d="M22.5 90h45" stroke="#1E2530" strokeWidth="1.6" />
      <rect x="25" y="67" width="40" height="5" rx="2.5" fill="#F0B429" />
      <circle cx="45" cy="34" r="15" fill="#F5DFC2" />
      {/* Le foulard corail, noué derrière. */}
      <path d="M45 14c12 0 20 8 20 20l-4 2c-1-9-7-13-16-13s-15 4-16 13l-4-2c0-12 8-20 20-20z" fill="#FF6F61" />
      <path d="M31 29q14-6 28 0" fill="none" stroke="#F0B429" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M41 44q4 3.5 8 0" fill="none" stroke="#C77E5E" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="36" cy="45.5" rx="5" ry="2.6" fill="#FF6F61" opacity=".5" />
      <ellipse cx="54" cy="45.5" rx="5" ry="2.6" fill="#FF6F61" opacity=".5" />
    </svg>
  )
}

/** Les deux ensemble, côte à côte — la vignette des histoires. */
export function TiticheEtTomatiche({ height = 70, className = '' }) {
  return (
    <span className={`flex items-end ${className}`} aria-hidden="true">
      <Titiche height={height} />
      <span style={{ marginLeft: -Math.round(height * 0.12) }}>
        <Tomatiche height={Math.round(height * 1.02)} />
      </span>
    </span>
  )
}
