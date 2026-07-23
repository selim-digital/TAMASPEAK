import { TopBar } from '../components/TopBar.jsx'
import { LessonNode } from '../components/LessonNode.jsx'

/**
 * Screen 2 — Chemin d'apprentissage.
 * Barre de stats + bannière d'unité + chemin sinueux de nœuds.
 */
export function PathScreen({ unit, onSelectLesson }) {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <TopBar streak={3} gems={240} hearts={5} />

      <div className="mx-3.5 mt-0.5 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark px-4 py-3.5 text-white">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] opacity-90">
          {unit.level} · {unit.unitLabel}
        </div>
        <div className="mt-0.5 text-[15px] font-extrabold">{unit.title}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-7">
        <div className="flex flex-col items-center gap-6">
          {unit.lessons.map((node, i) => (
            <LessonNode
              key={node.id}
              node={node}
              offset={Math.round(Math.sin(i * 0.9) * 70)}
              onClick={() => onSelectLesson?.(node)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
