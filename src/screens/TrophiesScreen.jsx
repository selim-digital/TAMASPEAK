import { BADGES } from '../data/badges.js'
import { units, isUnitComplete } from '../data/units.js'
import { landOf } from '../data/journey.js'
import { lessonsDone } from '../lib/progress.js'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { FlameIcon, StarIcon, GemIcon } from '../components/jewels/StatIcons.jsx'

function Stat({ icon, value, label }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-cream px-2 py-3 text-center">
      <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-turquoise-deep tabular-nums">
        {icon} {value}
      </div>
      <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}

/** Petite coche « leçons » assortie aux icônes bijoux. */
function CheckIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="25" fill="url(#jw-silver)" />
      <circle cx="28" cy="28" r="20.5" fill="var(--color-cream)" />
      <circle cx="28" cy="28" r="15" fill="url(#jw-turq)" />
      <path d="M21.5 28.5l4.5 4.5 8.5-9" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Écran Trophées (v3) : statistiques bijoux, collection de médaillons du
 * voyage (une tabzimt par unité, révélée quand l'unité est terminée),
 * puis badges dérivés de la progression.
 */
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
          <Stat icon={<GemIcon size={20} />} value={progress.gems} label="Gemmes" />
          <Stat icon={<StarIcon size={20} />} value={progress.xp} label="XP" />
          <Stat icon={<FlameIcon size={20} />} value={progress.streak} label="Série" />
          <Stat icon={<CheckIcon size={20} />} value={lessonsDone(progress)} label="Leçons" />
        </div>

        <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          Médaillons du voyage
        </div>
        <div className="grid grid-cols-2 gap-3">
          {units.map((unit, i) => {
            const land = landOf(i)
            const done = isUnitComplete(progress.statuses, unit)
            return (
              <div
                key={unit.id}
                className={`relative overflow-hidden rounded-2xl border ${
                  done ? 'border-turquoise/40 bg-cream' : 'border-line bg-sand'
                }`}
              >
                <img
                  src={land.img}
                  alt=""
                  className={`h-16 w-full object-cover ${done ? '' : 'opacity-55 grayscale'}`}
                />
                <div className="absolute right-1.5 top-1.5 drop-shadow-sm">
                  <Tabzimt size={32} className={done ? 'block' : 'block opacity-70 grayscale'} />
                </div>
                <div className="px-2.5 py-1.5">
                  <div className="text-[10.5px] font-extrabold leading-tight">
                    {unit.unitLabel}
                    {done && <span className="ml-1 text-turquoise-deep">✓</span>}
                  </div>
                  <div className="mt-0.5 text-[9px] leading-tight text-ink-soft">{land.region}</div>
                </div>
              </div>
            )
          })}
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
