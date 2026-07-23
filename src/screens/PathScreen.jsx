import { TopBar } from '../components/TopBar.jsx'
import { LessonNode } from '../components/LessonNode.jsx'

/**
 * Chemin d'apprentissage (multi-unités) : stats, actions (Défi, Trophées),
 * bannières d'unité et nœuds (leçons + coffres).
 */
export function PathScreen({ units, xp, gems, streak, canChallenge, onSelectLesson, onOpenChest, onChallenge, onTrophies }) {
  function handleNode(node) {
    if (node.type === 'chest') {
      if (node.status === 'available') onOpenChest?.(node)
    } else if (node.status === 'current') {
      onSelectLesson?.(node)
    }
  }

  return (
    <div className="animate-enter flex flex-1 flex-col bg-cream">
      <TopBar streak={streak} xp={xp} gems={gems} />

      {/* Actions */}
      <div className="flex gap-2 px-3.5 pb-1">
        <button
          type="button"
          onClick={onChallenge}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-extrabold transition ${
            canChallenge ? 'bg-coral text-white shadow-[0_3px_0_var(--color-coral-dark)]' : 'bg-sand-2 text-ink-soft'
          }`}
          disabled={!canChallenge}
        >
          🎯 {canChallenge ? 'Défi du jour' : 'Défi fait ✓'}
        </button>
        <button
          type="button"
          onClick={onTrophies}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-[12.5px] font-extrabold text-ink transition"
        >
          🏆 Trophées
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {units.map((unit) => (
          <div key={unit.id} className="mb-2">
            <div className="mx-0 mb-1 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark px-4 py-3 text-white">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] opacity-90">
                {unit.level} · {unit.unitLabel}
              </div>
              <div className="mt-0.5 text-[15px] font-extrabold">{unit.title}</div>
            </div>
            <div className="flex flex-col items-center gap-6 py-5">
              {unit.lessons.map((node, i) => (
                <div key={node.id} className="animate-enter" style={{ animationDelay: `${i * 60}ms` }}>
                  <LessonNode node={node} offset={Math.round(Math.sin(i * 0.9) * 66)} onClick={() => handleNode(node)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
