# Tama Speak — application (MVP)

Apprends le kabyle (taqbaylit), un mot après l'autre. Web app façon Duolingo.
Ce dépôt contient le **socle technique** et le **design system** de la marque.

## Stack

- **React 18** + **Vite** — interface & build
- **Tailwind CSS v4** — styles utilitaires + tokens de marque (`src/index.css`, bloc `@theme`)
- Cible : **PWA** installable · back-end **Supabase** (à brancher en Phase 4)

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée (par défaut http://localhost:5173).

Autres commandes :

```bash
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## Design system

Les couleurs de marque sont définies une seule fois dans `src/index.css` (`@theme`)
et disponibles comme utilitaires Tailwind :

| Token | Utilitaire | Hex |
|-------|-----------|-----|
| Turquoise | `bg-turquoise` | `#10C4A8` |
| Turquoise foncé | `bg-turquoise-dark` | `#04A88F` |
| Corail | `bg-coral` | `#FF6F61` |
| Corail foncé | `text-coral-dark` | `#EF5646` |
| Sable | `bg-sand` | `#F6EEE0` |
| Encre | `text-ink` | `#1E2530` |

Règle d'illustration : **jamais de visage ni d'yeux** sur les mascottes.

### Composants (`src/components/`)

- `Logo.jsx` — `YazMark`, `AppIcon`, `Wordmark`, `LogoLockup`
- `Button.jsx` — bouton pressable (variants `primary`, `coral`, `neutral`, `ghost`)
- `PhoneFrame.jsx` — coquille téléphone pour prévisualiser les écrans
- `mascots/Yemma.jsx` — mascotte (sans yeux, foudha)

### Écrans (`src/screens/`)

- `WelcomeScreen.jsx` — écran d'accueil / onboarding

## Prochaines étapes (voir roadmap)

1. Écran **Chemin d'apprentissage** (nœuds de leçons)
2. **Moteur d'exercices** (QCM, association, écoute) + feedback
3. **Comptes & gamification** (Supabase, XP, séries)
4. **PWA** + audio natif + bêta
