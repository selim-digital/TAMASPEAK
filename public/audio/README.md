# Enregistrements audio (prononciation kabyle)

Ce dossier reçoit les **enregistrements natifs** de chaque mot/phrase.
Dès qu'un fichier est présent, l'app le joue automatiquement à la place
de la voix de synthèse provisoire.

## Convention de nommage

Un fichier **MP3** par terme, nommé d'après le mot kabyle « slugifié » :

| Kabyle | Fichier |
|--------|---------|
| Azul | `azul.mp3` |
| Azul fell-ak | `azul-fell-ak.mp3` |
| Tanemmirt | `tanemmirt.mp3` |
| Ar tufat | `ar-tufat.mp3` |

La liste complète et à jour est dans **`manifest.json`** (généré) et dans
**`content-review.csv`** (à la racine du projet, à remettre au locuteur natif).

## Priorité de lecture

1. `audio/<slug>.mp3` — **enregistrement natif** (authentique). Dépose ici les vrais fichiers.
2. `audio/synth/<slug>.mp3` — **voix de synthèse provisoire** (espeak, générée), signalée « voix provisoire » dans l'app.
3. sinon, voix du navigateur.

Dès qu'un fichier natif est déposé dans `audio/`, il **remplace** automatiquement la version de synthèse.

## Régénérer la liste

Après toute modification du contenu des leçons :

```bash
node scripts/gen-audio-manifest.mjs
```

## Conseils d'enregistrement

- Voix claire, débit posé, une prise par mot.
- Format MP3, mono, ~128 kbps suffit.
- Un court silence (~150 ms) au début/fin, pas de bruit de fond.
