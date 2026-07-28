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
    }
  }

  _auth = betterAuth({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || 'https://tamaspeak.com',
    // Pas d'emailAndPassword : lien magique et Google seulement.
    socialProviders: social,
    // Suppression de compte en libre-service — engagement RGPD : la purge
    // en base suit par cascade (voir db/schema.sql), sans intervention.
    user: { deleteUser: { enabled: true } },
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
  } catch {
    return null
  }
}

/** L'admin est une liste d'emails dans ADMIN_EMAILS (séparés par virgules). */
export function isAdmin(session) {
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return !!session?.user?.email && list.includes(session.user.email.toLowerCase())
}
