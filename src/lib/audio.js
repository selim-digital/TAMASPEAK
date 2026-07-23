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
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function audioUrl(word) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}audio/${slug(word)}.mp3`
}

function tryFile(word) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.addEventListener('playing', () => resolve('file'), { once: true })
    audio.addEventListener('error', () => reject(new Error('missing')), { once: true })
    audio.src = audioUrl(word)
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
 * Joue la prononciation d'un mot.
 * @returns {Promise<'file'|'tts'|'none'>} la source réellement utilisée.
 */
export async function playWord(word) {
  try {
    return await tryFile(word)
  } catch {
    return trySynth(word)
  }
}
