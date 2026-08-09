import { ECRANS } from '../data/screens.js'
import { sfx } from '../lib/sfx.js'

/**
 * La barre d'onglets — la refonte C choisie par Selim, sur avis du comité
 * UX : cinq familles en permanence sous le pouce, et l'écran Chemin rendu
 * à sa seule raison d'être (le chemin).
 *
 *   Aujourd'hui — le rituel quotidien orchestré (écran d'atterrissage)
 *   Chemin      — la carte du voyage, plein écran
 *   Jouer       — Mémory, Mots croisés, Quiz, À deux, duels
 *   Cercle      — famille & amis à distance, voix, missions
 *   Moi         — profil, trophées, langues, compte, abonnement
 *
 * Elle est masquée pendant les flux immersifs (leçon, duel, micro…) —
 * on ne sort pas d'une leçon par accident. Icônes SVG sobres, sans
 * visage (règle maison) ; le Chemin porte fièrement le ⵣ.
 */

export const ONGLETS = [
  {
    id: 'aujourdhui',
    ecran: ECRANS.AUJOURDHUI,
    label: 'Aujourd’hui',
    icone: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
      </svg>
    ),
  },
  {
    id: 'chemin',
    ecran: ECRANS.CHEMIN,
    label: 'Chemin',
    icone: <span className="tifinagh text-[19px] leading-none">ⵣ</span>,
  },
  {
    id: 'jouer',
    ecran: ECRANS.JEUX,
    label: 'Jouer',
    icone: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <circle cx="8.6" cy="8.6" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="15.4" cy="15.4" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="15.4" cy="8.6" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="8.6" cy="15.4" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'cercle',
    ecran: ECRANS.CERCLE,
    label: 'Cercle',
    icone: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="9" r="2.4" />
        <path d="M7 18c.7-2.2 2.7-3.5 5-3.5s4.3 1.3 5 3.5" />
      </svg>
    ),
  },
  {
    id: 'moi',
    ecran: ECRANS.PROFIL,
    label: 'Moi',
    icone: (
      // La fibule tabzimt stylisée — l'identité, sans figure.
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
    ),
  },
]

/** L'onglet auquel appartient chaque écran — pour l'illumination. */
export const ONGLET_PAR_ECRAN = {
  [ECRANS.AUJOURDHUI]: 'aujourdhui',
  [ECRANS.NOTIFS]: 'aujourdhui',
  [ECRANS.HISTOIRE]: 'aujourdhui',
  [ECRANS.TIFINAGH]: 'aujourdhui',
  [ECRANS.CHEMIN]: 'chemin',
  [ECRANS.JEUX]: 'jouer',
  [ECRANS.MEMORY]: 'jouer',
  [ECRANS.MOTS]: 'jouer',
  [ECRANS.QUIZ]: 'jouer',
  [ECRANS.DUO]: 'jouer',
  [ECRANS.CERCLE]: 'cercle',
  [ECRANS.MISSIONS]: 'cercle',
  [ECRANS.CONTRIBUER]: 'cercle',
  [ECRANS.PROFIL]: 'moi',
  [ECRANS.TROPHEES]: 'moi',
  [ECRANS.LANGUES]: 'moi',
  [ECRANS.COMPTE]: 'moi',
  [ECRANS.ABONNEMENT]: 'moi',
  [ECRANS.FEEDBACK]: 'moi',
  [ECRANS.FAMILLE]: 'moi',
}

export function TabBar({ ecran, onGo }) {
  const actif = ONGLET_PAR_ECRAN[ecran]
  return (
    <nav className="flex flex-none border-t border-line bg-white/95 pb-[max(4px,env(safe-area-inset-bottom))] backdrop-blur-sm" aria-label="Navigation principale">
      {ONGLETS.map((o) => {
        const ici = actif === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              if (!ici) sfx.click()
              onGo(o.ecran)
            }}
            aria-current={ici ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 transition-colors ${
              ici ? 'text-turquoise-deep' : 'text-ink-soft'
            }`}
          >
            <span className={`grid h-6 place-items-center transition-transform ${ici ? 'scale-110' : ''}`}>{o.icone}</span>
            <span className={`text-[9px] tracking-tight ${ici ? 'font-extrabold' : 'font-bold'}`}>{o.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
