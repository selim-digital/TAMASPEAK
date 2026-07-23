import { TopBar } from '../components/TopBar.jsx'
import { LessonNode } from '../components/LessonNode.jsx'

import kmont from '../assets/landscapes/kmont.svg'
import kcote from '../assets/landscapes/kcote.svg'
import rif from '../assets/landscapes/rif.svg'
import atlas from '../assets/landscapes/atlas.svg'
import aures from '../assets/landscapes/aures.svg'
import mzab from '../assets/landscapes/mzab.svg'
import ksar from '../assets/landscapes/ksar.svg'
import oasis from '../assets/landscapes/oasis.svg'
import dunes from '../assets/landscapes/dunes.svg'
import hoggar from '../assets/landscapes/hoggar.svg'
import tassili from '../assets/landscapes/tassili.svg'

/**
 * Le voyage de Tamazgha (validé v3) : chaque unité se joue dans un paysage
 * berbère — du village kabyle jusqu'au désert. Le Tassili (nuit étoilée)
 * attend les unités suivantes.
 */
const JOURNEY = [
  { img: kmont, region: 'Kabylie — Djurdjura' },
  { img: kcote, region: 'Kabylie — la côte' },
  { img: rif, region: 'Le Rif' },
  { img: atlas, region: 'Haut Atlas' },
  { img: aures, region: 'Aurès — Ghoufi' },
  { img: mzab, region: 'Vallée du M’zab' },
  { img: ksar, region: 'Ksar du Sud' },
  { img: oasis, region: 'L’oasis' },
  { img: dunes, region: 'Grand Erg' },
  { img: hoggar, region: 'Hoggar' },
  { img: tassili, region: 'Tassili n’Ajjer' },
]
const landOf = (unitIndex) => JOURNEY[Math.min(unitIndex, JOURNEY.length - 1)]

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

/** Bannière d'unité illustrée par son paysage + voile turquoise lisible. */
function UnitBanner({ unit, land }) {
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
    </div>
  )
}

/** Avancement d'une unité (leçons faites / leçons totales, coffres exclus). */
function progressOf(unit) {
  const lessons = unit.lessons.filter((l) => l.type !== 'chest')
  if (!lessons.length) return 0
  return lessons.filter((l) => l.status === 'done').length / lessons.length
}

export function PathScreen({ units, xp, gems, streak, canChallenge, onSelectLesson, onOpenChest, onChallenge, onTrophies }) {
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
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="relative">
          <Filigree />
          {units.map((unit, unitIndex) => {
            const land = landOf(unitIndex)
            const progress = progressOf(unit)
            return (
              <div key={unit.id} className="relative mb-2">
                <UnitBanner unit={unit} land={land} />
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
