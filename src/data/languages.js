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
    // ------------------------------------------------------------------
    // LE PARCOURS BÊTA — un cours À PART, jamais un remplacement.
    //
    // Décision de Selim, sans ambiguïté : c'est un parcours PARALLÈLE,
    // estampillé bêta, proposé à qui veut le tester. Le cours de kabyle
    // ordinaire (`kab`) reste intact et reste le défaut ; personne ne doit
    // s'y retrouver sans l'avoir choisi. Quatre garde-fous en découlent :
    //
    //   1. Aucun basculement automatique — on n'y entre que par un tap
    //      délibéré depuis « Mes langues ».
    //   2. `beta: true` l'exclut de l'onboarding : un nouvel inscrit
    //      commence toujours par le cours ordinaire.
    //   3. On en sort sans rien perdre — le store est multi-langues, les
    //      deux progressions ne se touchent pas.
    //   4. Ce n'est pas un argument de vente : on ne verrouille pas du
    //      contenu qu'on annonce soi-même comme non stabilisé.
    //
    // Le CONTENU LINGUISTIQUE est exactement celui du cours de kabyle —
    // mêmes mots, mêmes phrases, mêmes sources. Ce qui change est le récit
    // qui l'entoure (data/voyage.js). Écrire des répliques amazighes pour
    // les hôtes demanderait deux locuteurs natifs (docs/pedagogie-voyage.md,
    // §8) : tant qu'ils n'ont pas relu, on n'invente rien.
    // ------------------------------------------------------------------
    id: 'kab-beta',
    beta: true,
    // La langue RÉELLE derrière le parcours. C'est du kabyle : ses
    // enregistrements, ses voix de locuteurs et ses fichiers de synthèse sont
    // ceux du kabyle, et doivent être cherchés là-bas. Sans cela, la bêta
    // irait lire un dossier `audio/kab-beta/` qui n'existe pas — le parcours
    // serait MUET alors qu'il enseigne exactement les mêmes mots.
    base: 'kab',
    name: 'Kabyle — Le voyage',
    autonym: 'Taqbaylit',
    region: 'Version d’essai',
    land: 'kmont',
    accent: '#10C4A8',
    accentDeep: '#0a7a69',
    blurb: 'Une histoire, des personnages qu’on retrouve, et onze paysages.',
    note: 'Version d’essai : même contenu que le cours de kabyle, mais raconté. Ta progression y est séparée, et le cours de kabyle ordinaire n’y touche pas. Dis-nous ce que tu en penses — c’est fait pour ça.',
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
  {
    id: 'zgh',
    name: 'Amazighe standard',
    autonym: 'Tamaziɣt tanawayt',
    region: 'Norme officielle · tifinagh',
    land: 'tassili',
    accent: '#FF6F61',
    accentDeep: '#D8442E',
    blurb: 'Lire le tifinagh — la langue de l’école et des panneaux.',
    note: 'Norme écrite de l’IRCAM, sans locuteur natif — comme l’arabe littéraire. Officielle au Maroc depuis 2003 (graphie) et 2011 (Constitution) : on l’apprend pour LIRE, pas pour parler.',
  },
]

export const DEFAULT_LANG = 'kab'

export const findLanguage = (id) => LANGUAGES.find((l) => l.id === id) || LANGUAGES[0]

/**
 * Les langues proposées à l'ONBOARDING — les bêtas en sont exclues.
 *
 * C'est le garde-fou n° 2 : un nouvel inscrit commence toujours par un cours
 * stabilisé. La bêta ne se découvre que depuis « Mes langues », par un choix
 * explicite de quelqu'un qui est déjà dans l'app.
 */
export const LANGUES_STABLES = LANGUAGES.filter((l) => !l.beta)

export const estBeta = (id) => !!findLanguage(id)?.beta

/**
 * La langue réelle derrière un identifiant de cours.
 *
 * Un parcours d'essai n'est pas une nouvelle langue : « kab-beta » enseigne
 * du kabyle. Tout ce qui touche au SON doit donc passer par ici — les
 * enregistrements natifs, les voix contribuées et la synthèse vivent sous
 * l'identifiant de la vraie langue, jamais sous celui du parcours.
 *
 * On garde volontairement une fonction plutôt qu'un remplacement à la
 * source : la progression, elle, DOIT rester séparée (c'est tout l'intérêt
 * d'un parcours parallèle). Seul l'audio se partage.
 */
export const langueDeBase = (id) => findLanguage(id)?.base || id || DEFAULT_LANG
