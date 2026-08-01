import { useEffect, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Avatar, AVATARS } from '../components/Avatar.jsx'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { FlameIcon, StarIcon, GemIcon } from '../components/jewels/StatIcons.jsx'
import { COURSES } from '../data/courses.js'
import { globalStats, setIdentity } from '../lib/progress.js'
import { shareText, profileShare } from '../lib/share.js'
import { getEmailPrefs, setEmailPrefs } from '../lib/api.js'
import { abonnementReel } from '../lib/abonnement.js'
import { sfx, isSfxOn, setSfxOn } from '../lib/sfx.js'

function Tile({ icon, value, label }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-cream px-2 py-3 text-center">
      <div className="flex items-center justify-center gap-1 text-lg font-extrabold tabular-nums text-turquoise-deep">
        {icon} {value}
      </div>
      <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}

/** Interrupteur à glissière — le motif standard, au doigt comme au clavier. */
function Toggle({ checked, onChange, label, detail, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        sfx.click()
        onChange(!checked)
      }}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-cream px-3 py-2.5 text-left disabled:opacity-50"
    >
      <div className="flex-1">
        <div className="text-[12.5px] font-extrabold">{label}</div>
        <div className="mt-0.5 text-[10.5px] leading-snug text-ink-soft">{detail}</div>
      </div>
      <span
        className={`relative h-6 w-11 flex-none rounded-full transition-colors ${checked ? 'bg-turquoise' : 'bg-sand-2'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </span>
    </button>
  )
}

/**
 * Rappels par email — les deux opt-in que le cron des relances consulte.
 * La section n'apparaît que si le serveur répond ET que l'élève est
 * connecté (getEmailPrefs rend null sinon) : hors-ligne ou en mode local,
 * pas de promesse d'email qu'on ne peut pas tenir.
 */
function EmailPrefs() {
  const [prefs, setPrefs] = useState(null) // null = pas connecté / pas encore su
  const [envoi, setEnvoi] = useState(false)

  useEffect(() => {
    let actif = true
    getEmailPrefs().then((p) => actif && p && setPrefs(p))
    return () => {
      actif = false
    }
  }, [])

  if (!prefs) return null

  async function change(patch) {
    const avant = prefs
    const apres = { ...prefs, ...patch }
    setPrefs(apres) // optimiste — l'interrupteur répond au doigt
    setEnvoi(true)
    const ok = await setEmailPrefs(apres)
    setEnvoi(false)
    if (!ok) setPrefs(avant)
  }

  return (
    <>
      <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
        Rappels par email
      </div>
      <div className="flex flex-col gap-2">
        <Toggle
          checked={prefs.relances}
          disabled={envoi}
          onChange={(v) => change({ relances: v, ...(v ? {} : { resumeHebdo: false }) })}
          label="Un rappel de temps en temps"
          detail="Si tu t'absentes quelques jours, un petit mot — jamais de reproche."
        />
        <Toggle
          checked={prefs.resumeHebdo}
          disabled={envoi || !prefs.relances}
          onChange={(v) => change({ resumeHebdo: v })}
          label="Le résumé de ma semaine"
          detail="Chaque semaine : tes XP, ta série, tes découvertes."
        />
      </div>
    </>
  )
}

/**
 * Profil — l'identité de l'élève dans l'app : pseudo, avatar choisi parmi la
 * famille, et bilan cumulé de TOUTES les langues. C'est aussi d'ici qu'on
 * partage sa progression et qu'on lance un défi.
 *
 * Aucune donnée ne quitte l'appareil : le partage passe par la feuille de
 * partage du système ou le presse-papiers, jamais par un serveur.
 */
/**
 * L'abonnement, vu du profil : une seule ligne, qui dit l'état sans jargon.
 * Elle n'apparaît pas si la boutique n'est pas ouverte (pas de clé Stripe) ni
 * si le serveur est muet — on ne propose pas de payer ce qu'on ne peut pas
 * encaisser.
 */
function LigneAbonnement({ etat, onOuvrir }) {
  if (!etat || !etat.paiementOuvert) return null
  // `abonnementReel` et non `etat.abonne` : en mode test (ou boutique
  // fermée) l'accès est ouvert sans que personne n'ait payé — annoncer
  // « Abonnement actif » serait promettre une facture qui n'existe pas.
  const abonne = abonnementReel(etat)
  return (
    <button
      type="button"
      onClick={() => {
        sfx.click()
        onOuvrir()
      }}
      className={`mt-6 flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left ${
        abonne ? 'border-line bg-cream' : 'border-turquoise/40 bg-turquoise/5'
      }`}
    >
      <span
        className={`grid h-10 w-10 flex-none place-items-center rounded-full ${
          abonne ? 'bg-turquoise text-white' : 'bg-turquoise/15 text-turquoise-deep'
        }`}
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          {abonne ? <path d="M4 12.5l5.5 5.5L20 6.5" /> : <path d="M12 3l2.6 5.6L21 9.4l-4.5 4.3 1.1 6.1L12 17l-5.6 2.8 1.1-6.1L3 9.4l6.4-.8z" />}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-extrabold">
          {abonne
            ? etat.via === 'famille'
              ? 'Pack famille — tu en fais partie'
              : etat.statut === 'essai'
                ? 'Essai gratuit en cours'
                : 'Abonnement actif'
            : 'Ouvrir tous les cours'}
        </span>
        <span className="block text-[10.5px] leading-snug text-ink-soft">
          {abonne
            ? 'Voir, gérer, ou inviter tes proches.'
            : `À partir de ${etat.tarifs?.solo?.parMois || '—'}, résiliable en un clic.`}
        </span>
      </span>
      <span className="flex-none text-[13px] font-extrabold text-ink-soft">›</span>
    </button>
  )
}

export function ProfileScreen({
  store,
  onSave,
  onDuel,
  onAccount,
  onAbonnement,
  abonnement,
  onFeedback,
  onTrophees,
  onFamille,
  onResetLang,
  onBack,
}) {
  const [resetEnCours, setResetEnCours] = useState(null) // langId en attente de confirmation
  const profile = store.profile || {}
  const [name, setName] = useState(profile.name || '')
  const [avatar, setAvatar] = useState(profile.avatar || 'akermus')
  const [picking, setPicking] = useState(false)
  const [flash, setFlash] = useState(null)
  // Le réglage du son — rapatrié du chemin par la refonte C : c'est un
  // réglage, il vit avec « Moi », pas dans la rangée d'action primaire.
  const [soundOn, setSoundOn] = useState(isSfxOn)
  function toggleSound() {
    const next = !soundOn
    setSfxOn(next)
    setSoundOn(next)
    if (next) sfx.click()
  }

  const stats = globalStats(store, COURSES)
  const dirty = name !== (profile.name || '') || avatar !== (profile.avatar || 'akermus')

  function save() {
    sfx.click()
    onSave(setIdentity(store, { name: name.trim(), avatar }))
    setFlash('Profil enregistré')
    setTimeout(() => setFlash(null), 1600)
  }

  async function share() {
    const lines = stats.perLang.map(
      (l) => `• ${l.course.name} — ${l.done}/${l.total} leçons, ${l.xp} XP`,
    )
    const res = await shareText(profileShare({ name: name.trim(), lines, totalXp: stats.xp }))
    setFlash(res === 'copied' ? 'Copié dans le presse-papiers' : res === 'failed' ? 'Partage indisponible' : null)
    setTimeout(() => setFlash(null), 2200)
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Mon profil</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {/* Identité */}
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={() => setPicking((v) => !v)} aria-label="Changer d'avatar" className="relative">
            <Avatar id={avatar} size={64} />
            <span className="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full border-2 border-cream bg-turquoise text-[11px] font-extrabold text-white">
              ✎
            </span>
          </button>
          <div className="flex-1">
            <label htmlFor="pseudo" className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
              Pseudo
            </label>
            <input
              id="pseudo"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="Ton nom dans l’app"
              className="mt-0.5 w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-[14px] font-bold outline-none focus:border-turquoise"
            />
          </div>
        </div>

        {picking && (
          <div className="animate-rise mt-3 grid grid-cols-4 gap-2 rounded-2xl border border-line bg-sand p-2.5">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setAvatar(a.id)
                  setPicking(false)
                  sfx.click()
                }}
                className={`flex flex-col items-center rounded-xl border-2 py-1.5 transition ${
                  avatar === a.id ? 'border-turquoise bg-turquoise/10' : 'border-transparent'
                }`}
              >
                <Avatar id={a.id} size={40} className="border-0 bg-transparent" />
                <span className="mt-0.5 text-[9px] font-extrabold">{a.name}</span>
              </button>
            ))}
          </div>
        )}

        {dirty && (
          <button
            type="button"
            onClick={save}
            className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
          >
            Enregistrer
          </button>
        )}

        {/* Bilan toutes langues */}
        <div className="mt-5 flex gap-2.5">
          <Tile icon={<StarIcon size={20} />} value={stats.xp} label="XP total" />
          <Tile icon={<FlameIcon size={20} />} value={stats.bestStreak} label="Meilleure série" />
          <Tile icon={<GemIcon size={20} />} value={stats.gems} label="Gemmes" />
        </div>

        <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          Mes langues ({stats.perLang.length})
        </div>
        {stats.perLang.length === 0 ? (
          <p className="text-[12px] text-ink-soft">Commence une langue pour voir ta progression ici.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.perLang.map((l) => (
              <div key={l.course.id} className="flex items-center gap-2.5 rounded-2xl border border-line bg-cream px-3 py-2.5">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: l.course.accent }} />
                <div className="flex-1">
                  <div className="text-[12.5px] font-extrabold">{l.course.name}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((l.done / l.total) * 100)}%`, background: l.course.accent }}
                    />
                  </div>
                </div>
                <div className="flex-none text-right">
                  <div className="text-[11.5px] font-extrabold tabular-nums">{l.xp} XP</div>
                  <div className="text-[9.5px] font-bold text-ink-soft tabular-nums">
                    {l.done}/{l.total} leçons
                  </div>
                </div>
                {l.medals > 0 && (
                  <span className="flex flex-none items-center gap-0.5">
                    <Tabzimt size={22} className="block" />
                    <span className="text-[10px] font-extrabold text-ink-soft">×{l.medals}</span>
                  </span>
                )}
                {/* Recommencer la langue — en deux temps, et c'est un vrai
                    zéro : la remise est aussi poussée au serveur, sinon la
                    fusion ressusciterait tout à la prochaine connexion. */}
                {resetEnCours === l.course.id ? (
                  <span className="flex flex-none gap-1">
                    <button
                      type="button"
                      onClick={() => setResetEnCours(null)}
                      className="rounded-lg border border-line bg-cream px-1.5 py-1 text-[9.5px] font-extrabold text-ink-soft"
                    >
                      Garder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onResetLang(l.course.id)
                        setResetEnCours(null)
                        sfx.click()
                      }}
                      className="rounded-lg bg-coral px-1.5 py-1 text-[9.5px] font-extrabold text-white"
                    >
                      À zéro
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResetEnCours(l.course.id)}
                    aria-label={`Recommencer ${l.course.name} depuis le début`}
                    className="flex-none text-[13px] text-ink-soft"
                  >
                    ↺
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <LigneAbonnement etat={abonnement} onOuvrir={onAbonnement} />

        <EmailPrefs />

        {/* Refonte C : le hub « Moi » — trophées et famille y trouvent leur
            porte, avec le réglage du son. */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onTrophees}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line bg-cream py-2.5 text-[12px] font-extrabold transition-transform active:scale-[0.98]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 4h12v4a6 6 0 0 1-12 0zM9 20h6M12 14v6" />
            </svg>
            Trophées
          </button>
          <button
            type="button"
            onClick={onFamille}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line bg-cream py-2.5 text-[12px] font-extrabold transition-transform active:scale-[0.98]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
            La famille
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? 'Couper les sons' : 'Activer les sons'}
            aria-pressed={soundOn}
            className={`grid flex-none place-items-center rounded-2xl border border-line px-3 transition ${soundOn ? 'bg-cream text-turquoise-deep' : 'bg-sand-2 text-ink-soft'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 9v6h4l5 5V4L8 9H4z" />
              {soundOn ? (
                <path d="M16 8c1.5 1.2 1.5 6.8 0 8M18.5 6c2.5 2 2.5 10 0 12" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <Button variant="primary" onClick={onDuel}>
            Défier un ami
          </Button>
          <Button variant="neutral" onClick={share}>
            Partager ma progression
          </Button>
          <Button variant="ghost" onClick={onFeedback}>
            💬 Donner mon avis
          </Button>
          <Button variant="neutral" onClick={onAccount}>
            Mon compte — sauvegarde en ligne
          </Button>
        </div>

        {flash && (
          <p className="animate-rise mt-3 text-center text-[11.5px] font-bold text-turquoise-deep">{flash}</p>
        )}

        <p className="mt-4 text-center text-[10px] leading-snug text-ink-soft">
          Ton profil vit sur cet appareil. Il n’est envoyé en ligne que si tu crées un compte —
          et uniquement pour te suivre d’un appareil à l’autre.
        </p>
      </div>
    </div>
  )
}
