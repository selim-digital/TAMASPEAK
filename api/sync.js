/**
 * Synchronisation de la progression — GET pour lire, POST pour écrire.
 *
 * Le serveur GARDE l'instantané, il ne le comprend pas : la fusion max/union
 * se fait côté client (src/lib/progress.js, mergeStores), là où vit déjà
 * toute la logique de progression. Deux appareils qui divergent envoient
 * chacun leur fusion — l'écriture est « dernier fusionné gagne », ce qui est
 * sans perte puisque chaque écriture contient déjà l'union des deux états.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'

const MAX_STORE_BYTES = 256 * 1024 // un store réel fait ~10 Ko ; 256 Ko = déjà suspect

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })
  const userId = session.user.id

  if (req.method === 'GET') {
    const rows = await sql()`
      SELECT store, updated_at FROM progress_snapshots WHERE user_id = ${userId}`
    return res.status(200).json(rows[0] || { store: null, updated_at: null })
  }

  if (req.method === 'POST') {
    const store = req.body?.store
    if (!store || typeof store !== 'object') return res.status(400).json({ error: 'store manquant' })
    if (JSON.stringify(store).length > MAX_STORE_BYTES)
      return res.status(413).json({ error: 'store trop volumineux' })
    await sql()`
      INSERT INTO progress_snapshots (user_id, store, updated_at)
      VALUES (${userId}, ${JSON.stringify(store)}::jsonb, NOW())
      ON CONFLICT (user_id) DO UPDATE SET store = EXCLUDED.store, updated_at = NOW()`
    return res.status(200).json({ ok: true })
  }

  /**
   * DELETE — effacer l'instantané, en gardant le compte.
   *
   * Il manquait, et son absence produisait un bug que Selim a vécu : effacer
   * sa progression EN LOCAL ne servait à rien. La fusion est max/union et ne
   * connaît pas la notion d'effacement ; à la connexion suivante, le GET
   * ci-dessus rendait l'ancien instantané et `mergeStores` le réinstallait.
   * Le zéro était donc silencieusement annulé — l'utilisateur croit avoir
   * tout effacé et retrouve tout.
   *
   * C'est aussi la sortie de secours quand quelqu'un veut repartir à zéro
   * sans supprimer son compte : cela ne demande aucun email de confirmation,
   * puisque rien n'est détruit d'autre que ses propres données de
   * progression, et qu'il faut déjà être connecté pour arriver ici.
   */
  if (req.method === 'DELETE') {
    await sql()`DELETE FROM progress_snapshots WHERE user_id = ${userId}`
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'méthode non autorisée' })
}
