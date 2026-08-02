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

/* ------------------------------------------------------------------ */
/* Schéma auto-appliqué — ZÉRO manip au déploiement.                    */
/*                                                                      */
/* POST /api/setup existe toujours, mais exiger de s'en souvenir après  */
/* chaque migration est une manip de trop (vécu : « relation … does     */
/* not exist » en prod). Les endpoints qui dépendent de tables récentes */
/* appellent assurerSchema() : une SONDE vérifie les objets les plus    */
/* neufs du schéma, et ne rejoue db/schema.sql (idempotent, tout en     */
/* IF NOT EXISTS) que si l'un d'eux manque. Coût en régime établi :     */
/* un SELECT LIMIT 0 par instance et par démarrage, grâce au drapeau.   */
/* Les fonctions concernées embarquent db/schema.sql (vercel.json →     */
/* functions[…].includeFiles).                                          */
/* ------------------------------------------------------------------ */

let schemaVerifie = false

export async function assurerSchema() {
  if (schemaVerifie || !serverReady()) return
  try {
    // La sonde couvre LES DERNIERS ARRIVÉS du schéma : si eux existent,
    // tout le reste existe aussi (le fichier est appliqué d'un bloc).
    await sql()`SELECT palmares FROM email_prefs LIMIT 0`
    await sql()`SELECT 1 FROM cercle_liens LIMIT 0`
    await sql()`SELECT 1 FROM defis LIMIT 0`
    await sql()`SELECT 1 FROM abonnements LIMIT 0`
    await sql()`SELECT 1 FROM famille_membres LIMIT 0`
    await sql()`SELECT publie_le FROM lexique LIMIT 0`
    await sql()`SELECT 1 FROM lexique_audio LIMIT 0`
    schemaVerifie = true
    return
  } catch {
    /* il manque quelque chose : on applique le schéma ci-dessous */
  }
  try {
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const { Pool } = await import('@neondatabase/serverless')
    const script = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    try {
      await pool.query(script)
      schemaVerifie = true
      console.log('[tama] schéma appliqué automatiquement')
    } finally {
      await pool.end().catch(() => {})
    }
  } catch (e) {
    // On n'empêche JAMAIS la requête de tenter sa chance : si le schéma
    // était déjà bon malgré la sonde, tout marchera ; sinon l'erreur
    // d'origine remontera, elle, avec un sens.
    console.error('[tama] échec d’application automatique du schéma :', e?.message)
  }
}
