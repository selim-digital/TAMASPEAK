import { Avatar } from '../components/Avatar.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { YazMark } from '../components/Logo.jsx'
import { RECITS } from '../data/history.js'
import { verrouActif } from '../lib/abonnement.js'
import { useEffect, useState } from 'react'
import { sfx } from '../lib/sfx.js'

/**
 * Aujourd'hui — l'écran d'atterrissage de la refonte C (choix de Selim).
 *
 * Le rituel quotidien, orchestré : UN grand geste (« Continuer ma
 * leçon »), l'objectif du jour, le défi, ce que le cercle attend de toi,
 * un fait à savourer, la culture à portée — et c'est tout. Le chemin,
 * lui, est redevenu une carte qu'on consulte, dans son propre onglet.
 *
 * Discipline éditoriale (le risque identifié par le comité était de
 * recréer un fourre-tout) : CHAQUE bloc doit répondre à « qu'est-ce que
 * je fais MAINTENANT ? ». Ce qui ne s'y plie pas vit dans un autre
 * onglet.
 */

/** Salutation selon l'heure — sobre, sans figure. */
function salutation() {
  const h = new Date().getHours()
  if (h < 6) return 'Bonne nuit'
  if (h < 18) return 'Azul'
  return 'Timensiwin' // bonsoir
}

function TeteJour({ course, name, onLanguages, onNotifs, onProfile, notifCount, avatar }) {
  return (
    <div className="flex items-center gap-2 px-[18px] pt-7 pb-1">
      <button type="button" onClick={onLanguages} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-label={`Langue : ${course.name}. Changer de langue`}>
        <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: course.accent }} />
        <span className="truncate text-[12px] font-extrabold">{course.name}</span>
        <span className="text-[11px] font-extrabold text-ink-soft">⌄</span>
      </button>
      <button
        type="button"
        onClick={onNotifs}
        aria-label={notifCount > 0 ? `Notifications — ${notifCount} non lues` : 'Notifications'}
        className="relative flex-none text-ink-soft transition-transform active:scale-90"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9a6 6 0 1 1 12 0c0 4 1.6 5.4 2.4 6.2.3.3.1.8-.4.8H4c-.5 0-.7-.5-.4-.8C4.4 14.4 6 13 6 9z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
        {notifCount > 0 && (
          <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-0.5 text-[9px] font-extrabold text-white">
            {notifCount > 9 ? '9+' : notifCount}
          </span>
        )}
      </button>
      <button type="button" onClick={onProfile} aria-label="Mon profil" className="flex-none">
        <Avatar id={avatar} size={30} />
      </button>
    </div>
  )
}

/** L'anneau d'objectif, compact, à côté du grand bouton. */
function AnneauObjectif({ value = 0, goal }) {
  if (!goal) return null
  const p = Math.min(1, value / goal)
  const C = 2 * Math.PI * 14
  const done = p >= 1
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-cream px-3 py-2.5">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="17" cy="17" r="14" fill="none" stroke="var(--color-sand-2)" strokeWidth="4.5" />
        <circle
          cx="17" cy="17" r="14" fill="none"
          stroke={done ? 'var(--color-green-vif)' : 'var(--color-coral)'}
          strokeWidth="4.5" strokeLinecap="round"
          strokeDasharray={`${C * p} ${C}`}
          transform="rotate(-90 17 17)"
          className="transition-all duration-700"
        />
        {done && <path d="M11.5 17.5l4 4 7-8" fill="none" stroke="var(--color-green-vif)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11.5px] font-extrabold">{done ? 'Objectif atteint — Igerrez !' : 'Objectif du jour'}</div>
        <div className="text-[10.5px] font-bold tabular-nums text-ink-soft">{Math.min(value, goal)} / {goal} XP</div>
      </div>
    </div>
  )
}

/** Proposition d'installation (voir PathScreen d'origine — déplacée ici). */
function InstallCard() {
  const [dispo, setDispo] = useState(() => !!window.__installPrompt)
  useEffect(() => {
    const f = () => setDispo(true)
    window.addEventListener('tama-installable', f)
    return () => window.removeEventListener('tama-installable', f)
  }, [])
  if (!dispo) return null
  return (
    <button
      type="button"
      onClick={async () => {
        const p = window.__installPrompt
        if (!p) return
        p.prompt()
        await p.userChoice.catch(() => {})
        window.__installPrompt = null
        setDispo(false)
      }}
      className="mt-2.5 flex w-full items-center gap-2.5 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3 py-2 text-left"
    >
      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-turquoise text-white" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-extrabold">Installer Tama Speak</span>
        <span className="block text-[10px] leading-snug text-ink-soft">Sur ton écran d'accueil, comme une vraie app.</span>
      </span>
    </button>
  )
}

export function AujourdhuiScreen({
  course,
  name,
  avatar,
  notifCount = 0,
  xpTodayValue = 0,
  dailyGoalXp,
  streak = 0,
  leconCourante, // { node, unit } | null
  canChallenge = false,
  fait, // le fait du moment (rotation de la respiration)
  recitsLusCount = 0,
  suggestions = [], // notifications serveur actionnables (≤ 2)
  abonnement,
  onContinuer,
  onChemin,
  onChallenge,
  onQuiz,
  onHistoire,
  onTifinagh,
  onNotifs,
  onProfile,
  onLanguages,
  onAbonnement,
  onOuvrirNotif,
}) {
  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-[radial-gradient(130%_70%_at_50%_0%,rgba(16,196,168,0.10),var(--color-cream)_55%)]">
      <TeteJour
        course={course}
        name={name}
        onLanguages={onLanguages}
        onNotifs={onNotifs}
        onProfile={onProfile}
        notifCount={notifCount}
        avatar={avatar}
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        {/* Le salut + Akermus, petit : on est chez soi. */}
        <div className="flex items-center gap-2 px-0.5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[19px] font-extrabold leading-tight">
              {salutation()}{name ? `, ${name}` : ''} !
            </h2>
            {streak >= 2 && (
              <p className="text-[11px] font-bold text-ink-soft">🔥 {streak} jours de suite — ça compte.</p>
            )}
          </div>
          <Akermus height={64} state="idle" float className="flex-none" />
        </div>

        {/* LE geste du jour : continuer sa leçon. Un seul grand bouton. */}
        <button
          type="button"
          onClick={() => {
            sfx.click()
            leconCourante ? onContinuer(leconCourante.node) : onChemin()
          }}
          className="mt-2.5 w-full rounded-2xl bg-turquoise px-4 py-4 text-left text-white shadow-[0_5px_0_var(--color-turquoise-dark)] transition-transform active:translate-y-[2px] active:shadow-[0_3px_0_var(--color-turquoise-dark)]"
        >
          <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.14em] opacity-90">
            {leconCourante ? `${leconCourante.unit?.unitLabel || ''} · ${leconCourante.unit?.title || ''}` : 'Ton parcours'}
          </span>
          <span className="mt-0.5 flex items-center justify-between gap-2">
            <span className="truncate text-[17px] font-extrabold">
              {leconCourante ? `Continuer — ${leconCourante.node.title}` : 'Voir le chemin'}
            </span>
            <span className="flex-none text-[18px]" aria-hidden="true">→</span>
          </span>
        </button>

        {/* Objectif + défi, côte à côte quand les deux existent. */}
        <div className="mt-2.5 flex gap-2">
          <div className="min-w-0 flex-1">
            <AnneauObjectif value={xpTodayValue} goal={dailyGoalXp} />
          </div>
          <button
            type="button"
            onClick={onChallenge}
            disabled={!canChallenge}
            className={`flex flex-none flex-col items-center justify-center gap-0.5 rounded-2xl px-3.5 text-[11px] font-extrabold transition ${
              canChallenge
                ? 'bg-coral text-white shadow-[0_3px_0_var(--color-coral-dark)] active:translate-y-[1px]'
                : 'border border-line bg-cream text-ink-soft'
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
            </svg>
            {canChallenge ? 'Défi du jour' : 'Défi fait ✓'}
          </button>
        </div>

        {/* Ce que le cercle attend de toi — de vraies personnes d'abord. */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {suggestions.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onOuvrirNotif(n)}
                className="flex w-full items-center gap-2.5 rounded-2xl border-2 border-coral/40 bg-coral/5 px-3 py-2.5 text-left transition-transform active:scale-[0.98]"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-coral to-coral-dark text-white">
                  <YazMark size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold">{n.title}</span>
                  <span className="block truncate text-[10.5px] text-ink-soft">{n.body}</span>
                </span>
                <span className="flex-none text-[11px] font-extrabold text-coral-dark">
                  {n.kind === 'demande-audio' ? 'Enregistrer →' : n.kind === 'defi' ? 'Jouer →' : 'Voir →'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Le fait du moment — la respiration a aussi sa maison. */}
        {fait && (
          <div className="mt-3 rounded-2xl border border-turquoise/40 bg-white px-3 py-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-turquoise-deep">
                Le savais-tu ?
              </span>
            </div>
            <p className="mt-1 text-[11.5px] leading-snug text-ink">{fait.texte}</p>
            <button type="button" onClick={onQuiz} className="mt-1.5 text-[10.5px] font-extrabold text-turquoise-deep underline">
              Retrouve-le au quiz ⵣ
            </button>
          </div>
        )}

        {/* La culture, à portée : Histoire + Tifinagh. */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onHistoire}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-cream px-3 py-2.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-turquoise-deep text-white" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
                <path d="M9 7.5h6M9 11h4" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-extrabold">Histoire</span>
              <span className="block text-[9.5px] font-bold tabular-nums text-ink-soft">
                {recitsLusCount}/{RECITS.length} récits lus
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={onTifinagh}
            className="flex flex-none items-center gap-2 rounded-2xl border border-line bg-cream px-3.5 py-2.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="tifinagh text-[19px] font-extrabold text-turquoise-deep" aria-hidden="true">ⵣ</span>
            <span className="text-[12px] font-extrabold">Tifinagh</span>
          </button>
        </div>

        {verrouActif(abonnement) && (
          <button
            type="button"
            onClick={onAbonnement}
            className="mt-2.5 flex w-full items-center gap-2.5 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3 py-2 text-left transition-transform active:scale-[0.98]"
          >
            <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-turquoise text-white" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l2.6 5.6L21 9.4l-4.5 4.3 1.1 6.1L12 17l-5.6 2.8 1.1-6.1L3 9.4l6.4-.8z" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-extrabold">Ouvrir tous les cours</span>
              <span className="block text-[10px] leading-snug text-ink-soft">
                {abonnement?.tarifs?.solo?.parMois ? `À partir de ${abonnement.tarifs.solo.parMois}, ` : ''}résiliable en un clic. Ou en famille, à 4.
              </span>
            </span>
            <span className="flex-none text-[12px] font-extrabold text-turquoise-deep">→</span>
          </button>
        )}

        <InstallCard />
      </div>
    </div>
  )
}
