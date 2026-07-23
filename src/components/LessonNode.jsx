import { Tabzimt } from './jewels/Tabzimt.jsx'

/**
 * Nœud du chemin (v3 « bijou ») : cercle parfait, dégradé radial, ombre dure
 * en diagonale (lumière haut-gauche) et éclat interne. Le nœud courant porte
 * un anneau de progression serti (piste argent + remplissage corail selon
 * l'avancement de l'unité) et un halo respirant. Les coffres sont des
 * médaillons tabzimt. `offset` (px) décale horizontalement (chemin sinueux).
 */

/** Ombre portée diagonale « posée » (drop-shadow net, sans flou). */
const DIAG_SHADOW = { filter: 'drop-shadow(3px 4px 0 rgba(30,37,48,.16))' }

function Glyph({ kind }) {
  if (kind === 'check') {
    return <path d="M26 39l9 10 16-18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  }
  if (kind === 'lock') {
    return (
      <g fill="none">
        <rect x="27" y="35" width="22" height="17" rx="4.5" fill="#A9B0BA" />
        <path d="M31 35v-5a7 7 0 0 1 14 0v5" stroke="#A9B0BA" strokeWidth="4.5" />
      </g>
    )
  }
  /* bulle de parole (leçon en cours) */
  return (
    <path
      d="M26 27h24a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5h-8l-6 6v-6h-10a5 5 0 0 1-5-5V32a5 5 0 0 1 5-5z"
      fill="#fff"
    />
  )
}

/** Pastille circulaire de leçon (fait / verrouillé). */
function LessonCircle({ variant, glyph }) {
  const fill = variant === 'done' ? 'url(#jw-turq)' : 'var(--color-sand-2)'
  const shadow = variant === 'done' ? 'var(--color-turquoise-dark)' : 'var(--color-line)'
  return (
    <svg className="block" width="64" height="64" viewBox="0 0 76 76" aria-hidden="true">
      <circle cx="41.5" cy="42.5" r="30" fill={shadow} opacity=".9" />
      <circle cx="38" cy="38" r="30" fill={fill} />
      {variant === 'done' && (
        <ellipse cx="28" cy="26" rx="9" ry="5.6" fill="rgba(255,255,255,.28)" transform="rotate(-24 28 26)" />
      )}
      <Glyph kind={glyph} />
    </svg>
  )
}

/** Nœud courant : anneau de progression + halo + pastille corail. */
function CurrentCircle({ progress = 0 }) {
  const C = 2 * Math.PI * 40
  const p = Math.max(0.04, Math.min(1, progress)) // toujours une amorce visible
  return (
    <svg className="block" width="88" height="88" viewBox="0 0 100 100" aria-hidden="true">
      <circle
        className="animate-halo"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth="3"
        opacity=".45"
      />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E7EC" strokeWidth="6" />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--color-coral)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${C * p} ${C}`}
        transform="rotate(-90 50 50)"
      />
      <circle cx="53.5" cy="54.5" r="30" fill="var(--color-coral-deep)" opacity=".85" />
      <circle cx="50" cy="50" r="30" fill="url(#jw-coral)" />
      <ellipse cx="40" cy="38" rx="9" ry="5.6" fill="rgba(255,255,255,.3)" transform="rotate(-24 40 38)" />
      <g transform="translate(12,12)">
        <Glyph kind="speech" />
      </g>
    </svg>
  )
}

/** Petit badge d'état posé sur un coffre. */
function ChestBadge({ kind }) {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-cream bg-cream">
      <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
        {kind === 'done' ? (
          <>
            <circle cx="10" cy="10" r="9" fill="var(--color-green-vif)" />
            <path d="M6 10l3 3.4 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <circle cx="10" cy="10" r="9" fill="#A9B0BA" />
            <rect x="6" y="9" width="8" height="6" rx="1.6" fill="#fff" />
            <path d="M7.6 9V7.4a2.4 2.4 0 0 1 4.8 0V9" stroke="#fff" strokeWidth="1.6" fill="none" />
          </>
        )}
      </svg>
    </span>
  )
}

export function LessonNode({ node, offset = 0, onClick, unitProgress = 0 }) {
  const isChest = node.type === 'chest'
  const clickable = isChest ? node.status === 'available' : node.status === 'current'

  const label = isChest
    ? node.status === 'available'
      ? 'Ouvrir'
      : node.status === 'done'
        ? 'Ouvert'
        : ''
    : node.status === 'current'
      ? 'En cours'
      : node.status === 'locked'
        ? ''
        : node.title

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {clickable && (
        <div className="relative z-10 mb-1.5">
          <span className="rounded-lg bg-ink px-2.5 py-1 text-[10.5px] font-extrabold text-white">
            {isChest ? 'Ouvrir !' : 'Commencer !'}
          </span>
          <span className="absolute left-1/2 -bottom-1 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-ink" />
        </div>
      )}

      <button
        type="button"
        onClick={clickable ? onClick : undefined}
        disabled={!clickable}
        aria-label={`${node.title || 'Coffre'}${clickable ? '' : node.status === 'locked' ? ' (verrouillé)' : ' (terminé)'}`}
        className={`relative grid aspect-square flex-none place-items-center rounded-full ${
          clickable ? 'animate-bob cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        {isChest ? (
          <span
            className={`relative block ${node.status === 'locked' ? 'opacity-55 grayscale' : ''}`}
            style={node.status === 'available' ? DIAG_SHADOW : undefined}
          >
            <Tabzimt size={56} className="block" />
            {node.status !== 'available' && <ChestBadge kind={node.status === 'done' ? 'done' : 'lock'} />}
          </span>
        ) : node.status === 'current' ? (
          <CurrentCircle progress={unitProgress} />
        ) : (
          <LessonCircle variant={node.status} glyph={node.status === 'done' ? 'check' : 'lock'} />
        )}
      </button>

      {label && <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</span>}
    </div>
  )
}
