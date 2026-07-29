/**
 * Diagnostic du serveur — chaque sous-système est sondé séparément, pour
 * qu'une panne dise OÙ elle est au lieu d'un FUNCTION_INVOCATION_FAILED
 * opaque (on n'a pas toujours les logs Vercel sous la main).
 *
 * Ne révèle AUCUN secret : uniquement des booléens de présence et des
 * messages d'erreur tronqués, sans valeurs de connexion.
 */
export default async function handler(req, res) {
  const out = { node: process.version, env: {}, steps: {} }
  const step = (name, fn) =>
    Promise.resolve()
      .then(fn)
      .then(() => {
        out.steps[name] = 'ok'
      })
      .catch((e) => {
        out.steps[name] = `ERREUR: ${String(e?.message || e).slice(0, 180)}`
      })

  for (const k of ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'GOOGLE_CLIENT_ID', 'RESEND_API_KEY', 'ADMIN_EMAILS'])
    out.env[k] = !!process.env[k]
  // La VALEUR de l'URL de base n'est pas un secret (c'est l'adresse publique
  // de l'app) et un écart avec le domaine réel casse les cookies de session
  // — le symptôme est une reconnexion en boucle.
  out.env.BETTER_AUTH_URL_VALUE = process.env.BETTER_AUTH_URL || '(défaut)'

  await step('import-neon', () => import('@neondatabase/serverless'))
  await step('import-better-auth', () => import('better-auth'))
  await step('import-better-auth-node', () => import('better-auth/node'))
  await step('import-lib-db', () => import('./_lib/db.js'))
  await step('import-lib-auth', () => import('./_lib/auth.js'))

  await step('db-ping', async () => {
    const { serverReady, sql } = await import('./_lib/db.js')
    if (!serverReady()) throw new Error('DATABASE_URL absente')
    await sql()`SELECT 1`
  })

  await step('auth-init', async () => {
    const { auth } = await import('./_lib/auth.js')
    auth()
  })

  await step('auth-session', async () => {
    const { sessionOf } = await import('./_lib/auth.js')
    await sessionOf(req)
  })

  // Le secret Google est-il VALIDE ? Le sélecteur de comptes n'utilise que
  // l'identifiant public — un secret faux ne casse qu'à l'échange final du
  // code, précisément le symptôme « je choisis mon compte puis rien ».
  // Astuce : un échange avec un code bidon répond `invalid_grant` si le
  // couple id/secret est BON, `invalid_client` s'il est MAUVAIS. Aucun
  // secret n'est exposé — seule la classe d'erreur de Google remonte.
  await step('google-secret', async () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      throw new Error('identifiants Google absents')
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: 'code-bidon-diagnostic',
        grant_type: 'authorization_code',
        redirect_uri: (process.env.BETTER_AUTH_URL || 'https://tamaspeak.com') + '/api/auth/callback/google',
      }),
    })
    const d = await r.json()
    if (d.error === 'invalid_client') throw new Error('SECRET GOOGLE INVALIDE (invalid_client)')
    if (d.error !== 'invalid_grant') throw new Error(`réponse inattendue : ${d.error}`)
    // invalid_grant = le code bidon est refusé mais le couple id/secret est bon.
  })

  // Le paquet resend est-il réellement embarqué dans le bundle Vercel ?
  // (import dynamique : le traceur peut le manquer)
  await step('import-resend', () => import('resend'))

  // Déclenche le VRAI flux du lien magique côté serveur (écriture du jeton
  // en base + envoi d'email) vers une adresse de test — c'est la sonde qui
  // dit pourquoi /sign-in/magic-link répond 500 corps vide.
  await step('magic-link-dry', async () => {
    const { auth } = await import('./_lib/auth.js')
    await auth().api.signInMagicLink({
      body: { email: 'delivered@resend.dev', callbackURL: '/' },
      headers: new Headers({ origin: process.env.BETTER_AUTH_URL || 'https://tamaspeak.com' }),
    })
  })

  res.status(200).json(out)
}
