/**
 * Toutes les routes d'authentification (/api/auth/*) — Better Auth les gère :
 * lien magique, Google OAuth, session, déconnexion, suppression de compte.
 */
import { serverReady, notConfigured } from '../_lib/db.js'
import { auth } from '../_lib/auth.js'
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
