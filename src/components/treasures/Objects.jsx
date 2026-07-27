/**
 * Objets amazighs — du quotidien et de l'histoire.
 *
 * Récompenses de coffre, au même format que les plats (viewBox 130×96) pour
 * être interchangeables. Même règle maison que partout ailleurs : **objets
 * uniquement**, formes géométriques, aucun visage, aucun regard, rien qui
 * puisse constituer une représentation à vénérer.
 *
 * C'est aussi pourquoi la pièce numide et l'art rupestre du Tassili ne sont
 * PAS représentés par leurs figures : la monnaie de Massinissa porte un
 * portrait, les fresques du Tassili des personnages. On montre ici la stèle
 * inscrite et la roche gravée de motifs — ce qui est de toute façon le plus
 * juste historiquement, puisque c'est l'ÉCRITURE qui fait l'événement.
 *
 * Les notes historiques sont sourcées et volontairement courtes : une
 * récompense doit apprendre quelque chose en trois secondes.
 */

const W = 130
const H = 96
const box = (width) => ({ width, height: Math.round((width * H) / W), viewBox: `0 0 ${W} ${H}` })
const Ombre = ({ rx = 40 }) => <ellipse cx="65" cy="89" rx={rx} ry="4.5" fill="rgba(0,0,0,.08)" />

/* ---------------------------------------------------------------- */
/* Le quotidien                                                      */
/* ---------------------------------------------------------------- */

/** Aqbuc — la poterie peinte, décor géométrique de Grande Kabylie. */
function Aqbuc({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={30} />
      <path d="M52 20h26l-3 9c9 5 15 15 15 27 0 17-12 29-25 29S40 73 40 56c0-12 6-22 15-27z" fill="#EFE3CF" />
      <path d="M52 20h26l-3 9c9 5 15 15 15 27 0 17-12 29-25 29S40 73 40 56c0-12 6-22 15-27z" fill="#F6EEE0" />
      <path d="M41 50h48" stroke="#D8442E" strokeWidth="3" />
      <path d="M41 72h48" stroke="#D8442E" strokeWidth="3" />
      {/* Bande de losanges : le motif le plus répandu de la poterie kabyle. */}
      <path
        d="M45 61l5-6 5 6-5 6zM57 61l5-6 5 6-5 6zM69 61l5-6 5 6-5 6zM81 61l4-5 4 5-4 5z"
        fill="none"
        stroke="#1E2530"
        strokeWidth="1.7"
      />
      <path d="M46 40h38M50 33h30" stroke="#D8442E" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 20h26l-3 9H55z" fill="#EFE3CF" />
    </svg>
  )
}

/** Tasirt — le moulin à bras, deux meules et sa poignée de bois. */
function Tasirt({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={38} />
      <ellipse cx="65" cy="74" rx="40" ry="12" fill="#9AA3AC" />
      <rect x="25" y="58" width="80" height="16" fill="#AEB6BE" />
      <ellipse cx="65" cy="58" rx="40" ry="12" fill="#C6CDD4" />
      <ellipse cx="65" cy="52" rx="34" ry="10" fill="#BFC7CF" />
      <rect x="31" y="40" width="68" height="12" fill="#D3D9DE" />
      <ellipse cx="65" cy="40" rx="34" ry="10" fill="#E2E7EB" />
      <ellipse cx="65" cy="40" rx="9" ry="3" fill="#8E979F" />
      {/* La poignée verticale, en bois d'olivier. */}
      <rect x="93" y="20" width="6" height="26" rx="3" fill="#B07A3C" />
      <ellipse cx="96" cy="19" rx="5" ry="3.4" fill="#C68F4E" />
      <path d="M38 47h54" stroke="#AEB6BE" strokeWidth="1.4" opacity=".7" />
    </svg>
  )
}

/** Azetta — le métier à tisser vertical, dressé dans la pièce commune. */
function Azetta({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={34} />
      <rect x="28" y="14" width="7" height="72" rx="3" fill="#B07A3C" />
      <rect x="95" y="14" width="7" height="72" rx="3" fill="#B07A3C" />
      <rect x="24" y="12" width="82" height="8" rx="4" fill="#C68F4E" />
      <rect x="24" y="80" width="82" height="8" rx="4" fill="#C68F4E" />
      {/* Chaîne tendue, puis la partie déjà tissée. */}
      <path
        d="M40 20v60M47 20v60M54 20v60M61 20v60M68 20v60M75 20v60M82 20v60M89 20v60"
        stroke="#EFE3CF"
        strokeWidth="2"
      />
      <rect x="36" y="52" width="58" height="28" fill="#F6EEE0" />
      <path d="M36 58h58M36 74h58" stroke="#D8442E" strokeWidth="2.6" />
      <path
        d="M40 66l5-5 5 5-5 5zM52 66l5-5 5 5-5 5zM64 66l5-5 5 5-5 5zM76 66l5-5 5 5-5 5z"
        fill="#10C4A8"
      />
      <path d="M36 52h58" stroke="#B07A3C" strokeWidth="3" />
    </svg>
  )
}

/** Taqecwalt — le panier d'alfa, tressé en spirale. */
function Taqecwalt({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={32} />
      <path d="M36 44h58l-7 40H43z" fill="#E8D6AE" />
      <path d="M36 44h58l-7 40H43z" fill="#F0E2C0" />
      <path d="M38 54h54M40 64h50M42 74h46" stroke="#C9A96A" strokeWidth="2.4" />
      <path
        d="M44 44v40M54 44v40M65 44v40M76 44v40M86 44v40"
        stroke="#C9A96A"
        strokeWidth="1.3"
        opacity=".8"
      />
      <ellipse cx="65" cy="44" rx="29" ry="7" fill="#D9C494" />
      <ellipse cx="65" cy="43" rx="29" ry="6" fill="#F0E2C0" />
      {/* L'anse, arceau d'alfa torsadé. */}
      <path d="M45 42q20-26 40 0" fill="none" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" />
      <path d="M45 42q20-26 40 0" fill="none" stroke="#E8D6AE" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Tazerbit — le tapis, et ses losanges qui se lisent comme une phrase. */
function Tazerbit({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={42} />
      <rect x="18" y="20" width="94" height="64" rx="3" fill="#D8442E" />
      <rect x="22" y="24" width="86" height="56" fill="#F6EEE0" />
      <rect x="27" y="29" width="76" height="46" fill="#D8442E" />
      <rect x="31" y="33" width="68" height="38" fill="#1E2530" />
      <path
        d="M47 52l9-11 9 11-9 11zM74 52l9-11 9 11-9 11z"
        fill="none"
        stroke="#FFC93C"
        strokeWidth="2.6"
      />
      <path d="M56 52l-9 11h18zM83 52l-9 11h18z" fill="#10C4A8" />
      <path d="M35 40h5M35 52h5M35 64h5M90 40h5M90 52h5M90 64h5" stroke="#F6EEE0" strokeWidth="2.4" strokeLinecap="round" />
      {/* Les franges. */}
      <path d="M22 84v6M32 84v6M42 84v6M52 84v6M62 84v6M72 84v6M82 84v6M92 84v6M102 84v6" stroke="#EFE3CF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Abernus — le burnous de laine, capuche en pointe. */
function Abernus({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={33} />
      <path d="M65 12q13 0 13 13 0 8-6 12H58q-6-4-6-12 0-13 13-13z" fill="#EFE3CF" />
      <path d="M38 84q0-38 12-48h30q12 10 12 48z" fill="#F6EEE0" />
      <path d="M38 84q0-38 12-48h6q-6 14-6 48z" fill="#EFE3CF" />
      <path d="M80 36q12 10 12 48h-12q0-34-6-48z" fill="#EFE3CF" />
      <path d="M65 37v47" stroke="#D9CDB6" strokeWidth="2.2" />
      <path d="M52 46q13 6 26 0" fill="none" stroke="#D9CDB6" strokeWidth="2" />
      <path d="M65 12q13 0 13 13 0 8-6 12" fill="none" stroke="#D9CDB6" strokeWidth="2" />
      <path d="M46 82h38" stroke="#D8442E" strokeWidth="3" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* L'histoire                                                        */
/* ---------------------------------------------------------------- */

/**
 * La stèle bilingue de Dougga — le texte libyque et punique qui a permis
 * de déchiffrer l'alphabet libyque, ancêtre du tifinagh.
 */
function SteleDougga({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={28} />
      <path d="M44 86V26q0-12 21-12t21 12v60z" fill="#AEB6BE" />
      <path d="M44 86V26q0-12 21-12t21 12v60z" fill="#C6CDD4" />
      <path d="M75 14q11 3 11 12v60h-8V26q0-8-3-12z" fill="#AEB6BE" />
      <rect x="50" y="28" width="30" height="24" rx="1.5" fill="#9AA3AC" opacity=".35" />
      {/* Lignes libyques : traits, points et chevrons — pas des lettres à lire. */}
      <path d="M54 34h6M64 34h4M71 34h5M54 40h4M62 40h5M72 40h4M54 46h8M66 46h3M73 46h3" stroke="#57606A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="61" cy="34" r="1.3" fill="#57606A" />
      <circle cx="70" cy="40" r="1.3" fill="#57606A" />
      <path d="M52 60l4-5 4 5M62 60l4-5 4 5M72 60l4-5 4 5" fill="none" stroke="#57606A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 70h26M52 76h20" stroke="#57606A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M44 86h42" stroke="#8E979F" strokeWidth="3" />
    </svg>
  )
}

/** Le Medracen — mausolée royal numide, dans les Aurès. */
function Medracen({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={44} />
      <path d="M14 84h102l-8-10H22z" fill="#AEB6BE" />
      <rect x="22" y="56" width="86" height="18" fill="#C6CDD4" />
      <rect x="30" y="42" width="70" height="14" fill="#D3D9DE" />
      <rect x="38" y="30" width="54" height="12" fill="#C6CDD4" />
      <rect x="46" y="20" width="38" height="10" fill="#D3D9DE" />
      <rect x="55" y="13" width="20" height="7" fill="#C6CDD4" />
      {/* La colonnade dorique qui ceint le tambour. */}
      <path
        d="M28 56v18M38 56v18M48 56v18M58 56v18M68 56v18M78 56v18M88 56v18M98 56v18"
        stroke="#9AA3AC"
        strokeWidth="2.6"
      />
      <path d="M22 56h86" stroke="#8E979F" strokeWidth="2.4" />
      <path d="M30 42h70M38 30h54M46 20h38" stroke="#9AA3AC" strokeWidth="1.6" />
    </svg>
  )
}

/** Ifran — la roche gravée du Tassili, motifs et spirales. */
function Ifran({ width = 150 }) {
  return (
    <svg {...box(width)} aria-hidden="true">
      <Ombre rx={40} />
      <path d="M20 84q-4-40 14-54 20-16 44-8 22 8 26 30 3 18-4 32z" fill="#C68F4E" />
      <path d="M20 84q-4-40 14-54 20-16 44-8-30 6-40 24-9 17-6 38z" fill="#D9A567" />
      <path d="M28 78q28 5 72 0" stroke="#A9743A" strokeWidth="2" fill="none" />
      {/* Gravures : spirale, chevrons, damier — motifs géométriques seuls. */}
      <path
        d="M46 46a5 5 0 1 1-4 5 9 9 0 1 1 9-9"
        fill="none"
        stroke="#7C5326"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M64 38l5 7 5-7M64 48l5 7 5-7" fill="none" stroke="#7C5326" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M84 40h5v5h-5zM89 45h5v5h-5zM84 50h5v5h-5z" fill="#7C5326" />
      <path d="M44 64h18M70 64h14" stroke="#7C5326" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M52 68v6M78 68v6" stroke="#7C5326" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Les objets, avec ce qu'ils apprennent.
 *
 * `note` tient en une ligne : c'est un écran de récompense, pas un article.
 * Les faits historiques sont vérifiables — Dougga et le Medracen sont deux
 * monuments réels, datés, et le lien de la stèle avec le déchiffrement de
 * l'alphabet libyque est établi.
 */
export const OBJETS = [
  {
    id: 'aqbuc',
    name: 'Aqbuc',
    fr: 'la poterie peinte',
    note: 'Ses losanges se transmettent de mère en fille.',
    epoque: 'quotidien',
    Art: Aqbuc,
  },
  {
    id: 'tasirt',
    name: 'Tasirt',
    fr: 'le moulin à bras',
    note: 'Deux meules, et le grain de toute la maison.',
    epoque: 'quotidien',
    Art: Tasirt,
  },
  {
    id: 'azetta',
    name: 'Azetta',
    fr: 'le métier à tisser',
    note: 'On y dresse le tapis debout, contre le mur.',
    epoque: 'quotidien',
    Art: Azetta,
  },
  {
    id: 'taqecwalt',
    name: 'Taqecwalt',
    fr: 'le panier d’alfa',
    note: 'Tressé avec l’herbe des hauts plateaux.',
    epoque: 'quotidien',
    Art: Taqecwalt,
  },
  {
    id: 'tazerbit',
    name: 'Tazerbit',
    fr: 'le tapis',
    note: 'Chaque motif porte un sens — c’est une écriture.',
    epoque: 'quotidien',
    Art: Tazerbit,
  },
  {
    id: 'abernus',
    name: 'Abernus',
    fr: 'le burnous',
    note: 'Un manteau de laine, une capuche, et l’hiver passe.',
    epoque: 'quotidien',
    Art: Abernus,
  },
  {
    id: 'dougga',
    name: 'Dougga',
    fr: 'la stèle bilingue',
    note: 'Son texte libyque et punique a permis de déchiffrer l’alphabet libyque.',
    epoque: 'histoire',
    Art: SteleDougga,
  },
  {
    id: 'medracen',
    name: 'Medracen',
    fr: 'le mausolée numide',
    note: 'Un tombeau royal des Aurès, dressé bien avant Rome.',
    epoque: 'histoire',
    Art: Medracen,
  },
  {
    id: 'ifran',
    name: 'Ifran',
    fr: 'la roche gravée',
    note: 'Au Tassili, on grave la pierre depuis des millénaires.',
    epoque: 'histoire',
    Art: Ifran,
  },
]
