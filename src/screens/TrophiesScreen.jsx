import { BADGES } from '../data/badges.js'
import { lessonsDone } from '../lib/progress.js'

function Stat({ icon, value, label }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-cream px-2 py-3 text-center">
      <div className="text-lg font-extrabold text-turquoise-deep">
        <span aria-hidden="true">{icon}</span> {value}
      </div>
      <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}

/** Écran Trophées : statistiques + collection de badges. */
export function TrophiesScreen({ progress, onBack }) {
  return (
    <div className="animate-enter flex flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-2">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Trophées</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        <div className="mt-1 flex gap-2.5">
          <Stat icon="🪙" value={progress.gems} label="Gemmes" />
          <Stat icon="◆" value={progress.xp} label="XP" />
          <Stat icon="🔥" value={progress.streak} label="Série" />
          <Stat icon="📘" value={lessonsDone(progress)} label="Leçons" />
        </div>

        <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">Badges</div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const earned = b.earned(progress)
            return (
              <div
                key={b.id}
                className={`flex flex-col items-center rounded-2xl border p-3 text-center ${earned ? 'border-turquoise/40 bg-turquoise/10' : 'border-line bg-sand opacity-60'}`}
              >
                <div className={`text-3xl ${earned ? '' : 'grayscale'}`} aria-hidden="true">
                  {earned ? b.icon : '🔒'}
                </div>
                <div className="mt-1.5 text-[11px] font-extrabold leading-tight">{b.title}</div>
                <div className="mt-0.5 text-[9.5px] leading-tight text-ink-soft">{b.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
