import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Avatar, AVATARS } from '../components/Avatar.jsx'
import { Tabzimt } from '../components/jewels/Tabzimt.jsx'
import { FlameIcon, StarIcon, GemIcon } from '../components/jewels/StatIcons.jsx'
import { COURSES } from '../data/courses.js'
import { globalStats, setIdentity } from '../lib/progress.js'
import { shareText, profileShare } from '../lib/share.js'
import { sfx } from '../lib/sfx.js'

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

/**
 * Profil — l'identité de l'élève dans l'app : pseudo, avatar choisi parmi la
 * famille, et bilan cumulé de TOUTES les langues. C'est aussi d'ici qu'on
 * partage sa progression et qu'on lance un défi.
 *
 * Aucune donnée ne quitte l'appareil : le partage passe par la feuille de
 * partage du système ou le presse-papiers, jamais par un serveur.
 */
export function ProfileScreen({ store, onSave, onDuel, onAccount, onFeedback, onBack }) {
  const profile = store.profile || {}
  const [name, setName] = useState(profile.name || '')
  const [avatar, setAvatar] = useState(profile.avatar || 'akermus')
  const [picking, setPicking] = useState(false)
  const [flash, setFlash] = useState(null)

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
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
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
