/**
 * Désabonnement en un clic — RFC 8058, exigée par Gmail et Yahoo.
 *
 *   • POST : le clic « se désabonner » DANS le client mail (Gmail l'envoie
 *     lui-même, sans ouvrir de page). Doit répondre 200 sans rien demander.
 *   • GET : le lien visible en pied d'email → petite page de confirmation.
 *
 * Aucune connexion requise : exiger de se connecter pour se désabonner est
 * exactement ce qui transforme un désabonnement en plainte spam — et Resend
 * suspend à 0,08 % de plaintes. On coupe d'abord, on pose des questions
 * jamais.
 */
import { serverReady, notConfigured, sql } from './_lib/db.js'

async function couper(email) {
  await sql()`
    INSERT INTO email_prefs (user_id, relances, resume_hebdo, unsubscribed_at)
    SELECT id, FALSE, FALSE, NOW() FROM "user" WHERE "email" = ${email}
    ON CONFLICT (user_id) DO UPDATE
      SET relances = FALSE, resume_hebdo = FALSE, unsubscribed_at = NOW(), updated_at = NOW()`
}

export default async function handler(req, res) {
  if (!serverReady()) return notConfigured(res)
  const email = String(req.query?.email || req.body?.email || '').trim().toLowerCase()
  // Email absent ou inconnu : on répond quand même 200 — un endpoint de
  // désabonnement ne doit jamais servir à tester quelles adresses existent.
  if (email) await couper(email)

  if (req.method === 'POST') return res.status(200).json({ ok: true })

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.status(200).send(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Désabonné — Tama Speak</title></head>
<body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#FDF8EF;font-family:'Segoe UI',system-ui,sans-serif;color:#1E2530;">
  <div style="text-align:center;padding:24px;max-width:360px;">
    <p style="font-size:40px;margin:0;">🌿</p>
    <h1 style="font-size:20px;margin:8px 0;">C’est fait.</h1>
    <p style="font-size:14px;color:#5C6672;line-height:1.5;">
      Tu ne recevras plus d’emails de Tama Speak. L’app, elle, continue de
      fonctionner exactement pareil — et tu peux réactiver les emails à tout
      moment depuis ton profil.
    </p>
  </div>
</body></html>`)
}
