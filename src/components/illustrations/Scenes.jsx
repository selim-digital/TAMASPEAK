/**
 * Illustrations de situations quotidiennes — style maison, deuxième
 * facture : compositions pleines (ciel, sol, frise de losanges), objets
 * détaillés, lumières et ombres douces. La règle ne change pas :
 * AUCUN visage, AUCUN œil — les êtres vivants sont des silhouettes.
 *
 * Chaque scène est exportée par identifiant et utilisée par les exercices
 * « image » et par le Mémory. Les dégradés portent des ids PRÉFIXÉS par
 * scène : plusieurs scènes cohabitent dans un même écran (tapis de
 * Mémory), et des ids en double se voleraient leurs couleurs.
 */
const P = {
  turq: '#10C4A8', turqD: '#04A88F', turqDd: '#0a7a69',
  coral: '#FF6F61', coralD: '#ef5646',
  sand: '#F6EEE0', sand2: '#EFE3CF', cream: '#FFFAF1',
  ink: '#1E2530', inkSoft: '#5A6470',
  wood: '#B07A4B', woodD: '#8E5F36',
  gold: '#E0A83E', goldD: '#C08A10',
  ciel: '#DFF3EE', cielD: '#C8EAE2',
}

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 200 140" role="img" aria-label={label} className="h-full w-full">
      <rect width="200" height="140" rx="14" fill={P.sand} />
      {children}
    </svg>
  )
}

/** Ciel dégradé plein cadre (id unique par scène). */
function Ciel({ id, haut = P.ciel, bas = P.sand }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={haut} />
          <stop offset="1" stopColor={bas} />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="14" fill={`url(#${id})`} />
    </>
  )
}

/** Frise de losanges tissés, discrète, en bas de scène. */
function Frise({ y = 128, couleur = P.turqDd, opacite = 0.16 }) {
  const points = []
  for (let x = 14; x <= 186; x += 16) {
    points.push(`M${x} ${y - 5} L${x + 6} ${y} L${x} ${y + 5} L${x - 6} ${y} Z`)
  }
  return <path d={points.join(' ')} fill="none" stroke={couleur} strokeWidth="1.4" opacity={opacite} />
}

/** Sol : bande de terre chaude + ombre portée douce sous l'objet. */
function Sol({ y = 108, ombreX = 100, ombreR = 58 }) {
  return (
    <>
      <rect x="0" y={y} width="200" height={140 - y} fill={P.sand2} />
      <rect x="0" y={y} width="200" height="2.5" fill={P.ink} opacity=".05" />
      <ellipse cx={ombreX} cy={y + 10} rx={ombreR} ry="6" fill={P.ink} opacity=".08" />
    </>
  )
}

/* ================= La maison & le village ================= */

/** Le thé (atay) — plateau, théière ciselée, verres dorés, vapeur. */
export function SceneTea() {
  return (
    <Frame label="Le thé">
      <Ciel id="g-tea" haut="#FCEFE3" />
      <Sol y={104} ombreX={100} ombreR={66} />
      <Frise />
      {/* plateau ciselé */}
      <ellipse cx="100" cy="106" rx="72" ry="12" fill={P.gold} />
      <ellipse cx="100" cy="103" rx="72" ry="11" fill="#EDC06A" />
      <ellipse cx="100" cy="103" rx="58" ry="8" fill="none" stroke={P.goldD} strokeWidth="1.2" opacity=".5" />
      {/* théière */}
      <path d="M64 96 L59 64 Q59 52 74 52 L102 52 Q117 52 117 64 L112 96 Z" fill={P.turq} />
      <path d="M64 96 L61 76 Q88 84 110 76 L108 96 Z" fill={P.turqD} opacity=".55" />
      <path d="M66 68 h44 M68 62 h40" stroke={P.cream} strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <path d="M70 74 l5 5 l-5 5 l-5 -5 Z M88 74 l5 5 l-5 5 l-5 -5 Z M106 74 l5 5 l-5 5 l-5 -5 Z" fill={P.cream} opacity=".4" />
      <path d="M117 64 Q136 66 134 80 Q133 90 116 90" stroke={P.turqD} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M59 66 Q42 62 38 76" stroke={P.turqD} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="72" y="42" width="32" height="10" rx="5" fill={P.turqD} />
      <circle cx="88" cy="38" r="5.5" fill={P.coral} />
      <circle cx="88" cy="36.5" r="2" fill="#FFD3CD" />
      {/* verres à thé */}
      <path d="M130 100 L128 78 h20 l-2 22 Z" fill="#fff" opacity=".92" />
      <path d="M130 96 L129 86 h18 l-1 10 Z" fill={P.gold} />
      <path d="M131 82 h16" stroke="#fff" strokeWidth="2" opacity=".8" />
      <path d="M156 100 L154 82 h17 l-2 18 Z" fill="#fff" opacity=".92" />
      <path d="M156 97 L155 89 h15 l-1 8 Z" fill={P.gold} />
      {/* vapeur */}
      <path d="M84 34 q7 -9 0 -16 M96 34 q7 -9 0 -16 M139 72 q5 -7 0 -12" stroke={P.turqDd} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".5" />
    </Frame>
  )
}

/** Le pain (aɣrum) — galette kesra sur panier tressé, épis de blé. */
export function SceneBread() {
  return (
    <Frame label="Le pain">
      <Ciel id="g-bread" haut="#FBEFD9" />
      <Sol y={108} ombreX={100} ombreR={62} />
      <Frise />
      {/* panier tressé */}
      <path d="M42 106 q58 16 116 0 l-6 14 q-52 12 -104 0 Z" fill={P.wood} />
      <path d="M46 110 q54 12 108 0 M50 116 q50 10 100 0" stroke={P.woodD} strokeWidth="2" fill="none" opacity=".6" />
      {/* galette */}
      <ellipse cx="100" cy="86" rx="56" ry="30" fill="#D9A05B" />
      <ellipse cx="100" cy="80" rx="56" ry="27" fill="#E8B871" />
      <ellipse cx="100" cy="78" rx="42" ry="18" fill="#F0C787" />
      <path d="M64 70 q36 -13 72 0" stroke="#C98A45" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".8" />
      {/* quadrillage de la kesra */}
      <path d="M76 66 l40 24 M96 62 l30 20 M116 62 l16 12 M124 66 l-48 22 M104 62 l-32 18 M84 63 l-14 10" stroke="#C98A45" strokeWidth="1.6" opacity=".55" />
      {/* épis de blé */}
      <g stroke={P.goldD} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".9">
        <path d="M30 104 q-2 -20 6 -34" />
        <path d="M36 70 l-7 -3 M36 76 l-8 -2 M35 82 l-8 -1 M36 70 l6 -5 M36 76 l7 -4 M35 82 l8 -3" />
        <path d="M170 104 q2 -22 -6 -36" />
        <path d="M164 68 l7 -4 M164 74 l8 -3 M165 80 l8 -2 M164 68 l-6 -5 M164 74 l-7 -4 M165 80 l-8 -3" />
      </g>
    </Frame>
  )
}

/** L'eau (aman) — cruche en terre qui verse, filet d'eau, éclaboussures. */
export function SceneWater() {
  return (
    <Frame label="L'eau">
      <Ciel id="g-water" haut={P.ciel} />
      <Sol y={110} ombreX={92} ombreR={64} />
      <Frise />
      {/* cruche en terre décorée */}
      <path d="M60 108 L54 62 Q54 46 76 46 L90 46 Q112 46 112 62 L106 108 Z" fill={P.coral} />
      <path d="M60 108 L57 84 Q83 92 104 84 L102 108 Z" fill={P.coralD} opacity=".5" />
      <rect x="66" y="38" width="34" height="10" rx="5" fill={P.coralD} />
      <path d="M112 58 Q132 60 130 76 Q129 88 112 88" stroke={P.coralD} strokeWidth="6.5" fill="none" strokeLinecap="round" />
      {/* motif berbère peint sur la panse */}
      <path d="M62 70 h42" stroke={P.cream} strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
      <path d="M70 63 l6 7 l-6 7 l-6 -7 Z M96 63 l6 7 l-6 7 l-6 -7 Z" fill="none" stroke={P.cream} strokeWidth="2" opacity=".8" />
      <path d="M83 60 l5 10 l-5 10 l-5 -10 Z" fill={P.cream} opacity=".75" />
      {/* eau versée */}
      <path d="M136 52 q14 22 6 46" stroke={P.turq} strokeWidth="8" fill="none" strokeLinecap="round" opacity=".9" />
      <path d="M138 56 q10 18 5 38" stroke="#7FE0CF" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9" />
      <ellipse cx="146" cy="106" rx="26" ry="9" fill={P.turq} opacity=".5" />
      <ellipse cx="146" cy="104" rx="18" ry="5" fill="#7FE0CF" opacity=".6" />
      <circle cx="160" cy="80" r="3" fill={P.turq} opacity=".7" />
      <circle cx="128" cy="90" r="2.4" fill={P.turq} opacity=".7" />
      <circle cx="166" cy="94" r="2" fill={P.turq} opacity=".5" />
    </Frame>
  )
}

/** La maison (axxam) — pierre et tuiles, olivier, montagnes du Djurdjura. */
export function SceneHouse() {
  return (
    <Frame label="La maison">
      <Ciel id="g-house" />
      {/* montagnes */}
      <path d="M0 92 L46 44 L88 92 Z" fill={P.turqD} opacity=".35" />
      <path d="M120 92 L166 40 L200 92 Z" fill={P.turqD} opacity=".28" />
      <path d="M158 50 L166 40 L175 50 Z" fill="#fff" opacity=".8" />
      <Sol y={104} ombreX={96} ombreR={60} />
      <Frise />
      {/* corps de la maison */}
      <rect x="50" y="64" width="94" height="42" rx="3" fill={P.cream} />
      <path d="M50 64 h94 v6 H50 Z" fill={P.ink} opacity=".05" />
      {/* pierres apparentes */}
      <path d="M56 96 h10 M70 88 h9 M126 92 h10 M120 74 h8 M60 74 h8" stroke={P.inkSoft} strokeWidth="2" opacity=".25" strokeLinecap="round" />
      {/* toit de tuiles */}
      <path d="M40 66 L97 26 L154 66 Z" fill={P.coralD} />
      <path d="M44 63 L97 26 L150 63 L144 63 L97 31 L50 63 Z" fill={P.coral} />
      <path d="M60 56 L97 31 L134 56 M74 46 L97 31 L120 46" stroke="#D8442E" strokeWidth="2" fill="none" opacity=".6" />
      {/* porte à losange */}
      <rect x="86" y="76" width="22" height="30" rx="2.5" fill={P.wood} />
      <path d="M97 82 l5 6 l-5 6 l-5 -6 Z" fill="none" stroke={P.cream} strokeWidth="1.8" />
      <circle cx="103" cy="94" r="1.8" fill={P.gold} />
      {/* fenêtres */}
      <rect x="58" y="76" width="16" height="14" rx="2" fill={P.turq} />
      <rect x="120" y="76" width="16" height="14" rx="2" fill={P.turq} />
      <path d="M66 76 v14 M58 83 h16 M128 76 v14 M120 83 h16" stroke={P.cream} strokeWidth="1.6" />
      {/* olivier */}
      <path d="M30 104 q-1 -14 4 -22" stroke={P.woodD} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="72" r="11" fill="#5B7A3A" />
      <circle cx="40" cy="78" r="9" fill="#6B8B45" />
      <circle cx="22" cy="80" r="8" fill="#4A6830" />
    </Frame>
  )
}

/** Le chat (amcic) — silhouette assise de profil, sans yeux, sur un tapis. */
export function SceneCat() {
  return (
    <Frame label="Le chat">
      <Ciel id="g-cat" haut="#FCEFE3" />
      <Frise y={20} opacite={0.1} />
      <Sol y={106} ombreX={100} ombreR={52} />
      {/* petit tapis tissé */}
      <rect x="52" y="104" width="96" height="12" rx="3" fill={P.coral} opacity=".85" />
      <path d="M60 110 l4 -4 l4 4 l-4 4 Z M132 110 l4 -4 l4 4 l-4 4 Z" fill={P.cream} opacity=".8" />
      <path d="M76 106 h48" stroke={P.cream} strokeWidth="1.6" opacity=".6" />
      {/* silhouette : corps assis */}
      <path d="M78 106 Q74 66 100 62 Q124 60 124 88 L124 106 Z" fill={P.ink} />
      {/* poitrail */}
      <path d="M78 106 Q80 84 92 78 Q84 96 88 106 Z" fill={P.ink} />
      {/* tête de profil */}
      <circle cx="93" cy="52" r="17" fill={P.ink} />
      <path d="M80 42 l-3 -14 l14 8 Z" fill={P.ink} />
      <path d="M103 40 l5 -13 l-15 6 Z" fill={P.ink} />
      <path d="M82 41 l-1.5 -8 l8 4.5 Z" fill={P.coral} opacity=".5" />
      {/* museau et moustaches — pas d'yeux */}
      <path d="M76 54 q4 3 9 2" stroke={P.cream} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".5" />
      <path d="M74 50 l-12 -2 M75 54 l-12 2 M77 58 l-10 5" stroke={P.inkSoft} strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      {/* queue enroulée */}
      <path d="M124 100 q26 -2 24 -22 q-1 -12 -14 -12" stroke={P.ink} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* pattes avant */}
      <path d="M96 106 v-14 M108 106 v-16" stroke={P.ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M93 105 h8 M105 105 h8" stroke={P.sand2} strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
    </Frame>
  )
}

/** Le village (taddart) — crêtes du Djurdjura, toits serrés, soleil. */
export function SceneVillage() {
  return (
    <Frame label="Le village">
      <Ciel id="g-village" haut="#D5F0E9" />
      <circle cx="168" cy="30" r="13" fill={P.gold} />
      <circle cx="168" cy="30" r="17" fill={P.gold} opacity=".25" />
      {/* crêtes en profondeur */}
      <path d="M0 88 L48 40 L92 88 Z" fill={P.turqDd} opacity=".8" />
      <path d="M40 88 L104 30 L164 88 Z" fill={P.turqD} />
      <path d="M92 42 L104 30 L117 42 L110 42 L104 36 L98 42 Z" fill="#fff" opacity=".85" />
      <path d="M120 88 L172 46 L200 88 Z" fill={P.turqDd} opacity=".6" />
      <Sol y={96} ombreX={100} ombreR={80} />
      <Frise y={130} />
      {/* rangée de maisons */}
      <rect x="20" y="76" width="28" height="22" rx="2" fill={P.cream} />
      <path d="M14 78 L34 62 L54 78 Z" fill={P.coral} />
      <rect x="30" y="84" width="8" height="14" fill={P.wood} />
      <rect x="66" y="80" width="24" height="18" rx="2" fill={P.sand} />
      <path d="M61 81 L78 67 L95 81 Z" fill={P.coralD} />
      <rect x="73" y="86" width="7" height="12" fill={P.wood} />
      <rect x="108" y="78" width="27" height="20" rx="2" fill={P.cream} />
      <path d="M102 79 L121 63 L140 79 Z" fill={P.coral} />
      <rect x="112" y="84" width="8" height="7" rx="1" fill={P.turq} />
      <rect x="124" y="84" width="8" height="7" rx="1" fill={P.turq} />
      <rect x="150" y="82" width="24" height="16" rx="2" fill={P.sand} />
      <path d="M145 83 L162 70 L179 83 Z" fill={P.coralD} />
      {/* chemin */}
      <path d="M96 140 Q100 116 92 98" stroke={P.cream} strokeWidth="9" fill="none" strokeLinecap="round" opacity=".85" />
    </Frame>
  )
}

/** La porte (tawwurt) — porte cloutée sous arc, murs chaulés, lanterne. */
export function SceneDoor() {
  return (
    <Frame label="La porte">
      <Ciel id="g-door" haut="#FBEFD9" />
      <Frise y={14} opacite={0.12} />
      <Sol y={118} ombreX={100} ombreR={44} />
      {/* mur et arc */}
      <path d="M54 118 V54 Q54 24 100 24 Q146 24 146 54 V118 Z" fill={P.sand2} />
      <path d="M62 118 V56 Q62 32 100 32 Q138 32 138 56 V118 Z" fill={P.cream} />
      {/* zellige autour de l'arc */}
      <path d="M70 118 V58 Q70 40 100 40 Q130 40 130 58 V118" fill="none" stroke={P.turq} strokeWidth="3.5" />
      <path d="M74 100 l-6 0 M74 82 l-6 0 M132 100 l-6 0 M132 82 l-6 0 M84 46 l-4 -5 M116 46 l4 -5 M100 40 v-6" stroke={P.turq} strokeWidth="2" opacity=".6" />
      {/* battants de bois */}
      <path d="M76 118 V60 Q76 46 100 46 Q124 46 124 60 V118 Z" fill={P.wood} />
      <path d="M100 47 V118" stroke={P.woodD} strokeWidth="2.4" />
      <path d="M80 62 h16 M80 78 h16 M80 94 h16 M104 62 h16 M104 78 h16 M104 94 h16" stroke={P.woodD} strokeWidth="2" opacity=".75" />
      {/* clous et heurtoirs */}
      <g fill={P.gold}>
        <circle cx="84" cy="70" r="1.6" /><circle cx="92" cy="70" r="1.6" /><circle cx="108" cy="70" r="1.6" /><circle cx="116" cy="70" r="1.6" />
        <circle cx="84" cy="86" r="1.6" /><circle cx="92" cy="86" r="1.6" /><circle cx="108" cy="86" r="1.6" /><circle cx="116" cy="86" r="1.6" />
      </g>
      <circle cx="94" cy="104" r="3.5" fill="none" stroke={P.gold} strokeWidth="2" />
      <circle cx="106" cy="104" r="3.5" fill="none" stroke={P.gold} strokeWidth="2" />
      {/* lanterne */}
      <path d="M40 44 v10" stroke={P.ink} strokeWidth="2" />
      <path d="M35 54 h10 l2 12 h-14 Z" fill={P.gold} />
      <path d="M37 56 h6 l1.4 8 h-8.8 Z" fill="#F7DFA6" />
      {/* seuil */}
      <rect x="70" y="116" width="60" height="5" rx="2" fill={P.woodD} opacity=".5" />
    </Frame>
  )
}

/** Le livre (adlis) — livre ouvert, lignes d'écriture, signet, yaz. */
export function SceneBook() {
  return (
    <Frame label="Le livre">
      <Ciel id="g-book" haut={P.ciel} />
      <Frise y={16} opacite={0.12} />
      <Sol y={112} ombreX={100} ombreR={62} />
      {/* couverture */}
      <path d="M100 44 q-30 -13 -52 -4 v62 q22 -9 52 4 Z" fill={P.turqD} />
      <path d="M100 44 q30 -13 52 -4 v62 q-22 -9 -52 4 Z" fill={P.turqDd} />
      {/* pages */}
      <path d="M100 48 q-26 -11 -44 -4 v54 q18 -7 44 4 Z" fill={P.cream} />
      <path d="M100 48 q26 -11 44 -4 v54 q-18 -7 -44 4 Z" fill="#fff" />
      <path d="M100 48 v54" stroke={P.sand2} strokeWidth="2.4" />
      {/* lignes d'écriture */}
      <g stroke={P.inkSoft} strokeWidth="2" strokeLinecap="round" opacity=".5">
        <path d="M64 58 h24 M64 66 h28 M64 74 h22 M64 82 h27 M64 90 h18" />
        <path d="M112 58 h24 M112 66 h20 M112 74 h26 M112 82 h18" />
      </g>
      {/* yaz sur la page droite */}
      <g stroke={P.coralD} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M124 88 v10 M117 88 c0 6 14 6 14 0 M118 98 h12" />
      </g>
      {/* signet */}
      <path d="M136 42 v22 l5 -5 l5 5 V40" fill={P.coral} />
    </Frame>
  )
}

/* ================= Météo ================= */

/** Le soleil (tafukt) — plein ciel au-dessus des crêtes. */
export function SceneSun() {
  return (
    <Frame label="Le soleil">
      <Ciel id="g-sun" haut="#FFF3D6" bas="#FBE7C2" />
      <circle cx="100" cy="62" r="40" fill={P.gold} opacity=".22" />
      <circle cx="100" cy="62" r="30" fill={P.gold} />
      <circle cx="100" cy="62" r="22" fill="#F5C860" />
      <circle cx="92" cy="54" r="7" fill="#FBDf95" opacity=".9" />
      <g stroke={P.gold} strokeWidth="5.5" strokeLinecap="round">
        <path d="M100 14 v-6 M100 116 v-6 M52 62 h-10 M158 62 h-10" />
        <path d="M66 28 l-7 -7 M141 96 l7 7 M134 28 l7 -7 M59 96 l-7 7" />
      </g>
      {/* crêtes au loin */}
      <path d="M0 124 L36 96 L70 124 Z" fill={P.turqDd} opacity=".5" />
      <path d="M52 124 L96 88 L138 124 Z" fill={P.turqD} opacity=".55" />
      <path d="M120 124 L158 94 L200 124 Z" fill={P.turqDd} opacity=".45" />
      <rect x="0" y="122" width="200" height="18" fill={P.sand2} />
      <Frise y={131} />
    </Frame>
  )
}

/** La pluie (ageffur) — nuages pleins, rideau de pluie, flaque, pousse. */
export function SceneRain() {
  return (
    <Frame label="La pluie">
      <Ciel id="g-rain" haut="#DCE7EC" bas="#EDF2F0" />
      <ellipse cx="82" cy="46" rx="38" ry="24" fill="#B9C6CE" />
      <ellipse cx="120" cy="52" rx="30" ry="20" fill="#CBD6DC" />
      <ellipse cx="98" cy="38" rx="26" ry="17" fill="#DDE5EA" />
      <g stroke={P.turq} strokeWidth="4.5" strokeLinecap="round" opacity=".9">
        <path d="M64 82 l-5 18 M88 84 l-5 20 M112 82 l-5 18 M134 84 l-5 16" />
        <path d="M76 108 l-3 10 M100 110 l-3 10 M124 106 l-3 10" opacity=".6" />
      </g>
      <rect x="0" y="124" width="200" height="16" fill={P.sand2} />
      <ellipse cx="96" cy="127" rx="30" ry="4.5" fill={P.turq} opacity=".4" />
      {/* pousse qui boit */}
      <path d="M160 124 q0 -10 2 -16 M162 112 q6 -3 9 -9 M162 116 q-6 -2 -8 -8" stroke="#4A6830" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Frise y={133} opacite={0.12} />
    </Frame>
  )
}

/** La neige (adfel) — crêtes blanchies, maison, flocons dessinés. */
export function SceneSnow() {
  return (
    <Frame label="La neige">
      <Ciel id="g-snow" haut="#E4EEF4" bas="#F3F6F5" />
      <path d="M20 112 L74 48 L126 112 Z" fill={P.turqD} opacity=".75" />
      <path d="M58 68 L74 48 L91 68 L83 68 L74 58 L66 68 Z" fill="#fff" />
      <path d="M104 112 L152 62 L200 112 Z" fill={P.turqDd} opacity=".6" />
      <path d="M138 78 L152 62 L167 78 L160 78 L152 70 L145 78 Z" fill="#fff" opacity=".9" />
      {/* maison sous la neige */}
      <rect x="30" y="96" width="26" height="18" rx="2" fill={P.cream} />
      <path d="M25 97 L43 82 L61 97 Z" fill={P.coralD} />
      <path d="M27 95 L43 82 L59 95 L54 95 L43 86 L32 95 Z" fill="#fff" />
      <rect x="38" y="102" width="8" height="12" fill={P.wood} />
      {/* sol enneigé */}
      <path d="M0 116 q50 -8 100 0 t100 0 V140 H0 Z" fill="#fff" />
      {/* flocons */}
      <g stroke="#9FB9C8" strokeWidth="2.2" strokeLinecap="round">
        <path d="M150 30 v12 M144 36 h12 M146 32 l8 8 M154 32 l-8 8" />
        <path d="M104 22 v9 M99.5 26.5 h9 M101 23 l6 6 M107 23 l-6 6" opacity=".8" />
        <path d="M176 52 v9 M171.5 56.5 h9 M173 53 l6 6 M179 53 l-6 6" opacity=".7" />
        <path d="M28 40 v9 M23.5 44.5 h9 M25 41 l6 6 M31 41 l-6 6" opacity=".7" />
      </g>
    </Frame>
  )
}

/** Le nuage (asigna) — ciel voilé, nuages étagés. */
export function SceneCloud() {
  return (
    <Frame label="Le nuage">
      <Ciel id="g-cloud" haut="#DEE9EE" bas="#F1F1EA" />
      <ellipse cx="146" cy="34" rx="26" ry="12" fill="#E8EEF2" opacity=".9" />
      <ellipse cx="40" cy="42" rx="22" ry="10" fill="#E8EEF2" opacity=".8" />
      {/* nuage principal en trois masses */}
      <ellipse cx="78" cy="82" rx="38" ry="25" fill="#CBD6DC" />
      <ellipse cx="120" cy="86" rx="32" ry="21" fill="#B9C6CE" />
      <ellipse cx="100" cy="66" rx="30" ry="20" fill="#DDE5EA" />
      <ellipse cx="92" cy="60" rx="12" ry="7" fill="#EDF2F5" />
      <path d="M46 96 q54 14 108 0" stroke="#A9B9C2" strokeWidth="2" fill="none" opacity=".5" />
      <rect x="0" y="124" width="200" height="16" fill={P.sand2} />
      <Frise y={133} opacite={0.12} />
    </Frame>
  )
}

/** Le vent (aḍu) — bourrasques, arbre penché, feuilles envolées. */
export function SceneWind() {
  return (
    <Frame label="Le vent">
      <Ciel id="g-wind" haut={P.ciel} bas="#F2EEDF" />
      <g stroke={P.turqD} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M26 44 h64 q16 0 16 -11 q0 -11 -12 -9" />
        <path d="M20 68 h92 q18 0 18 13 q0 13 -15 11" />
        <path d="M32 92 h52 q14 0 14 9" opacity=".8" />
      </g>
      {/* arbre penché par la bourrasque */}
      <path d="M162 122 q2 -18 -8 -30" stroke={P.woodD} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="146" cy="82" r="13" fill="#5B7A3A" />
      <circle cx="134" cy="90" r="9" fill="#4A6830" />
      <circle cx="158" cy="90" r="8" fill="#6B8B45" />
      {/* feuilles emportées */}
      <g fill="#6B8B45">
        <path d="M104 30 q6 -4 10 0 q-6 4 -10 0" />
        <path d="M120 54 q6 -4 10 0 q-6 4 -10 0" opacity=".8" />
        <path d="M88 20 q5 -3 8 0 q-5 3 -8 0" opacity=".7" />
      </g>
      <rect x="0" y="122" width="200" height="18" fill={P.sand2} />
      <path d="M8 122 q40 -6 80 0" stroke={P.inkSoft} strokeWidth="1.6" opacity=".25" fill="none" />
      <Frise y={131} />
    </Frame>
  )
}

/* ================= Marché ================= */

/** Le marché (ssuq) — auvent rayé, étal, sacs d'épices, poterie. */
export function SceneSouk() {
  return (
    <Frame label="Le marché">
      <Ciel id="g-souk" haut="#FBEFD9" />
      <Sol y={116} ombreX={100} ombreR={78} />
      <Frise y={131} />
      {/* auvent rayé */}
      <path d="M24 34 h152 l6 14 H18 Z" fill={P.coral} />
      <path d="M38 34 l4 14 M62 34 l3 14 M86 34 l2 14 M110 34 l-2 14 M134 34 l-3 14 M158 34 l-4 14" stroke={P.cream} strokeWidth="7" opacity=".85" />
      <path d="M18 48 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 22 0 v-4 H18 Z" fill={P.coralD} />
      {/* montants */}
      <rect x="28" y="48" width="6" height="70" rx="2" fill={P.wood} />
      <rect x="166" y="48" width="6" height="70" rx="2" fill={P.wood} />
      {/* étal */}
      <rect x="40" y="92" width="120" height="26" rx="4" fill={P.wood} />
      <path d="M44 98 h112" stroke={P.woodD} strokeWidth="2" opacity=".6" />
      {/* sacs d'épices coniques */}
      <path d="M52 92 q0 -18 14 -18 q14 0 14 18 Z" fill={P.sand} />
      <path d="M56 92 q10 -26 10 -26 q10 8 10 26 Z" fill={P.gold} />
      <path d="M88 92 q0 -16 12 -16 q12 0 12 16 Z" fill={P.sand} />
      <path d="M92 92 q8 -22 8 -22 q9 7 9 22 Z" fill={P.coralD} />
      <path d="M120 92 q0 -14 11 -14 q11 0 11 14 Z" fill={P.sand} />
      <path d="M124 92 q7 -19 7 -19 q8 6 8 19 Z" fill="#5B7A3A" />
      {/* poterie au sol */}
      <path d="M152 92 q-2 -12 8 -12 q10 0 8 12 Z" fill={P.turq} />
      <path d="M154 84 h12" stroke={P.cream} strokeWidth="1.6" opacity=".7" />
    </Frame>
  )
}

/** Le miel (tament) — pot, cuillère qui coule, alvéoles dorées. */
export function SceneHoney() {
  return (
    <Frame label="Le miel">
      <Ciel id="g-honey" haut="#FCEFD8" />
      <Sol y={112} ombreX={92} ombreR={52} />
      <Frise />
      {/* rayon d'alvéoles */}
      <g fill={P.gold} opacity=".35">
        <path d="M140 34 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
        <path d="M158 44 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
        <path d="M140 54 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
      </g>
      <g fill="none" stroke={P.goldD} strokeWidth="1.6" opacity=".6">
        <path d="M140 34 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
        <path d="M158 44 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
        <path d="M140 54 l8 -5 l8 5 v10 l-8 5 l-8 -5 Z" />
      </g>
      {/* pot en verre */}
      <path d="M62 112 V66 q0 -8 10 -8 h32 q10 0 10 8 v46 Z" fill="#F3D89B" />
      <path d="M62 112 V84 q26 8 52 0 v28 Z" fill={P.gold} />
      <path d="M66 62 q22 -6 44 0" stroke="#fff" strokeWidth="3" opacity=".5" fill="none" />
      <rect x="58" y="50" width="60" height="10" rx="5" fill={P.wood} />
      <path d="M70 72 v28" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".45" />
      {/* étiquette losange */}
      <path d="M88 86 l8 9 l-8 9 l-8 -9 Z" fill={P.cream} />
      <path d="M88 89.5 l5 5.5 l-5 5.5 l-5 -5.5 Z" fill="none" stroke={P.goldD} strokeWidth="1.4" />
      {/* cuillère à miel */}
      <path d="M124 44 l18 -14" stroke={P.woodD} strokeWidth="4" strokeLinecap="round" />
      <path d="M116 52 a10 10 0 1 0 14 -14 a10 10 0 1 0 -14 14" fill={P.wood} />
      <path d="M113 49 h18 M115 44 h16 M115 55 h14" stroke={P.woodD} strokeWidth="2" />
      {/* filet de miel */}
      <path d="M120 58 q-2 14 2 22" stroke={P.gold} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="122" cy="84" rx="7" ry="3" fill={P.gold} />
    </Frame>
  )
}

/** Les olives (azemmur) — branche feuillue, plat creux, olives mêlées. */
export function SceneOlives() {
  return (
    <Frame label="Les olives">
      <Ciel id="g-olives" haut="#EFF4E3" />
      <Sol y={110} ombreX={100} ombreR={58} />
      <Frise />
      {/* branche d'olivier */}
      <path d="M40 34 q44 -10 96 6" stroke="#7A8B52" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <g fill="#8FA663">
        <path d="M58 30 q8 -8 16 -4 q-8 8 -16 4" />
        <path d="M86 30 q9 -7 16 -2 q-8 7 -16 2" />
        <path d="M112 34 q9 -6 16 -1 q-8 7 -16 1" />
        <path d="M70 38 q8 6 16 4 q-7 -9 -16 -4" />
        <path d="M98 40 q8 6 15 4 q-6 -9 -15 -4" />
      </g>
      <ellipse cx="76" cy="40" rx="4.5" ry="6" fill="#4A6830" />
      <ellipse cx="122" cy="42" rx="4.5" ry="6" fill="#5B7A3A" />
      {/* plat creux décoré */}
      <path d="M52 84 q48 -14 96 0 l-9 26 q-39 10 -78 0 Z" fill={P.coral} opacity=".9" />
      <path d="M58 88 q42 -10 84 0" stroke={P.cream} strokeWidth="2" fill="none" opacity=".7" />
      <path d="M70 100 l4 5 l-4 5 l-4 -5 Z M130 100 l4 5 l-4 5 l-4 -5 Z" fill={P.cream} opacity=".7" />
      {/* olives dans le plat */}
      <ellipse cx="80" cy="80" rx="10" ry="13" fill="#5B7A3A" />
      <ellipse cx="100" cy="76" rx="10" ry="13" fill="#4A6830" />
      <ellipse cx="120" cy="80" rx="10" ry="13" fill="#6B8B45" />
      <ellipse cx="90" cy="90" rx="9" ry="12" fill="#3E5A28" />
      <ellipse cx="110" cy="90" rx="9" ry="12" fill="#5B7A3A" />
      <path d="M78 72 q1 -3 3 -4 M98 68 q1 -3 3 -4 M118 72 q1 -3 3 -4" stroke="#DDE8C8" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    </Frame>
  )
}

/* ================= Culture ================= */

/** Le drapeau amazigh — étoffe qui ondule, yaz rouge, hampe. */
export function SceneFlag() {
  return (
    <Frame label="Le drapeau amazigh">
      <Ciel id="g-flag" />
      <Sol y={122} ombreX={54} ombreR={30} />
      {/* hampe */}
      <rect x="30" y="22" width="6" height="102" rx="3" fill={P.wood} />
      <circle cx="33" cy="20" r="4" fill={P.gold} />
      {/* étoffe ondulée */}
      <path d="M36 30 q60 -10 132 0 q-6 12 0 24 q-72 -10 -132 0 Z" fill="#1F7FCB" />
      <path d="M36 54 q60 -10 132 0 q-6 12 0 24 q-72 -10 -132 0 Z" fill="#39A845" />
      <path d="M36 78 q60 -10 132 0 q-6 12 0 24 q-72 -10 -132 0 Z" fill="#F2C400" />
      <path d="M36 30 q60 -10 132 0 M36 54 q60 -10 132 0 M36 78 q60 -10 132 0 M36 102 q60 -10 132 0" stroke={P.ink} strokeWidth="1" opacity=".1" fill="none" />
      {/* yaz, posé sur l'ondulation */}
      <g stroke="#D62828" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="rotate(-2 100 64)">
        <path d="M100 44 V88" />
        <path d="M82 32 c0 15, 36 15, 36 0" />
        <path d="M88 88 h24" />
      </g>
      <circle cx="100" cy="31" r="6" fill="#D62828" transform="rotate(-2 100 64)" />
    </Frame>
  )
}

/** L'alphabet tifinagh — stèle gravée, lettres en creux. */
export function SceneTifinagh() {
  return (
    <Frame label="L'alphabet tifinagh">
      <Ciel id="g-tif" haut="#EDE7DA" />
      <Sol y={116} ombreX={100} ombreR={58} />
      <Frise y={130} />
      {/* stèle de pierre */}
      <path d="M56 118 V44 q0 -16 22 -18 q22 -2 44 2 q18 3 18 18 v72 Z" fill="#CBC3B2" />
      <path d="M62 118 V46 q0 -12 18 -14 q20 -2 40 2 q14 2 14 14 v70 Z" fill="#DAD3C3" />
      <path d="M70 34 q20 -5 44 -1" stroke="#B9B09C" strokeWidth="2" fill="none" opacity=".7" />
      {/* lettres gravées : aza, yaz, aman */}
      <g stroke={P.turqDd} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M84 52 V78 M74 52 c0 10, 20 10, 20 0 M76 78 h16" />
        <circle cx="120" cy="58" r="7" />
        <path d="M120 66 V80 M111 80 h18" />
      </g>
      <g stroke={P.coralD} strokeWidth="4" strokeLinecap="round" fill="none" opacity=".9">
        <path d="M78 96 h10 M83 96 v14 M100 96 h10 M105 96 v14 M120 103 h10" />
      </g>
      {/* éclats au pied */}
      <path d="M48 116 l6 -5 l4 5 Z M144 116 l5 -6 l5 6 Z" fill="#CBC3B2" />
    </Frame>
  )
}

/* ------- Fabriques : couleurs & nombres ------- */

/**
 * Une couleur = un motif de tapis tissé (tazerbit) teinté : grand losange
 * central, chevrons, fils de chaîne — la couleur EST le sujet, le motif
 * lui donne un corps berbère.
 */
const makeColor = (hex, label, ring) => () => (
  <Frame label={label}>
    <Ciel id={`g-col-${label}`} haut={P.cream} bas={P.sand} />
    {/* fils de chaîne */}
    <path d="M20 18 v104 M180 18 v104" stroke={P.sand2} strokeWidth="3" />
    <path d="M28 22 h144 M28 118 h144" stroke={P.sand2} strokeWidth="4" />
    {/* bandes du tapis */}
    <rect x="28" y="30" width="144" height="80" rx="4" fill={P.cream} stroke={ring || 'rgba(0,0,0,.06)'} strokeWidth="2" />
    <rect x="28" y="30" width="144" height="10" fill={hex} opacity=".85" />
    <rect x="28" y="100" width="144" height="10" fill={hex} opacity=".85" />
    {/* losange central teinté */}
    <path d="M100 40 L136 70 L100 100 L64 70 Z" fill={hex} stroke="rgba(0,0,0,.12)" strokeWidth="2" />
    <path d="M100 52 L124 70 L100 88 L76 70 Z" fill="none" stroke={P.cream} strokeWidth="3" />
    <path d="M100 62 L112 70 L100 78 L88 70 Z" fill={P.cream} opacity=".9" />
    {/* chevrons latéraux */}
    <path d="M42 60 l8 10 l-8 10 M158 60 l-8 10 l8 10" stroke={hex} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* franges */}
    <path d="M34 118 v8 M46 118 v8 M58 118 v8 M70 118 v8 M82 118 v8 M94 118 v8 M106 118 v8 M118 118 v8 M130 118 v8 M142 118 v8 M154 118 v8 M166 118 v8" stroke={P.sand2} strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

/** Un nombre = autant d'olives, bien comptables, sur un plat décoré. */
const makeCount = (n) => () => (
  <Frame label={`${n} olive${n > 1 ? 's' : ''}`}>
    <Ciel id={`g-cnt-${n}`} haut="#EFF4E3" />
    <Sol y={112} ombreX={100} ombreR={56} />
    <Frise />
    {/* plat */}
    <path d="M46 92 q54 -12 108 0 l-9 22 q-45 10 -90 0 Z" fill={P.coral} opacity=".9" />
    <path d="M52 95 q48 -9 96 0" stroke={P.cream} strokeWidth="2" fill="none" opacity=".7" />
    <path d="M100 102 l4 5 l-4 5 l-4 -5 Z" fill={P.cream} opacity=".7" />
    {/* olives en rangées lisibles */}
    {Array.from({ length: n }).map((_, i) => {
      const cols = Math.min(n, 3)
      const row = Math.floor(i / cols)
      const col = i % cols
      const rowCount = Math.min(cols, n - row * cols)
      const x = 100 + (col - (rowCount - 1) / 2) * 36
      const y = n <= 3 ? 74 : 56 + row * 36
      return (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="14" ry="18" fill={i % 2 ? '#4A6830' : '#5B7A3A'} />
          <path d={`M${x - 4} ${y - 12} q2 -3 5 -4`} stroke="#DDE8C8" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".85" />
          <path d={`M${x} ${y - 18} q3 -5 8 -6`} stroke="#7A8B52" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      )
    })}
  </Frame>
)

export const SCENES = {
  tea: SceneTea,
  bread: SceneBread,
  water: SceneWater,
  house: SceneHouse,
  cat: SceneCat,
  village: SceneVillage,
  door: SceneDoor,
  book: SceneBook,
  // météo
  sun: SceneSun,
  rain: SceneRain,
  snow: SceneSnow,
  cloud: SceneCloud,
  wind: SceneWind,
  // marché
  souk: SceneSouk,
  honey: SceneHoney,
  olives: SceneOlives,
  // culture
  flag: SceneFlag,
  tifinagh: SceneTifinagh,
  // couleurs
  'color-green': makeColor('#39A845', 'Vert'),
  'color-red': makeColor('#D62828', 'Rouge'),
  'color-yellow': makeColor('#F2C400', 'Jaune'),
  'color-black': makeColor('#1E2530', 'Noir'),
  'color-white': makeColor('#FFFFFF', 'Blanc', '#CBD6DC'),
  // nombres
  'count-1': makeCount(1),
  'count-2': makeCount(2),
  'count-3': makeCount(3),
  'count-4': makeCount(4),
  'count-5': makeCount(5),
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
