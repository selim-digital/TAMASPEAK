import { useEffect, useState } from 'react'
import { getCercle, actionCercle } from '../lib/api.js'
import { shareText, APP_URL } from '../lib/share.js'
import { sfx } from '../lib/sfx.js'

/**
 * Le cercle — famille et amis qui apprennent ensemble.
 *
 * Trois classements (semaine, mois, année en cours) calculés par le
 * serveur depuis les événements d'usage. Le barème VALORISE L'EFFORT :
 * chaque XP compte, chaque duel joué compte, la victoire compte en plus —
 * et le « plus assidu » (jours de pratique) a son trophée à lui.
 *
 * Le palmarès de chaque période close part par email aux membres
 * (lundi / le 1ᵉʳ / le 1ᵉʳ janvier) — c'est dit en clair ici même, au
 * moment de créer ou rejoindre : c'est là que vit le consentement.
 *
 * C'est la SEULE brique du coin jeux qui exige un compte et du réseau :
 * un classement entre téléphones ne peut pas vivre dans un lien.
 */

const PERIODES = [
  { id: 'semaine', label: 'Semaine' },
  { id: 'mois', label: 'Mois' },
  { id: 'annee', label: 'Année' },
]

const MEDAILLES = ['🥇', '🥈', '🥉']

function Carte({ children }) {
  return <div className="mt-3 rounded-2xl border border-line bg-sand px-3.5 py-3.5 text-[11.5px] leading-snug text-ink-soft">{children}</div>
}

export function CercleScreen({ user, onCompte, onBack }) {
  // null = chargement ; sinon la réponse de getCercle (etat + données).
  const [donnees, setDonnees] = useState(null)
  const [periode, setPeriode] = useState('semaine')
  const [nom, setNom] = useState('')
  const [code, setCode] = useState('')
  const [occupe, setOccupe] = useState(false)
  const [message, setMessage] = useState(null)
  const [confirmeDepart, setConfirmeDepart] = useState(false)

  const charger = () => getCercle().then(setDonnees)
  useEffect(() => {
    if (user) charger()
  }, [user])

  async function faire(action, params) {
    setOccupe(true)
    setMessage(null)
    const r = await actionCercle(action, params)
    setOccupe(false)
    if (r.etat === 'ok') {
      sfx.correct()
      setNom('')
      setCode('')
      setConfirmeDepart(false)
      setDonnees(null)
      charger()
    } else {
      sfx.wrong()
      setMessage(
        r.message ||
          (r.etat === 'indisponible'
            ? 'Le serveur n’est pas joignable pour le moment.'
            : r.etat === 'anonyme'
              ? 'Connecte-toi d’abord.'
              : 'Impossible pour le moment — réessaie.'),
      )
    }
  }

  function inviter() {
    sfx.click()
    shareText(
      [
        'ⵣ Tama Speak — rejoins notre cercle !',
        `Code d’invitation : ${donnees.cercle.code}`,
        'Dans l’app : Jeux → Le cercle → Rejoindre.',
      ].join('\n'),
      APP_URL,
    )
  }

  const entete = (
    <div className="flex items-center gap-3 px-4 pt-8 pb-1">
      <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
        ←
      </button>
      <h2 className="text-lg font-extrabold">Le cercle</h2>
    </div>
  )

  /* ---- Pas de compte : le cercle vit sur le serveur, il en faut un. ---- */
  if (!user) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        {entete}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <Carte>
            Le cercle relie plusieurs téléphones : classement de la semaine, du mois et de l’année
            entre famille et amis, et le palmarès envoyé par email. Il lui faut donc un{' '}
            <b className="text-ink">compte</b> — le reste de l’app n’en a pas besoin.
          </Carte>
          <button
            type="button"
            onClick={onCompte}
            className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
          >
            Me connecter
          </button>
        </div>
      </div>
    )
  }

  /* ---- Chargement / serveur absent ---- */
  if (!donnees) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        {entete}
        <p className="mt-8 text-center text-[11.5px] text-ink-soft">chargement…</p>
      </div>
    )
  }
  if (donnees.etat !== 'ok') {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        {entete}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <Carte>
            {donnees.etat === 'anonyme'
              ? 'Ta session a expiré — reconnecte-toi pour retrouver ton cercle.'
              : 'Le cercle a besoin du serveur, qui n’est pas joignable pour le moment. Tout le reste de l’app fonctionne sans lui.'}
          </Carte>
        </div>
      </div>
    )
  }

  /* ---- Pas encore de cercle : créer ou rejoindre ---- */
  if (!donnees.cercle) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        {entete}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            Famille et amis dans un même cercle : classement de la <b className="text-ink">semaine</b>, du{' '}
            <b className="text-ink">mois</b> et de l’<b className="text-ink">année</b>, où chaque effort compte —
            XP, parties, duels. Le <b className="text-ink">palmarès part par email</b> aux membres à chaque fin de
            période (c’est l’engagement pris en rejoignant ; on peut s’en désabonner à tout moment).
          </p>

          <div className="mt-4 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3.5 py-3.5">
            <div className="text-[13px] font-extrabold">Créer un cercle</div>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              maxLength={40}
              placeholder="Le nom du cercle (« Ath Yenni », « La famille »…)"
              className="mt-2 w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-turquoise"
            />
            <button
              type="button"
              disabled={occupe || !nom.trim()}
              onClick={() => faire('creer', { nom: nom.trim() })}
              className="mt-2 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:opacity-50"
            >
              Créer et recevoir le code
            </button>
          </div>

          <div className="mt-3 rounded-2xl border-2 border-coral/40 bg-coral/5 px-3.5 py-3.5">
            <div className="text-[13px] font-extrabold">Rejoindre un cercle</div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="Le code reçu (6 lettres)"
              className="mt-2 w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-center text-[15px] font-extrabold tracking-[0.3em] outline-none focus:border-coral"
            />
            <button
              type="button"
              disabled={occupe || code.trim().length < 6}
              onClick={() => faire('rejoindre', { code: code.trim() })}
              className="mt-2 w-full rounded-xl bg-coral py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-coral-dark)] disabled:opacity-50"
            >
              Rejoindre
            </button>
          </div>

          {message && <p className="animate-rise mt-3 text-center text-[11.5px] font-bold text-coral-dark">{message}</p>}
        </div>
      </div>
    )
  }

  /* ---- Le cercle et ses classements ---- */
  const classement = donnees.classements?.[periode] || []
  const assidu = [...classement].sort((a, b) => b.jours - a.jours || b.xp - a.xp)[0]

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      {entete}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        {/* Le cercle et son code d'invitation */}
        <div className="mt-1 flex items-center gap-2.5 rounded-2xl border border-line bg-sand px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-extrabold">{donnees.cercle.nom}</div>
            <div className="text-[10.5px] font-bold text-ink-soft">
              {donnees.cercle.membres} membre{donnees.cercle.membres > 1 ? 's' : ''} · code{' '}
              <b className="tracking-widest text-turquoise-deep">{donnees.cercle.code}</b>
            </div>
          </div>
          <button
            type="button"
            onClick={inviter}
            className="flex-none rounded-xl bg-turquoise px-3 py-2 text-[11.5px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
          >
            Inviter
          </button>
        </div>

        {/* Les trois périodes */}
        <div className="mt-3 flex gap-1.5">
          {PERIODES.map((pp) => (
            <button
              key={pp.id}
              type="button"
              onClick={() => {
                setPeriode(pp.id)
                sfx.click()
              }}
              className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11.5px] font-extrabold transition ${
                periode === pp.id ? 'border-turquoise bg-turquoise/10 text-turquoise-deep' : 'border-line bg-cream text-ink-soft'
              }`}
            >
              {pp.label}
            </button>
          ))}
        </div>

        {/* Le classement */}
        <div className="mt-2.5 flex flex-col gap-1.5">
          {classement.map((l, i) => {
            const moi = l.id === donnees.moi
            return (
              <div
                key={l.id}
                className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 ${
                  moi ? 'border-turquoise/50 bg-turquoise/5' : 'border-line bg-cream'
                }`}
              >
                <span className="w-7 flex-none text-center text-[15px] font-extrabold">
                  {MEDAILLES[i] || <span className="text-[11px] text-ink-soft">{i + 1}.</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-extrabold">
                    {l.nom}
                    {moi && <span className="ml-1 text-[9.5px] font-bold text-turquoise-deep">(toi)</span>}
                    {assidu && assidu.id === l.id && assidu.jours > 0 && (
                      <span className="ml-1" title="La personne la plus assidue">
                        🔥
                      </span>
                    )}
                  </span>
                  <span className="block text-[9.5px] font-bold text-ink-soft">
                    {l.xp} XP · {l.duelsJoues} duel{l.duelsJoues > 1 ? 's' : ''}
                    {l.duelsGagnes > 0 && ` (${l.duelsGagnes} gagné${l.duelsGagnes > 1 ? 's' : ''})`} · {l.jours} jour
                    {l.jours > 1 ? 's' : ''} actif{l.jours > 1 ? 's' : ''}
                  </span>
                </span>
                <span className="flex-none text-[14px] font-extrabold tabular-nums text-turquoise-deep">{l.points} pts</span>
              </div>
            )
          })}
        </div>

        <Carte>
          Points = <b className="text-ink">XP + {donnees.bareme?.duelJoue ?? 5} par duel joué + {donnees.bareme?.duelGagne ?? 20} par duel
          gagné</b> — jouer compte toujours, gagner compte plus. 🔥 marque la personne la plus assidue. Le{' '}
          <b className="text-ink">palmarès part par email</b> chaque lundi (semaine), le 1ᵉʳ (mois) et le 1ᵉʳ janvier (année).
        </Carte>

        {confirmeDepart ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmeDepart(false)}
              className="flex-1 rounded-xl border-2 border-line bg-cream py-2 text-[12px] font-extrabold text-ink-soft"
            >
              Rester
            </button>
            <button
              type="button"
              disabled={occupe}
              onClick={() => faire('quitter')}
              className="flex-1 rounded-xl bg-coral py-2 text-[12px] font-extrabold text-white shadow-[0_3px_0_var(--color-coral-dark)]"
            >
              Oui, quitter
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmeDepart(true)}
            className="mx-auto mt-3 block text-[11px] font-bold text-ink-soft underline"
          >
            Quitter le cercle
          </button>
        )}
        {message && <p className="animate-rise mt-3 text-center text-[11.5px] font-bold text-coral-dark">{message}</p>}
      </div>
    </div>
  )
}
