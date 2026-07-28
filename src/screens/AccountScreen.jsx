import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { sfx } from '../lib/sfx.js'
import {
  me,
  serverKnown,
  requestMagicLink,
  signInWithGoogle,
  signOut,
  deleteAccount,
  syncStore,
} from '../lib/api.js'

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Mon compte — la porte vers la sauvegarde en ligne.
 *
 * Le discours de l'écran suit la règle du produit : le compte est un FILET
 * DE SÉCURITÉ, pas une obligation. L'app entière fonctionne sans — ce que
 * l'écran dit en toutes lettres, parce qu'un public familial doit pouvoir
 * refuser sans se demander ce qu'il perd (réponse : rien, sauf la
 * synchronisation entre appareils).
 *
 * Pas de mot de passe, par choix : un lien envoyé par email, ou Google.
 * Rien à retenir, rien à se faire voler.
 */
export function AccountScreen({ store, onStoreMerged, onBack }) {
  const [etat, setEtat] = useState('chargement') // chargement | deconnecte | connecte | indisponible
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [envoi, setEnvoi] = useState(null) // null | 'encours' | 'envoye' | 'erreur'
  const [flash, setFlash] = useState(null)
  const [confirmerSuppr, setConfirmerSuppr] = useState(false)

  useEffect(() => {
    me().then((u) => {
      setUser(u)
      // Après me(), on sait si le serveur existe : sans lui, inutile de
      // montrer un formulaire dont l'envoi ne peut qu'échouer.
      setEtat(u ? 'connecte' : serverKnown() === false ? 'indisponible' : 'deconnecte')
    })
  }, [])

  function note(msg, duree = 2600) {
    setFlash(msg)
    setTimeout(() => setFlash(null), duree)
  }

  async function envoyerLien() {
    if (!EMAIL_OK.test(email)) {
      note('Vérifie l’adresse email — elle semble incomplète.')
      return
    }
    setEnvoi('encours')
    sfx.click()
    const r = await requestMagicLink(email.trim().toLowerCase())
    if (r === 'sent') setEnvoi('envoye')
    else if (r === 'unavailable') {
      setEtat('indisponible')
      setEnvoi(null)
    } else {
      setEnvoi('erreur')
    }
  }

  async function synchroniser() {
    sfx.click()
    const { store: fusion, synced } = await syncStore(store)
    if (synced) {
      onStoreMerged(fusion)
      note('Progression synchronisée — rien ne se perd, jamais.')
    } else {
      note('Synchronisation impossible pour le moment. Ta progression locale est intacte.')
    }
  }

  async function deconnecter() {
    sfx.click()
    await signOut()
    setUser(null)
    setEtat('deconnecte')
    setConfirmerSuppr(false)
    note('Déconnecté. Tout continue de fonctionner sur cet appareil.')
  }

  async function supprimer() {
    sfx.click()
    const ok = await deleteAccount()
    if (ok) {
      setUser(null)
      setEtat('deconnecte')
      setConfirmerSuppr(false)
      note('Compte supprimé. Tes données en ligne sont effacées ; ta progression locale reste à toi.', 4000)
    } else {
      note('La suppression a échoué — réessaie, ou écris-nous via le feedback.')
    }
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Mon compte</h2>
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
              Les comptes ne sont pas encore ouverts sur cette version.
            </p>
            <p className="mt-1 text-[11px] leading-snug text-ink-soft">
              Rien d’inquiétant : toute ta progression vit sur cet appareil et ne bouge pas.
            </p>
          </div>
        )}

        {/* ---------- Pas connecté : les deux portes d'entrée ------------ */}
        {etat === 'deconnecte' && (
          <>
            <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
              <Akermus height={64} state="curious" className="flex-none" />
              <p className="text-[11.5px] leading-snug text-ink">
                Un compte sert à <strong>une seule chose</strong> : garder ta progression si tu
                changes de téléphone, et la partager entre tes appareils.
                <span className="mt-1 block text-ink-soft">
                  Sans compte, tout fonctionne pareil — simplement, tout reste ici.
                </span>
              </p>
            </div>

            {envoi === 'envoye' ? (
              <div className="animate-rise mt-5 rounded-2xl border-2 border-turquoise bg-turquoise/5 px-4 py-4 text-center">
                <p className="text-[26px]" aria-hidden="true">📬</p>
                <p className="mt-1 text-[13px] font-extrabold">Le lien est parti !</p>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
                  Ouvre l’email envoyé à <b className="text-ink">{email}</b> et appuie sur le
                  bouton. Le lien est valable 10 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setEnvoi(null)}
                  className="mt-2 text-[11px] font-bold text-ink-soft underline"
                >
                  Me tromper d’adresse ? Renvoyer
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="email" className="mt-5 block text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
                  Par email — un lien, pas de mot de passe
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
                  onClick={envoyerLien}
                  disabled={envoi === 'encours' || !email.trim()}
                  className="mt-2 w-full rounded-xl bg-turquoise py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:opacity-40 disabled:shadow-none"
                >
                  {envoi === 'encours' ? 'Envoi…' : 'Recevoir mon lien de connexion'}
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
                  onClick={() => signInWithGoogle()}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-line bg-white py-2.5 text-[13.5px] font-extrabold text-ink"
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

                <p className="mt-5 text-center text-[10px] leading-snug text-ink-soft">
                  En te connectant, ta progression locale est <b>fusionnée</b> avec celle du
                  compte : on garde toujours le meilleur des deux, rien ne s’écrase.
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

            <div className="mt-4 flex flex-col gap-2">
              <Button variant="primary" onClick={synchroniser}>
                Synchroniser maintenant
              </Button>
              <Button variant="neutral" onClick={deconnecter}>
                Se déconnecter
              </Button>
            </div>

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
          </>
        )}

        {flash && (
          <p className="animate-rise mt-4 text-center text-[11.5px] font-bold text-turquoise-deep">{flash}</p>
        )}
      </div>
    </div>
  )
}
