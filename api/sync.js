/**
 * Ce qui circule entre l'app et le serveur.
 *
 *   (défaut)         GET/POST/DELETE  la progression d'une personne — privée
 *   ?r=dictionnaire  GET              les corrections publiées — PUBLIQUES
 *
 * Synchronisation de la progression : le serveur GARDE l'instantané, il ne le
 * comprend pas. La fusion max/union se fait côté client (src/lib/progress.js,
 * mergeStores), là où vit déjà toute la logique de progression. Deux appareils
 * qui divergent envoient chacun leur fusion — l'écriture est « dernier fusionné
 * gagne », ce qui est sans perte puisque chaque écriture contient déjà l'union
 * des deux états.
 *
 * Pourquoi le dictionnaire atterrit ICI et pas dans un fichier à lui : le plan
 * Vercel Hobby plafonne à DOUZE fonctions, et elles sont prises. Ce fichier
 * était déjà celui par lequel l'app télécharge ce que le serveur détient — les
 * corrections de contenu en sont, elles ne dépareillent pas.
 */
import { serverReady, notConfigured, sql, assurerSchema } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'

const MAX_STORE_BYTES = 256 * 1024 // un store réel fait ~10 Ko ; 256 Ko = déjà suspect

/* ------------------------------------------------------------------ */
/* ?r=dictionnaire — la SORTIE de l'atelier de contenu.                */
/*                                                                      */
/* L'app embarque son dictionnaire dans son bundle : c'est ce qui la    */
/* rend hors-ligne, et cela ne change pas. Cette route ne renvoie que   */
/* la COUCHE DE CORRECTIONS publiée depuis le backoffice — le peu qui a */
/* bougé depuis le dernier déploiement. L'app la pose par-dessus le     */
/* contenu embarqué (src/lib/dictionnaireLive.js).                      */
/*                                                                      */
/* Publique et anonyme, à dessein : un dictionnaire relu par des        */
/* locuteurs natifs n'a rien de confidentiel, et exiger un compte pour  */
/* lire le bon mot serait absurde. Rien de personnel ne sort d'ici.     */
/* ------------------------------------------------------------------ */

async function dictionnaire(res) {
  // Sans base, il n'y a pas de corrections — ce n'est pas une panne, c'est
  // un dictionnaire qui n'a simplement rien à corriger. On répond donc une
  // couche VIDE (200) plutôt qu'un 503 : le client n'a pas de cas d'erreur
  // à traiter, il pose une couche vide et garde son contenu embarqué.
  const vide = { version: null, corrections: [], ajouts: [], retraits: [] }
  if (!serverReady()) return envoyer(res, vide)

  let lignes
  try {
    await assurerSchema()
    lignes = await sql()`
      SELECT lang, cle, publie_terme, publie_sens, publie_notes, publie_statut, publie_le
      FROM lexique
      WHERE publie_le IS NOT NULL
      ORDER BY lang, cle NULLS LAST, publie_terme
      LIMIT 5000`
  } catch (e) {
    // Une base muette ne doit pas rendre le dictionnaire muet : même règle
    // que le verrou d'abonnement — on ne retire jamais à quelqu'un ce qu'il
    // a déjà dans les mains à cause d'une panne de notre côté.
    console.error('[tama] dictionnaire publié illisible :', e?.message)
    return envoyer(res, vide)
  }

  const out = { version: null, corrections: [], ajouts: [], retraits: [] }
  for (const l of lignes) {
    const at = l.publie_le instanceof Date ? l.publie_le.toISOString() : String(l.publie_le)
    if (!out.version || at > out.version) out.version = at
    // Une entrée publiée « rejetée » se retire du dictionnaire : c'est le
    // seul moyen de faire oublier un mot faux sans attendre un déploiement.
    if (l.publie_statut === 'rejete') {
      if (l.cle) out.retraits.push({ lang: l.lang, cle: l.cle })
      continue
    }
    // Le sens est stocké à plat ; le dictionnaire de l'app en porte
    // plusieurs par entrée. Le séparateur est celui de l'ensemencement.
    const sens = String(l.publie_sens || '').split(' · ').map((s) => s.trim()).filter(Boolean)
    const notes = l.publie_notes || ''
    if (l.cle) out.corrections.push({ lang: l.lang, cle: l.cle, mot: l.publie_terme, sens, notes })
    else out.ajouts.push({ lang: l.lang, mot: l.publie_terme, sens, notes })
  }
  return envoyer(res, out)
}

function envoyer(res, corps) {
  // Cinq minutes au bord de Vercel, une journée de rattrapage : une
  // correction publiée atteint tout le monde en quelques minutes, sans
  // qu'une ouverture d'app coûte une invocation de fonction.
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res.status(200).json(corps)
}

export default async function handler(req, res) {
  if (req.query?.r === 'dictionnaire') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'méthode non autorisée' })
    return dictionnaire(res)
  }

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
