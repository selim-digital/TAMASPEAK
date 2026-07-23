import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { LogoLockup, Wordmark } from './components/Logo.jsx'
import { Button } from './components/Button.jsx'

/** Small swatch used in the design-system reference strip. */
function Swatch({ name, hex }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-12 w-full rounded-xl border border-line" style={{ background: hex }} />
      <div className="text-[11px] font-bold leading-tight">{name}</div>
      <div className="text-[10px] font-mono text-ink-soft -mt-1">{hex}</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-full bg-sand text-ink">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <LogoLockup />
          <span className="rounded-full bg-cream border border-line px-3 py-1.5 text-xs font-bold text-ink-soft">
            Design system · v0.1
          </span>
        </header>

        <p className="mt-4 max-w-[60ch] text-sm text-ink-soft leading-relaxed">
          Socle technique <Wordmark className="text-sm" /> — React + Vite + Tailwind. Voici l'écran d'accueil
          construit à partir des composants de marque, plus la palette et les boutons de référence.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* Live screen preview */}
          <div className="flex justify-center">
            <PhoneFrame>
              <WelcomeScreen onStart={() => alert('Azul ! Prochaine étape : le chemin de leçons.')} />
            </PhoneFrame>
          </div>

          {/* Design-system reference */}
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-soft mb-3">Palette</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <Swatch name="Turquoise" hex="#10C4A8" />
                <Swatch name="Turq. foncé" hex="#04A88F" />
                <Swatch name="Corail" hex="#FF6F61" />
                <Swatch name="Corail foncé" hex="#EF5646" />
                <Swatch name="Sable" hex="#F6EEE0" />
                <Swatch name="Encre" hex="#1E2530" />
              </div>
            </section>

            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-soft mb-3">Boutons</h2>
              <div className="max-w-xs flex flex-col gap-3">
                <Button variant="primary">Vérifier</Button>
                <Button variant="coral">Continuer</Button>
                <Button variant="neutral">Passer</Button>
                <Button variant="ghost">J'ai déjà un compte</Button>
              </div>
            </section>

            <p className="text-xs text-ink-soft leading-relaxed max-w-[52ch]">
              Prochaine brique : l'écran <b>Chemin d'apprentissage</b> (nœuds de leçons), puis le
              moteur d'exercices. Chaque écran réutilisera ces composants.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
