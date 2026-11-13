/**
 * Better Auth — la configuration, unique pour toutes les fonctions.
 *
 * Pourquoi Better Auth : il tourne dans des fonctions Vercel avec une SPA
 * Vite (pas de framework serveur), range ses tables DANS Neon (aucune donnée
 * utilisateur chez un tiers — revue RGPD), et couvre lien magique + Google
 * sans palier payant ni verrouillage.
 *
 * Modes de connexion :
 *   • CODE À 6 CHIFFRES par email — le mode principal. Un lien cliqué dans
 *    Gmail ouvre toujours le NAVIGATEUR, jamais la PWA installée ; sur
 *    iPhone, la PWA a même un stockage séparé de Safari — l'utilisateur se
 *    retrouvait connecté dans Safari et « à zéro » dans l'app. Un code se
 *    tape DANS l'app : on n'en sort jamais.
 *   • lien magique conservé (utile sur ordinateur, où le contexte ne change
 *     pas) ; • Google ; • jamais de mot de passe.
 * Sans RESEND_API_KEY, codes et liens s'écrivent dans les logs Vercel.
 *
 * L'instance est créée PARESSEUSEMENT : sans DATABASE_URL le module se
 * charge sans rien initialiser, et l'endpoint répond 503 (voir db.js).
 */
import { randomInt } from 'node:crypto'
import { betterAuth } from 'better-auth'
import { magicLink, emailOTP } from 'better-auth/plugins'
import { Pool } from '@neondatabase/serverless'
import { sendEmail } from './email.js'

let _auth = null

export function auth() {
  if (_auth) return _auth

  const social = {}
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    social.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Sans ceci, Google resélectionne SILENCIEUSEMENT le dernier compte :
      // impossible d'en changer, et la déconnexion semble « ne pas marcher »
      // (on se retrouve reconnecté au même compte au clic suivant).
      prompt: 'select_account',
    }
  }

  _auth = betterAuth({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || 'https://tamaspeak.com',
    // Vécu en prod (« Invalid origin: https://tamaspeak.vercel.app ») : les
    // PWA installées AVANT le branchement du domaine vivent encore sur
    // l'adresse Vercel, et toute connexion en était rejetée. On accepte les
    // deux anciennes formes le temps que la redirection (vercel.json) ramène
    // tout le monde sur tamaspeak.com.
    trustedOrigins: ['https://tamaspeak.vercel.app', 'https://www.tamaspeak.com'],
    // Pas d'emailAndPassword : lien magique et Google seulement.
    socialProviders: social,
    // Suppression de compte en libre-service — engagement RGPD : la purge
    // en base suit par cascade (voir db/schema.sql), sans intervention.
    // Nos comptes sont SANS mot de passe : Better Auth exige alors une
    // confirmation par email avant d'effacer — c'est le circuit branché ici
    // (sans lui, « Supprimer mon compte » échouait en silence). Bonus
    // sécurité réel : un téléphone volé ne peut pas effacer le compte.
    user: {
      deleteUser: {
        enabled: true,
        /**
         * UN CODE, PAS UN LIEN — et c'est tout le sujet.
         *
         * Le point d'arrivée du lien de Better Auth exige une session dans le
         * navigateur qui l'ouvre ; sans elle il répond « Failed to get user
         * info ». Or un lien reçu par email n'atterrit presque jamais dans le
         * bon contexte : les applications de messagerie ouvrent les liens
         * dans LEUR navigateur intégré, et sur iOS une PWA installée a un
         * stockage séparé de Safari. La confirmation échouait donc pile pour
         * les gens qui utilisent l'app comme elle est faite pour l'être.
         *
         * Même piège, même remède que pour la connexion : LE CODE SE TAPE
         * DANS L'APP, ON N'EN SORT JAMAIS. L'app garde sa session, l'email
         * prouve la boîte, et le jeton ne quitte jamais le serveur.
         */
        sendDeleteAccountVerification: async ({ user, url, token }) => {
          const code = await poserCodeSuppression(user.id, token)
          const ok = await sendEmail({
            to: user.email,
            subject: `${code} — confirme la suppression de ton compte Tama Speak`,
            template: 'confirmer-suppression',
            data: { name: user.name, code },
          })
          if (!ok) {
            // Vécu par Selim : l'email refusé (quota) laissait l'app dire
            // « email envoyé » — un mensonge sur un droit RGPD. On échoue
            // FRANCHEMENT : le client affichera « réessaie », pas « vérifie
            // ta boîte ». Le code reste en log pour un dépannage manuel ;
            // le lien aussi, il dépanne encore depuis le bon navigateur.
            console.log(`[tama] code de suppression pour ${user.email} : ${code} (lien : ${url})`)
            throw new Error('email de confirmation refusé (quota ou panne Resend)')
          }
        },
        /**
         * AVANT d'effacer : arrêter l'abonnement Stripe.
         *
         * La cascade SQL fait disparaître la ligne `abonnements`, donc le
         * lien vers Stripe — et l'abonnement, lui, continuerait de débiter
         * une carte pour un compte qui n'existe plus, sans que personne
         * puisse encore le résilier depuis l'app. C'est le pire scénario de
         * facturation qui soit ; il se règle ici, tant que la ligne existe.
         *
         * Résiliation IMMÉDIATE et non « à la fin de la période » : la
         * personne a demandé l'effacement, pas un préavis.
         */
        beforeDelete: async (user) => {
          try {
            const { serverReady, sql } = await import('./db.js')
            const { stripe, stripeReady } = await import('./stripe.js')
            if (!serverReady() || !stripeReady()) return
            const [a] = await sql()`
              SELECT stripe_subscription FROM abonnements WHERE user_id = ${user.id}`
            if (a?.stripe_subscription) {
              await stripe(`subscriptions/${a.stripe_subscription}`, { method: 'DELETE' })
            }
          } catch (e) {
            // On ne BLOQUE PAS la suppression du compte pour autant : le
            // droit à l'effacement prime. L'échec est bruyant dans les
            // journaux pour être rattrapé à la main chez Stripe.
            console.error('[tama] résiliation Stripe avant suppression :', e?.message)
          }
        },
        afterDelete: async (user) => {
          // La cascade SQL purge les tables liées ; le compteur de quota est
          // hors cascade (clé = email, pas user_id) — on le purge ici, même
          // exigence RGPD que le reste.
          try {
            const { sql } = await import('./db.js')
            await sql()`DELETE FROM email_quota WHERE email = ${user.email.toLowerCase()}`
          } catch (e) {
            console.error('[tama] purge email_quota après suppression :', e?.message)
          }
        },
      },
    },
    // Audit : 7 jours de session (défaut) forcent un public à usage
    // épisodique à se reconnecter sans cesse — 60 jours glissants, c'est
    // une app d'apprentissage, pas une banque. Le cache de cookie évite un
    // aller-retour Neon à chaque getSession (latence à froid, CU-heures).
    session: {
      expiresIn: 60 * 60 * 24 * 60,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 300 },
    },
    telemetry: { enabled: false },
    // LIAISON DES COMPTES. Sans ceci, quelqu'un qui s'est déjà connecté par
    // code email puis essaie Google avec LA MÊME adresse est refusé
    // (account_not_linked) — vécu : « je choisis mon compte Gmail puis
    // rien ». Google vérifie l'email de ses comptes : la liaison est sûre,
    // c'est le même titulaire.
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },
    // Limiteur de débit DÉSACTIVÉ — décision assumée après DEUX pannes pour
    // zéro attaque : « Google injoignable » au 2ᵉ clic (règle par défaut),
    // puis « connexion bloquée après quelques tentatives » malgré des seuils
    // relevés. Son stockage en mémoire d'instance serverless le rend
    // imprévisible : les compteurs vivent et meurent avec les instances,
    // deux utilisateurs partagent parfois le même compteur.
    // Le risque couvert était faible : pas de mots de passe à forcer, les
    // codes OTP ont leur propre limite de tentatives, les liens magiques
    // sont à usage unique. Le seul enjeu réel — le quota Resend (100
    // emails/jour) — sera protégé par un garde-fou applicatif dédié, pas
    // par un limiteur générique qui bloque les vrais utilisateurs.
    rateLimit: { enabled: false },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const ok = await sendEmail({
            to: email,
            subject: 'Ton lien de connexion Tama Speak',
            template: 'magic-link',
            data: { url },
          })
          // Sans clé Resend (dev, préversion) : le lien va dans les logs
          // Vercel — on peut se connecter sans aucun service email.
          if (!ok) console.log(`[tama] lien magique pour ${email} : ${url}`)
        },
        expiresIn: 600, // 10 minutes
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 600,
        // Audit : 3 essais (défaut) puis code invalidé EN SILENCE — un
        // enfant qui tape mal trois fois voit ensuite « code invalide »
        // même avec le bon code. Cinq essais, et le client explique.
        allowedAttempts: 5,
        sendVerificationOTP: async ({ email, otp }) => {
          const ok = await sendEmail({
            to: email,
            // Le code dans l'objet : lisible depuis la bannière de
            // notification, sans même ouvrir l'email.
            subject: `${otp} — ton code Tama Speak`,
            template: 'code-otp',
            data: { otp },
          })
          if (!ok) console.log(`[tama] code pour ${email} : ${otp}`)
        },
      }),
    ],
  })
  return _auth
}

/** Session de la requête entrante (ou null). */
export async function sessionOf(req) {
  try {
    const headers = new Headers()
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v)
    }
    const s = await auth().api.getSession({ headers })
    return s?.user ? s : null
  } catch (e) {
    // Audit : avaler l'erreur déguisait une panne de base en « utilisateur
    // déconnecté ». On répond toujours null (l'appelant fera son 401), mais
    // la panne est désormais VISIBLE dans les journaux.
    console.error('[tama] sessionOf en échec — panne technique, pas une déconnexion :', e?.message || e)
    return null
  }
}

/* ------------------------------------------------------------------ */
/* Le pont code ↔ jeton de suppression                                 */
/*                                                                      */
/* Le jeton de Better Auth fait 32 caractères : illisible au téléphone, */
/* et personne ne le recopie sans faute. On envoie donc SIX CHIFFRES —  */
/* la même forme que le code de connexion, déjà familière — et on garde */
/* la correspondance ici. Le jeton, lui, ne quitte jamais le serveur.    */
/* ------------------------------------------------------------------ */

/** Six chiffres, tirés du générateur cryptographique — pas de Math.random. */
const codeSixChiffres = () => String(randomInt(0, 1_000_000)).padStart(6, '0')

/**
 * Range le code et son jeton, et RETIRE le précédent : un code lu dans un
 * vieil email ne doit pas effacer un compte que son propriétaire a
 * entre-temps décidé de garder.
 */
export async function poserCodeSuppression(userId, token) {
  const { sql, assurerSchema } = await import('./db.js')
  await assurerSchema()
  const code = codeSixChiffres()
  await sql()`DELETE FROM suppression_codes WHERE user_id = ${userId}`
  await sql()`
    INSERT INTO suppression_codes (code, token, user_id, expires_at)
    VALUES (${code}, ${token}, ${userId}, NOW() + INTERVAL '1 hour')`
  return code
}

/**
 * Le jeton correspondant à un code, pour CETTE personne — ou null.
 *
 * Le code est lié au compte connecté : sans cela, quelqu'un qui a reçu un
 * code pour son propre compte pourrait tenter de le jouer contre un autre.
 * Il est consommé à la lecture (un code ne sert qu'une fois).
 */
export async function consommerCodeSuppression(userId, code) {
  const { sql } = await import('./db.js')
  const [ligne] = await sql()`
    DELETE FROM suppression_codes
    WHERE user_id = ${userId} AND code = ${String(code).trim()} AND expires_at > NOW()
    RETURNING token`
  return ligne?.token || null
}

/** L'admin est une liste d'emails dans ADMIN_EMAILS (séparés par virgules). */
export function isAdmin(session) {
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return !!session?.user?.email && list.includes(session.user.email.toLowerCase())
}
