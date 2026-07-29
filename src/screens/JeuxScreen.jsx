import { niveauxMots } from '../lib/jeux.js'
import { JEUX } from '../data/economy.js'

/**
 * Le coin jeux — deux façons de réviser sans en avoir l'air.
 *
 * Le Mémory et les Mots croisés ne remplacent pas les leçons : ils font
 * revenir les mêmes mots par un autre chemin. Volontairement sans visage
 * ni être vivant dessiné : des lettres, des losanges, c'est tout.
 */
export function JeuxScreen({ course, progress, onMemory, onMots, onBack }) {
  const niveaux = niveauxMots(course)
  const faits = (progress.jeux?.motsFaits || []).filter((id) => niveaux.some((n) => n.id === id)).length
  const victoires = progress.jeux?.memoryVictoires || 0

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Jeux</h2>
        <span className="ml-auto text-[10.5px] font-bold text-ink-soft">{course.name}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        <p className="mt-1 text-[11px] leading-snug text-ink-soft">
          Les mots des leçons, par un autre chemin — joue autant que tu veux.
        </p>

        {/* Mémory */}
        <button
          type="button"
          onClick={onMemory}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3.5 py-3.5 text-left transition active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-turquoise text-white" aria-hidden="true">
            {/* Deux cartes, l'une retournée (losange) */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <rect x="3" y="5" width="11" height="15" rx="2.2" transform="rotate(-8 8.5 12.5)" />
              <rect x="12" y="6" width="11" height="15" rx="2.2" fill="rgba(255,255,255,.18)" transform="rotate(7 17.5 13.5)" />
              <path d="M17.5 10.2 L20 13.5 L17.5 16.8 L15 13.5 Z" transform="rotate(7 17.5 13.5)" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-extrabold">Mémory</span>
            <span className="block text-[10.5px] leading-snug text-ink-soft">
              Associe tifinagh et images — les cartes s'écoutent aussi.
            </span>
          </span>
          <span className="flex-none text-right">
            <span className="block text-[13px] font-extrabold tabular-nums text-turquoise-deep">{victoires}</span>
            <span className="block text-[9px] font-bold uppercase tracking-wide text-ink-soft">
              {victoires > 1 ? 'parties' : 'partie'}
            </span>
          </span>
        </button>

        {/* Mots croisés */}
        <button
          type="button"
          onClick={onMots}
          className="mt-2.5 flex w-full items-center gap-3 rounded-2xl border-2 border-coral/40 bg-coral/5 px-3.5 py-3.5 text-left transition active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-coral text-white" aria-hidden="true">
            {/* Petite grille croisée */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
              <rect x="10" y="3.5" width="6" height="6" rx="1.2" fill="rgba(255,255,255,.18)" />
              <rect x="16.5" y="3.5" width="6" height="6" rx="1.2" />
              <rect x="10" y="10" width="6" height="6" rx="1.2" />
              <rect x="10" y="16.5" width="6" height="6" rx="1.2" fill="rgba(255,255,255,.18)" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-extrabold">Mots croisés</span>
            <span className="block text-[10.5px] leading-snug text-ink-soft">
              Forme les mots avec la roue de lettres, remplis la grille.
            </span>
          </span>
          <span className="flex-none text-right">
            <span className="block text-[13px] font-extrabold tabular-nums text-coral-dark">
              {faits}/{niveaux.length}
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-wide text-ink-soft">niveaux</span>
          </span>
        </button>

        <div className="mt-4 rounded-2xl border border-line bg-sand px-3 py-3 text-[10.5px] leading-snug text-ink-soft">
          Chaque partie de Mémory rapporte <b>{JEUX.memory.xpGain} XP</b>. Un niveau de mots croisés terminé
          rapporte <b>{JEUX.mots.xpGain} XP</b> et <b>{JEUX.mots.gems} gemmes</b> la première fois — et les
          gemmes servent aux indices.
        </div>
      </div>
    </div>
  )
}
