/**
 * Installation de la base — exécute db/schema.sql dans Neon.
 *
 * Diagnostic vécu : toutes les variables étaient posées, l'auth démarrait…
 * et le lien magique mourait sur `relation "verification" does not exist` —
 * le schéma n'avait jamais été exécuté. Cet endpoint supprime l'étape
 * manuelle : POST /api/setup, et les tables existent.
 *
 * Public mais inoffensif, par construction :
 *   • il n'exécute QUE le fichier db/schema.sql embarqué au déploiement —
 *     aucune entrée utilisateur n'approche le SQL ;
 *   • le schéma est entièrement en CREATE TABLE/INDEX IF NOT EXISTS :
 *     le rejouer est un no-op, il ne détruit ni ne lit jamais rien ;
 *   • rate-limité en mémoire comme le feedback, pour le confort de la base.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { serverReady, notConfigured } from './_lib/db.js'
import { Pool } from '@neondatabase/serverless'

let dernier = 0

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST attendu' })
  const now = Date.now()
  if (now - dernier < 30_000) return res.status(429).json({ error: 'déjà en cours — réessaie dans 30 s' })
  dernier = now

  let sql
  try {
    sql = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8')
  } catch {
    return res.status(500).json({ error: 'schema.sql introuvable dans le bundle' })
  }

  // Le driver WebSocket (Pool) accepte un script multi-instructions tel
  // quel — pas de découpage fragile sur les points-virgules.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    await pool.query(sql)
    const { rows } = await pool.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' ORDER BY table_name`,
    )
    return res.status(200).json({ ok: true, tables: rows.map((r) => r.table_name) })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e).slice(0, 300) })
  } finally {
    await pool.end().catch(() => {})
  }
}
