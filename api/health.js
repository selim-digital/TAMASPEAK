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

  res.status(200).json(out)
}
