/**
 * Plats berbères (v3.1) — récompenses gourmandes des coffres.
 * Style plat, palette de la marque, objets uniquement (règle maison).
 * Deux plats sont déjà des mots du vocabulaire (aghrum, atay) :
 * la récompense devient une mini-leçon.
 */

function Seksu({ width = 150 }) {
  return (
    <svg width={width} height={Math.round((width * 96) / 130)} viewBox="0 0 130 96" aria-hidden="true">
      <ellipse cx="65" cy="88" rx="42" ry="4.5" fill="rgba(0,0,0,.08)" />
      <path d="M50 20q3-6 0-12M65 16q3-6 0-12M80 20q3-6 0-12" stroke="#BFC7CF" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".65" />
      <path d="M31 54c0-16 15-26 34-26s34 10 34 26z" fill="#FFC93C" />
      <circle cx="48" cy="44" r="1.2" fill="#F0B429" />
      <circle cx="58" cy="38" r="1.2" fill="#F0B429" />
      <circle cx="70" cy="45" r="1.2" fill="#F0B429" />
      <circle cx="79" cy="39" r="1.2" fill="#F0B429" />
      <circle cx="64" cy="49" r="1.2" fill="#F0B429" />
      <circle cx="48" cy="41" r="3" fill="#34A163" />
      <circle cx="72" cy="34" r="3.8" fill="#2C7F4F" />
      <rect x="70" y="25" width="9" height="4" rx="2" fill="#FF6F61" />
      <rect x="43" y="38" width="8" height="3.6" rx="1.8" fill="#D8442E" />
      <rect x="80" y="44" width="8" height="3.6" rx="1.8" fill="#F0B429" />
      <path d="M28 54h74c0 15-11 25-25 27H53c-14-2-25-12-25-27z" fill="#D8442E" />
      <path
        d="M38 63l5.4 5.4 5.4-5.4 5.4 5.4 5.4-5.4 5.4 5.4 5.4-5.4 5.4 5.4 5.4-5.4 5.4 5.4 5.4-5.4 5.4 5.4"
        stroke="#F6EEE0"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Aghrum({ width = 150 }) {
  return (
    <svg width={width} height={Math.round((width * 96) / 130)} viewBox="0 0 130 96" aria-hidden="true">
      <ellipse cx="65" cy="88" rx="44" ry="4.5" fill="rgba(0,0,0,.08)" />
      <ellipse cx="65" cy="62" rx="47" ry="17" fill="#EFE3CF" />
      <ellipse cx="65" cy="60" rx="47" ry="15.5" fill="#F6EEE0" />
      <ellipse cx="63" cy="54" rx="35" ry="13.5" fill="#F0B429" />
      <ellipse cx="63" cy="52" rx="35" ry="12.5" fill="#FFC93C" />
      <path d="M63 40v24M46 44l34 16M80 44l-34 16" stroke="#F0B429" strokeWidth="1.8" />
      <circle cx="52" cy="48" r="1.4" fill="#C08A10" />
      <circle cx="72" cy="46" r="1.4" fill="#C08A10" />
      <circle cx="63" cy="57" r="1.4" fill="#C08A10" />
      <circle cx="45" cy="54" r="1.2" fill="#C08A10" />
      <circle cx="79" cy="55" r="1.2" fill="#C08A10" />
      <path d="M96 40q10-8 20-9" stroke="#2C7F4F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="103" cy="36" rx="2.6" ry="1.6" fill="#34A163" transform="rotate(-30 103 36)" />
      <ellipse cx="110" cy="33" rx="2.6" ry="1.6" fill="#34A163" transform="rotate(-20 110 33)" />
      <circle cx="100" cy="42" r="2.6" fill="#2C7F4F" />
      <circle cx="107" cy="40" r="2.6" fill="#2C7F4F" />
    </svg>
  )
}

function Atay({ width = 150 }) {
  return (
    <svg width={width} height={Math.round((width * 96) / 130)} viewBox="0 0 130 96" aria-hidden="true">
      <ellipse cx="65" cy="89" rx="44" ry="4.5" fill="rgba(0,0,0,.08)" />
      <path d="M30 62c0-11 8-19 19-19s19 8 19 19c0 8-4 13-9 16H39c-5-3-9-8-9-16z" fill="#BFC7CF" />
      <path d="M32 55q-9-2-12-10" stroke="#BFC7CF" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M49 43v-6" stroke="#8E99A5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="49" cy="34" r="3.4" fill="#FF6F61" />
      <path d="M39 78h20l-2 5H41z" fill="#8E99A5" />
      <ellipse cx="43" cy="56" rx="4" ry="6" fill="#E3E9EF" opacity=".7" />
      <path d="M82 46h26l-2.5 34q-.5 4-4 4h-13q-3.5 0-4-4z" fill="#FFC93C" />
      <path d="M82 46h26l-.6 8H82.6z" fill="#F0B429" />
      <rect x="80" y="42" width="30" height="6" rx="3" fill="#C08A10" />
      <path d="M84 60h21M85 68h19" stroke="#C08A10" strokeWidth="1.4" opacity=".5" />
      <path d="M91 40q-2-6 3-9M98 40q3-5 8-6" stroke="#34A163" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="94" cy="30" rx="3" ry="1.9" fill="#34A163" transform="rotate(-40 94 30)" />
      <ellipse cx="107" cy="33" rx="3" ry="1.9" fill="#34A163" transform="rotate(-15 107 33)" />
    </svg>
  )
}

function Tighrifin({ width = 150 }) {
  return (
    <svg width={width} height={Math.round((width * 96) / 130)} viewBox="0 0 130 96" aria-hidden="true">
      <ellipse cx="65" cy="88" rx="42" ry="4.5" fill="rgba(0,0,0,.08)" />
      <ellipse cx="65" cy="80" rx="44" ry="8" fill="#EFE3CF" />
      <ellipse cx="65" cy="72" rx="36" ry="9" fill="#C08A10" />
      <ellipse cx="65" cy="64" rx="34" ry="9" fill="#F0B429" />
      <ellipse cx="65" cy="56" rx="32" ry="9" fill="#FFC93C" />
      <ellipse cx="65" cy="54" rx="32" ry="8" fill="#FFD569" />
      <circle cx="52" cy="52" r="1.2" fill="#C08A10" />
      <circle cx="63" cy="55" r="1.2" fill="#C08A10" />
      <circle cx="74" cy="51" r="1.2" fill="#C08A10" />
      <circle cx="58" cy="49" r="1" fill="#C08A10" />
      <circle cx="80" cy="55" r="1" fill="#C08A10" />
      <circle cx="69" cy="58" r="1" fill="#C08A10" />
      <path d="M48 51q9 6 17 0t17 0" stroke="#C08A10" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M88 42q3-5 8-6" stroke="#34A163" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="97" cy="35" rx="2.8" ry="1.8" fill="#34A163" transform="rotate(-20 97 35)" />
    </svg>
  )
}

/** Les plats, dans l'ordre de rotation des coffres. */
export const DISHES = [
  { id: 'seksu', name: 'Seksu', fr: 'le couscous', note: 'Le plat du vendredi.', Art: Seksu },
  { id: 'aghrum', name: 'Aghrum', fr: 'la galette', note: 'Un mot que tu apprends dans l’app !', Art: Aghrum },
  { id: 'atay', name: 'Atay', fr: 'le thé à la menthe', note: 'Un mot que tu apprends dans l’app !', Art: Atay },
  { id: 'tighrifin', name: 'Tiɣrifin', fr: 'les crêpes mille trous', note: 'Avec un filet de miel.', Art: Tighrifin },
]

/** Plat associé à un coffre : rotation stable par POSITION du coffre sur le
 *  chemin de la langue en cours (les ids sautent des numéros). */
export function dishForChest(course, chestId) {
  const chests = (course?.orderedNodes || []).filter((n) => n.type === 'chest')
  const i = chests.findIndex((c) => c.id === chestId)
  return DISHES[Math.max(0, i) % DISHES.length]
}
