import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { shareText } from '../lib/share.js'
import { sfx } from '../lib/sfx.js'
import { PLANS, FAMILLE_TAILLE, FAMILLE_INVITES } from '../data/tarifs.js'
import {
  etatAbonnement,
  abonnementReel,
  passerEnCaisse,
  ouvrirPortail,
  inviterFamille,
  retirerFamille,
  quitterFamille,
  invitationFamilleUrl,
} from '../lib/abonnement.js'

/**
 * L'abonnement — la page des tarifs, et la gestion de ce qu'on a pris.
 *
 * Ce que cet écran refuse de faire, et pourquoi :
 *
 *   • PAS DE COMPTE À REBOURS, pas de « plus que 2 places », pas de faux
 *     prix barré. Le public de cette app, ce sont des familles qui essaient
 *     de transmettre une langue ; les pressionner serait leur mentir sur ce
 *     qu'on est.
 *   • LE PRIX EST DIT EN ENTIER, TTC, avec le mot « par mois » et le mot
 *     « résiliable ». Personne ne doit découvrir un montant sur son relevé.
 *   • LA RÉSILIATION EST AUSSI VISIBLE QUE L'ABONNEMENT. Un bouton, au même
 *     endroit, dès qu'on est abonné.
 *
 * Les deux zones tarifaires ne se choisissent pas ici : le serveur décide
 * (voir api/billing.js). L'écran se contente d'afficher celle qui s'applique,
 * en la nommant — quelqu'un doit pouvoir comprendre pourquoi son cousin
 * d'Alger ne voit pas le même chiffre que lui.
 */

function Ligne({ children }) {
  return (
    <li className="flex items-start gap-2 text-[12px] leading-snug">
      <span className="mt-[3px] flex-none text-turquoise-deep" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5l5.5 5.5L20 6.5" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  )
}

/** Une formule : son nom, son prix en entier, ce qu'elle ouvre. */
function Formule({ plan, prix, avantages, vedette, occupe, onPrendre }) {
  return (
    <div
      className={`rounded-2xl border-2 p-3.5 ${
        vedette ? 'border-turquoise bg-turquoise/5' : 'border-line bg-cream'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[14px] font-extrabold">{plan.nom}</h3>
        {vedette && (
          <span className="flex-none rounded-full bg-turquoise px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
            Le plus pris
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">{plan.detail}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[26px] font-extrabold leading-none tracking-tight text-turquoise-deep tabular-nums">
          {prix.prix}
        </span>
        <span className="text-[12px] font-bold text-ink-soft">par mois</span>
      </div>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {avantages.map((a) => (
          <Ligne key={a}>{a}</Ligne>
        ))}
      </ul>
      <button
        type="button"
        disabled={occupe}
        onClick={() => {
          sfx.click()
          onPrendre()
        }}
        className={`mt-3 w-full rounded-xl py-2.5 text-[13px] font-extrabold transition-transform active:translate-y-[2px] disabled:opacity-60 ${
          vedette
            ? 'bg-turquoise text-white shadow-[0_3px_0_var(--color-turquoise-dark)]'
            : 'bg-sand-2 text-ink shadow-[0_3px_0_var(--color-line)]'
        }`}
      >
        {occupe ? '· · ·' : 'Choisir'}
      </button>
    </div>
  )
}

/** Le pack famille côté titulaire : trois places, trois codes à envoyer. */
function Famille({ famille, onChange }) {
  const [flash, setFlash] = useState(null)
  const [occupe, setOccupe] = useState(false)
  if (!famille) return null

  const prises = famille.membres.length
  const restantes = famille.places - prises - famille.invitations.length

  async function inviter() {
    setOccupe(true)
    const r = await inviterFamille()
    setOccupe(false)
    if (r?.code) onChange()
    else setFlash(r?.erreur === 'places complètes' ? 'Toutes les places sont prises.' : 'Réessaie dans un instant.')
    setTimeout(() => setFlash(null), 2600)
  }

  async function partager(code) {
    const res = await shareText(
      `Je t’offre une place sur Tama Speak — on apprend le kabyle (et les autres langues amazighes) en famille. Ouvre ce lien :`,
      invitationFamilleUrl(code),
    )
    setFlash(res === 'copied' ? 'Lien copié' : res === 'failed' ? 'Partage indisponible' : null)
    setTimeout(() => setFlash(null), 2200)
  }

  return (
    <>
      <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
        Mon pack famille — {prises + 1}/{FAMILLE_TAILLE} personnes
      </div>

      <div className="flex flex-col gap-2">
        {famille.membres.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded-2xl border border-line bg-cream px-3 py-2.5">
            <span className="flex-1 text-[12.5px] font-extrabold">{m.nom || 'Un proche'}</span>
            <button
              type="button"
              onClick={async () => {
                await retirerFamille(m.id)
                onChange()
              }}
              className="flex-none rounded-lg border border-line px-2 py-1 text-[10px] font-extrabold text-ink-soft"
            >
              Retirer
            </button>
          </div>
        ))}

        {famille.invitations.map((i) => (
          <div key={i.id} className="flex items-center gap-2 rounded-2xl border border-dashed border-turquoise/50 bg-turquoise/5 px-3 py-2.5">
            <span className="flex-1">
              <span className="block text-[12.5px] font-extrabold tracking-[0.12em]">{i.code}</span>
              <span className="block text-[10px] text-ink-soft">Place réservée — envoie ce lien</span>
            </span>
            <button
              type="button"
              onClick={() => partager(i.code)}
              className="flex-none rounded-lg bg-turquoise px-2.5 py-1.5 text-[10.5px] font-extrabold text-white"
            >
              Envoyer
            </button>
          </div>
        ))}
      </div>

      {restantes > 0 && (
        <button
          type="button"
          disabled={occupe}
          onClick={inviter}
          className="mt-2 w-full rounded-xl border-2 border-dashed border-line py-2.5 text-[12px] font-extrabold text-ink-soft disabled:opacity-60"
        >
          + Ajouter un proche ({restantes} place{restantes > 1 ? 's' : ''} libre{restantes > 1 ? 's' : ''})
        </button>
      )}

      {flash && <p className="animate-rise mt-2 text-center text-[11.5px] font-bold text-turquoise-deep">{flash}</p>}
    </>
  )
}

/** Ce qu'on voit une fois abonné : l'état, la date, et la sortie. */
function Gestion({ etat, onChange }) {
  const [flash, setFlash] = useState(null)
  const [occupe, setOccupe] = useState(false)

  const fin = etat.periodeFin
    ? new Date(etat.periodeFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const libelle =
    etat.via === 'famille'
      ? `Tu fais partie du pack famille${etat.proprietaire ? ` de ${etat.proprietaire}` : ''}`
      : etat.statut === 'essai'
        ? 'Essai gratuit en cours'
        : etat.statut === 'retard'
          ? 'Un paiement n’est pas passé'
          : etat.annuleALaFin
            ? 'Abonnement en cours — résilié à la fin de la période'
            : 'Abonnement actif'

  return (
    <>
      <div className="rounded-2xl border-2 border-turquoise bg-turquoise/5 p-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-turquoise text-white" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5.5 5.5L20 6.5" />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold">{libelle}</div>
            <div className="text-[10.5px] leading-snug text-ink-soft">
              {etat.plan === 'famille' ? `Pack ${FAMILLE_TAILLE} personnes` : 'Une personne'}
              {fin && ` · ${etat.annuleALaFin ? 'jusqu’au' : 'prochaine échéance le'} ${fin}`}
            </div>
          </div>
        </div>

        {etat.statut === 'retard' && (
          <p className="mt-2 rounded-xl bg-coral/10 px-2.5 py-2 text-[11px] leading-snug text-ink">
            Ta carte a peut-être expiré. Tes leçons restent ouvertes jusqu’au {fin || 'terme en cours'} —
            le temps de la mettre à jour, sans se presser.
          </p>
        )}
      </div>

      {etat.via === 'famille' ? (
        <button
          type="button"
          disabled={occupe}
          onClick={async () => {
            setOccupe(true)
            await quitterFamille()
            setOccupe(false)
            onChange()
          }}
          className="mt-3 w-full rounded-xl border border-line bg-cream py-2.5 text-[12px] font-extrabold text-ink-soft disabled:opacity-60"
        >
          Quitter ce pack famille
        </button>
      ) : (
        <div className="mt-3">
          <Button
            variant="neutral"
            disabled={occupe}
            onClick={async () => {
              setOccupe(true)
              const err = await ouvrirPortail()
              setOccupe(false)
              if (err) {
                setFlash(err)
                setTimeout(() => setFlash(null), 3000)
              }
            }}
          >
            Gérer mon abonnement
          </Button>
          <p className="mt-1.5 text-center text-[10px] leading-snug text-ink-soft">
            Changer de carte, télécharger tes factures, ou résilier — en un clic, chez Stripe.
            Une résiliation garde l’accès jusqu’à la fin du mois déjà payé.
          </p>
        </div>
      )}

      {etat.plan === 'famille' && etat.via === 'propre' && (
        <Famille famille={etat.famille} onChange={onChange} />
      )}

      {flash && <p className="animate-rise mt-2 text-center text-[11.5px] font-bold text-coral">{flash}</p>}
    </>
  )
}

export function AbonnementScreen({ onBack, retour }) {
  const [etat, setEtat] = useState(undefined) // undefined = on regarde
  const [occupe, setOccupe] = useState(null) // le plan en cours d'achat
  const [erreur, setErreur] = useState(null)

  const recharger = () => etatAbonnement().then(setEtat)
  useEffect(() => {
    recharger()
  }, [])

  async function prendre(plan) {
    setErreur(null)
    setOccupe(plan)
    const err = await passerEnCaisse(plan)
    if (err) {
      setOccupe(null)
      setErreur(err)
    }
    // Pas de `setOccupe(null)` en cas de succès : la page est en train de
    // partir vers Stripe, remettre le bouton à l'état neuf inviterait à
    // cliquer deux fois pendant la redirection.
  }

  const t = etat?.tarifs

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Tama Speak en entier</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {/* Le retour de Stripe, dit en clair : un paiement qui se termine sans
            un mot laisse toujours un doute (« ça a marché ou pas ? »). */}
        {retour === 'ok' && (
          <div className="animate-rise mb-3 rounded-2xl border-2 border-turquoise bg-turquoise/10 px-3 py-2.5 text-[12px] font-bold leading-snug">
            Merci — c’est en place. Tanemmirt ! Tous les cours sont ouverts.
          </div>
        )}
        {retour === 'annule' && (
          <div className="animate-rise mb-3 rounded-2xl border border-line bg-sand px-3 py-2.5 text-[12px] leading-snug text-ink-soft">
            Rien n’a été débité. La première unité de chaque cours reste ouverte, autant que tu veux.
          </div>
        )}

        {/* Mode test : dit franchement, et en haut. Quelqu'un qui « paie »
            sans que rien ne soit débité doit le savoir avant, pas après. */}
        {etat?.modeTest && (
          <div className="mb-3 rounded-2xl border-2 border-coral bg-coral/10 px-3 py-2.5 text-[11.5px] font-bold leading-snug">
            Mode test — aucun paiement réel. Utilise la carte d’essai
            <span className="tabular-nums"> 4242 4242 4242 4242</span>, une date future et
            n’importe quel code.
          </div>
        )}

        {etat === undefined && <p className="mt-6 text-center text-[12px] text-ink-soft">· · ·</p>}

        {etat === null && (
          <p className="mt-6 text-center text-[12px] leading-snug text-ink-soft">
            Les tarifs ne se chargent pas — tu es peut-être hors ligne.
            <br />
            Tes leçons, elles, restent ouvertes.
          </p>
        )}

        {/* Un abonnement RÉEL : l'écran de gestion. On se garde bien de
            l'afficher quand l'accès vient d'ailleurs (boutique fermée, mode
            test) — ce serait promettre une facture qui n'existe pas. */}
        {etat && abonnementReel(etat) && <Gestion etat={etat} onChange={recharger} />}

        {/* Accès ouvert sans rien avoir payé : on le dit tel quel. */}
        {etat && !abonnementReel(etat) && etat.abonne && (
          <div className="rounded-2xl border border-line bg-sand px-3 py-3 text-center text-[12px] leading-snug text-ink-soft">
            {etat.paiementOuvert
              ? 'Tout est ouvert pendant la mise en route des abonnements. Rien à faire, et rien à payer.'
              : 'Les abonnements ne sont pas encore ouverts. En attendant, tous les cours sont accessibles.'}
            {/* Le mot qui manquait : en mode test, un « tout est ouvert »
                inexpliqué envoie chercher la panne du côté de Stripe alors
                qu'il manque une adresse dans ADMIN_EMAILS. */}
            {etat.modeTest && etat.connecte && !etat.admin && (
              <span className="mt-2 block text-[10.5px] leading-snug">
                Pendant les essais, seuls les comptes listés dans <b>ADMIN_EMAILS</b> voient les
                formules. Ce compte n’en fait pas partie.
              </span>
            )}
          </div>
        )}

        {etat && !etat.abonne && (
          <>
            <div className="mb-3 flex items-end gap-2">
              <Akermus height={64} />
              <p className="mb-1 flex-1 rounded-2xl rounded-bl-md border border-line bg-sand p-2.5 text-[11.5px] font-semibold leading-snug">
                La première unité de chaque cours est <b>gratuite pour toujours</b>. Pour la suite —
                les dix unités du kabyle et tous les autres cours — c’est ici.
              </p>
            </div>

            {/* Ici, `abonne` est faux : la boutique est forcément ouverte
                (le serveur rend `abonne: true` quand elle ne l'est pas). */}
            <div className="flex flex-col gap-2.5">
                  <Formule
                    plan={PLANS.solo}
                    prix={t.solo}
                    vedette={false}
                    occupe={occupe === 'solo'}
                    onPrendre={() => prendre('solo')}
                    avantages={[
                      'Les 5 cours, toutes les unités',
                      'Ta progression sur tous tes appareils',
                      'Les nouveaux contenus au fur et à mesure',
                    ]}
                  />
                  <Formule
                    plan={PLANS.famille}
                    prix={t.famille}
                    vedette
                    occupe={occupe === 'famille'}
                    onPrendre={() => prendre('famille')}
                    avantages={[
                      `Tout du plan « une personne », pour ${FAMILLE_TAILLE} personnes`,
                      `${FAMILLE_INVITES} invitations à envoyer par WhatsApp`,
                      'Chacun son compte, chacun sa progression',
                    ]}
                  />
                </div>

                <p className="mt-3 text-center text-[10.5px] leading-relaxed text-ink-soft">
                  {etat.essaiJours} jours d’essai gratuit, puis le montant indiqué, TTC, par mois.
                  <br />
                  Résiliable à tout moment, en un clic, sans avoir à écrire à personne.
                </p>

                <div className="mt-4 rounded-2xl border border-line bg-sand px-3 py-2.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                    Tarif {etat.zoneLibelle}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-ink-soft">
                    Le prix suit la région d’où tu te connectes. En Afrique et en Asie, il est
                    volontairement plus bas : une app qui enseigne les langues amazighes et resterait
                    hors de portée en Afrique du Nord aurait manqué son sujet.
                  </p>
                </div>

                <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-soft">
                  Paiement par carte, Apple&nbsp;Pay, Google&nbsp;Pay et les moyens de paiement
                  locaux — traité par Stripe. Tama Speak ne voit ni ne conserve aucune donnée
                  bancaire.
                </p>
          </>
        )}

        {/* `whitespace-pre-line` : le détail technique du mode test arrive
            après un saut de ligne, il ne doit pas se coller au message. */}
        {erreur && (
          <p className="animate-rise mt-3 whitespace-pre-line break-words text-center text-[11.5px] font-bold text-coral">
            {erreur}
          </p>
        )}
      </div>
    </div>
  )
}
