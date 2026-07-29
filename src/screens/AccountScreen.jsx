import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { sfx } from '../lib/sfx.js'
import {
  me,
  serverKnown,
  requestCode,
  verifyCode,
  signInWithGoogle,
  signOut,
  deleteAccount,
  syncStore,
} from '../lib/api.js'

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Mon compte — connexion par CODE À 6 CHIFFRES ou Google.
 *
 * Pourquoi un code et pas un lien : un lien cliqué dans Gmail ouvre le
 * NAVIGATEUR, jamais l'app installée — et sur iPhone la PWA a un stockage
 * séparé de Safari : on se retrouvait « connecté ailleurs », avec une app
 * qui semblait repartie de zéro. Le code, lui, se tape ICI : on ne quitte
 * jamais l'app, la session naît au bon endroit.
 *
 * `obligatoire` : l'app exige un compte pour commencer (décision produit).
 * L'écran garde un ton d'accueil, pas de barrière — et si le serveur est
 * absent, l'app laisse passer en local : on n'exige pas l'impossible.
 */
export function AccountScreen({
  store,
  obligatoire = false,
  intention = 'creer', // 'creer' | 'connexion' — même flux, wording adapté
  onStoreMerged,
  onSession,
  onBack,
}) {
  const [etat, setEtat] = useState('chargement') // chargement | deconnecte | connecte | indisponible
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [envoi, setEnvoi] = useState(null) // null | 'encours' | 'envoye' | 'verif' | 'erreur'
  const [flash, setFlash] = useState(null)
  const [confirmerSuppr, setConfirmerSuppr] = useState(false)
  const [googleEnCours, setGoogleEnCours] = useState(false)

  useEffect(() => {
    me().then((u) => {
      setUser(u)
      // Après me(), on sait si le serveur existe : sans lui, inutile de
      // montrer un formulaire dont l'envoi ne peut qu'échouer.
      setEtat(u ? 'connecte' : serverKnown() === false ? 'indisponible' : 'deconnecte')
      if (u) onSession?.(u)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function note(msg, duree = 2600) {
    setFlash(msg)
    setTimeout(() => setFlash(null), duree)
  }

  // Avis du comité : après connexion en mode obligatoire, PAS d'écran
  // intermédiaire « Continuer → » — un flash « ✓ » d'une seconde, puis on
  // entre. Vaut aussi pour qui arrive ici déjà connecté (retour Google,
  // double passage) : l'écran de connexion devient inatteignable une fois
  // connecté.
  useEffect(() => {
    if (!obligatoire || etat !== 'connecte') return
    const t = setTimeout(onBack, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obligatoire, etat])

  async function envoyerCode() {
    if (!EMAIL_OK.test(email)) {
      note('Vérifie l’adresse email — elle semble incomplète.')
      return
    }
    setEnvoi('encours')
    sfx.click()
    const r = await requestCode(email.trim().toLowerCase())
    if (r === 'sent') {
      setEnvoi('envoye')
      setCode('')
    } else if (r === 'unavailable') {
      setEtat('indisponible')
      setEnvoi(null)
    } else {
      setEnvoi('erreur')
    }
  }

  async function valider() {
    if (code.trim().length < 6) return
    setEnvoi('verif')
    sfx.click()
    const r = await verifyCode(email.trim().toLowerCase(), code.trim())
    if (r === 'ok') {
      const u = await me()
      setUser(u)
      setEtat('connecte')
      setEnvoi(null)
      sfx.correct()
      // La promesse tenue : fusion max/union — rien ne se perd, jamais.
      const { store: fusion, synced } = await syncStore(store)
      if (synced) onStoreMerged(fusion)
      onSession?.(u)
      note('Connecté ! Ta progression est maintenant sauvegardée.', 3200)
    } else {
      setEnvoi('envoye')
      note(r === 'wrong' ? 'Code faux ou expiré — vérifie, ou renvoie un code.' : 'Vérification impossible — réessaie.')
    }
  }

  async function synchroniser() {
    sfx.click()
    const { store: fusion, synced } = await syncStore(store)
    if (synced) {
      onStoreMerged(fusion)
      note('Progression synchronisée.')
    } else {
      note('Synchronisation impossible pour le moment — ta progression locale est intacte.')
    }
  }

  async function lancerGoogle() {
    sfx.click()
    // Le bijou tourne dès le clic : l'aller-retour OAuth chez Google prend
    // plusieurs secondes, et un bouton muet ressemble à un bouton cassé.
    // Le loader reste affiché jusqu'à ce que la page parte chez Google.
    setGoogleEnCours(true)
    const parti = await signInWithGoogle()
    if (!parti) {
      setGoogleEnCours(false)
      note('Google est injoignable pour le moment — réessaie, ou passe par le code email.')
    }
  }

  async function deconnecter() {
    sfx.click()
    await signOut()
    // On vérifie que la session est RÉELLEMENT tombée : afficher
    // « déconnecté » alors que le serveur garde la session, c'est la recette
    // du « impossible de me déconnecter de Google ».
    const encore = await me()
    if (encore) {
      note('La déconnexion a échoué — réessaie dans un instant.')
      return
    }
    setUser(null)
    setEtat('deconnecte')
    setEnvoi(null)
    setConfirmerSuppr(false)
    onSession?.(null)
    note('Déconnecté. Ta progression locale reste sur cet appareil.')
  }

  async function supprimer() {
    sfx.click()
    const r = await deleteAccount()
    if (r === 'email-envoye') {
      // Sans mot de passe, la preuve d'identité c'est la boîte mail : la
      // suppression réelle se fait au clic dans l'email de confirmation.
      setConfirmerSuppr(false)
      note('Un email de confirmation vient de partir — la suppression se fait en cliquant dedans.', 5000)
    } else if (r === 'supprime') {
      setUser(null)
      setEtat('deconnecte')
      setConfirmerSuppr(false)
      onSession?.(null)
      note('Compte supprimé. Tes données en ligne sont effacées ; ta progression locale reste à toi.', 4000)
    } else {
      note('La suppression a échoué — réessaie, ou écris-nous via le feedback.')
    }
  }

  // L'attente Google, habillée : la tabzimt tourne comme un bijou qu'on fait
  // jouer dans la lumière. Plein écran pour que rien d'autre ne soit cliqué
  // pendant l'aller-retour OAuth.
  if (googleEnCours) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col items-center justify-center bg-cream px-8 text-center">
        <div className="animate-bijou" aria-hidden="true">
          <Tabzimt size={110} />
        </div>
        <p className="mt-5 text-[15px] font-extrabold">Google ouvre sa porte…</p>
        <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
          L’aller-retour prend quelques secondes. Choisis ton compte quand Google te le demande —
          tu reviendras ici tout seul.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">
          {!obligatoire ? 'Mon compte' : intention === 'connexion' ? 'Content de te revoir !' : 'Crée ton compte'}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {etat === 'chargement' && (
          <p className="mt-6 text-center text-[12px] text-ink-soft">Un instant…</p>
        )}

        {/* ---------- Serveur absent : on le dit, sans dramatiser -------- */}
        {etat === 'indisponible' && (
          <div className="mt-4 rounded-2xl border border-line bg-sand px-4 py-4 text-center">
            <Akermus height={72} state="console" className="mx-auto" />
            <p className="mt-2 text-[12.5px] leading-snug text-ink">
              Les comptes ne sont pas joignables pour le moment.
            </p>
            <p className="mt-1 text-[11px] leading-snug text-ink-soft">
              Rien d’inquiétant : toute ta progression vit sur cet appareil et ne bouge pas.
            </p>
          </div>
        )}

        {/* ---------- Pas connecté ---------------------------------------- */}
        {etat === 'deconnecte' && (
          <>
            <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
              <Akermus height={64} state="curious" className="flex-none" />
              <p className="text-[11.5px] leading-snug text-ink">
                {obligatoire && intention === 'connexion' ? (
                  <>
                    Entre ton adresse : on t’envoie un <strong>code</strong>, et tu retrouves ta
                    progression exactement où tu l’avais laissée.
                  </>
                ) : obligatoire ? (
                  <>
                    Crée ton compte en <strong>30 secondes</strong> — il garde ta progression pour
                    toujours, sur tous tes appareils.
                  </>
                ) : (
                  <>
                    Un compte sert à <strong>une seule chose</strong> : garder ta progression si tu
                    changes de téléphone, et la partager entre tes appareils.
                  </>
                )}
                <span className="mt-1 block text-ink-soft">
                  Pas de mot de passe : un code reçu par email, ou Google.
                </span>
              </p>
            </div>

            {envoi === 'envoye' || envoi === 'verif' ? (
              /* --- Saisie du code : on ne quitte jamais cet écran --- */
              <div className="animate-rise mt-5 rounded-2xl border-2 border-turquoise bg-turquoise/5 px-4 py-4 text-center">
                <p className="text-[26px]" aria-hidden="true">📬</p>
                <p className="mt-1 text-[13px] font-extrabold">Un code à 6 chiffres est parti !</p>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
                  Regarde l’email envoyé à <b className="text-ink">{email}</b> (et les spams la
                  première fois), puis tape le code ici :
                </p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  aria-label="Code à 6 chiffres"
                  className="mx-auto mt-3 block w-[190px] rounded-xl border-2 border-line bg-white px-3 py-2.5 text-center text-[24px] font-extrabold tracking-[0.4em] outline-none focus:border-turquoise"
                />
                <button
                  type="button"
                  onClick={valider}
                  disabled={code.length < 6 || envoi === 'verif'}
                  className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] transition-[transform,box-shadow] duration-75 active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:shadow-none"
                >
                  {envoi === 'verif' ? 'Vérification…' : 'Me connecter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnvoi(null)
                    setCode('')
                  }}
                  className="mt-2 text-[11px] font-bold text-ink-soft underline"
                >
                  Changer d’adresse ou renvoyer un code
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="email" className="mt-5 block text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
                  Ton adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@adresse.fr"
                  className="mt-1 w-full rounded-xl border-2 border-line bg-white px-3 py-2.5 text-[14px] font-bold outline-none focus:border-turquoise"
                />
                <button
                  type="button"
                  onClick={envoyerCode}
                  disabled={envoi === 'encours' || !email.trim()}
                  className="mt-2 w-full rounded-xl bg-turquoise py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] transition-[transform,box-shadow] duration-75 active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:shadow-none"
                >
                  {envoi === 'encours' ? 'Envoi…' : 'Recevoir mon code'}
                </button>
                {envoi === 'erreur' && (
                  <p className="mt-2 text-center text-[11px] font-bold text-coral-dark">
                    L’envoi a échoué — vérifie l’adresse et réessaie.
                  </p>
                )}

                <div className="my-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[10px] font-extrabold uppercase text-ink-soft">ou</span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <button
                  type="button"
                  onClick={lancerGoogle}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-b-4 border-line bg-white py-2.5 text-[13.5px] font-extrabold text-ink transition-transform duration-75 active:translate-y-[2px] active:border-b-2"
                >
                  {/* Le « G » officiel, en SVG inline : pas de requête externe. */}
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.3 17.7 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.8c4.4-4.1 7.2-10.1 7.2-17.5z" />
                    <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6z" />
                    <path fill="#34A853" d="M24 48c6.1 0 11.2-2 15-5.5l-7.4-5.8c-2 1.4-4.6 2.2-7.6 2.2-6.3 0-11.7-3.8-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
                  </svg>
                  Continuer avec Google
                </button>
                <p className="mt-1.5 text-center text-[10px] text-ink-soft">
                  Google fait un aller-retour de quelques secondes — c’est normal.
                </p>

                <p className="mt-4 text-center text-[10px] leading-snug text-ink-soft">
                  À la connexion, ta progression locale est <b>fusionnée</b> avec celle du compte :
                  on garde toujours le meilleur des deux, rien ne s’écrase.
                </p>
              </>
            )}
          </>
        )}

        {/* ---------- Connecté ------------------------------------------- */}
        {etat === 'connecte' && user && (
          <>
            <div className="mt-2 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-4 py-3.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-turquoise-deep">
                Connecté
              </div>
              <div className="mt-0.5 truncate text-[14px] font-extrabold">{user.email}</div>
              <p className="mt-1 text-[11px] leading-snug text-ink-soft">
                Ta progression est sauvegardée en ligne et te suivra sur n’importe quel appareil.
              </p>
            </div>

            {obligatoire ? (
              // L'avance est automatique (effet ci-dessus) : on montre
              // juste que c'est gagné, une seconde.
              <p className="animate-rise mt-4 text-center text-[15px] font-extrabold text-turquoise-deep">
                ✓ C'est bon{user.name ? `, ${user.name}` : ''} ! On y va…
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="primary" onClick={synchroniser}>
                  Synchroniser maintenant
                </Button>
                <Button variant="neutral" onClick={deconnecter}>
                  Se déconnecter
                </Button>
              </div>
            )}

            {!obligatoire && (
              <div className="mt-8 rounded-2xl border border-line bg-sand px-4 py-3">
                <div className="text-[11px] font-extrabold">Supprimer mon compte</div>
                <p className="mt-1 text-[10.5px] leading-snug text-ink-soft">
                  Efface tout ce que le serveur sait de toi — définitivement. Ta progression sur cet
                  appareil, elle, reste à toi.
                </p>
                {confirmerSuppr ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmerSuppr(false)}
                      className="flex-1 rounded-xl border-2 border-line bg-cream py-2 text-[12px] font-extrabold text-ink-soft"
                    >
                      Garder mon compte
                    </button>
                    <button
                      type="button"
                      onClick={supprimer}
                      className="flex-1 rounded-xl bg-coral py-2 text-[12px] font-extrabold text-white shadow-[0_3px_0_var(--color-coral-dark)]"
                    >
                      Oui, tout effacer
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmerSuppr(true)}
                    className="mt-2 text-[11.5px] font-extrabold text-coral-dark underline"
                  >
                    Supprimer…
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {flash && (
          <p className="animate-rise mt-4 text-center text-[11.5px] font-bold text-turquoise-deep">{flash}</p>
        )}
      </div>
    </div>
  )
}
