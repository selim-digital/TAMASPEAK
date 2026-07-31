/**
 * Abonnements — tout le circuit de paiement en UNE fonction Vercel, routée
 * par `?r=` (même contrainte que api/distance.js : le plan Hobby plafonne à
 * douze fonctions serverless, c'est pour la tenir que les deux endpoints
 * admin ont été réunis dans api/admin.js).
 *
 *   ?r=etat      GET   ce que l'app a le droit d'ouvrir, et à quel prix
 *   ?r=checkout  POST  départ vers la caisse Stripe (carte, Apple/Google Pay…)
 *   ?r=portail   POST  départ vers le portail client (résilier, changer de carte)
 *   ?r=famille   POST  inviter / rejoindre / retirer — le pack 4 personnes
 *   ?r=webhook   POST  Stripe nous dit ce qui s'est passé (signé)
 *
 * TROIS RÈGLES, dans cet ordre :
 *
 * 1. AUCUNE DONNÉE BANCAIRE ICI. Le paiement se fait sur les pages hébergées
 *    par Stripe. Nous ne voyons jamais un numéro de carte, donc nous ne
 *    pouvons pas le perdre.
 *
 * 2. LE PRIX EST DÉCIDÉ PAR LE SERVEUR. Le client demande un PLAN
 *    ('solo' | 'famille'), jamais un montant ni un identifiant de Price :
 *    sinon n'importe qui s'abonnerait au tarif de son choix depuis la console
 *    du navigateur. La zone tarifaire vient de l'en-tête géographique de
 *    Vercel, pas d'un champ envoyé par le navigateur.
 *
 * 3. STRIPE FAIT FOI. Notre table `abonnements` est un cache de lecture,
 *    alimenté par les webhooks. En cas de doute, c'est Stripe qui a raison.
 */
import { serverReady, notConfigured, sql, assurerSchema } from './_lib/db.js'
import { sessionOf, isAdmin } from './_lib/auth.js'
import { stripe, stripeReady, evenementVerifie } from './_lib/stripe.js'
import {
  ZONES,
  PLANS,
  DEVISE,
  FAMILLE_INVITES,
  ESSAI_JOURS,
  UNITES_LIBRES,
  zoneDuPays,
  tarifsDe,
} from '../src/data/tarifs.js'

/**
 * Corps BRUT obligatoire : la signature d'un webhook porte sur les octets
 * exacts envoyés par Stripe. Laisser Vercel analyser le JSON puis le
 * ré-imprimer change les espaces et invalide toute signature — le webhook
 * serait rejeté à 100 %. On désactive donc l'analyseur pour le fichier
 * entier, et `lireJson()` s'en charge pour les autres routes.
 */
export const config = { api: { bodyParser: false } }

async function lireCorps(req) {
  // Ceinture ET bretelles : si l'analyseur tournait quand même, le flux
  // serait déjà consommé et la signature échouerait pour toujours — un
  // webhook muet est le genre de panne qu'on ne remarque qu'au premier
  // client mécontent. On récupère alors le corps déjà lu, à condition qu'il
  // soit resté BRUT (réimprimer un JSON analysé changerait les octets, donc
  // la signature : mieux vaut échouer franchement que valider un faux).
  if (Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf8')

  const morceaux = []
  for await (const c of req) morceaux.push(typeof c === 'string' ? Buffer.from(c) : c)
  return Buffer.concat(morceaux)
}

/**
 * La route demandée. On lit l'URL nous-mêmes plutôt que `req.query` : couper
 * l'analyseur de corps ne doit pas pouvoir emporter le routage avec lui.
 */
function routeDe(req) {
  if (req.query?.r) return req.query.r
  try {
    return new URL(req.url, 'http://x').searchParams.get('r') || ''
  } catch {
    return ''
  }
}

async function lireJson(req) {
  // Corps déjà analysé par la plateforme (cas où la config ci-dessus ne
  // serait pas honorée) : le flux est vide, il faut le prendre là.
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body
  try {
    const brut = await lireCorps(req)
    return brut.length ? JSON.parse(brut.toString('utf8')) : {}
  } catch {
    return {}
  }
}

const APP_URL = process.env.APP_URL || process.env.BETTER_AUTH_URL || 'https://tamaspeak.com'

/** Code court à partager (invitation famille) — sans ambiguïté O/0, I/1. */
function codeCourt(n = 8) {
  const alpha = 'abcdefghjkmnpqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < n; i++) out += alpha[Math.floor(Math.random() * alpha.length)]
  return out
}

/* ------------------------------------------------------------------ */
/* Zone tarifaire et identifiants de Price                             */
/* ------------------------------------------------------------------ */

/**
 * La zone se lit dans l'en-tête géographique posé par la plateforme —
 * `x-vercel-ip-country` en production, `cf-ipcountry` derrière Cloudflare.
 * Le navigateur ne peut pas la choisir : c'est tout l'intérêt.
 *
 * Un VPN peut évidemment faire passer quelqu'un pour ailleurs. On l'assume :
 * le tarif bas existe pour être atteignable, pas pour être défendu comme un
 * coffre-fort — et Stripe refusera de toute façon une carte dont le pays ne
 * colle pas, dans les cas qui comptent.
 */
function zoneDeLaRequete(req) {
  const pays = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || ''
  return zoneDuPays(pays)
}

/**
 * Sommes-nous sur les clés de TEST de Stripe ?
 *
 * Ce que ce drapeau règle, et c'est un vrai problème de calendrier : pour
 * vérifier la chaîne de paiement de bout en bout (caisse → webhook →
 * abonnement enregistré), il faut que le code soit DÉPLOYÉ — l'authentification
 * est liée au domaine tamaspeak.com, une préversion ne saurait connecter
 * personne. Il faut donc laisser les clés de test en production le temps de
 * l'essai. Sans précaution, pendant ce temps, les vrais utilisateurs verraient
 * un mur d'abonnement adossé à une caisse qui REFUSE les vraies cartes.
 *
 * D'où la règle : EN MODE TEST, LE VERROU NE S'APPLIQUE QU'AUX ADMINS. On voit
 * exactement l'expérience réelle et on peut tout essayer ; tout le monde garde
 * l'app entière, comme la veille. Le jour où les clés `sk_live_` arrivent, le
 * verrou vaut pour tous — sans toucher une ligne de code.
 */
const modeTest = () => (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_')

/**
 * L'identifiant du Price Stripe pour (plan, zone).
 *
 * Chez Stripe, le mode test et le mode réel sont deux mondes ÉTANCHES : un
 * produit créé dans l'un n'existe pas dans l'autre, et une clé de test qui
 * nomme un tarif réel reçoit « No such price ». Vécu à la mise en route.
 *
 * D'où les deux jeux de variables qui cohabitent en permanence :
 *
 *   STRIPE_PRICE_SOLO_NORD        le tarif RÉEL   (celui qui encaisse)
 *   STRIPE_PRICE_SOLO_NORD_TEST   le tarif de TEST (préféré si la clé est
 *                                 `sk_test_`, ignoré sinon)
 *
 * Conséquence, et c'est tout l'intérêt : basculer entre répétition et
 * représentation ne demande plus de réécrire quatre identifiants — il suffit
 * de changer STRIPE_SECRET_KEY. Moins de variables à changer, moins de
 * chances d'en oublier une le jour de l'ouverture.
 */
function priceId(plan, zone) {
  const cle = `STRIPE_PRICE_${plan}_${zone}`.toUpperCase()
  if (modeTest() && process.env[`${cle}_TEST`]) return process.env[`${cle}_TEST`]
  return process.env[cle] || null
}

/** Même principe pour le secret du webhook : un point de terminaison par mode. */
function webhookSecret() {
  if (modeTest() && process.env.STRIPE_WEBHOOK_SECRET_TEST) {
    return process.env.STRIPE_WEBHOOK_SECRET_TEST
  }
  return process.env.STRIPE_WEBHOOK_SECRET || null
}

/**
 * Le Price nommé par l'environnement vaut-il bien ce que l'app affiche ?
 *
 * LA FAUTE QU'ON EMPÊCHE ICI : les quatre `STRIPE_PRICE_*` se ressemblent
 * tous (`price_1TzKr0BFur…`). Les intervertir prend trois secondes
 * d'inattention et ne casse RIEN — l'app afficherait 4,99 € et Stripe
 * débiterait 1,99 €, ou l'inverse, silencieusement, pendant des mois. C'est
 * exactement l'écart affichage/débit que tout le reste du code s'applique à
 * rendre impossible ; il serait absurde de le laisser rentrer par la porte
 * de la configuration.
 *
 * On vérifie donc le montant, la devise et la récurrence AVANT d'ouvrir la
 * caisse. Le résultat est mémorisé par instance : un aller-retour Stripe au
 * premier passage en caisse après un démarrage à froid, zéro ensuite.
 *
 * @returns {Promise<string|null>} la raison du refus, ou null si tout est bon
 */
const pricesVerifies = new Set()

async function priceConforme(price, plan, zone) {
  if (pricesVerifies.has(price)) return null
  const attendu = tarifsDe(zone)[plan]?.centimes
  if (!attendu) return `aucun montant de référence pour ${plan}/${zone}`

  const p = await stripe(`prices/${price}`, { method: 'GET' })

  if (p.unit_amount !== attendu) {
    return `le tarif ${plan}/${zone} vaut ${(p.unit_amount ?? 0) / 100} € chez Stripe, ` +
      `l'app affiche ${attendu / 100} € — les identifiants STRIPE_PRICE_* sont probablement intervertis`
  }
  if (p.currency !== DEVISE) return `le tarif ${plan}/${zone} est en ${p.currency}, attendu en ${DEVISE}`
  if (p.recurring?.interval !== 'month' || p.recurring?.interval_count !== 1) {
    return `le tarif ${plan}/${zone} n'est pas un abonnement mensuel`
  }
  if (p.active === false) return `le tarif ${plan}/${zone} est archivé chez Stripe`

  pricesVerifies.add(price)
  return null
}

/** Le plan correspondant à un Price reçu de Stripe (chemin inverse). */
function planDuPrice(id) {
  for (const plan of ['solo', 'famille']) {
    for (const zone of [ZONES.NORD, ZONES.SUD]) {
      if (id && priceId(plan, zone) === id) return { plan, zone }
    }
  }
  return { plan: null, zone: null }
}

/** Les statuts Stripe, traduits dans le vocabulaire de la table. */
function statutDepuisStripe(s) {
  switch (s) {
    case 'trialing':
      return 'essai'
    case 'active':
      return 'actif'
    case 'past_due':
    case 'unpaid':
      return 'retard'
    case 'canceled':
    case 'incomplete_expired':
      return 'annule'
    case 'incomplete':
      return 'attente'
    default:
      return 'aucun'
  }
}

/* ------------------------------------------------------------------ */
/* Le droit d'accès — la seule question qui compte                     */
/* ------------------------------------------------------------------ */

/**
 * Un abonnement ouvre l'accès s'il est en essai, actif, ou en retard de
 * paiement mais dans sa période déjà payée.
 *
 * « Retard » ouvre encore : une carte qui expire n'est pas une fraude, et
 * couper l'accès d'un enfant au milieu d'une leçon pour un renouvellement
 * qui n'est pas passé serait une punition adressée à la mauvaise personne.
 * Stripe relance pendant plusieurs jours ; passé la période payée, l'accès
 * se referme de lui-même.
 */
function ouvre(a) {
  if (!a) return false
  if (a.statut === 'essai' || a.statut === 'actif') return true
  if (a.statut === 'retard' && a.periode_fin && new Date(a.periode_fin) > new Date()) return true
  return false
}

/**
 * L'accès d'un utilisateur : le sien, ou celui du pack famille qui l'a
 * invité. Renvoie de quoi expliquer la situation à l'écran, pas seulement
 * un booléen — « c'est le pack de Yamina » se dit mieux que « accès OK ».
 */
async function accesDe(userId) {
  const [propre] = await sql()`
    SELECT * FROM abonnements WHERE user_id = ${userId}`

  if (ouvre(propre)) {
    return { abonne: true, via: 'propre', abonnement: propre }
  }

  // Membre du pack famille de quelqu'un d'autre ?
  const [herite] = await sql()`
    SELECT a.*, u."name" AS proprietaire_nom
    FROM famille_membres f
    JOIN abonnements a ON a.user_id = f.proprietaire
    JOIN "user" u ON u.id = f.proprietaire
    WHERE f.membre = ${userId} AND f.joined_at IS NOT NULL AND a.plan = 'famille'
    LIMIT 1`

  if (ouvre(herite)) {
    return {
      abonne: true,
      via: 'famille',
      abonnement: propre || null,
      proprietaire: herite.proprietaire_nom || '',
    }
  }

  return { abonne: false, via: null, abonnement: propre || null }
}

/** Le pack famille du titulaire : places occupées, invitations en attente. */
async function familleDe(userId) {
  const lignes = await sql()`
    SELECT f.id, f.code, f.joined_at, u.id AS membre_id, u."name" AS membre_nom
    FROM famille_membres f
    LEFT JOIN "user" u ON u.id = f.membre
    WHERE f.proprietaire = ${userId}
    ORDER BY f.created_at`
  return {
    places: FAMILLE_INVITES,
    membres: lignes
      .filter((l) => l.joined_at)
      .map((l) => ({ id: Number(l.id), userId: l.membre_id, nom: l.membre_nom || '' })),
    invitations: lignes.filter((l) => !l.joined_at).map((l) => ({ id: Number(l.id), code: l.code })),
  }
}

/* ------------------------------------------------------------------ */
/* ?r=etat — ce que l'app demande à chaque ouverture                   */
/* ------------------------------------------------------------------ */

async function etat(req, res, session) {
  const zone = zoneDeLaRequete(req)
  const t = tarifsDe(zone)

  // Les tarifs se disent même sans compte : quelqu'un doit pouvoir savoir
  // combien ça coûte AVANT de créer quoi que ce soit.
  const base = {
    zone,
    zoneLibelle: t.libelle,
    tarifs: { solo: t.solo, famille: t.famille },
    essaiJours: ESSAI_JOURS,
    unitesLibres: UNITES_LIBRES,
    // Sans clé Stripe, l'app ne verrouille RIEN (voir src/lib/abonnement.js) :
    // une boutique fermée ne peut pas exiger de ticket.
    paiementOuvert: stripeReady(),
    // L'écran d'abonnement le dit en clair — on ne laisse personne croire
    // qu'il vient de payer alors qu'il était en mode test.
    modeTest: modeTest(),
  }

  if (!session) {
    return res.status(200).json({ ...base, connecte: false, abonne: !stripeReady() })
  }

  // En test, seuls les admins subissent le verrou (voir modeTest ci-dessus).
  const admin = isAdmin(session)
  const enRodage = modeTest() && !admin

  const acces = await accesDe(session.user.id)
  const a = acces.abonnement
  return res.status(200).json({
    ...base,
    connecte: true,
    // `admin` ne sert qu'à EXPLIQUER l'écran en mode test : sans lui, un
    // « tout est ouvert » inexpliqué laisse chercher pendant une heure si
    // la panne vient de Stripe, du webhook ou de la base — alors qu'il
    // manque juste une adresse dans ADMIN_EMAILS.
    admin,
    abonne: acces.abonne || !stripeReady() || enRodage,
    via: acces.via,
    proprietaire: acces.proprietaire || null,
    statut: a?.statut || 'aucun',
    plan: a?.plan || null,
    // La zone GRAVÉE à la souscription prime sur celle d'aujourd'hui : un
    // abonné en voyage garde son tarif.
    zoneAbonnement: a?.zone || null,
    periodeFin: a?.periode_fin || null,
    annuleALaFin: !!a?.annule_a_la_fin,
    famille: a?.plan === 'famille' ? await familleDe(session.user.id) : null,
  })
}

/* ------------------------------------------------------------------ */
/* ?r=checkout — le passage en caisse                                  */
/* ------------------------------------------------------------------ */

async function checkout(req, res, session) {
  if (!stripeReady()) return res.status(503).json({ error: 'paiement non configuré' })
  const { plan } = await lireJson(req)
  // `Object.hasOwn` et pas `PLANS[plan]` : sans cela, un plan nommé
  // « constructor » passerait la garde (il vient d'Object.prototype).
  if (typeof plan !== 'string' || !Object.hasOwn(PLANS, plan)) {
    return res.status(400).json({ error: 'plan inconnu' })
  }

  const userId = session.user.id
  const acces = await accesDe(userId)
  if (acces.abonne) return res.status(409).json({ error: 'deja abonne' })

  const zone = zoneDeLaRequete(req)
  const price = priceId(plan, zone)
  if (!price) {
    console.error(`[tama] Price Stripe manquant pour ${plan}/${zone} — voir .env.example`)
    return res.status(503).json({ error: 'tarif non configuré' })
  }

  // On refuse d'ouvrir la caisse plutôt que de débiter un montant qui ne
  // correspond pas à ce qui vient d'être affiché. Un abonnement en moins se
  // rattrape ; un débit surprise, non.
  const souci = await priceConforme(price, plan, zone)
  if (souci) {
    console.error(`[tama] TARIF INCOHÉRENT, caisse refusée — ${souci}`)
    // Le détail ne sort QU'EN MODE TEST : en production, il dirait à un
    // inconnu comment notre facturation est configurée.
    return res.status(503).json({ error: 'tarif non configuré', ...(modeTest() ? { detail: souci } : {}) })
  }

  // Un seul client Stripe par compte, réutilisé : sans cela, chaque tentative
  // de paiement créerait un doublon et l'historique de facturation de la
  // personne se retrouverait éparpillé sur plusieurs fiches.
  let customer = acces.abonnement?.stripe_customer || null
  if (!customer) {
    const c = await stripe('customers', {
      data: {
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { userId, app: 'tama-speak' },
      },
      idempotency: `cust-${userId}`,
    })
    customer = c.id
    await sql()`
      INSERT INTO abonnements (user_id, stripe_customer, zone, updated_at)
      VALUES (${userId}, ${customer}, ${zone}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET stripe_customer = ${customer}, updated_at = NOW()`
  }

  const s = await stripe('checkout/sessions', {
    data: {
      mode: 'subscription',
      customer,
      line_items: [{ price, quantity: 1 }],
      // `payment_method_types` est VOLONTAIREMENT absent : Stripe propose
      // alors tout ce qui est activé dans le tableau de bord et pertinent
      // pour le pays et l'appareil — carte, Apple Pay, Google Pay, Link, et
      // les moyens locaux (SEPA, iDEAL, Bancontact, Blik…). Le figer ici
      // reviendrait à devoir redéployer pour accepter un nouveau moyen de
      // paiement ; laissé ouvert, cela se coche chez Stripe en dix secondes.
      // Apple Pay et Google Pay n'apparaissent que sur une page servie en
      // HTTPS avec le domaine vérifié chez Stripe (voir README).
      locale: 'fr',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: { address: 'auto', name: 'auto' },
      client_reference_id: userId,
      subscription_data: {
        trial_period_days: ESSAI_JOURS,
        metadata: { userId, plan, zone },
      },
      metadata: { userId, plan, zone },
      success_url: `${APP_URL}/?abonnement=ok`,
      cancel_url: `${APP_URL}/?abonnement=annule`,
      ...(process.env.STRIPE_TVA_AUTO === '1' ? { automatic_tax: { enabled: true } } : {}),
    },
    // Idempotence à la SECONDE près : un double clic ne fabrique pas deux
    // sessions, mais réessayer une minute plus tard reste possible (sinon
    // Stripe renverrait éternellement la première session, expirée).
    idempotency: `co-${userId}-${plan}-${Math.floor(Date.now() / 1000)}`,
  })

  // On note le passage en caisse : si le webhook tardait, l'app saurait
  // déjà que quelque chose est en cours plutôt que d'afficher « pas abonné ».
  await sql()`
    UPDATE abonnements
       SET statut = CASE WHEN statut = 'aucun' THEN 'attente' ELSE statut END,
           plan = COALESCE(plan, ${plan}), zone = ${zone}, updated_at = NOW()
     WHERE user_id = ${userId}`

  return res.status(200).json({ url: s.url })
}

/* ------------------------------------------------------------------ */
/* ?r=portail — résilier, changer de carte, voir ses factures          */
/* ------------------------------------------------------------------ */

/**
 * Tout se gère chez Stripe : résiliation en un clic, moyen de paiement,
 * historique de factures. On n'écrit pas notre propre page de résiliation —
 * elle serait moins complète, et une résiliation difficile est un litige
 * bancaire qui s'annonce.
 */
async function portail(req, res, session) {
  if (!stripeReady()) return res.status(503).json({ error: 'paiement non configuré' })
  const [a] = await sql()`
    SELECT stripe_customer FROM abonnements WHERE user_id = ${session.user.id}`
  if (!a?.stripe_customer) return res.status(404).json({ error: 'aucun abonnement' })

  const s = await stripe('billing_portal/sessions', {
    data: {
      customer: a.stripe_customer,
      return_url: `${APP_URL}/?abonnement=retour`,
      locale: 'fr',
    },
  })
  return res.status(200).json({ url: s.url })
}

/* ------------------------------------------------------------------ */
/* ?r=famille — les trois places du pack                               */
/* ------------------------------------------------------------------ */

async function famille(req, res, session) {
  const me = session.user.id
  const { action, code, id } = await lireJson(req)

  if (action === 'inviter') {
    const [a] = await sql()`SELECT plan FROM abonnements WHERE user_id = ${me}`
    const acces = await accesDe(me)
    if (a?.plan !== 'famille' || !acces.abonne || acces.via !== 'propre') {
      return res.status(403).json({ error: 'pack famille requis' })
    }
    const [{ n }] = await sql()`
      SELECT COUNT(*)::int AS n FROM famille_membres WHERE proprietaire = ${me}`
    if (n >= FAMILLE_INVITES) return res.status(409).json({ error: 'places complètes' })

    const nouveau = codeCourt()
    await sql()`
      INSERT INTO famille_membres (proprietaire, code) VALUES (${me}, ${nouveau})`
    return res.status(200).json({ ok: true, code: nouveau })
  }

  if (action === 'rejoindre') {
    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'code manquant' })
    }
    const [invitation] = await sql()`
      SELECT f.id, f.proprietaire, f.membre, u."name" AS nom
      FROM famille_membres f JOIN "user" u ON u.id = f.proprietaire
      WHERE f.code = ${code.trim().toLowerCase()}`
    if (!invitation) return res.status(404).json({ error: 'code inconnu' })
    if (invitation.membre) return res.status(409).json({ error: 'code deja utilise' })
    if (invitation.proprietaire === me) return res.status(400).json({ error: 'c est ton propre pack' })

    // Une place ne s'attribue que si le pack est réellement ouvert : sinon
    // un code périmé donnerait un accès fantôme.
    const acces = await accesDe(invitation.proprietaire)
    if (!acces.abonne) return res.status(409).json({ error: 'pack inactif' })

    // L'index unique sur `membre` empêche d'appartenir à deux packs ; on le
    // dit clairement plutôt que de laisser remonter une erreur Postgres.
    const [deja] = await sql()`
      SELECT id FROM famille_membres WHERE membre = ${me}`
    if (deja) return res.status(409).json({ error: 'deja dans un pack' })

    await sql()`
      UPDATE famille_membres SET membre = ${me}, joined_at = NOW()
       WHERE id = ${invitation.id} AND membre IS NULL`
    await sql()`
      INSERT INTO notifications (user_id, kind, title, body)
      VALUES (${invitation.proprietaire}, 'cercle', 'Une place de ton pack famille est prise',
              ${`${session.user.name || 'Quelqu’un'} a rejoint ton abonnement famille.`})`
    return res.status(200).json({ ok: true, avec: invitation.nom || '' })
  }

  if (action === 'retirer') {
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalide' })
    // On ne fait JAMAIS confiance à l'id envoyé : la clause `proprietaire`
    // est ce qui empêche de vider le pack de quelqu'un d'autre.
    const lignes = await sql()`
      DELETE FROM famille_membres WHERE id = ${id} AND proprietaire = ${me} RETURNING id`
    if (!lignes.length) return res.status(404).json({ error: 'introuvable' })
    return res.status(200).json({ ok: true })
  }

  // Quitter un pack dont on est membre — sans passer par le titulaire.
  if (action === 'quitter') {
    await sql()`DELETE FROM famille_membres WHERE membre = ${me}`
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'action inconnue' })
}

/* ------------------------------------------------------------------ */
/* ?r=webhook — Stripe raconte ce qui s'est passé                      */
/* ------------------------------------------------------------------ */

/** Écrit (ou met à jour) l'abonnement d'un utilisateur d'après un objet Stripe. */
async function enregistrerAbonnement(sub) {
  const priceStripe = sub.items?.data?.[0]?.price?.id || null
  const dePrice = planDuPrice(priceStripe)
  // metadata d'abord (posée à la création), Price ensuite : si quelqu'un
  // change de formule depuis le portail Stripe, c'est le Price qui dit vrai.
  const plan = dePrice.plan || sub.metadata?.plan || null
  const zone = dePrice.zone || sub.metadata?.zone || null

  let userId = sub.metadata?.userId || null
  if (!userId) {
    const [ligne] = await sql()`
      SELECT user_id FROM abonnements WHERE stripe_customer = ${sub.customer}`
    userId = ligne?.user_id || null
  }
  if (!userId) {
    console.error(`[tama] abonnement ${sub.id} sans utilisateur connu (client ${sub.customer})`)
    return
  }

  const statut = statutDepuisStripe(sub.status)
  // `current_period_end` vit sur l'abonnement ou, depuis les versions
  // récentes de l'API, sur la ligne d'abonnement — on lit les deux.
  const finSec = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null
  const fin = finSec ? new Date(finSec * 1000).toISOString() : null

  await sql()`
    INSERT INTO abonnements (user_id, stripe_customer, stripe_subscription, plan, zone,
                             statut, periode_fin, annule_a_la_fin, updated_at)
    VALUES (${userId}, ${sub.customer}, ${sub.id}, ${plan}, ${zone},
            ${statut}, ${fin}, ${!!sub.cancel_at_period_end}, NOW())
    ON CONFLICT (user_id) DO UPDATE
      SET stripe_customer = ${sub.customer},
          stripe_subscription = ${sub.id},
          plan = COALESCE(${plan}, abonnements.plan),
          zone = COALESCE(${zone}, abonnements.zone),
          statut = ${statut},
          periode_fin = ${fin},
          annule_a_la_fin = ${!!sub.cancel_at_period_end},
          updated_at = NOW()`

  // Un pack famille redevenu « solo » ou éteint ne doit pas continuer à
  // ouvrir l'accès à trois autres personnes : les places sont libérées.
  if (plan !== 'famille' || statut === 'annule') {
    await sql()`DELETE FROM famille_membres WHERE proprietaire = ${userId}`
  }
}

async function webhook(req, res) {
  const secret = webhookSecret()
  if (!secret || !stripeReady()) return res.status(503).json({ error: 'webhook non configuré' })

  const brut = await lireCorps(req)
  const ev = evenementVerifie(brut, req.headers['stripe-signature'], secret)
  if (!ev) {
    // 400 volontaire : Stripe réessaiera, et une signature invalide doit
    // rester bruyante dans les journaux — c'est le seul signal d'une URL
    // de webhook qui fuite ou d'un secret désynchronisé.
    console.error('[tama] webhook Stripe à signature invalide — rejeté')
    return res.status(400).json({ error: 'signature invalide' })
  }

  // Le monde de l'événement doit être LE NÔTRE. Les deux points de
  // terminaison (test et réel) visent la même URL ; si les secrets venaient
  // à se croiser, un événement de test pourrait toucher un abonnement réel.
  // On acquitte sans rien faire plutôt que de réessayer en boucle.
  if (ev.livemode === modeTest()) {
    console.error(
      `[tama] webhook ignoré : événement ${ev.livemode ? 'réel' : 'de test'} reçu ` +
        `alors que la clé est en mode ${modeTest() ? 'test' : 'réel'}`,
    )
    return res.status(200).json({ ok: true, ignore: 'mode' })
  }

  // Anti-rejeu : Stripe garantit « au moins une fois », pas « exactement une
  // fois ». Le premier passage insère ; les suivants ne renvoient rien.
  const vu = await sql()`
    INSERT INTO stripe_events (id, type) VALUES (${ev.id}, ${ev.type})
    ON CONFLICT (id) DO NOTHING RETURNING id`
  if (!vu.length) return res.status(200).json({ ok: true, deja: true })

  try {
    switch (ev.type) {
      case 'checkout.session.completed': {
        const s = ev.data.object
        const userId = s.client_reference_id || s.metadata?.userId || null
        if (userId && s.customer) {
          await sql()`
            INSERT INTO abonnements (user_id, stripe_customer, plan, zone, statut, updated_at)
            VALUES (${userId}, ${s.customer}, ${s.metadata?.plan || null},
                    ${s.metadata?.zone || null}, 'attente', NOW())
            ON CONFLICT (user_id) DO UPDATE SET stripe_customer = ${s.customer}, updated_at = NOW()`
        }
        // Le détail (statut réel, fin de période) arrive avec l'abonnement
        // lui-même : on va le chercher plutôt que de deviner.
        if (s.subscription) {
          const sub = await stripe(`subscriptions/${s.subscription}`, { method: 'GET' })
          await enregistrerAbonnement(sub)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.trial_will_end':
        await enregistrerAbonnement(ev.data.object)
        break

      case 'invoice.paid':
      case 'invoice.payment_failed': {
        // La facture ne porte pas l'état de l'abonnement : on relit la source.
        const inv = ev.data.object
        const subId = inv.subscription || inv.parent?.subscription_details?.subscription || null
        if (subId) {
          const sub = await stripe(`subscriptions/${subId}`, { method: 'GET' })
          await enregistrerAbonnement(sub)
        }
        break
      }

      default:
        // Les autres événements ne nous concernent pas — on les acquitte
        // quand même : un 4xx ferait réessayer Stripe indéfiniment.
        break
    }
  } catch (e) {
    // On efface la trace d'idempotence : l'événement n'a PAS été traité, il
    // faut que le réessai de Stripe puisse le rejouer pour de bon.
    await sql()`DELETE FROM stripe_events WHERE id = ${ev.id}`.catch(() => {})
    console.error(`[tama] webhook ${ev.type} en échec :`, e?.message)
    return res.status(500).json({ error: 'traitement en échec' })
  }

  return res.status(200).json({ ok: true })
}

/* ------------------------------------------------------------------ */

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  await assurerSchema()
  const r = routeDe(req)

  // Le webhook vient de Stripe, pas d'un navigateur : ni session, ni cookie.
  if (r === 'webhook') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'méthode non autorisée' })
    return webhook(req, res)
  }

  const session = await sessionOf(req)

  // L'état se lit sans compte : les tarifs doivent être visibles avant de
  // s'inscrire. Tout le reste est nominatif.
  if (r === 'etat') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'méthode non autorisée' })
    return etat(req, res, session)
  }

  if (!session) return res.status(401).json({ error: 'non connecté' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'méthode non autorisée' })

  try {
    if (r === 'checkout') return await checkout(req, res, session)
    if (r === 'portail') return await portail(req, res, session)
    if (r === 'famille') return await famille(req, res, session)
  } catch (e) {
    // Une panne Stripe ne doit pas ressembler à un refus : le message part
    // dans les journaux, l'app affiche « réessaie », rien n'est débité.
    console.error(`[tama] billing ?r=${r} :`, e?.message, e?.stripe || '')
    return res.status(502).json({
      error: 'paiement indisponible',
      // Même règle qu'au-dessus : le message brut de Stripe (« No such
      // price: … ») est un cadeau pendant la mise en route, et une fuite
      // d'information une fois en production.
      ...(modeTest() ? { detail: e?.message || String(e) } : {}),
    })
  }

  return res.status(404).json({ error: 'route inconnue' })
}
