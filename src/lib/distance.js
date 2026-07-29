/**
 * Client du « jeu à distance » — parle à /api/distance (cercle, demandes
 * d'enregistrement, défis distants, notifications serveur).
 *
 * Mêmes conventions que lib/api.js : jamais d'exception qui remonte à
 * l'interface. Un serveur muet, non configuré ou une session absente
 * rendent `null` (ou `false`) — l'écran affiche alors son état vide, il
 * ne plante pas. La distance est un BONUS par-dessus l'app locale.
 */
import { isApi } from './api.js'

async function get(params) {
  try {
    const r = await fetch(`/api/distance?${new URLSearchParams(params)}`, { credentials: 'include' })
    if (!r.ok || !isApi(r)) return null
    return await r.json()
  } catch {
    return null
  }
}

async function post(r, body) {
  try {
    const rep = await fetch(`/api/distance?r=${r}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!isApi(rep)) return null
    const json = await rep.json()
    return rep.ok ? json : { erreur: json?.error || 'refus' }
  } catch {
    return null
  }
}

/* ---------------- cercle ---------------- */

/** @returns {{membres:[{lienId,userId,name}], invitations:[{code}]} | null} */
export const monCercle = () => get({ r: 'cercle' })

/** Crée (ou réutilise) un code d'invitation. @returns {string|null} */
export const creerInvitation = () => post('cercle', { action: 'inviter' }).then((r) => r?.code || null)

/** Lien complet à partager par WhatsApp. */
export const invitationUrl = (code) => `https://tamaspeak.com/?cercle=${code}`

/**
 * Rejoint le cercle de qui a envoyé ce code.
 * @returns {'ok'|'deja'|'introuvable'|'erreur'} + le prénom dans `avec`
 */
export async function rejoindreCercle(code) {
  const r = await post('cercle', { action: 'rejoindre', code })
  if (!r) return { statut: 'erreur' }
  if (r.ok) return { statut: 'ok', avec: r.avec?.name || '' }
  if (r.erreur === 'deja relies' || r.erreur === 'code deja utilise') return { statut: 'deja' }
  if (r.erreur === 'code inconnu') return { statut: 'introuvable' }
  return { statut: 'erreur' }
}

export const retirerDuCercle = (lienId) => post('cercle', { action: 'retirer', lienId })

/* ---------------- demandes d'enregistrement ---------------- */

/** @returns {{recues:[...], envoyees:[...]} | null} */
export const mesDemandes = () => get({ r: 'demandes' })

export async function demanderMot({ pour, texte, sens, lang }) {
  const r = await post('demandes', { action: 'creer', pour, texte, sens, lang })
  return !!r?.ok
}

/** Envoie l'enregistrement d'une demande reçue (blob → base64). */
export async function repondreDemande(id, blob) {
  const b64 = await new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result).split(',')[1] || '')
    fr.onerror = () => reject(fr.error)
    fr.readAsDataURL(blob)
  })
  if (b64.length > 800000) return 'trop-long'
  const r = await post('demandes', { action: 'repondre', id, audio: b64, type: blob.type || 'audio/webm' })
  return r?.ok ? 'ok' : 'erreur'
}

export const declinerDemande = (id) => post('demandes', { action: 'decliner', id })

/**
 * Récupère l'audio d'une demande « faite » en Blob (pour l'écouter, ou
 * l'installer dans les voix locales via saveVoice).
 */
export async function audioDemande(id) {
  try {
    const r = await fetch(`/api/distance?r=audio&id=${id}`, { credentials: 'include' })
    if (!r.ok) return null
    return await r.blob()
  } catch {
    return null
  }
}

/* ---------------- défis à distance ---------------- */

/** @returns {{defis:[...]} | null} */
export const mesDefis = () => get({ r: 'defis' })

/** Le défi `code`, pour le jouer. */
export const lireDefi = (code) => get({ r: 'defis', code })

/** Crée un défi vers un membre du cercle — le créateur a déjà joué. */
export async function creerDefi({ pour, lang, seed, size, version, correct, total }) {
  const r = await post('defis', { action: 'creer', pour, lang, seed, size, version, correct, total })
  return r?.ok ? r.code : null
}

/** Le score de l'adversaire clôt le défi. @returns le score du créateur, ou null */
export async function scorerDefi({ code, correct, total }) {
  const r = await post('defis', { action: 'score', code, correct, total })
  return r?.ok ? { correct: r.scoreCreateur, total: r.totalCreateur } : null
}

/* ---------------- notifications serveur ---------------- */

/** @returns {Array<{id,srvId,kind,title,body,data,lue}>} jamais null : [] si muet */
export const notifsServeur = () => get({ r: 'notifs' }).then((r) => r?.notifs || [])

export const marquerNotifsServeurLues = () => post('notifs', { action: 'lues' })
