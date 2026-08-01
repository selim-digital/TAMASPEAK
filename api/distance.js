/**
 * Tout le « jeu à distance » en UNE fonction Vercel, routée par `?r=` —
 * le plan Hobby plafonne à 12 fonctions serverless et ce fichier est la
 * douzième : cercle, demandes d'enregistrement, défis distants et
 * notifications partagent donc le même point d'entrée.
 *
 * Règles héritées du reste du dossier api/ :
 *   • sans DATABASE_URL → 503 (le client le traite comme « mode local ») ;
 *   • sans session → 401 : tout ici est nominatif, rien d'anonyme ;
 *   • on ne parle qu'aux membres de son cercle — CHAQUE écriture revérifie
 *     le lien, on ne fait jamais confiance aux ids envoyés par le client.
 */
import { serverReady, notConfigured, sql, assurerSchema } from './_lib/db.js'
import { sessionOf } from './_lib/auth.js'
import { sansVisages } from './_lib/texte.js'

/** Code court à partager (invitation, défi) — lisible, sans ambiguïté O/0. */
function codeCourt(n = 8) {
  const alpha = 'abcdefghjkmnpqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < n; i++) out += alpha[Math.floor(Math.random() * alpha.length)]
  return out
}

/** Dépose une notification in-app pour `userId` (affichée au prochain passage). */
async function notifier(userId, kind, title, body, data = null) {
  await sql()`
    INSERT INTO notifications (user_id, kind, title, body, data)
    VALUES (${userId}, ${kind}, ${title}, ${body}, ${data ? JSON.stringify(data) : null})`
}

/** Les deux utilisateurs sont-ils reliés par un lien de cercle accepté ? */
async function sontRelies(a, b) {
  const [r] = await sql()`
    SELECT id FROM cercle_liens
    WHERE accepted_at IS NOT NULL
      AND ((createur = ${a} AND invite = ${b}) OR (createur = ${b} AND invite = ${a}))
    LIMIT 1`
  return !!r
}

/* ------------------------------------------------------------------ */
/* Cercle                                                              */
/* ------------------------------------------------------------------ */

async function cercleGet(res, me) {
  const membres = await sql()`
    SELECT l.id, l.accepted_at,
           u.id AS user_id, u.name
    FROM cercle_liens l
    JOIN "user" u ON u.id = CASE WHEN l.createur = ${me.id} THEN l.invite ELSE l.createur END
    WHERE l.accepted_at IS NOT NULL AND (l.createur = ${me.id} OR l.invite = ${me.id})
    ORDER BY l.accepted_at DESC`
  const enAttente = await sql()`
    SELECT code, created_at FROM cercle_liens
    WHERE createur = ${me.id} AND invite IS NULL
    ORDER BY created_at DESC LIMIT 3`
  return res.status(200).json({
    membres: membres.map((m) => ({ lienId: m.id, userId: m.user_id, name: m.name })),
    invitations: enAttente.map((i) => ({ code: i.code })),
  })
}

async function cerclePost(req, res, me) {
  const { action } = req.body || {}

  if (action === 'inviter') {
    // Réutiliser un code encore libre plutôt qu'en semer un par clic.
    const [libre] = await sql()`
      SELECT code FROM cercle_liens WHERE createur = ${me.id} AND invite IS NULL LIMIT 1`
    if (libre) return res.status(200).json({ code: libre.code })
    const code = codeCourt()
    await sql()`INSERT INTO cercle_liens (createur, code) VALUES (${me.id}, ${code})`
    return res.status(200).json({ code })
  }

  if (action === 'rejoindre') {
    const code = String(req.body?.code || '').trim().toLowerCase()
    if (!code) return res.status(400).json({ error: 'code manquant' })
    const [lien] = await sql()`
      SELECT id, createur, invite FROM cercle_liens WHERE code = ${code}`
    if (!lien) return res.status(404).json({ error: 'code inconnu' })
    if (lien.createur === me.id) return res.status(400).json({ error: 'propre-code' })
    if (lien.invite) return res.status(409).json({ error: 'code deja utilise' })
    if (await sontRelies(me.id, lien.createur)) return res.status(409).json({ error: 'deja relies' })
    await sql()`
      UPDATE cercle_liens SET invite = ${me.id}, accepted_at = NOW() WHERE id = ${lien.id}`
    const [autre] = await sql()`SELECT id, name FROM "user" WHERE id = ${lien.createur}`
    await notifier(
      lien.createur,
      'cercle',
      `${me.name || 'Quelqu’un'} a rejoint ton cercle 🎉`,
      'Vous pouvez maintenant vous défier et vous demander des mots, chacun sur son téléphone.',
    )
    // Se relier vaut consentement au palmarès par email (l'écran du cercle
    // le dit en clair) — pour les DEUX personnes. DO NOTHING et pas UPDATE :
    // un refus explicite déjà posé ne se ré-active JAMAIS tout seul.
    for (const uid of [me.id, lien.createur]) {
      await sql()`
        INSERT INTO email_prefs (user_id, palmares) VALUES (${uid}, TRUE)
        ON CONFLICT (user_id) DO NOTHING`
    }
    return res.status(200).json({ ok: true, avec: { name: autre?.name || '' } })
  }

  if (action === 'retirer') {
    const lienId = Number(req.body?.lienId)
    await sql()`
      DELETE FROM cercle_liens
      WHERE id = ${lienId} AND (createur = ${me.id} OR invite = ${me.id})`
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'action inconnue' })
}

/* ------------------------------------------------------------------ */
/* Demandes d'enregistrement                                           */
/* ------------------------------------------------------------------ */

async function demandesGet(res, me) {
  const recues = await sql()`
    SELECT d.id, d.texte, d.sens, d.lang, d.status, d.created_at, u.name AS de_name
    FROM demandes_audio d JOIN "user" u ON u.id = d.de_user
    WHERE d.pour_user = ${me.id} AND d.status = 'attente'
    ORDER BY d.created_at DESC LIMIT 20`
  const envoyees = await sql()`
    SELECT d.id, d.texte, d.sens, d.lang, d.status, d.created_at, d.audio_type,
           u.name AS pour_name
    FROM demandes_audio d JOIN "user" u ON u.id = d.pour_user
    WHERE d.de_user = ${me.id}
    ORDER BY d.created_at DESC LIMIT 20`
  return res.status(200).json({
    recues: recues.map((d) => ({
      id: d.id, texte: d.texte, sens: d.sens, lang: d.lang, de: d.de_name,
    })),
    envoyees: envoyees.map((d) => ({
      id: d.id, texte: d.texte, sens: d.sens, lang: d.lang, pour: d.pour_name,
      status: d.status, aAudio: d.status === 'fait',
    })),
  })
}

async function demandesPost(req, res, me) {
  const { action } = req.body || {}

  if (action === 'creer') {
    const pour = String(req.body?.pour || '')
    const texte = sansVisages(String(req.body?.texte || '').trim().slice(0, 120))
    const sens = sansVisages(String(req.body?.sens || '').trim().slice(0, 120))
    const lang = String(req.body?.lang || '').slice(0, 8)
    if (!pour || !texte) return res.status(400).json({ error: 'demande incomplète' })
    if (!(await sontRelies(me.id, pour))) return res.status(403).json({ error: 'pas dans le cercle' })
    const [d] = await sql()`
      INSERT INTO demandes_audio (de_user, pour_user, lang, texte, sens)
      VALUES (${me.id}, ${pour}, ${lang || null}, ${texte}, ${sens || null})
      RETURNING id`
    await notifier(
      pour,
      'demande-audio',
      `${me.name || 'Quelqu’un'} aimerait entendre ta voix 🎙`,
      `« ${texte} »${sens ? ` (${sens})` : ''} — enregistre-le quand tu as une minute.`,
      { demandeId: d.id },
    )
    return res.status(200).json({ ok: true, id: d.id })
  }

  if (action === 'repondre') {
    const id = Number(req.body?.id)
    const audio = String(req.body?.audio || '')
    const type = String(req.body?.type || 'audio/webm').slice(0, 40)
    if (!id || !audio) return res.status(400).json({ error: 'audio manquant' })
    if (audio.length > 800000) return res.status(413).json({ error: 'audio trop long' })
    const [d] = await sql()`
      SELECT id, de_user, texte FROM demandes_audio
      WHERE id = ${id} AND pour_user = ${me.id} AND status = 'attente'`
    if (!d) return res.status(404).json({ error: 'demande introuvable' })
    await sql()`
      UPDATE demandes_audio
      SET audio_b64 = ${audio}, audio_type = ${type}, status = 'fait', answered_at = NOW()
      WHERE id = ${id}`
    await notifier(
      d.de_user,
      'audio-recu',
      `${me.name || 'Ton proche'} a enregistré « ${d.texte} » 🎁`,
      'Écoute sa voix dans Mon cercle — et garde-la dans tes leçons si tu veux.',
      { demandeId: id },
    )
    return res.status(200).json({ ok: true })
  }

  if (action === 'decliner') {
    const id = Number(req.body?.id)
    const [d] = await sql()`
      UPDATE demandes_audio SET status = 'decline', answered_at = NOW()
      WHERE id = ${id} AND pour_user = ${me.id} AND status = 'attente'
      RETURNING de_user, texte`
    if (d) {
      // Jamais de reproche, dans aucun sens : le refus est dit avec douceur.
      await notifier(
        d.de_user,
        'info',
        `« ${d.texte} » attendra un peu`,
        `${me.name || 'Ton proche'} n’a pas pu enregistrer cette fois-ci.`,
      )
    }
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'action inconnue' })
}

/** L'audio d'une demande — seulement pour ses deux participants. */
async function audioGet(req, res, me) {
  const id = Number(req.query.id)
  const [d] = await sql()`
    SELECT audio_b64, audio_type FROM demandes_audio
    WHERE id = ${id} AND status = 'fait' AND (de_user = ${me.id} OR pour_user = ${me.id})`
  if (!d?.audio_b64) return res.status(404).json({ error: 'audio introuvable' })
  const buf = Buffer.from(d.audio_b64, 'base64')
  res.setHeader('Content-Type', d.audio_type || 'audio/webm')
  res.setHeader('Cache-Control', 'private, max-age=3600')
  return res.status(200).send(buf)
}

/* ------------------------------------------------------------------ */
/* Défis à distance                                                    */
/* ------------------------------------------------------------------ */

async function defisGet(req, res, me) {
  // Un défi précis (pour le jouer) ?
  if (req.query.code) {
    const code = String(req.query.code).toLowerCase()
    const [d] = await sql()`
      SELECT d.*, u.name AS createur_name
      FROM defis d JOIN "user" u ON u.id = d.createur
      WHERE d.code = ${code} AND (d.createur = ${me.id} OR d.adversaire = ${me.id})`
    if (!d) return res.status(404).json({ error: 'défi introuvable' })
    return res.status(200).json({
      code: d.code, lang: d.lang, seed: d.seed, size: d.size, version: d.version,
      de: d.createur_name, status: d.status,
      scoreCreateur: d.score_createur, totalCreateur: d.total_createur,
      scoreAdversaire: d.score_adversaire, totalAdversaire: d.total_adversaire,
      role: d.createur === me.id ? 'createur' : 'adversaire',
    })
  }
  const liste = await sql()`
    SELECT d.code, d.lang, d.size, d.status, d.created_at,
           d.score_createur, d.total_createur, d.score_adversaire, d.total_adversaire,
           d.createur = ${me.id} AS je_defie,
           uc.name AS createur_name, ua.name AS adversaire_name
    FROM defis d
    JOIN "user" uc ON uc.id = d.createur
    LEFT JOIN "user" ua ON ua.id = d.adversaire
    WHERE d.createur = ${me.id} OR d.adversaire = ${me.id}
    ORDER BY d.created_at DESC LIMIT 15`
  return res.status(200).json({
    defis: liste.map((d) => ({
      code: d.code, lang: d.lang, size: d.size, status: d.status,
      jeDefie: d.je_defie, avec: d.je_defie ? d.adversaire_name : d.createur_name,
      scoreCreateur: d.score_createur, totalCreateur: d.total_createur,
      scoreAdversaire: d.score_adversaire, totalAdversaire: d.total_adversaire,
    })),
  })
}

async function defisPost(req, res, me) {
  const { action } = req.body || {}

  if (action === 'creer') {
    // Le créateur a DÉJÀ joué sa série : son score arrive avec la création.
    const pour = String(req.body?.pour || '')
    const lang = String(req.body?.lang || '').slice(0, 8)
    const seed = String(req.body?.seed || '').slice(0, 16)
    const size = Math.min(Math.max(Number(req.body?.size) || 5, 1), 10)
    const version = String(req.body?.version || '').slice(0, 16)
    const correct = Number(req.body?.correct)
    const total = Number(req.body?.total)
    if (!pour || !lang || !seed || !Number.isFinite(correct) || !Number.isFinite(total)) {
      return res.status(400).json({ error: 'défi incomplet' })
    }
    if (!(await sontRelies(me.id, pour))) return res.status(403).json({ error: 'pas dans le cercle' })
    const code = codeCourt()
    await sql()`
      INSERT INTO defis (code, createur, adversaire, lang, seed, size, version, score_createur, total_createur)
      VALUES (${code}, ${me.id}, ${pour}, ${lang}, ${seed}, ${size}, ${version || null}, ${correct}, ${total})`
    await notifier(
      pour,
      'defi',
      `${me.name || 'Quelqu’un'} te défie ! ⚔`,
      `${size} questions — exactement les mêmes que ${me.name || 'ton proche'}. Montre ce que tu sais.`,
      { code },
    )
    return res.status(200).json({ ok: true, code })
  }

  if (action === 'score') {
    // L'adversaire a joué : on clôt et on prévient les deux téléphones.
    const code = String(req.body?.code || '').toLowerCase()
    const correct = Number(req.body?.correct)
    const total = Number(req.body?.total)
    if (!code || !Number.isFinite(correct) || !Number.isFinite(total)) {
      return res.status(400).json({ error: 'score incomplet' })
    }
    const [d] = await sql()`
      SELECT * FROM defis WHERE code = ${code} AND adversaire = ${me.id} AND status = 'ouvert'`
    if (!d) return res.status(404).json({ error: 'défi introuvable' })
    await sql()`
      UPDATE defis SET score_adversaire = ${correct}, total_adversaire = ${total},
                       status = 'fini', finished_at = NOW()
      WHERE id = ${d.id}`
    const verdict =
      correct > d.score_createur ? `${me.name || 'Ton adversaire'} l’emporte ${correct}–${d.score_createur} !`
      : correct < d.score_createur ? `Tu l’emportes ${d.score_createur}–${correct} !`
      : `Égalité parfaite, ${correct} partout.`
    await notifier(d.createur, 'defi-fini', 'Ton défi a été relevé ⚔', verdict, { code })
    return res.status(200).json({
      ok: true,
      scoreCreateur: d.score_createur,
      totalCreateur: d.total_createur,
    })
  }

  return res.status(400).json({ error: 'action inconnue' })
}

/* ------------------------------------------------------------------ */
/* Notifications serveur                                               */
/* ------------------------------------------------------------------ */

async function notifsGet(res, me) {
  // Les 'email-…' sont l'anti-doublon du cron : jamais affichées.
  const rows = await sql()`
    SELECT id, kind, title, body, data, read_at, created_at
    FROM notifications
    WHERE user_id = ${me.id} AND kind NOT LIKE 'email-%'
    ORDER BY created_at DESC LIMIT 30`
  return res.status(200).json({
    notifs: rows.map((n) => ({
      id: `srv-${n.id}`, srvId: n.id, kind: n.kind, title: n.title, body: n.body,
      data: n.data || null, lue: !!n.read_at,
    })),
  })
}

async function notifsPost(req, res, me) {
  if (req.body?.action === 'lues') {
    await sql()`
      UPDATE notifications SET read_at = NOW()
      WHERE user_id = ${me.id} AND read_at IS NULL AND kind NOT LIKE 'email-%'`
    return res.status(200).json({ ok: true })
  }
  return res.status(400).json({ error: 'action inconnue' })
}

/* ------------------------------------------------------------------ */
/* Classement du cercle — semaine, mois, année EN COURS.                */
/*                                                                      */
/* Le cercle est fait de liens deux-à-deux : « mon cercle », c'est moi   */
/* plus mes reliés — chacun voit donc SON classement, honnête vis-à-vis */
/* de qui il connaît. Le barème VALORISE L'EFFORT (règle du produit) :  */
/*   points = XP + 5 par duel joué + 20 par duel gagné                  */
/* Jouer rapporte toujours ; gagner rapporte plus. Le cron du palmarès  */
/* (api/cron/relances.js → _lib/palmares.js) applique le même barème.   */
/* ------------------------------------------------------------------ */

export const POINTS = { duelJoue: 5, duelGagne: 20 }

/** Les ids de mon cercle : moi + tous mes reliés. */
async function idsDeMonCercle(me) {
  const relies = await sql()`
    SELECT CASE WHEN l.createur = ${me.id} THEN l.invite ELSE l.createur END AS id
    FROM cercle_liens l
    WHERE l.accepted_at IS NOT NULL AND (l.createur = ${me.id} OR l.invite = ${me.id})`
  return [me.id, ...relies.map((r) => r.id)]
}

/** Classement d'un ensemble d'utilisateurs entre `debut` et `fin` (exclu, facultatif). */
export async function classementEntre(ids, debut, fin = null) {
  const lignes = await sql()`
    SELECT u.id, u."name" AS nom,
      COALESCE(SUM(e.xp), 0)::int AS xp,
      COUNT(e.id) FILTER (WHERE e.type = 'duel_won')::int AS duels_gagnes,
      COUNT(e.id) FILTER (WHERE e.type IN ('duel_won', 'duel_played'))::int AS duels_joues,
      COUNT(DISTINCT DATE(e.at))::int AS jours
    FROM "user" u
    LEFT JOIN events e ON e.user_id = u.id
      AND e.at >= ${debut.toISOString()}
      AND (${fin === null} OR e.at < ${fin ? fin.toISOString() : new Date().toISOString()})
    WHERE u.id = ANY(${ids})
    GROUP BY u.id, u."name"`
  return lignes
    .map((l) => ({
      id: l.id,
      nom: l.nom,
      xp: l.xp,
      duelsJoues: l.duels_joues,
      duelsGagnes: l.duels_gagnes,
      jours: l.jours,
      points: l.xp + POINTS.duelJoue * l.duels_joues + POINTS.duelGagne * l.duels_gagnes,
    }))
    .sort((a, b) => b.points - a.points || b.jours - a.jours || a.nom.localeCompare(b.nom))
}

/** Débuts des périodes EN COURS (lundi ISO, 1ᵉʳ du mois, 1ᵉʳ janvier — UTC). */
export function debutsPeriodes(maintenant = new Date()) {
  const d = maintenant
  const jour = (d.getUTCDay() + 6) % 7 // lundi = 0
  return {
    semaine: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - jour)),
    mois: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)),
    annee: new Date(Date.UTC(d.getUTCFullYear(), 0, 1)),
  }
}

async function classementGet(res, me) {
  const ids = await idsDeMonCercle(me)
  const { semaine, mois, annee } = debutsPeriodes()
  const [clSemaine, clMois, clAnnee] = await Promise.all([
    classementEntre(ids, semaine),
    classementEntre(ids, mois),
    classementEntre(ids, annee),
  ])
  return res.status(200).json({
    moi: me.id,
    bareme: POINTS,
    classements: { semaine: clSemaine, mois: clMois, annee: clAnnee },
  })
}

/* ------------------------------------------------------------------ */

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  // Zéro manip au déploiement : les tables récentes s'installent seules.
  await assurerSchema()
  const session = await sessionOf(req)
  if (!session) return res.status(401).json({ error: 'non connecté' })
  const me = session.user
  const r = String(req.query.r || '')

  try {
    if (r === 'cercle') return req.method === 'POST' ? cerclePost(req, res, me) : cercleGet(res, me)
    if (r === 'demandes') return req.method === 'POST' ? demandesPost(req, res, me) : demandesGet(res, me)
    if (r === 'audio') return audioGet(req, res, me)
    if (r === 'defis') return req.method === 'POST' ? defisPost(req, res, me) : defisGet(req, res, me)
    if (r === 'notifs') return req.method === 'POST' ? notifsPost(req, res, me) : notifsGet(res, me)
    if (r === 'classement') return classementGet(res, me)
    return res.status(404).json({ error: 'route inconnue' })
  } catch (e) {
    console.error(`[distance:${r}]`, e)
    return res.status(500).json({ error: 'panne technique' })
  }
}
