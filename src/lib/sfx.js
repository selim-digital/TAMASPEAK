/**
 * Petits sons de jeu — synthétisés en WebAudio (aucun fichier, fonctionne
 * hors-ligne, léger). Toujours déclenchés par un geste utilisateur (clics),
 * donc l'AudioContext démarre sans blocage. Volume doux, coupable via le
 * bouton son (persisté en localStorage).
 */
const KEY = 'tama-speak:sfx'

let ctx = null
const ac = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function isSfxOn() {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSfxOn(on) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
}

/** Une note : oscillateur + enveloppe douce. */
function tone(freq, { at = 0, dur = 0.14, type = 'sine', vol = 0.11, to } = {}) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + at
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

const guard = (fn) => (...args) => {
  if (!isSfxOn()) return
  try {
    fn(...args)
  } catch {
    /* le son est un bonus, jamais bloquant */
  }
}

export const sfx = {
  /** Bonne réponse : deux notes claires ascendantes. */
  correct: guard(() => {
    tone(659, { dur: 0.1, vol: 0.1 })
    tone(988, { at: 0.09, dur: 0.16, vol: 0.11 })
  }),
  /** Combo : la deuxième note grimpe avec la série. */
  combo: guard((n = 2) => {
    tone(659, { dur: 0.09, vol: 0.1 })
    tone(Math.min(988 + (n - 2) * 120, 1600), { at: 0.08, dur: 0.14, vol: 0.11 })
    tone(1319, { at: 0.17, dur: 0.16, vol: 0.09 })
  }),
  /** Mauvaise réponse : descente feutrée, jamais punitive. */
  wrong: guard(() => {
    tone(220, { dur: 0.16, type: 'triangle', vol: 0.09, to: 165 })
  }),
  /** Fin de leçon : petit arpège de fête. */
  complete: guard(() => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.09, dur: 0.18, vol: 0.1 }))
  }),
  /** Coffre / médaillon : scintillement. */
  chest: guard(() => {
    ;[1319, 1568, 2093].forEach((f, i) => tone(f, { at: i * 0.06, dur: 0.12, vol: 0.07 }))
    tone(784, { at: 0.2, dur: 0.22, vol: 0.09 })
  }),
  /** Petit clic d'interface. */
  click: guard(() => {
    tone(880, { dur: 0.05, type: 'triangle', vol: 0.05 })
  }),
  /** « Boing » d'un saut / d'un éloge qui s'envole (glissando montant). */
  pop: guard((at = 0) => {
    tone(300, { at, dur: 0.14, vol: 0.09, to: 560 })
  }),
  /** Glissement du carrousel (swipe / flèches). */
  swish: guard(() => {
    tone(500, { dur: 0.09, type: 'triangle', vol: 0.05, to: 950 })
  }),
  /** Petit salut d'un personnage qui entre en scène. */
  hello: guard(() => {
    tone(660, { dur: 0.09, vol: 0.07 })
    tone(880, { at: 0.1, dur: 0.13, vol: 0.07 })
  }),
}
