# Mise en route du serveur

L'app fonctionne **sans rien de tout ceci** — le serveur n'ajoute que les
comptes, la synchronisation, le feedback et l'admin. Ordre de branchement :

## 1. Neon (la base)

1. [neon.tech](https://neon.tech) → créer un projet, région **eu-central-1
   (Francfort)** — choix RGPD : le public est majoritairement en UE.
2. Dans l'éditeur SQL de Neon, coller et exécuter `db/schema.sql`.
3. Copier la **pooled connection string** → variable Vercel `DATABASE_URL`.
4. Générer un secret : `openssl rand -base64 32` → `BETTER_AUTH_SECRET`,
   et poser `BETTER_AUTH_URL=https://tamaspeak.com`.

Dès ce moment : lien magique opérationnel (le lien s'écrit dans les logs
Vercel tant que Resend n'est pas branché), sync et feedback actifs.

⚠️ Le schéma des tables d'auth suit la version de Better Auth installée :
en cas d'écart au premier déploiement, `npx @better-auth/cli generate`
produit le SQL exact — comparer avec `schema.sql` et ajuster.

## 2. Google (« Continuer avec Google »)

[console.cloud.google.com](https://console.cloud.google.com) → Credentials →
OAuth client ID (Web) → redirect URI :
`https://tamaspeak.com/api/auth/callback/google`
→ `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`.

## 3. Resend (les emails)

1. Il faut un **domaine à soi** (Resend n'a pas de domaine partagé).
2. resend.com → Domains → ajouter un **sous-domaine d'envoi**
   (`send.tamaspeak.com`) → poser les enregistrements SPF/DKIM proposés.
3. Ajouter un DMARC de départ : TXT `_dmarc` → `v=DMARC1; p=none;`.
4. `RESEND_API_KEY` + `EMAIL_FROM=Tama Speak <bonjour@send.tamaspeak.com>`.

Limites du palier gratuit (vérifiées le 27/07/2026) : 3 000 emails/mois
**et 100/jour** — le plafond journalier tombe en premier.

## 4. Admin

`ADMIN_EMAILS=selim@…` (plusieurs adresses séparées par des virgules).
L'écran admin n'apparaît dans l'app que pour un compte connecté dont
l'email figure dans cette liste.

## Ce que le serveur ne fait pas (et ne doit pas faire)

- Décider de la progression : la fusion se fait côté client, par maximum
  et union — on ne perd jamais la progression locale (`mergeStores`,
  `src/lib/progress.js`).
- Collecter plus que nécessaire : les événements sont `type + langue + XP
  + date`, rien d'autre. Aucun champ d'origine, aucune localisation.
- Conditionner l'app : chaque endpoint répond 503 sans `DATABASE_URL`, et
  le client traite ce 503 comme « mode local », pas comme une panne.
