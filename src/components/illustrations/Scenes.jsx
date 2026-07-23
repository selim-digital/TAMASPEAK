/**
 * Illustrations de situations quotidiennes (style maison : formes simples,
 * couleurs de marque, AUCUN visage ni yeux).
 * Chaque scène est exportée par identifiant et utilisée par les exercices « image ».
 */
const P = { turq: '#10C4A8', turqD: '#04A88F', turqDd: '#0a7a69', coral: '#FF6F61', coralD: '#ef5646', sand: '#F6EEE0', sand2: '#EFE3CF', ink: '#1E2530', wood: '#B07A4B', gold: '#E0A83E' }

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 200 140" role="img" aria-label={label} className="h-full w-full">
      <rect width="200" height="140" rx="14" fill={P.sand} />
      {children}
    </svg>
  )
}

/** Le thé (atay) — théière et verres, hospitalité kabyle. */
export function SceneTea() {
  return (
    <Frame label="Le thé">
      <ellipse cx="100" cy="120" rx="70" ry="7" fill={P.ink} opacity=".07" />
      <rect x="40" y="100" width="120" height="8" rx="4" fill={P.sand2} />
      {/* théière */}
      <path d="M62 98 L58 68 Q58 58 72 58 L104 58 Q118 58 118 68 L114 98 Z" fill={P.turq} />
      <path d="M118 70 Q136 72 134 84 Q133 92 120 92" stroke={P.turqD} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M58 70 Q44 66 40 78" stroke={P.turqD} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="74" y="48" width="28" height="10" rx="5" fill={P.turqD} />
      <circle cx="88" cy="46" r="5" fill={P.coral} />
      <path d="M66 78 h44" stroke={P.sand} strokeWidth="3" strokeLinecap="round" opacity=".7" />
      {/* verres */}
      <path d="M132 100 L130 82 h20 l-2 18 Z" fill="#ffffff" opacity=".9" />
      <path d="M132 96 L131 88 h18 l-1 8 Z" fill={P.gold} />
      <path d="M160 100 L158 86 h16 l-2 14 Z" fill="#ffffff" opacity=".9" />
      <path d="M160 97 L159 90 h14 l-1 7 Z" fill={P.gold} />
      {/* vapeur */}
      <path d="M86 40 q6 -8 0 -14 M96 40 q6 -8 0 -14" stroke={P.turqDd} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".55" />
    </Frame>
  )
}

/** Le pain (aɣrum). */
export function SceneBread() {
  return (
    <Frame label="Le pain">
      <ellipse cx="100" cy="112" rx="62" ry="7" fill={P.ink} opacity=".07" />
      <ellipse cx="100" cy="78" rx="54" ry="34" fill="#D9A05B" />
      <ellipse cx="100" cy="72" rx="54" ry="30" fill="#E8B871" />
      <path d="M62 62 q38 -14 76 0" stroke="#C98A45" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M74 84 q26 8 52 0" stroke="#C98A45" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />
      <circle cx="84" cy="70" r="2.5" fill="#C98A45" opacity=".8" />
      <circle cx="112" cy="76" r="2.5" fill="#C98A45" opacity=".8" />
      <circle cx="100" cy="64" r="2" fill="#C98A45" opacity=".8" />
    </Frame>
  )
}

/** L'eau (aman) — cruche qui verse. */
export function SceneWater() {
  return (
    <Frame label="L'eau">
      <ellipse cx="100" cy="120" rx="66" ry="7" fill={P.ink} opacity=".07" />
      <path d="M64 112 L58 66 Q58 52 76 52 L94 52 Q112 52 112 66 L106 112 Z" fill={P.coral} />
      <path d="M112 64 Q130 66 128 80 Q127 90 114 90" stroke={P.coralD} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="70" y="44" width="30" height="9" rx="4.5" fill={P.coralD} />
      <path d="M66 76 h38" stroke={P.sand} strokeWidth="3" strokeLinecap="round" opacity=".6" />
      {/* eau versée */}
      <path d="M138 60 q10 18 4 34" stroke={P.turq} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".85" />
      <ellipse cx="146" cy="104" rx="22" ry="8" fill={P.turq} opacity=".45" />
      <circle cx="152" cy="78" r="3" fill={P.turq} opacity=".7" />
    </Frame>
  )
}

/** La maison (axxam) — maison kabyle à toit de tuiles. */
export function SceneHouse() {
  return (
    <Frame label="La maison">
      <ellipse cx="100" cy="120" rx="70" ry="7" fill={P.ink} opacity=".07" />
      <rect x="52" y="66" width="96" height="52" rx="4" fill={P.sand2} />
      <path d="M42 68 L100 30 L158 68 Z" fill={P.coralD} />
      <path d="M42 68 L100 30 L158 68 Z" fill={P.coral} opacity=".75" />
      <rect x="88" y="88" width="24" height="30" rx="3" fill={P.wood} />
      <circle cx="107" cy="104" r="2" fill={P.gold} />
      <rect x="62" y="80" width="18" height="16" rx="3" fill={P.turq} />
      <rect x="120" y="80" width="18" height="16" rx="3" fill={P.turq} />
      <path d="M71 80 v16 M62 88 h18" stroke={P.sand} strokeWidth="2" />
      <path d="M129 80 v16 M120 88 h18" stroke={P.sand} strokeWidth="2" />
    </Frame>
  )
}

/** Le chat (amcic) — de dos/profil, sans yeux. */
export function SceneCat() {
  return (
    <Frame label="Le chat">
      <ellipse cx="100" cy="118" rx="52" ry="7" fill={P.ink} opacity=".07" />
      <path d="M74 116 q-4 -40 26 -40 q30 0 26 40 Z" fill={P.ink} />
      <circle cx="100" cy="66" r="24" fill={P.ink} />
      <path d="M80 50 l-4 -18 l18 9 Z" fill={P.ink} />
      <path d="M120 50 l4 -18 l-18 9 Z" fill={P.ink} />
      <path d="M84 52 l-2 -10 l9 5 Z" fill={P.coral} opacity=".55" />
      <path d="M116 52 l2 -10 l-9 5 Z" fill={P.coral} opacity=".55" />
      <path d="M126 112 q22 -6 16 -28" stroke={P.ink} strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="90" cy="72" rx="4" ry="2.6" fill={P.coral} opacity=".45" />
      <ellipse cx="110" cy="72" rx="4" ry="2.6" fill={P.coral} opacity=".45" />
      <circle cx="100" cy="74" r="3" fill={P.coral} />
    </Frame>
  )
}

/** Le village (taddart) — maisons et montagnes de Kabylie. */
export function SceneVillage() {
  return (
    <Frame label="Le village">
      <path d="M0 96 L44 52 L80 96 Z" fill={P.turqDd} opacity=".85" />
      <path d="M52 96 L104 44 L156 96 Z" fill={P.turqD} />
      <path d="M120 96 L168 58 L200 96 Z" fill={P.turqDd} opacity=".7" />
      <path d="M92 56 L104 44 L116 56 Z" fill={P.sand} opacity=".9" />
      <rect x="0" y="96" width="200" height="24" fill={P.sand2} />
      <rect x="26" y="82" width="26" height="20" rx="2" fill={P.sand} />
      <path d="M20 82 L39 68 L58 82 Z" fill={P.coral} />
      <rect x="72" y="86" width="22" height="16" rx="2" fill={P.sand} />
      <path d="M67 86 L83 74 L99 86 Z" fill={P.coralD} />
      <rect x="116" y="84" width="24" height="18" rx="2" fill={P.sand} />
      <path d="M111 84 L128 71 L145 84 Z" fill={P.coral} />
      <circle cx="172" cy="30" r="12" fill={P.gold} opacity=".9" />
    </Frame>
  )
}

/** La porte (tawwurt). */
export function SceneDoor() {
  return (
    <Frame label="La porte">
      <rect x="60" y="26" width="80" height="94" rx="6" fill={P.sand2} />
      <rect x="68" y="34" width="64" height="86" rx="4" fill={P.wood} />
      <path d="M78 44 h44 M78 62 h44 M78 80 h44 M78 98 h44" stroke="#8E5F36" strokeWidth="2.5" />
      <circle cx="122" cy="80" r="4.5" fill={P.gold} />
      <path d="M84 44 l8 -8 l8 8 l8 -8 l8 8" stroke={P.turq} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="100" cy="124" rx="46" ry="5" fill={P.ink} opacity=".07" />
    </Frame>
  )
}

/** Le livre (adlis). */
export function SceneBook() {
  return (
    <Frame label="Le livre">
      <ellipse cx="100" cy="112" rx="56" ry="7" fill={P.ink} opacity=".07" />
      <path d="M100 44 q-26 -12 -46 -4 v58 q20 -8 46 4 Z" fill={P.turq} />
      <path d="M100 44 q26 -12 46 -4 v58 q-20 -8 -46 4 Z" fill={P.turqD} />
      <path d="M100 44 v58" stroke={P.sand} strokeWidth="3" />
      <path d="M66 56 h22 M66 66 h22 M112 56 h22 M112 66 h22" stroke={P.sand} strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
      <circle cx="100" cy="34" r="7" fill={P.coral} />
    </Frame>
  )
}

export const SCENES = {
  tea: SceneTea,
  bread: SceneBread,
  water: SceneWater,
  house: SceneHouse,
  cat: SceneCat,
  village: SceneVillage,
  door: SceneDoor,
  book: SceneBook,
}

/** Rend une scène par identifiant. */
export function Scene({ id, className = '' }) {
  const Cmp = SCENES[id]
  if (!Cmp) return null
  return (
    <div className={className}>
      <Cmp />
    </div>
  )
}
