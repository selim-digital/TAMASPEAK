/**
 * Accès Neon — et la règle qui gouverne tout le dossier `api/` :
 *
 *   SANS `DATABASE_URL`, LE SERVEUR N'EXISTE PAS, ET CE N'EST PAS UNE ERREUR.
 *
 * L'app est locale d'abord ; ces fonctions ne font que synchroniser. Chaque
 * endpoint commence par `serverReady()` et répond 503 si la base n'est pas
 * configurée — le client (`src/lib/api.js`) traite ce 503 comme « mode local »,
 * jamais comme une panne.
 */
import { neon } from '@neondatabase/serverless'

let _sql = null

export function serverReady() {
  return !!process.env.DATABASE_URL
}

/** Client SQL (requêtes taguées : sql`select …`). Jamais appelé sans garde. */
export function sql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql
}

/** Réponse uniforme quand la base n'est pas branchée. */
export function notConfigured(res) {
  return res.status(503).json({ error: 'serveur non configuré', local: true })
}
