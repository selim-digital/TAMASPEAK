/**
 * Toutes les routes d'authentification (/api/auth/*) — Better Auth les gère :
 * lien magique, Google OAuth, session, déconnexion, suppression de compte.
 */
import { serverReady, notConfigured } from '../_lib/db.js'
import { auth } from '../_lib/auth.js'
import { toNodeHandler } from 'better-auth/node'

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  return toNodeHandler(auth())(req, res)
}
