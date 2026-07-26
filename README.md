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
automatiquement (build `npm run build`, sortie `dist`). `vercel.json` fixe les
en-têtes de cache, notamment ceux du service worker : il ne doit jamais être mis
en cache, sinon une nouvelle version n'atteint pas les téléphones déjà
installés.

Une fois en ligne, les **liens de défi entre amis** deviennent réellement
utilisables (ils ne fonctionnent pas depuis un fichier local).

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
