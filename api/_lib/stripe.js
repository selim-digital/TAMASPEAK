/**
 * Stripe, en direct sur son API REST — sans le paquet `stripe`.
 *
 * Pourquoi sans dépendance : le SDK officiel pèse plusieurs mégaoctets pour
 * ce dont on a besoin ici (trois appels et une vérification de signature),
 * et une fonction serverless paie ce poids à CHAQUE démarrage à froid. Le
 * projet a déjà fait ce choix ailleurs (générateur d'icônes maison, sons
 * synthétisés) ; l'API REST de Stripe est stable, versionnée et documentée —
 * c'est un contrat public, pas un détail d'implémentation.
 *
 * Ce que ce module garantit :
 *   • encodage `application/x-www-form-urlencoded` avec la notation à
 *     crochets de Stripe (a[b][0][c]=…) ;
 *   • clé d'idempotence sur toute écriture — un double clic ou un réessai
 *     réseau ne crée pas deux abonnements ;
 *   • vérification de signature des webhooks en temps constant (HMAC-SHA256,
 *     schéma v1), avec fenêtre de tolérance contre le rejeu.
 *
 * SANS `STRIPE_SECRET_KEY`, RIEN N'EXISTE — et ce n'est pas une erreur : la
 * même règle que le reste du dossier api/. L'app reste entièrement utilisable,
 * simplement sans abonnement (donc sans verrou : voir api/billing.js).
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

const API = 'https://api.stripe.com/v1'

/** Version d'API épinglée : une évolution chez Stripe ne doit pas nous surprendre. */
const VERSION = '2024-06-20'

export const stripeReady = () => !!process.env.STRIPE_SECRET_KEY

/**
 * Encodage « à la Stripe » : les objets et tableaux imbriqués deviennent des
 * clés à crochets. `{ a: { b: 1 }, c: [ 'x' ] }` → `a[b]=1&c[0]=x`.
 * Les `undefined` et `null` sont OMIS (envoyer une chaîne vide efface un
 * champ chez Stripe — ce n'est pas la même chose que ne pas y toucher).
 */
function encoder(valeur, prefixe = '', sortie = []) {
  if (valeur === undefined || valeur === null) return sortie
  if (Array.isArray(valeur)) {
    valeur.forEach((v, i) => encoder(v, `${prefixe}[${i}]`, sortie))
  } else if (typeof valeur === 'object') {
    for (const [k, v] of Object.entries(valeur)) {
      encoder(v, prefixe ? `${prefixe}[${k}]` : k, sortie)
    }
  } else {
    sortie.push(`${encodeURIComponent(prefixe)}=${encodeURIComponent(String(valeur))}`)
  }
  return sortie
}

/**
 * Un appel à l'API Stripe.
 *
 * @param {string} chemin       ex. 'checkout/sessions'
 * @param {object} [options]
 * @param {'GET'|'POST'|'DELETE'} [options.method]  DELETE = résilier (sans corps)
 * @param {object} [options.data]         corps (POST) ou requête (GET)
 * @param {string} [options.idempotency]  clé d'idempotence (écritures)
 * @returns {Promise<object>} la ressource Stripe
 * @throws {Error} avec `.stripe` (le détail renvoyé) si Stripe refuse
 */
export async function stripe(chemin, { method = 'POST', data, idempotency } = {}) {
  if (!stripeReady()) throw new Error('stripe non configuré')

  const corps = method === 'POST' ? encoder(data || {}).join('&') : null
  const requete = method === 'GET' && data ? `?${encoder(data).join('&')}` : ''

  const r = await fetch(`${API}/${chemin}${requete}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Stripe-Version': VERSION,
      ...(corps !== null ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      ...(idempotency ? { 'Idempotency-Key': idempotency } : {}),
    },
    ...(corps !== null ? { body: corps } : {}),
  })

  const json = await r.json().catch(() => ({}))
  if (!r.ok) {
    // Le message de Stripe est précis (« No such price: … ») : le taire
    // rendrait toute erreur de configuration indéchiffrable en production.
    const e = new Error(json?.error?.message || `stripe ${r.status}`)
    e.stripe = json?.error || null
    e.status = r.status
    throw e
  }
  return json
}

/**
 * Vérifie la signature d'un webhook Stripe.
 *
 * L'en-tête `Stripe-Signature` a la forme `t=1699…,v1=abc…,v1=def…` : on
 * recalcule HMAC-SHA256(`${t}.${corps}`) avec le secret du endpoint et on
 * compare EN TEMPS CONSTANT à chaque `v1` (Stripe en envoie plusieurs pendant
 * une rotation de secret).
 *
 * Sans cette vérification, n'importe qui connaissant l'URL pourrait s'offrir
 * un abonnement en postant un faux événement : c'est LE contrôle de sécurité
 * de tout le circuit de paiement, il n'a pas de solution de repli.
 *
 * @param {Buffer|string} corps  le corps BRUT, non reparsé (voir api/billing.js)
 * @param {string} entete       en-tête Stripe-Signature
 * @param {string} secret       STRIPE_WEBHOOK_SECRET (whsec_…)
 * @param {number} [tolerance]  fenêtre d'acceptation en secondes (anti-rejeu)
 * @returns {object|null} l'événement analysé, ou null si la signature ne vaut rien
 */
export function evenementVerifie(corps, entete, secret, tolerance = 300) {
  if (!corps || !entete || !secret) return null

  const parts = Object.create(null)
  for (const morceau of String(entete).split(',')) {
    const i = morceau.indexOf('=')
    if (i < 0) continue
    const cle = morceau.slice(0, i).trim()
    const val = morceau.slice(i + 1).trim()
    if (cle === 'v1') (parts.v1 ||= []).push(val)
    else parts[cle] = val
  }

  const t = Number(parts.t)
  if (!Number.isFinite(t) || !parts.v1?.length) return null
  // Anti-rejeu : un événement capté hier ne doit pas pouvoir être renvoyé.
  if (Math.abs(Math.floor(Date.now() / 1000) - t) > tolerance) return null

  const texte = Buffer.isBuffer(corps) ? corps.toString('utf8') : String(corps)
  const attendu = createHmac('sha256', secret).update(`${t}.${texte}`, 'utf8').digest()

  const valide = parts.v1.some((v) => {
    let recu
    try {
      recu = Buffer.from(v, 'hex')
    } catch {
      return false
    }
    // timingSafeEqual exige des longueurs égales — la vérifier d'abord ne
    // fuite rien (la longueur d'un HMAC est publique).
    return recu.length === attendu.length && timingSafeEqual(recu, attendu)
  })
  if (!valide) return null

  try {
    return JSON.parse(texte)
  } catch {
    return null
  }
}
