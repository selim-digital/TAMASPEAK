import { Wordmark, YazMark } from '../components/Logo.jsx'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'

/**
 * Écran 1 — l'accueil, en TROIS états (avis du comité UX) :
 *
 *   • session inconnue  → « Commencer » actif ; au tap, le bouton attend la
 *     réponse (« · · · ») et route dès qu'elle arrive — ON NE ROUTE JAMAIS
 *     VERS LA CONNEXION DEPUIS L'INCONNU, c'était le bug de la boucle ;
 *   • connecté          → « Azul, {prénom} ! » + « Reprendre ma leçon » ;
 *   • non connecté      → deux entrées visibles, « Commencer » et « J'ai
 *     déjà un compte ». Le flux derrière est le MÊME (le code crée le
 *     compte s'il n'existe pas) : la distinction rassure l'utilisateur,
 *     pas la machine.
 *
 * Hors-ligne : on entre quand même (mode local), avec un bandeau sobre.
 */
/** Traduction humaine des codes d'erreur OAuth — jamais de jargon à l'écran. */
const ERREURS = {
  account_not_linked:
    'Cette adresse a déjà un compte créé par code email. Réessaie : les deux sont maintenant reliés.',
  state_mismatch: 'La connexion a expiré en route — réessaie, ça ira vite.',
  state_not_found: 'La connexion a expiré en route — réessaie, ça ira vite.',
  access_denied: 'Tu as annulé la connexion Google — aucun souci.',
}

export function WelcomeScreen({ etat = 'inconnu', name, attente = false, erreur, onStart, onLogin, onChangeAccount }) {
  const connecte = etat === 'connecte'
  const anonyme = etat === 'anonyme'
  const horsLigne = etat === 'horsligne'

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pt-12 pb-6 text-center bg-[radial-gradient(130%_80%_at_50%_6%,rgba(16,196,168,0.18),var(--color-cream)_60%)]">
      <div className="grid place-items-center w-20 h-20 rounded-[22px] bg-gradient-to-br from-turquoise to-turquoise-dark text-white shadow-lg shadow-turquoise/30">
        <YazMark size={44} />
      </div>

      <Wordmark className="mt-5 text-3xl" />
      {connecte ? (
        <p className="mt-2 text-sm leading-snug text-ink">
          Azul{name ? `, ${name}` : ''} ! <span className="text-ink-soft">Content de te revoir.</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink-soft leading-snug">
          Apprends les langues amazighes,
          <br />
          un mot après l'autre.
        </p>
      )}

      <div className="my-3">
        <Akermus height={170} float />
      </div>

      <div className="flex-1" />

      {erreur && (
        <p className="mb-2 w-full rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] leading-snug text-ink">
          {ERREURS[erreur] || 'La connexion Google n’a pas abouti — réessaie, ou passe par le code email.'}
        </p>
      )}

      {horsLigne && (
        <p className="mb-2 w-full rounded-xl border border-line bg-sand px-3 py-2 text-[11px] leading-snug text-ink-soft">
          Pas de connexion internet — tu peux quand même t'entraîner, tout reste sur ton téléphone.
        </p>
      )}

      <div className="w-full flex flex-col gap-2">
        {/* Demande de Selim : deux mots sans ambiguïté — « M'inscrire » et
            « Connexion » — et plus aucun badge de niveau prédéfini. */}
        <Button variant="primary" onClick={onStart} disabled={attente}>
          {attente ? '· · ·' : connecte ? 'Reprendre ma leçon' : anonyme ? 'M’inscrire' : 'Commencer'}
        </Button>

        {connecte ? (
          <button
            type="button"
            onClick={onChangeAccount}
            className="mt-1 text-[11.5px] font-bold text-ink-soft underline"
          >
            Ce n'est pas toi{name ? `, ${name}` : ''} ? Changer de compte
          </button>
        ) : anonyme ? (
          // Contour, même taille que le bouton plein : une vraie seconde
          // entrée, pas un lien qu'on cherche.
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-2xl border-2 border-b-4 border-turquoise/50 bg-white py-[13px] text-[15px] font-extrabold tracking-tight text-turquoise-deep transition-transform duration-75 active:translate-y-[2px] active:border-b-2"
          >
            Connexion
          </button>
        ) : null}
      </div>
    </div>
  )
}
