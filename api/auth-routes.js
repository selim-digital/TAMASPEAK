/**
 * Toutes les routes d'authentification (/api/auth/*) — Better Auth les gère :
 * lien magique, Google OAuth, session, déconnexion, suppression de compte.
 *
 * POURQUOI UNE FONCTION PLATE ET PAS `api/auth/[...all].js` : vérifié en
 * production, Vercel (projet Vite, hors Next) traite `[...all].js` comme un
 * segment UNIQUE — /api/auth/get-session atteignait la fonction, mais
 * /api/auth/sign-in/magic-link (deux segments) mourait en NOT_FOUND avant
 * elle. La réécriture de vercel.json envoie tout /api/auth/* ici, et Better
 * Auth route lui-même d'après req.url, que la réécriture préserve.
 */
import { serverReady, notConfigured } from './_lib/db.js'
import { auth, sessionOf, consommerCodeSuppression } from './_lib/auth.js'
import { toNodeHandler } from 'better-auth/node'

/* ------------------------------------------------------------------ */
/* POST /api/auth/suppression — confirmer la suppression PAR UN CODE.  */
/*                                                                      */
/* Le lien de Better Auth exige une session dans le navigateur qui      */
/* l'ouvre, et un lien reçu par email n'y atterrit presque jamais : les  */
/* messageries ouvrent les liens dans leur navigateur intégré, et sur    */
/* iOS une PWA installée a un stockage séparé de Safari. D'où           */
/* « Failed to get user info » — pile pour les gens qui utilisent l'app  */
/* comme elle est faite pour l'être.                                    */
/*                                                                      */
/* Ici, c'est l'APP qui appelle, avec SA session : le contexte est le    */
/* bon par construction. L'email ne transporte plus qu'un code à six     */
/* chiffres, le jeton reste au serveur. Ensuite on passe la main à       */
/* Better Auth (`POST /delete-user` accepte le jeton) — ses garde-fous,  */
/* ses crochets Stripe et RGPD, sa purge de cookie jouent tels quels.    */
/* ------------------------------------------------------------------ */
/**
 * Le corps JSON. Vercel le décode d'ordinaire lui-même — mais c'est aussi
 * cette fonction qui sert Better Auth, à qui il faut le FLUX intact : on ne
 * suppose donc rien, et on lit le flux si le corps n'est pas déjà là.
 */
async function corpsJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  try {
    const morceaux = []
    for await (const c of req) morceaux.push(c)
    return JSON.parse(Buffer.concat(morceaux).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

async function confirmerSuppression(req, res) {
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })

  const code = String((await corpsJson(req))?.code || '').trim()
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'code invalide' })

  const token = await consommerCodeSuppression(session.user.id, code)
  // Un code faux et un code expiré se ressemblent volontairement : distinguer
  // les deux renseignerait qui essaie au hasard.
  if (!token) return res.status(400).json({ error: 'code faux ou expiré' })

  const entetes = new Headers()
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') entetes.set(k, v)
  const reponse = await auth().api.deleteUser({
    body: { token },
    headers: entetes,
    asResponse: true,
  })

  // Relais tel quel — surtout le Set-Cookie, qui EFFACE le cookie de session.
  // `getSetCookie()` et pas `forEach` : ce dernier réunit plusieurs cookies en
  // une seule chaîne séparée par des virgules, que les navigateurs rejettent.
  const cookies = reponse.headers.getSetCookie?.() || []
  if (cookies.length) res.setHeader('Set-Cookie', cookies)
  return res.status(reponse.status).json(await reponse.json().catch(() => ({ ok: reponse.ok })))
}

export default async function handler(req, res) {
  // Better Auth REFUSE de tourner sans secret en production (vérifié : c'est
  // lui qui lève, et la fonction entière tombait en 500). Sans le secret,
  // les comptes ne sont simplement « pas encore ouverts » — 503, comme pour
  // toute capacité non configurée.
  if (!serverReady() || !process.env.BETTER_AUTH_SECRET) return notConfigured(res)
  try {
    // Notre route à nous, avant de passer la main : Better Auth ne la connaît
    // pas et répondrait 404.
    if (req.method === 'POST' && (req.url || '').split('?')[0].endsWith('/suppression')) {
      return await confirmerSuppression(req, res)
    }
    return await toNodeHandler(auth())(req, res)
  } catch (e) {
    // Le détail vit dans les logs et dans /api/health (sonde magic-link-dry) ;
    // au client, on ne renvoie jamais l'intérieur d'une exception.
    console.error('[tama] auth handler', e)
    return res.status(500).json({ error: 'erreur interne' })
  }
}
