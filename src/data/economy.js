/**
 * L'économie du jeu — XP, gemmes, tailles de séries.
 *
 * Ces valeurs vivaient en tête d'`App.jsx`, mêlées à la navigation. Elles en
 * sortent parce qu'elles vont bientôt être lues ailleurs : le calcul des
 * droits d'accès (combien de leçons avant le mur) et les écrans d'abonnement
 * doivent s'appuyer sur les mêmes nombres que les leçons elles-mêmes.
 *
 * RÈGLE À NE PAS ENFREINDRE : aucune de ces valeurs ne doit servir à
 * INTERROMPRE une session en cours. Pas de cœurs, pas de vies, pas d'énergie —
 * Duolingo a mesuré puis démonté sa propre mécanique de cœurs en 2025, les
 * débutants étant « 2× plus susceptibles » d'en manquer en plein milieu d'une
 * leçon. Sur un public adulte que la honte de mal parler bloque déjà, ce
 * serait la faute la plus coûteuse possible.
 */

/** Fin de leçon. */
export const XP_PER_LESSON = 20

/** Ouverture d'un coffre sur le chemin. */
export const CHEST_GEMS = 15

/** Bonus quand toutes les leçons d'une unité sont terminées. */
export const UNIT_BONUS = 25

/** Défi du jour : une série courte, une fois par jour. */
export const CHALLENGE = { xpGain: 15, gems: 10, size: 5 }

/** Lecture d'un récit d'histoire, comptée une seule fois. */
export const XP_RECIT = 10

/** Duel à deux sur un même téléphone : pair, pour que chacun joue autant. */
export const DUO_TOURS = 6

/**
 * Le coin jeux — Mémory et Mots croisés. Rejouables à volonté (même règle
 * que partout : rien n'interrompt jamais une partie). Les gemmes d'un
 * niveau de mots croisés ne tombent qu'à la PREMIÈRE réussite ; rejouer
 * rapporte un petit XP d'entretien. L'indice est la première DÉPENSE de
 * gemmes de l'app : ce qu'on gagne aux coffres sert enfin à quelque chose.
 */
export const JEUX = {
  memory: { xpGain: 10 },
  mots: { xpGain: 15, gems: 10, xpRejoue: 5 },
  indice: 5,
  // Le Quiz Tamazgha : un petit XP par bonne réponse — assez pour compter,
  // pas assez pour transformer la culture en ferme à points.
  quiz: { xpParBonne: 2 },
}
