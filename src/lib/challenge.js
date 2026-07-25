/**
 * Défi entre amis — SANS SERVEUR.
 *
 * L'astuce : le défi ne transporte pas les questions, seulement une GRAINE.
 * Les deux joueurs tirent leurs questions du même cours avec la même graine,
 * et obtiennent donc exactement les mêmes exercices dans le même ordre. Le
 * lien reste court et l'app fonctionne hors-ligne.
 *
 * Format du lien :  …/#d=<base64url({l,s,n,c,t,f})>
 *   l = langue · s = graine · n = nombre de questions
 *   c = score de celui qui défie · t = total · f = son pseudo
 */

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hache une graine textuelle en entier 32 bits (FNV-1a). */
function hashSeed(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Nouvelle graine courte et lisible. */
export const makeSeed = () => Math.random().toString(36).slice(2, 8)

/**
 * Tire `n` éléments de `pool` de façon DÉTERMINISTE pour une graine donnée.
 * Mélange de Fisher-Yates piloté par le générateur à graine.
 */
export function seededPick(pool, n, seed) {
  const a = [...pool]
  const rnd = mulberry32(hashSeed(String(seed)))
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, Math.min(n, a.length))
}

/* ---------------- encodage du lien ---------------- */

const toB64Url = (s) =>
  btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const fromB64Url = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(escape(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))))
}

export function encodeDuel({ lang, seed, size, correct, total, from }) {
  return toB64Url(JSON.stringify({ l: lang, s: seed, n: size, c: correct, t: total, f: from || '' }))
}

export function decodeDuel(str) {
  try {
    const d = JSON.parse(fromB64Url(str))
    if (!d?.l || !d?.s) return null
    return { lang: d.l, seed: d.s, size: d.n || 5, correct: d.c ?? null, total: d.t ?? null, from: d.f || '' }
  } catch {
    return null
  }
}

/** Lien complet à envoyer à un ami (le hash survit à l'hébergement statique). */
export function duelUrl(duel) {
  const base = typeof location !== 'undefined' ? location.href.split('#')[0] : ''
  return `${base}#d=${encodeDuel(duel)}`
}

/** Lit un défi présent dans l'URL courante, s'il y en a un. */
export function readDuelFromUrl() {
  if (typeof location === 'undefined') return null
  const m = location.hash.match(/[#&]d=([A-Za-z0-9\-_]+)/)
  return m ? decodeDuel(m[1]) : null
}

/** Efface le défi de l'URL (sans recharger la page). */
export function clearDuelFromUrl() {
  if (typeof history === 'undefined') return
  history.replaceState(null, '', location.href.split('#')[0])
}
