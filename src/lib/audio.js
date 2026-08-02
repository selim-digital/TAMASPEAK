/**
 * Couche audio de prononciation.
 *
 * Stratégie :
 *  1. On tente de lire l'enregistrement natif `/audio/<slug>.mp3`.
 *  2. S'il n'existe pas encore, on retombe sur une voix de synthèse
 *     (SpeechSynthesis) — clairement signalée comme PROVISOIRE dans l'UI,
 *     car elle ne rend PAS la vraie prononciation kabyle.
 *
 * Dès qu'un locuteur natif dépose les fichiers dans `public/audio/`,
 * l'app joue automatiquement les vrais sons, sans changement de code.
 */

import { slug } from './slug.js'
import { voiceUrl } from './speakerVoice.js'
import { langueDeBase } from '../data/languages.js'

export { slug }

/**
 * Chemin d'un enregistrement natif.
 * Les langues ajoutées après le kabyle rangent leurs mp3 dans un
 * sous-dossier `audio/<lang>/` ; le kabyle garde `audio/` (historique).
 *
 * On passe par `langueDeBase` : un parcours d'essai n'est pas une langue.
 * « kab-beta » enseigne du kabyle et doit lire les mp3 du kabyle — sinon il
 * chercherait un dossier qui n'existe pas et serait muet.
 */
export function audioUrl(word, lang) {
  const base = import.meta.env.BASE_URL || '/'
  const l = langueDeBase(lang)
  const dir = !l || l === 'kab' ? 'audio' : `audio/${l}`
  return `${base}${dir}/${slug(word)}.mp3`
}

export function synthUrl(word, lang) {
  const base = import.meta.env.BASE_URL || '/'
  const l = langueDeBase(lang)
  const dir = !l || l === 'kab' ? 'audio/synth' : `audio/${l}/synth`
  return `${base}${dir}/${slug(word)}.mp3`
}

function tryFile(url, mode) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.addEventListener('playing', () => resolve(mode), { once: true })
    audio.addEventListener('error', () => reject(new Error('missing')), { once: true })
    audio.src = url
    const p = audio.play()
    if (p && typeof p.catch === 'function') p.catch(reject)
  })
}

function trySynth(word) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return 'none'
  try {
    const u = new SpeechSynthesisUtterance(word)
    u.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    return 'tts'
  } catch {
    return 'none'
  }
}

/**
 * Joue la prononciation d'un mot, par ordre de préférence :
 *   1. contribution d'un locuteur → 'contrib' (enregistrée sur cet appareil)
 *   2. enregistrement natif       → 'file'    (authentique, pas de badge)
 *   3. mp3 de synthèse espeak     → 'synth'   (provisoire, badge)
 *   4. voix du navigateur         → 'tts'     (provisoire, badge)
 *
 * La contribution passe AVANT le natif : quand un locuteur a pris la peine
 * d'enregistrer un mot pour ce cours, c'est lui qui fait référence — et pour
 * quatre des cinq langues, c'est le seul son qui existe.
 *
 * @returns {Promise<'contrib'|'file'|'synth'|'tts'|'none'>}
 */
export async function playWord(word, lang) {
  try {
    const url = await voiceUrl(lang, word)
    if (url) return await tryFile(url, 'contrib')
  } catch {
    /* aucune contribution pour ce mot */
  }
  try {
    return await tryFile(audioUrl(word, lang), 'file')
  } catch {
    /* pas d'enregistrement natif */
  }
  try {
    return await tryFile(synthUrl(word, lang), 'synth')
  } catch {
    /* pas de mp3 de synthèse */
  }
  return trySynth(word)
}

/** Vrai si la source jouée est provisoire (à remplacer par du natif). */
export const isProvisional = (mode) => mode === 'synth' || mode === 'tts'

/**
 * Réchauffe le cache audio de la PWA (route runtime CacheFirst du service
 * worker) : au premier chargement en ligne, chaque mp3 listé dans le
 * manifest est demandé une fois — le SW le met en cache, et les leçons
 * fonctionnent ensuite hors-ligne. Sans SW (dev, singlefile), no-op.
 */
export async function warmAudioCache() {
  try {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    await navigator.serviceWorker.ready
    const base = import.meta.env.BASE_URL || '/'
    const res = await fetch(`${base}audio/manifest.json`)
    if (!res.ok) return
    const entries = await res.json()
    for (const e of entries) {
      if (!e?.file) continue
      // natif puis synthèse : les 404 ne sont pas mis en cache, sans gravité.
      fetch(`${base}audio/${e.file}`).catch(() => {})
      fetch(`${base}audio/synth/${e.file}`).catch(() => {})
    }
  } catch {
    /* le réchauffage est un bonus — jamais bloquant */
  }
}
