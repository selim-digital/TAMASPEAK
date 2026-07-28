/**
 * Toutes les routes d'authentification (/api/auth/*) — Better Auth les gère :
 * lien magique, Google OAuth, session, déconnexion, suppression de compte.
 */
import { serverReady, notConfigured } from '../_lib/db.js'
import { auth } from '../_lib/auth.js'
import { toNodeHandler } from 'better-auth/node'

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  try {
    return await toNodeHandler(auth())(req, res)
  } catch (e) {
    // FUNCTION_INVOCATION_FAILED sans logs ne dit rien : on remonte le
    // message (jamais les valeurs d'env) le temps de stabiliser la prod.
    console.error('[tama] auth handler', e)
    return res.status(500).json({ error: String(e?.message || e).slice(0, 300) })
  }
}
