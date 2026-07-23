/**
 * A single node on the learning path.
 * States: done (turquoise ✓), current (coral, pulsing + "Commencer" tip),
 * locked (sand, muted), chest (turquoise-deep 🎁).
 * `offset` (px) shifts the node horizontally to draw the winding path.
 */
const VARIANTS = {
  done: 'bg-turquoise text-white shadow-[0_4px_0_var(--color-turquoise-dark)]',
  current: 'bg-coral text-white shadow-[0_4px_0_var(--color-coral-dark)] animate-bob cursor-pointer',
  locked: 'bg-sand-2 text-ink-soft/60 shadow-[0_4px_0_var(--color-line)] cursor-not-allowed',
  chest: 'bg-turquoise-deep text-white shadow-[0_4px_0_#073f36]',
}

export function LessonNode({ node, offset = 0, onClick }) {
  const variant = node.type === 'chest' ? 'chest' : node.status
  const isCurrent = node.status === 'current'
  const glyph = node.status === 'done' ? '✓' : node.icon

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {isCurrent && (
        <div className="relative mb-2">
          <span className="rounded-lg bg-ink px-2.5 py-1 text-[10.5px] font-extrabold text-white">
            Commencer&nbsp;!
          </span>
          <span className="absolute left-1/2 -bottom-1 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-ink" />
        </div>
      )}

      <button
        type="button"
        onClick={isCurrent ? onClick : undefined}
        disabled={!isCurrent}
        aria-label={`${node.title}${isCurrent ? ' — commencer' : node.status === 'locked' ? ' (verrouillé)' : ' (terminé)'}`}
        className={`relative grid h-[60px] w-[60px] place-items-center rounded-full text-[23px] font-extrabold ${VARIANTS[variant]}`}
      >
        {isCurrent && (
          <span className="pointer-events-none absolute -inset-1.5 rounded-full border-[3px] border-coral/40 animate-ping" />
        )}
        <span aria-hidden="true">{glyph}</span>
      </button>

      {node.title && (
        <span className="mt-1.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">
          {node.status === 'current' ? 'En cours' : node.title}
        </span>
      )}
    </div>
  )
}
