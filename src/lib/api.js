/**
 * Client API — la SEULE porte de l'app vers le serveur.
 *
 * Philosophie, non négociable : LE LOCAL EST LA SOURCE DE VÉRITÉ. Tout ce
 * que fait ce module est optionnel ; chaque fonction échoue en silence et
 * l'app continue comme si le serveur n'existait pas — parce que pour la
 * plupart des utilisateurs, il n'existera effectivement pas (pas de compte),
 * et parce qu'un métro sans réseau ne doit rien casser.
 *
 * File hors-ligne : les événements s'empilent dans localStorage et partent
 * quand le réseau revient. Un 503 (serveur non configuré) vide la file sans
 * réessayer — inutile d'accumuler ce qui ne partira jamais.
 */
import { mergeStores } from './progress.js'

const QUEUE_KEY = 'tama-speak:events-queue'
const QUEUE_MAX = 500

let _configured = null // null = on ne sait pas encore

/**
 * Une réponse n'est un « vrai » succès API que si elle est en JSON : en dev
 * (et sur tout hébergeur de SPA avec réécriture vers index.html), un chemin
 * /api inexistant renvoie la PAGE HTML avec un statut 200. S'y fier ferait
 * vider la file d'événements dans le vide.
 */
const isApi = (r) => (r.headers.get('content-type') || '').includes('application/json')

export const isLoggedIn = async () => !!(await me())

/**
 * Le serveur existe-t-il ? Fiable seulement APRÈS un premier appel (me(),
 * flushEvents…) ; null tant qu'on ne sait pas. L'écran compte s'en sert pour
 * distinguer « déconnecté » de « les comptes ne sont pas encore ouverts ».
 */
export const serverKnown = () => _configured

/** L'utilisateur connecté, ou null (pas de compte, pas de réseau, pas de serveur). */
export async function me() {
  try {
    const r = await fetch('/api/auth/get-session', { credentials: 'include' })
    if (r.status === 503 || !isApi(r)) {
      _configured = false
      return null
    }
    if (!r.ok) return null
    _configured = true
    const s = await r.json()
    return s?.user || null
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/* Connexion                                                            */
/* ------------------------------------------------------------------ */

/** Envoie le lien magique. Renvoie 'sent' | 'unavailable' | 'error'. */
export async function requestMagicLink(email) {
  try {
    const r = await fetch('/api/auth/sign-in/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, callbackURL: '/' }),
    })
    if (r.status === 503 || !isApi(r)) return 'unavailable'
    return r.ok ? 'sent' : 'error'
  } catch {
    return 'error'
  }
}

/** Départ vers Google (redirection pleine page). */
export async function signInWithGoogle() {
  try {
    const r = await fetch('/api/auth/sign-in/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider: 'google', callbackURL: '/' }),
    })
    if (!r.ok) return false
    const { url } = await r.json()
    if (url) window.location.href = url
    return true
  } catch {
    return false
  }
}

export async function signOut() {
  try {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' })
  } catch {
    /* déjà déconnecté de fait */
  }
}

/** Suppression du compte : purge serveur (cascade SQL), le local reste. */
export async function deleteAccount() {
  try {
    const r = await fetch('/api/auth/delete-user', { method: 'POST', credentials: 'include' })
    return r.ok
  } catch {
    return false
  }
}

/* ------------------------------------------------------------------ */
/* Synchronisation de la progression                                    */
/* ------------------------------------------------------------------ */

/**
 * Cycle complet : lire l'instantané serveur, fusionner (max/union — voir
 * mergeStores), réécrire la fusion. Renvoie le store fusionné, ou le store
 * local inchangé si le serveur est injoignable.
 */
export async function syncStore(localStore) {
  try {
    const r = await fetch('/api/sync', { credentials: 'include' })
    if (!r.ok) return { store: localStore, synced: false }
    const { store: remote } = await r.json()
    const merged = mergeStores(localStore, remote)
    const w = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ store: merged }),
    })
    return { store: merged, synced: w.ok }
  } catch {
    return { store: localStore, synced: false }
  }
}

/* ------------------------------------------------------------------ */
/* Événements — file d'attente hors-ligne                               */
/* ------------------------------------------------------------------ */

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []
  } catch {
    return []
  }
}

function writeQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-QUEUE_MAX)))
  } catch {
    /* stockage plein : les événements d'usage sont sacrifiables */
  }
}

/** Horodate et met en file. Toujours instantané, jamais d'attente réseau. */
export function track(type, { lang, xp } = {}) {
  const q = readQueue()
  q.push({ type, lang, xp, at: new Date().toISOString() })
  writeQueue(q)
  scheduleFlush()
}

let flushTimer = null
function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flushEvents()
  }, 4000) // on groupe : une leçon finie = plusieurs événements d'un coup
}

/** Envoie la file si possible ; la conserve telle quelle sinon. */
export async function flushEvents() {
  if (_configured === false) {
    writeQueue([]) // serveur explicitement absent : rien ne partira jamais
    return
  }
  const q = readQueue()
  if (!q.length) return
  try {
    const r = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ events: q.slice(0, 100) }),
    })
    if (r.status === 503 || !isApi(r)) {
      _configured = false
      writeQueue([])
      return
    }
    // 401 : pas de compte — on garde la file, elle partira à la connexion.
    if (r.ok) writeQueue(q.slice(100))
  } catch {
    /* hors-ligne : la file attend le retour du réseau */
  }
}

/* ------------------------------------------------------------------ */
/* Feedback                                                             */
/* ------------------------------------------------------------------ */

const FEEDBACK_QUEUE = 'tama-speak:feedback-queue'

/** Envoie un retour ; le met en file si hors-ligne. 'sent' | 'queued' | 'unavailable'. */
export async function sendFeedback({ mood, category, message, lang }) {
  const payload = { mood, category, message, lang }
  try {
    const r = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (r.status === 503 || !isApi(r)) return 'unavailable'
    if (r.ok) return 'sent'
  } catch {
    /* hors-ligne */
  }
  try {
    const q = JSON.parse(localStorage.getItem(FEEDBACK_QUEUE)) || []
    q.push(payload)
    localStorage.setItem(FEEDBACK_QUEUE, JSON.stringify(q.slice(-20)))
  } catch {
    /* tant pis */
  }
  return 'queued'
}

/** Rejoue les feedbacks en attente (appelé au retour du réseau). */
export async function flushFeedbacks() {
  let q
  try {
    q = JSON.parse(localStorage.getItem(FEEDBACK_QUEUE)) || []
  } catch {
    return
  }
  if (!q.length) return
  const restants = []
  for (const f of q) {
    // séquentiel volontairement : 3 feedbacks en attente ne justifient pas
    // de paralléliser, et l'ordre d'envoi préserve l'ordre d'écriture
    // eslint-disable-next-line no-await-in-loop
    const res = await sendFeedback(f)
    if (res === 'queued') restants.push(f)
  }
  try {
    localStorage.setItem(FEEDBACK_QUEUE, JSON.stringify(restants))
  } catch {
    /* ignore */
  }
}

/* Au retour du réseau, tout ce qui attendait part. */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushEvents()
    flushFeedbacks()
  })
}
