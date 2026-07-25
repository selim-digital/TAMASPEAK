/**
 * Les langues amazighes proposées par Tama Speak.
 *
 * Chaque langue est un cours indépendant : l'élève peut en suivre plusieurs
 * en parallèle, chacune avec sa propre progression, sa série et ses trophées.
 * Les identifiants sont les codes ISO 639-3 (kab, shi, rif, tzm).
 *
 * Chaque langue reçoit un paysage « chez soi » et une couleur d'accent tirée
 * de la palette des émaux d'Ath Yenni.
 *
 * RÈGLE DE NOMMAGE (recommandation de la recherche linguistique) : dans
 * l'interface, le terme générique est « amazigh » / « langues amazighes »,
 * JAMAIS « tamazight » — ce mot est à la fois le nom du produit et celui
 * d'une variété précise (Maroc central). D'où le qualificatif « (Atlas) »
 * sur ce cours, et la note affichée au choix de la langue.
 */
export const LANGUAGES = [
  {
    id: 'kab',
    name: 'Kabyle',
    autonym: 'Taqbaylit',
    region: 'Kabylie · Algérie',
    land: 'kmont',
    accent: '#10C4A8',
    accentDeep: '#0a7a69',
    blurb: 'Les montagnes du Djurdjura, la mer à Bgayet.',
  },
  {
    id: 'shi',
    name: 'Tachelhit',
    autonym: 'Tacelḥit',
    region: 'Souss & Anti-Atlas · Maroc',
    land: 'ksar',
    accent: '#F0B429',
    accentDeep: '#C08A10',
    blurb: 'Le pays de l’arganier, d’Agadir au Sahara.',
  },
  {
    id: 'rif',
    name: 'Tarifit',
    autonym: 'Tarifit',
    region: 'Rif · Maroc',
    land: 'rif',
    accent: '#2E7BDA',
    accentDeep: '#1F5AA8',
    blurb: 'Les collines du nord et la Méditerranée.',
  },
  {
    id: 'tzm',
    name: 'Tamazight (Atlas)',
    autonym: 'Tamaziɣt',
    region: 'Maroc central · Moyen Atlas',
    land: 'atlas',
    accent: '#34A163',
    accentDeep: '#2C7F4F',
    blurb: 'Les cèdres et les hauts plateaux du Moyen Atlas.',
    // Le mot « tamazight » sert aussi de nom générique : on le précise.
    note: 'Ici, la variété du Maroc central. « Tamazight » désigne aussi, plus largement, l’ensemble des langues amazighes.',
  },
]

export const DEFAULT_LANG = 'kab'

export const findLanguage = (id) => LANGUAGES.find((l) => l.id === id) || LANGUAGES[0]
