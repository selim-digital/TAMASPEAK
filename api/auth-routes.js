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
import { auth } from './_lib/auth.js'
import { toNodeHandler } from 'better-auth/node'

export default async function handler(req, res) {
  // Better Auth REFUSE de tourner sans secret en production (vérifié : c'est
  // lui qui lève, et la fonction entière tombait en 500). Sans le secret,
  // les comptes ne sont simplement « pas encore ouverts » — 503, comme pour
  // toute capacité non configurée.
  if (!serverReady() || !process.env.BETTER_AUTH_SECRET) return notConfigured(res)
  try {
    return await toNodeHandler(auth())(req, res)
  } catch (e) {
    console.error('[tama] auth handler', e)
    return res.status(500).json({ error: 'erreur interne' })
  }
}
