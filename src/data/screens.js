/**
 * Les écrans de l'app.
 *
 * Ils étaient jusqu'ici vingt chaînes libres semées dans `App.jsx`. Une faute
 * de frappe y était **silencieuse** : `setScreen('trophies')` écrit
 * `'trophées'` et l'écran ne s'affiche simplement pas, sans erreur, sans
 * indice. Passer par cet objet gelé rend la faute immédiate.
 *
 * L'objet est `Object.freeze`é : une écriture accidentelle échoue en mode
 * strict au lieu de corrompre la navigation.
 */
export const ECRANS = Object.freeze({
  ACCUEIL: 'welcome',
  AUJOURDHUI: 'aujourdhui',
  ONBOARDING: 'onboarding',
  CHEMIN: 'path',
  LECON: 'lesson',
  LECON_FINIE: 'complete',
  COFFRE: 'chest',
  UNITE_FINIE: 'unitcomplete',
  DEFI: 'challenge',
  DEFI_FINI: 'challengecomplete',
  TROPHEES: 'trophies',
  LANGUES: 'langues',
  PROFIL: 'profil',
  FAMILLE: 'famille',
  CONTRIBUER: 'contribuer',
  DUO: 'duo',
  MISSIONS: 'missions',
  TIFINAGH: 'tifinagh',
  HISTOIRE: 'histoire',
  JEUX: 'jeux',
  MEMORY: 'memory',
  MOTS: 'motscroises',
  QUIZ: 'quiz',
  DUEL_INTRO: 'duelintro',
  DUEL: 'duel',
  DUEL_RESULTAT: 'duelresult',
  COMPTE: 'compte',
  NOTIFS: 'notifs',
  FEEDBACK: 'feedback',
  CERCLE: 'cercle',
  ENREGISTRER: 'enregistrer',
  ABONNEMENT: 'abonnement',
  DICTIONNAIRE: 'dictionnaire',
})
