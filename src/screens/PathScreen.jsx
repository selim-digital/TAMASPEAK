import { useState } from 'react'
import { TopBar } from '../components/TopBar.jsx'
import { LessonNode } from '../components/LessonNode.jsx'
import { landOf } from '../data/journey.js'
import { cheerFor } from '../components/mascots/Family.jsx'
import { isSfxOn, setSfxOn, sfx } from '../lib/sfx.js'

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

/** Avancement d'une unité (leçons faites / leçons totales, coffres exclus). */
function progressOf(unit) {
  const lessons = unit.lessons.filter((l) => l.type !== 'chest')
  if (!lessons.length) return 0
  return lessons.filter((l) => l.status === 'done').length / lessons.length
}

/** Anneau d'objectif quotidien (issu de l'onboarding). */
function DailyGoal({ value = 0, goal }) {
  if (!goal) return null
  const p = Math.min(1, value / goal)
  const C = 2 * Math.PI * 14
  const done = p >= 1
  return (
    <div className="mx-3.5 mb-1.5 flex items-center gap-2.5 rounded-xl border border-line bg-cream px-3 py-2">
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

export function PathScreen({
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
}) {
  const cheer = cheerFor(cheerCount)
  const [soundOn, setSoundOn] = useState(isSfxOn)

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
    <div className="animate-enter flex flex-1 flex-col bg-cream">
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

      <DailyGoal value={xpTodayValue} goal={dailyGoalXp} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="relative">
          <Filigree />
          {units.map((unit, unitIndex) => {
            const land = landOf(unitIndex)
            const progress = progressOf(unit)
            const hasCurrent = unit.lessons.some((l) => l.status === 'current' || l.status === 'available')
            return (
              <div key={unit.id} className="relative mb-2">
                <UnitBanner unit={unit} land={land} progress={progress} />
                {hasCurrent && <FamilyCheer cheer={cheer} onOpen={onFamily} />}
                <div className="flex flex-col items-center py-5">
                  {unit.lessons.map((node, i) => (
                    <div key={node.id} className="flex flex-col items-center">
                      {i > 0 && <Connector from={offsetOf(i - 1)} to={offsetOf(i)} />}
                      <div className="animate-enter" style={{ animationDelay: `${i * 60}ms` }}>
                        <LessonNode node={node} offset={offsetOf(i)} onClick={() => handleNode(node)} unitProgress={progress} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
