import { useEffect, useRef, useState } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { LessonNode } from '../components/LessonNode.jsx'
import { landOf } from '../data/journey.js'
import { cheerFor } from '../components/mascots/Family.jsx'
import { isSfxOn, setSfxOn, sfx } from '../lib/sfx.js'
import { Avatar } from '../components/Avatar.jsx'

/** Position horizontale du nœud i sur le chemin sinueux. */
const offsetOf = (i) => Math.round(Math.sin(i * 0.9) * 66)

/** Trame de losanges en filigrane (motif G1, tissage kabyle) sur tout le chemin. */
function Filigree() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="tama-losanges" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 4 L24 14 L14 24 L4 14 Z" fill="none" stroke="var(--color-turquoise-deep)" strokeWidth="1.1" opacity=".07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tama-losanges)" />
    </svg>
  )
}

/** Sentier pointillé reliant deux nœuds consécutifs (motif G3).
 *  NB : la fin de courbe passe derrière l'info-bulle « Commencer ! » du nœud
 *  courant — masquée par le fond encre de la bulle, choix assumé. */
function Connector({ from, to }) {
  return (
    <svg width="264" height="26" viewBox="0 0 264 26" className="pointer-events-none overflow-visible" aria-hidden="true">
      <path
        d={`M${132 + from} -8 C ${132 + from} 8, ${132 + to} 18, ${132 + to} 34`}
        fill="none"
        stroke="var(--color-turquoise)"
        strokeOpacity=".3"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="0.1 13"
      />
    </svg>
  )
}

/** Bannière d'unité illustrée par son paysage + voile turquoise lisible
 *  + fine barre de progression de l'unité (motivation !). */
function UnitBanner({ unit, land, progress = 0 }) {
  return (
    <div className="relative mb-1 h-[86px] overflow-hidden rounded-2xl shadow-[0_8px_18px_-10px_rgba(10,122,105,.55)]">
      <img src={land.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,122,105,.88),rgba(10,122,105,.48)_55%,rgba(30,37,48,.16))]" />
      <div className="relative px-4 py-3 text-white">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] opacity-90">
          {unit.level} · {unit.unitLabel} — {land.region}
        </div>
        <div className="mt-0.5 text-[15px] font-extrabold drop-shadow-sm">{unit.title}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-black/15">
        <div
          className="h-full rounded-r-full bg-yellow-vif transition-all duration-700"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Une unité que l'abonnement n'ouvre pas encore.
 *
 * Elle reste VISIBLE — bannière, titre, paysage : on doit voir ce qu'il y a
 * après, c'est même toute la raison de payer. Seules les leçons cèdent la
 * place à cette carte. Le ton n'accuse pas et ne presse pas : la règle du
 * produit vaut aussi quand on demande de l'argent.
 */
function UniteVerrouillee({ unit, onAbonnement }) {
  const lecons = unit.lessons.filter((l) => l.type !== 'chest').length
  return (
    <button
      type="button"
      onClick={onAbonnement}
      className="mx-auto mt-3 mb-4 flex w-full max-w-[280px] items-center gap-2.5 rounded-2xl border-2 border-line bg-cream px-3 py-3 text-left transition-transform active:scale-[0.98]"
    >
      <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-sand-2 text-ink-soft" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
          <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-extrabold">
          {lecons} leçon{lecons > 1 ? 's' : ''} de plus, ici
        </span>
        <span className="block text-[10.5px] leading-snug text-ink-soft">
          Ouvre tous les cours — et emmène ta famille avec toi.
        </span>
      </span>
      <span className="flex-none text-[11px] font-extrabold text-turquoise-deep">Voir →</span>
    </button>
  )
}

/** Avancement d'une unité (leçons faites / leçons totales, coffres exclus). */
function progressOf(unit) {
  const lessons = unit.lessons.filter((l) => l.type !== 'chest')
  if (!lessons.length) return 0
  return lessons.filter((l) => l.status === 'done').length / lessons.length
}

/**
 * Proposition d'installation (Android/Chrome). L'événement est capturé très
 * tôt dans main.jsx ; ici on ne fait qu'offrir le bouton quand il existe.
 * La carte disparaît après installation, refus, ou si le navigateur ne
 * propose rien (iPhone : l'installation passe par le menu Partager).
 */
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
      className="mx-3.5 mt-1.5 flex items-center gap-2.5 rounded-xl border-2 border-turquoise/40 bg-turquoise/5 px-3 py-2 text-left"
    >
      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-turquoise text-white" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-extrabold">Installer Tama Speak</span>
        <span className="block text-[10px] leading-snug text-ink-soft">
          Sur ton écran d'accueil, comme une vraie app.
        </span>
      </span>
    </button>
  )
}

/** Anneau d'objectif quotidien (issu de l'onboarding). */
function DailyGoal({ value = 0, goal }) {
  if (!goal) return null
  const p = Math.min(1, value / goal)
  const C = 2 * Math.PI * 14
  const done = p >= 1
  return (
    // `mt-2.5` : la rangée d'actions au-dessus n'a pas de padding bas, la carte
    // se retrouvait collée à elle. 10 px reprend l'écart des autres rangées.
    <div className="mx-3.5 mt-2.5 mb-1.5 flex items-center gap-2.5 rounded-xl border border-line bg-cream px-3 py-2">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="17" cy="17" r="14" fill="none" stroke="var(--color-sand-2)" strokeWidth="4.5" />
        <circle
          cx="17"
          cy="17"
          r="14"
          fill="none"
          stroke={done ? 'var(--color-green-vif)' : 'var(--color-coral)'}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${C * p} ${C}`}
          transform="rotate(-90 17 17)"
          className="transition-all duration-700"
        />
        {done && (
          <path d="M11.5 17.5l4 4 7-8" fill="none" stroke="var(--color-green-vif)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <div className="flex-1">
        <div className="text-[11.5px] font-extrabold">{done ? 'Objectif du jour atteint — Igerrez !' : 'Objectif du jour'}</div>
        <div className="text-[10.5px] font-bold text-ink-soft tabular-nums">
          {Math.min(value, goal)} / {goal} XP
        </div>
      </div>
    </div>
  )
}

/** Un membre de la famille encourage l'élève près de sa leçon en cours
 *  (animé, et cliquable pour faire connaissance). */
function FamilyCheer({ cheer, onOpen }) {
  if (!cheer) return null
  const { member, message } = cheer
  return (
    <div className="animate-rise mb-1 mt-2 flex items-end gap-2 px-1">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Faire connaissance avec ${member.name}`}
        className="fam-anim flex-none cursor-pointer"
      >
        <member.Comp height={62} />
      </button>
      <div className="relative mb-2 flex-1 rounded-2xl rounded-bl-md border border-line bg-cream p-2.5 text-[11.5px] font-semibold leading-snug">
        <b className="text-turquoise-deep">{member.name}</b> — {message}
      </div>
    </div>
  )
}

/** Bandeau du haut : langue en cours à gauche, avatar (profil) à droite. */
function TopRow({ course, onOpen, onProfile, onNotifs, notifCount = 0, avatar }) {
  if (!course) return null
  return (
    <div className="flex items-center gap-2 px-[18px] pt-7 pb-0.5">
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 items-center gap-2 text-left"
        aria-label={`Langue : ${course.name}. Changer de langue`}
      >
        <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: course.accent }} />
        <span className="text-[12px] font-extrabold">{course.name}</span>
        {course.autonym !== course.name && <span className="text-[11px] font-bold text-ink-soft">{course.autonym}</span>}
        <span className="text-[11px] font-extrabold text-ink-soft">⌄</span>
      </button>
      {/* La cloche : badge corail tant qu'il reste du non-lu. */}
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

export function PathScreen({
  course,
  units,
  xp,
  gems,
  streak,
  xpTodayValue = 0,
  dailyGoalXp,
  cheerCount = 0,
  canChallenge,
  onSelectLesson,
  onOpenChest,
  onChallenge,
  onTrophies,
  onFamily,
  onLanguages,
  onProfile,
  onDuo,
  onMissions,
  onJeux,
  onTifinagh,
  onHistoire,
  onCercle,
  onNotifs,
  onAbonnement,
  // Verrou d'abonnement : rend `true` tant qu'on ne sait pas (hors-ligne,
  // serveur muet, boutique fermée) — le doute profite toujours à l'élève.
  uniteOuverte = () => true,
  notifCount = 0,
  lexiqueCount = 0,
  avatar,
}) {
  const cheer = cheerFor(cheerCount)
  const [soundOn, setSoundOn] = useState(isSfxOn)
  const scrollerRef = useRef(null)

  // À l'ouverture, on se place sur la leçon en cours plutôt qu'en haut du
  // chemin : avec dix unités, l'élève ne doit pas avoir à se chercher.
  // On calcule la position nous-mêmes plutôt que d'utiliser scrollIntoView,
  // qui se laisse interrompre par les animations d'entrée des nœuds.
  useEffect(() => {
    const placer = () => {
      const zone = scrollerRef.current
      const cible = zone?.querySelector('[data-courant="1"]')
      if (!zone || !cible) return
      // On mesure par rectangles : offsetTop se rapporterait au conteneur de
      // l'unité (positionné), pas à la zone de défilement.
      const zoneBox = zone.getBoundingClientRect()
      const cibleBox = cible.getBoundingClientRect()
      const ecart = cibleBox.top - zoneBox.top - zone.clientHeight / 2 + cibleBox.height / 2
      // Positionnement INSTANTANÉ : un défilement animé se fait interrompre par
      // l'entrée échelonnée des nœuds, et l'élève n'a de toute façon aucune
      // raison de regarder l'écran défiler sur dix unités.
      zone.scrollTop = Math.max(0, zone.scrollTop + ecart)
    }
    // Appel direct (la mise en page est déjà calculée après le commit), plus un
    // rattrapage différé — requestAnimationFrame ne conviendrait pas : il ne se
    // déclenche pas dans un onglet qui n'est pas peint.
    placer()
    const t = setTimeout(placer, 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id])

  function toggleSound() {
    const next = !soundOn
    setSfxOn(next)
    setSoundOn(next)
    if (next) sfx.click()
  }
  function handleNode(node) {
    if (node.type === 'chest') {
      if (node.status === 'available') onOpenChest?.(node)
    } else if (node.status === 'current') {
      onSelectLesson?.(node)
    }
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <TopRow
        course={course}
        onOpen={onLanguages}
        onProfile={onProfile}
        onNotifs={onNotifs}
        notifCount={notifCount}
        avatar={avatar}
      />
      <TopBar streak={streak} xp={xp} gems={gems} />

      {/* Actions */}
      <div className="flex gap-2 px-3.5 pb-1">
        <button
          type="button"
          onClick={onChallenge}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-extrabold transition ${
            canChallenge ? 'bg-coral text-white shadow-[0_3px_0_var(--color-coral-dark)]' : 'bg-sand-2 text-ink-soft'
          }`}
          disabled={!canChallenge}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
          </svg>
          {canChallenge ? 'Défi du jour' : 'Défi fait ✓'}
        </button>
        <button
          type="button"
          onClick={onTrophies}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-[12.5px] font-extrabold text-ink transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 4h12v4a6 6 0 0 1-12 0zM9 20h6M12 14v6" />
          </svg>
          Trophées
        </button>
        <button
          type="button"
          onClick={onJeux}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-[12.5px] font-extrabold text-ink transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1.8" />
            <path d="M16.75 3.5v7.5M13 7.25h7.5M7.25 13v7.5M3.5 16.75H11" />
          </svg>
          Jeux
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? 'Couper les sons' : 'Activer les sons'}
          aria-pressed={soundOn}
          className={`grid place-items-center rounded-xl border border-line px-2.5 transition ${soundOn ? 'bg-cream text-turquoise-deep' : 'bg-sand-2 text-ink-soft'}`}
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

      {/* Les deux façons d'apprendre qui ne se jouent pas seul face à l'écran :
          à deux sur ce téléphone, ou dehors auprès de quelqu'un qui parle. */}
      <div className="flex gap-2 px-3.5 pt-1.5">
        <button
          type="button"
          onClick={onDuo}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-[12px] font-extrabold text-ink transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="8.5" cy="8" r="3.2" />
            <circle cx="16.5" cy="8" r="3.2" />
            <path d="M3 19c0-2.6 2.4-4.5 5.5-4.5S14 16.4 14 19M13.5 19c.3-2.2 2.4-3.7 5-3.7 1.2 0 2.4.3 3.3.9" />
          </svg>
          À deux
        </button>
        <button
          type="button"
          onClick={onMissions}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-[12px] font-extrabold text-ink transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s7-5.4 7-10.5A7 7 0 0 0 5 10.5C5 15.6 12 21 12 21z" />
            <circle cx="12" cy="10.2" r="2.4" />
          </svg>
          Missions
          {lexiqueCount > 0 && (
            <span className="rounded-full bg-turquoise/15 px-1.5 text-[9px] font-extrabold tabular-nums text-turquoise-deep">
              {lexiqueCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onHistoire}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-[12px] font-extrabold text-ink transition"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
            <path d="M9 7.5h6M9 11h4" />
          </svg>
          Histoire
        </button>
        <button
          type="button"
          onClick={onTifinagh}
          aria-label="Écrire le tifinagh"
          className="flex flex-none items-center justify-center rounded-xl border border-line bg-cream px-3 py-2 text-[13px] font-extrabold text-ink tifinagh"
        >
          ⵣ
        </button>
      </div>

      {/* Le cercle : jouer avec sa famille et ses amis, chacun sur SON
          téléphone — défis à distance et voix demandées aux proches. */}
      <div className="px-3.5 pt-1.5">
        <button
          type="button"
          onClick={onCercle}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-turquoise/40 bg-turquoise/5 px-3 py-2 text-[12px] font-extrabold text-turquoise-deep transition-transform active:scale-[0.98]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="9" r="2.6" />
            <path d="M6.8 18.4c.7-2.3 2.8-3.7 5.2-3.7s4.5 1.4 5.2 3.7" />
          </svg>
          Mon cercle — famille & amis à distance
        </button>
      </div>

      <InstallCard />

      <DailyGoal value={xpTodayValue} goal={dailyGoalXp} />

      <div ref={scrollerRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-16">
        <div className="relative">
          <Filigree />
          {units.map((unit, unitIndex) => {
            const land = landOf(unitIndex, course?.land)
            const progress = progressOf(unit)
            const ouverte = uniteOuverte(unitIndex)
            const hasCurrent = ouverte && unit.lessons.some((l) => l.status === 'current' || l.status === 'available')
            return (
              <div key={unit.id} className="relative mb-2">
                <UnitBanner unit={unit} land={land} progress={progress} />
                {hasCurrent && <FamilyCheer cheer={cheer} onOpen={onFamily} />}
                {/* Les nœuds d'une unité verrouillée ne sont pas rendus du
                    tout (plutôt que masqués) : le placement automatique à
                    l'ouverture cherche `data-courant` et se poserait sinon
                    sur une leçon invisible. */}
                {ouverte ? (
                  <div className="flex flex-col items-center py-5">
                    {unit.lessons.map((node, i) => (
                      <div
                        key={node.id}
                        data-courant={node.status === 'current' || node.status === 'available' ? '1' : undefined}
                        className="flex flex-col items-center"
                      >
                        {i > 0 && <Connector from={offsetOf(i - 1)} to={offsetOf(i)} />}
                        <div className="animate-enter" style={{ animationDelay: `${i * 60}ms` }}>
                          <LessonNode node={node} offset={offsetOf(i)} onClick={() => handleNode(node)} unitProgress={progress} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UniteVerrouillee unit={unit} onAbonnement={onAbonnement} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
