import { ECRANS } from '../data/screens.js'

/**
 * Barre de développement — sauts d'écran et remise à zéro.
 *
 * ⚠️ Elle permet d'atteindre n'importe quel écran sans passer par le parcours.
 * Tant qu'il n'y avait rien à protéger, ce n'était qu'un confort. Le jour où
 * un mur d'abonnement existe, c'est une porte dérobée : elle est donc
 * conditionnée à `import.meta.env.DEV` et **absente du bundle de production**
 * (Vite élimine la branche morte à la compilation).
 *
 * Elle reste masquée sur mobile de toute façon (`hidden sm:flex`).
 */
const RACCOURCIS = [
  [ECRANS.ACCUEIL, 'Accueil'],
  [ECRANS.CHEMIN, 'Chemin'],
  [ECRANS.LANGUES, 'Langues'],
]

export function DebugBar({ screen, onGo, onReset }) {
  if (!import.meta.env.DEV) return null
  return (
    <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 text-sm sm:flex">
      {RACCOURCIS.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onGo(id)}
          className={`rounded-full px-4 py-2 font-bold transition ${
            screen === id ? 'bg-turquoise text-white' : 'border border-line bg-cream text-ink-soft'
          }`}
        >
          {label}
        </button>
      ))}
      <button
        onClick={onReset}
        className="rounded-full border border-line bg-cream px-4 py-2 font-bold text-ink-soft transition hover:text-coral-dark"
        title="Efface la progression sauvegardée"
      >
        ↺ Réinitialiser
      </button>
    </div>
  )
}
