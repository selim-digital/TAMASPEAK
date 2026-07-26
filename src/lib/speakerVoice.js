/**
 * Contributions audio d'un locuteur.
 *
 * Quatre des cinq cours n'ont AUCUN enregistrement natif : ils sont muets, et
 * la synthèse vocale amazighe disponible est sous licence non commerciale.
 * Un locuteur — quelqu'un que l'apprenant connaît, ou l'apprenant lui-même
 * s'il parle la langue — enregistre la liste des mots, et le cours devient
 * sonore. C'est exactement le procédé dont viennent les 24 mp3 kabyles déjà
 * dans l'app : une note vocale, découpée mot par mot.
 *
 * CE QUE CE MODULE NE FAIT PAS, et ne doit jamais faire :
 *  • aucune IA, aucune synthèse, aucune reconstitution de voix. On enregistre
 *    puis on rejoue le fichier tel quel, attribué à son auteur et effaçable.
 *  • aucune notation de prononciation. Le taux d'erreur sur parole
 *    d'apprenant est de 40 à 70 % : un « faux » injustifié rendrait muet
 *    exactement le public qu'on cherche à faire parler.
 *
 * Tout reste sur l'appareil (IndexedDB). Rien n'est envoyé nulle part.
 *
 * Note iOS : Safari n'accepte pas `audio/webm` — on négocie le format au
 * moment de l'enregistrement, et l'enregistrement s'interrompt si l'app passe
 * en arrière-plan, d'où la sauvegarde du tampon partiel.
 */
import { slug } from './slug.js'

const DB = 'tama-speak-voix'
const STORE = 'enregistrements'
const VERSION = 1

/* ------------------------------------------------------------------ */
/* IndexedDB — accès minimal, sans dépendance                          */
/* ------------------------------------------------------------------ */

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('indexedDB indisponible'))
    const req = indexedDB.open(DB, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const store = t.objectStore(STORE)
        const out = fn(store)
        t.oncomplete = () => resolve(out?.result ?? out)
        t.onerror = () => reject(t.error)
      }),
  )
}

/** Clé d'un enregistrement : une contribution par mot et par langue. */
export const voiceKey = (lang, word) => `${lang || 'kab'}:${slug(word)}`

/* ------------------------------------------------------------------ */
/* Lecture / écriture                                                   */
/* ------------------------------------------------------------------ */

/** Enregistre (ou remplace) la contribution d'un locuteur pour un mot. */
export async function saveVoice({ lang, word, blob, speaker }) {
  const id = voiceKey(lang, word)
  await tx('readwrite', (s) =>
    s.put({ id, lang, word, speaker: speaker || '', blob, type: blob.type, at: new Date().toISOString() }),
  )
  index?.add(id)
  bust(id)
  return id
}

export function getVoice(lang, word) {
  return tx('readonly', (s) => s.get(voiceKey(lang, word))).then((r) => r || null)
}

export async function deleteVoice(lang, word) {
  const id = voiceKey(lang, word)
  await tx('readwrite', (s) => s.delete(id))
  index?.delete(id)
  bust(id)
}

/** Tous les enregistrements, pour l'écran de gestion. */
export function listVoices() {
  return tx('readonly', (s) => s.getAll()).then((r) => r || [])
}

/* ------------------------------------------------------------------ */
/* Index en mémoire — pour savoir SANS attendre si une voix existe      */
/* ------------------------------------------------------------------ */

let index = null
const urls = new Map()

/** Charge l'index des clés disponibles (appelé une fois au démarrage). */
export async function loadVoiceIndex() {
  try {
    const all = await listVoices()
    index = new Set(all.map((v) => v.id))
  } catch {
    index = new Set()
  }
  return index
}

export const hasVoice = (lang, word) => !!index?.has(voiceKey(lang, word))

export const voiceCount = () => index?.size ?? 0

/** Invalide l'URL objet mise en cache : le prochain accès relira le blob. */
function bust(id) {
  const u = urls.get(id)
  if (u) {
    URL.revokeObjectURL(u)
    urls.delete(id)
  }
}

/** URL jouable d'un enregistrement (mise en cache le temps de la session). */
export async function voiceUrl(lang, word) {
  const id = voiceKey(lang, word)
  if (urls.has(id)) return urls.get(id)
  const rec = await getVoice(lang, word)
  if (!rec?.blob) return null
  const url = URL.createObjectURL(rec.blob)
  urls.set(id, url)
  return url
}

/* ------------------------------------------------------------------ */
/* Échange sans serveur — le locuteur envoie, l'apprenant importe       */
/* ------------------------------------------------------------------ */

/**
 * Le locuteur n'est pas forcément l'apprenant : c'est souvent un oncle à qui
 * on a envoyé un lien. Tant qu'il n'y a pas de serveur, l'audio revient par
 * le même canal que les 24 mp3 kabyles actuels — un fichier envoyé par
 * WhatsApp. On l'emballe en JSON (audio en base64) : un seul fichier à
 * transmettre, lisible par n'importe quel appareil.
 */
const EXT = 'tamavoix'

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] || '')
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })

const base64ToBlob = (b64, type) => {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return new Blob([buf], { type })
}

/** Emballe les contributions d'une langue en un fichier téléchargeable. */
export async function exportVoices(lang) {
  const all = (await listVoices()).filter((v) => !lang || v.lang === lang)
  if (!all.length) return null
  const items = await Promise.all(
    all.map(async (v) => ({
      lang: v.lang,
      word: v.word,
      speaker: v.speaker,
      type: v.type,
      at: v.at,
      data: await blobToBase64(v.blob),
    })),
  )
  const json = JSON.stringify({ format: EXT, version: 1, items })
  return {
    blob: new Blob([json], { type: 'application/json' }),
    name: `tama-speak-${lang || 'tout'}-${all.length}-mots.${EXT}.json`,
    count: all.length,
  }
}

/**
 * Lit un fichier reçu et range les enregistrements.
 * @returns {Promise<{ajoutes:number, ignores:number}>}
 */
export async function importVoices(file, { overwrite = true } = {}) {
  const parsed = JSON.parse(await file.text())
  if (parsed?.format !== EXT || !Array.isArray(parsed.items)) {
    throw new Error('Ce fichier ne vient pas de Tama Speak.')
  }
  let ajoutes = 0
  let ignores = 0
  for (const it of parsed.items) {
    if (!it?.word || !it?.data) continue
    if (!overwrite && hasVoice(it.lang, it.word)) {
      ignores++
      continue
    }
    await saveVoice({
      lang: it.lang,
      word: it.word,
      speaker: it.speaker,
      blob: base64ToBlob(it.data, it.type || 'audio/webm'),
    })
    ajoutes++
  }
  return { ajoutes, ignores }
}

/* ------------------------------------------------------------------ */
/* Enregistrement micro                                                 */
/* ------------------------------------------------------------------ */

/** Formats à essayer dans l'ordre : Safari ne connaît que mp4. */
const FORMATS = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac']

export function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null
  return FORMATS.find((t) => {
    try {
      return MediaRecorder.isTypeSupported(t)
    } catch {
      return false
    }
  })
}

export const canRecord = () =>
  typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

/**
 * Démarre un enregistrement. Renvoie un objet de contrôle :
 *   stop()   → Promise<Blob>   (aussi déclenché si l'app passe en arrière-plan)
 *   cancel() → abandonne
 */
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
  })
  const mimeType = pickMimeType()
  const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  const chunks = []
  rec.ondataavailable = (e) => {
    if (e.data?.size) chunks.push(e.data)
  }
  rec.start(200) // tampon régulier : iOS peut couper sans prévenir

  const fermer = () => stream.getTracks().forEach((t) => t.stop())

  const done = new Promise((resolve) => {
    rec.onstop = () => {
      fermer()
      resolve(new Blob(chunks, { type: mimeType || 'audio/webm' }))
    }
  })

  // iOS interrompt la capture quand l'app passe en arrière-plan : on clôt
  // proprement pour ne pas perdre ce qui a déjà été dit.
  const surMasquage = () => {
    if (document.visibilityState === 'hidden' && rec.state === 'recording') rec.stop()
  }
  document.addEventListener('visibilitychange', surMasquage)
  done.finally(() => document.removeEventListener('visibilitychange', surMasquage))

  return {
    stop: () => {
      if (rec.state === 'recording') rec.stop()
      return done
    },
    cancel: () => {
      chunks.length = 0
      if (rec.state === 'recording') rec.stop()
      else fermer()
    },
    get state() {
      return rec.state
    },
  }
}
