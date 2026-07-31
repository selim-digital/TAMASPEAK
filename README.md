# Tama Speak — ⵣ apprends les langues amazighes

Application web (PWA) d'apprentissage des langues amazighes, dans l'esprit de
Duolingo : un chemin de leçons, des exercices courts, une mascotte qui
encourage, et un design tiré des **bijoux d'argent émaillé d'Ath Yenni**.

Cinq cours indépendants — on peut en suivre plusieurs en parallèle, chacun
gardant sa propre progression :

| Cours | Autonyme | Région | Contenu |
| --- | --- | --- | --- |
| Kabyle | Taqbaylit | Kabylie · Algérie | 10 unités, 35 leçons |
| Tachelhit | Tacelḥit | Souss & Anti-Atlas · Maroc | 2 unités, 9 leçons |
| Tarifit | Tarifit | Rif · Maroc | 2 unités, 9 leçons |
| Tamazight (Atlas) | Tamaziɣt | Maroc central · Moyen Atlas | 2 unités, 9 leçons |
| Amazighe standard | Tamaziɣt tanawayt | Norme officielle · tifinagh | 2 unités, 11 leçons |

> **Le contenu linguistique est PROVISOIRE** et doit être validé par des
> locuteurs natifs avant diffusion large. Chaque cours cite ses sources en tête
> de son fichier (`src/data/courses/*.js`) et signale explicitement ce qui est
> néologisme militant, emprunt arabe d'usage courant ou forme contestée.

## Démarrer

```bash
npm install
npm run dev
```

## Construire

```bash
npm run build                # PWA installable → dist/
SINGLEFILE=1 npm run build   # un seul fichier HTML autonome (démo hors-ligne)
```

Le mode `SINGLEFILE` inline tout (JS, CSS, police) dans un `dist/index.html`
qu'on peut envoyer par mail et ouvrir d'un double-clic ; il ne contient pas de
service worker.

## Déploiement

Le projet se déploie tel quel sur **Vercel** — le preset Vite est détecté
automatiquement (build `npm run build`, sortie `dist`). Ne pas renseigner de
« Root Directory » : la racine du dépôt est le projet.

`vercel.json` fixe les en-têtes de cache (le format n'admet aucun commentaire,
d'où cette explication ici) :

| Chemin | Politique | Pourquoi |
| --- | --- | --- |
| `sw.js`, `registerSW.js`, `manifest.webmanifest` | jamais mis en cache | sinon une nouvelle version n'atteint pas les téléphones déjà installés — le piège classique des PWA |
| `/assets/*` | un an, immuable | les noms portent une empreinte, ils changent à chaque build |
| `/audio/*` | un jour, puis revalidation | les enregistrements bougent rarement |
| `/icons/*` | une semaine | idem |

Une fois en ligne, les **liens de défi entre amis** deviennent réellement
utilisables (ils ne fonctionnent pas depuis un fichier local).

## Abonnements

Deux zones tarifaires, deux formules — décision produit inscrite dans
`src/data/tarifs.js` (source de vérité **unique**, lue par l'app *et* par le
serveur) :

| Zone | Une personne | Famille (4 personnes) |
| --- | --- | --- |
| Europe & Amériques | 4,99 €/mois | 14,99 €/mois |
| Afrique & Asie | 1,99 €/mois | 5,99 €/mois |

Le prix plus bas au Sud n'est pas une promotion : une app qui enseigne les
langues amazighes et resterait hors de portée en Afrique du Nord aurait manqué
son sujet.

**La première unité de chaque cours est gratuite pour toujours**, sans compte
ni carte, et les jeux, le tifinagh, l'histoire, le cercle et les défis restent
libres — ce sont eux qui font venir la famille. L'abonnement ouvre la suite des
cours, après **7 jours d'essai gratuit**.

### Ce qui décide du prix

La zone est choisie **par le serveur**, d'après l'en-tête géographique de
Vercel (`x-vercel-ip-country`), jamais d'après le navigateur — sinon chacun
choisirait son tarif depuis la console. Elle est ensuite **gravée** sur
l'abonnement : un abonné en voyage garde son tarif.

La règle, en deux temps, dans `src/data/tarifs.js` :

1. Afrique + Asie → zone sud ; tout le reste (Europe, Amériques, Océanie,
   pays inconnu) → zone nord.
2. **Sauf les pays à revenu élevé** (catégorie « high income » de la Banque
   mondiale), qui repassent au tarif du nord : Japon, Corée du Sud,
   Singapour, Hong Kong, Macao, Taïwan, Brunei, Golfe, Israël, Chypre,
   Seychelles, La Réunion et Mayotte. Le tarif bas est fait pour le pouvoir
   d'achat, pas pour le continent — et il est financé par les abonnés du
   nord. Les pays à revenu intermédiaire (Turquie, Chine, Malaisie,
   Kazakhstan, Maurice…) restent volontairement au tarif du sud.

### Moyens de paiement

Tout passe par **Stripe Checkout**, en page hébergée : carte, **Apple Pay**,
**Google Pay**, Link, et les moyens locaux (SEPA, iDEAL, Bancontact…). Le code
ne fixe volontairement **aucune** liste de moyens de paiement : ils se cochent
dans le tableau de bord Stripe, et le nouveau apparaît sans redéploiement.

Aucune donnée bancaire ne transite ni ne dort dans l'app ou dans Neon — nous
ne voyons jamais un numéro de carte, donc nous ne pouvons pas le perdre. La
résiliation, le changement de carte et les factures passent par le **portail
client Stripe**, en un clic.

> Apple Pay et Google Pay n'apparaissent qu'une fois le domaine **vérifié**
> chez Stripe (Settings → Payments → Payment method domains).

### Mise en service

1. Créer les **quatre Prices** chez Stripe (EUR, mensuel, **taxe incluse** —
   « prix TTC », pour que le montant affiché soit exactement celui débité) et
   renseigner `STRIPE_PRICE_*` (voir `.env.example`).
2. Déclarer le webhook sur `https://tamaspeak.com/api/billing?r=webhook`, avec
   les événements `checkout.session.completed`,
   `customer.subscription.created|updated|deleted`, `invoice.paid`,
   `invoice.payment_failed` — puis copier le secret dans
   `STRIPE_WEBHOOK_SECRET`.
3. Renseigner `STRIPE_SECRET_KEY`. Les tables (`abonnements`,
   `famille_membres`, `stripe_events`) s'appliquent toutes seules au premier
   appel (`assurerSchema()`).

**Sans ces variables, l'app ne verrouille rien** : tous les cours restent
ouverts. Une boutique fermée ne peut pas exiger de ticket — même règle que
`DATABASE_URL`.

### À faire plus tard : séparer le compte Stripe

Les abonnements Tama Speak arrivent aujourd'hui sur le **compte Stripe déjà
utilisé par FIQUP** : mêmes virements, même comptabilité, catalogue de produits
partagé. C'est un choix de commodité pour le lancement, assumé et **temporaire**.

Le jour où les deux activités doivent être distinguées (deux structures, deux
bilans, ou simplement pour y voir clair), il faudra créer un compte Stripe
dédié à Tama Speak et migrer : nouveaux produits et tarifs, nouvelle clé,
nouveau webhook, et **surtout** les abonnements en cours — Stripe sait migrer
des abonnements entre comptes, mais cela se demande à son support et prend du
temps.

Plus il y a d'abonnés, plus la migration coûte cher. Autrement dit : c'est la
tâche dont le prix augmente chaque jour où on ne la fait pas.

La clé de Tama Speak est nommée `Tama Speak` chez Stripe, distincte de celle de
FIQUP — révoquer l'une ne touche pas l'autre.

### Le verrou, sans se raconter d'histoires

Le contenu des cours est dans le bundle de la PWA : c'est ce qui la rend
utilisable hors-ligne, et c'est aussi ce qui empêche un verrou étanche. La
porte tient devant l'usage normal, pas devant les outils de développement.
La déplacer côté serveur coûterait le hors-ligne, c'est-à-dire l'app
elle-même : le compromis est assumé. Corollaire assumé lui aussi — on ne
verrouille **que sur un refus explicite du serveur** : hors-ligne, panne ou
serveur muet laissent tout ouvert (même règle anti-boucle que la session).

### Le pack famille

Quatre personnes : le titulaire et trois proches. Même mécanique que le cercle
— une invitation est un **code à partager** (WhatsApp), et la place n'est prise
que lorsque quelqu'un de connecté ouvre le lien `…/?famille=CODE`. Chacun garde
son compte et sa progression ; seul l'accès est partagé. Le titulaire peut
retirer quelqu'un, un membre peut partir de lui-même, et une résiliation libère
les places.

## Architecture

```
src/
  data/
    languages.js     registre des cours (codes ISO 639-3)
    courses.js       fabrique liant chaque langue à son contenu
    exercises.js     fabriques d'exercices partagées
    courses/*.js     contenu par langue (+ sources en commentaire)
    units.js         unités du cours de kabyle
    lessons.js       exercices du cours de kabyle
    journey.js       les 11 paysages ; le voyage part de « chez » la langue
    badges.js        badges dérivés de la progression
  lib/
    progress.js      store multi-langues + migration, localStorage
    audio.js         natif → synthèse → voix du navigateur
    challenge.js     défi entre amis par graine (sans serveur)
    share.js         cartes de partage, Web Share + presse-papiers
    sfx.js           sons de jeu synthétisés (WebAudio, aucun fichier)
  components/        design system, mascottes, bijoux
  screens/           un fichier par écran
scripts/
  gen-icons.mjs      icônes PWA générées (rasterizer maison, sans dépendance)
  gen-audio-manifest.mjs
```

```
api/
  billing.js         abonnements — caisse, portail, pack famille, webhook Stripe
  admin.js           tableau de bord (?r=stats|feedbacks|revenus)
  distance.js        cercle, défis, demandes de voix (?r=…)
  _lib/stripe.js     client REST Stripe + vérification de signature, sans SDK
src/
  data/tarifs.js     zones, prix, pays — source de vérité partagée app/serveur
  lib/abonnement.js  client de la caisse + le verrou (`uniteOuverte`)
  screens/AbonnementScreen.jsx
```

> **Le plafond de douze fonctions.** Le plan Vercel Hobby n'accepte que douze
> fonctions serverless. C'est la raison pour laquelle `api/distance.js` réunit
> tout le jeu à distance, pourquoi `api/billing.js` réunit tout le paiement, et
> pourquoi `api/admin/stats.js` + `api/admin/feedbacks.js` ont fusionné dans
> `api/admin.js` (`?r=stats|feedbacks|revenus`) — les anciennes adresses sont
> redirigées par `vercel.json`, aucun signet ne casse. Ajouter une treizième
> fonction cassera le déploiement : router par `?r=` dans un fichier existant.

### Partis pris

- **Aucun backend.** Toute la progression vit dans `localStorage`. Le défi entre
  amis transporte une *graine* dans le lien : les deux joueurs tirent les mêmes
  questions du même cours, sans serveur ni compte.
- **Pas de photo, pas de compte, pas de pistage.** Les avatars sont les
  personnages de l'app ; le partage passe par la feuille de partage du système.
- **Règle d'illustration** : les mascottes n'ont jamais d'yeux — l'émotion passe
  par la posture et les joues. Les ornements sont uniquement géométriques,
  jamais talismaniques.
- **Audio** : un enregistrement natif est toujours préféré ; à défaut une voix
  de synthèse clairement étiquetée « provisoire ». Les cours autres que le
  kabyle n'ont volontairement aucun audio tant qu'il n'existe pas
  d'enregistrement natif — un enregistrement kabyle ne peut pas y être recyclé
  (le kabyle spirantise t/d/k, le tachelhit non).
- **Accessibilité** : toutes les animations sont coupées si le système demande
  « réduire les animations ».

## Reste à faire

- Validation du vocabulaire et des enregistrements par des locuteurs natifs
- Comptes et synchronisation (Supabase) — la couche `lib/progress.js` est isolée
  pour être remplaçable
- Étoffer les cours autres que le kabyle

## Licences

Code du projet : privé. La police **Noto Sans Tifinagh** est embarquée sous
licence **SIL Open Font License 1.1** (voir `src/fonts/`) : elle est nécessaire
parce qu'iOS et macOS ne fournissent aucune police tifinagh, et que le cours
d'amazighe standard enseigne précisément à lire cette écriture.
