/**
 * Nœud du chemin : leçon (locked/current/done) ou coffre (locked/available/done).
 * `offset` (px) décale horizontalement pour dessiner le chemin sinueux.
 */
const CLS = {
  done: 'bg-turquoise text-white shadow-[0_4px_0_var(--color-turquoise-dark)]',
  current: 'bg-coral text-white shadow-[0_4px_0_var(--color-coral-dark)] animate-bob cursor-pointer',
  locked: 'bg-sand-2 text-ink-soft/60 shadow-[0_4px_0_var(--color-line)] cursor-not-allowed',
  chestAvailable: 'bg-turquoise-deep text-white shadow-[0_4px_0_#073f36] animate-bob cursor-pointer',
  chestDone: 'bg-turquoise/30 text-turquoise-deep shadow-[0_4px_0_var(--color-line)]',
}

export function LessonNode({ node, offset = 0, onClick }) {
  const isChest = node.type === 'chest'
  const clickable = isChest ? node.status === 'available' : node.status === 'current'

  let variant, glyph, label
  if (isChest) {
    variant = node.status === 'available' ? 'chestAvailable' : node.status === 'done' ? 'chestDone' : 'locked'
    glyph = node.status === 'locked' ? '🔒' : '🎁'
    label = node.status === 'available' ? 'Ouvrir' : node.status === 'done' ? 'Ouvert' : ''
  } else {
    variant = node.status
    glyph = node.status === 'done' ? '✓' : node.status === 'locked' ? '🔒' : node.icon
    label = node.status === 'current' ? 'En cours' : node.status === 'locked' ? '' : node.title
  }

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {clickable && (
        <div className="relative mb-2">
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
        className={`relative grid h-[60px] w-[60px] place-items-center rounded-full text-[23px] font-extrabold ${CLS[variant]}`}
      >
        {clickable && (
          <span
            className={`pointer-events-none absolute -inset-1.5 rounded-full border-[3px] animate-ping ${isChest ? 'border-turquoise-deep/40' : 'border-coral/40'}`}
          />
        )}
        <span aria-hidden="true">{glyph}</span>
      </button>

      {label && <span className="mt-1.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</span>}
    </div>
  )
}
