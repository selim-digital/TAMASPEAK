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

/** Transforme « Azul fell-ak » → « azul-fell-ak » (nom de fichier stable). */
export function slug(word) {
  return word
    .toLowerCase()
    // lettres propres au kabyle, translittérées pour les noms de fichiers
    .replace(/ɣ/g, 'gh')
    .replace(/ɛ/g, 'e')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function audioUrl(word) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}audio/${slug(word)}.mp3`
}

export function synthUrl(word) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}audio/synth/${slug(word)}.mp3`
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
 *   1. enregistrement natif   → 'file'  (authentique, pas de badge)
 *   2. mp3 de synthèse espeak → 'synth' (provisoire, badge)
 *   3. voix du navigateur     → 'tts'   (provisoire, badge)
 * @returns {Promise<'file'|'synth'|'tts'|'none'>}
 */
export async function playWord(word) {
  try {
    return await tryFile(audioUrl(word), 'file')
  } catch {
    /* pas d'enregistrement natif */
  }
  try {
    return await tryFile(synthUrl(word), 'synth')
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
