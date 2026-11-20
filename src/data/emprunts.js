/**
 * LES EMPRUNTS — le registre, et ce que l'app en dit.
 *
 * Demande de Selim : quand l'élève valide la bonne réponse sur une
 * expression venue de l'arabe, une modale lui explique que le mot amazigh
 * plus « classique » existe (azul, tanemmirt…), SANS pour autant ranger
 * l'emprunt du côté de l'erreur — l'arabe est présent depuis des siècles
 * dans les régions et la culture amazighes, et c'est ce qu'on entend
 * réellement au Rif, au Souss ou en Kabylie.
 *
 * D'où le ton, qui n'est pas négociable : « les deux sont justes ». Une app
 * qui enseignerait « ssalamu ɛlikum » puis le corrigerait mentirait sur la
 * langue telle qu'elle se parle — et vexerait exactement les gens qu'elle
 * veut servir.
 *
 * TROIS RÈGLES DE CONTENU, tenues volontairement strictes :
 *
 *   1. `classique` n'est renseigné QUE si un mot amazigh d'usage existe
 *      vraiment pour cette langue. Pas de néologisme inventé pour combler
 *      la case : « ssuq » (le marché) n'a pas de remplaçant vivant, et le
 *      dire est plus honnête que fabriquer.
 *   2. Les formules qui nomment Dieu ou qui sont un vœu (« Lla yɛawn »,
 *      « Qqim g lman »…) ne sont PAS dans le registre : ce sont des
 *      bénédictions, pas des choix de vocabulaire, et proposer de les
 *      « remplacer » n'aurait aucun sens. Pas de modale, par principe.
 *   3. Ce qui n'est pas sûr n'est pas affiché. La modale AFFIRME qu'un mot
 *      vient d'ailleurs : sans source qui le dise, elle se tait. Les cas
 *      examinés, et ce qui a été retenu pour chacun, sont consignés dans
 *      TRANCHES ; ce qui attend encore une décision va dans A_TRANCHER.
 *
 * Tout ce fichier est PROVISOIRE tant qu'un locuteur natif ne l'a pas
 * validé, comme le reste du contenu (voir README).
 */

/**
 * D'où vient l'emprunt — le badge de la modale et la phrase qui l'accompagne.
 *
 * L'arabe est le cas général (58 entrées sur 59) et reste la valeur par
 * défaut. L'espagnol est arrivé avec « simana » au Rif : Melilla et Nador ont
 * laissé des mots comme les siècles arabes en ont laissé, et la modale doit
 * pouvoir le dire sans mentir sur la provenance.
 */
export const SOURCES = Object.freeze({
  arabe: {
    badge: 'Mot venu de l’arabe',
    phrase:
      'L’arabe est présent depuis des siècles dans les régions et la culture amazighes : ce qu’on entend au village fait partie de la langue, autant que le mot ancien.',
  },
  espagnol: {
    badge: 'Mot venu de l’espagnol',
    phrase:
      'L’espagnol est entré au Rif par Melilla et Nador. Un siècle de voisinage laisse des mots : ils font partie du tarifit d’aujourd’hui, au même titre que les autres.',
  },
})

/** Clé de comparaison : « Labas ? » et « labas » sont le même mot. */
const cle = (mot) =>
  String(mot || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.…]+$/, '')
    .trim()

/**
 * Le registre, langue par langue.
 *
 * @typedef  {object} Emprunt
 * @property {string}  mot         l'expression telle qu'elle apparaît dans les leçons
 * @property {string}  sens        sa traduction française
 * @property {keyof SOURCES} [origine]  d'où vient l'emprunt — 'arabe' par défaut
 * @property {string} [classique]  le mot amazigh plus classique, s'il en existe un
 * @property {string} [sensClassique] ce que veut dire ce mot amazigh, s'il diffère
 * @property {string} [usage]      la nuance régionale, en une phrase
 */
export const EMPRUNTS = {
  kab: [
    {
      mot: 'Labas',
      sens: 'Ça va (bien)',
      usage:
        'De l’arabe « la ba’s » — littéralement « pas de mal ». Pour demander en kabyle sans emprunt : « Amek telliḍ ? »',
    },
    {
      mot: 'Labas ?',
      sens: 'Ça va ?',
      classique: 'Amek telliḍ ?',
      sensClassique: 'Comment vas-tu ?',
      usage: 'La forme kabyle entière existe, et elle s’apprend à l’unité 4.',
    },
    {
      mot: 'Aql-i labas',
      sens: 'Je vais bien',
      usage: 'La phrase est kabyle, seul « labas » vient de l’arabe.',
    },
    {
      mot: 'Ssuq',
      sens: 'Le marché',
      usage:
        'De l’arabe « sūq ». L’emprunt est si ancien et si complet qu’aucun mot amazigh ne lui fait concurrence — c’est le marché de tout le Maghreb.',
    },
    {
      mot: 'Idrimen',
      sens: 'L’argent',
      usage:
        'Arrivé par l’arabe « dirham », lui-même venu du grec « drachmê » : trois langues pour une pièce de monnaie.',
    },
    {
      mot: 'Atay',
      sens: 'Le thé',
      usage:
        'Venu de Chine, passé par l’arabe maghrébin. Le mot a voyagé avec la boisson — il n’y a pas de thé amazigh plus ancien que le mot.',
    },
    {
      mot: 'Semmeḥ-iyi',
      sens: 'Excuse-moi',
      classique: 'Suref-iyi',
      sensClassique: 'Pardonne-moi',
      usage: 'Les deux s’entendent en Kabylie ; « suref-iyi » est le mot du fonds kabyle.',
    },
    {
      mot: 'Axeddim',
      sens: 'Le travail',
      classique: 'Tawuri',
      usage:
        'La racine « xdm » est arabe. « Tawuri » est amazigh, et vivant : c’est le mot du Souss et de l’Atlas.',
    },
    {
      mot: 'Axeddam',
      sens: 'Le travailleur',
      usage: 'Même racine arabe que « axeddim », avec la forme du nom de métier amazigh (a—am).',
    },
    {
      mot: 'Afellaḥ',
      sens: 'Le paysan',
      classique: 'Amekraz',
      sensClassique: 'Le laboureur',
      usage: 'De l’arabe « fallāḥ ». « Amekraz » vient de « krez », labourer — un verbe kabyle.',
    },
    {
      mot: 'Ɛumm !',
      sens: 'Nage !',
      usage: 'De l’arabe « ɛām ». Le kabyle n’a pas gardé de verbe propre pour la nage.',
    },
  ],

  rif: [
    {
      mot: 'Ssalamu ɛlikum',
      sens: 'Bonjour (la paix sur vous)',
      classique: 'Azul',
      usage:
        'C’est LA salutation du Rif, celle qu’on entend partout. « Azul » est le bonjour amazigh, porté par l’école et les médias.',
    },
    {
      mot: 'Wa ɛlikum ssalam',
      sens: 'Et sur vous la paix (réponse)',
      classique: 'Azul',
      usage: 'La réponse va avec la salutation : les deux viennent de l’arabe.',
    },
    {
      mot: 'Barek llahu fik',
      sens: 'Merci (que Dieu te bénisse)',
      classique: 'Tanemmirt',
      usage:
        'Au Rif, on remercie ainsi. « Tanemmirt » est kabyle ; en amazighe standard il s’écrit « tanmmirt ».',
    },
    {
      mot: 'Marḥba',
      sens: 'Bienvenue',
      classique: 'Ansuf',
      usage: '« Ansuf » est le mot amazigh de l’accueil, vivant en Kabylie.',
    },
    {
      mot: 'Ɛafak',
      sens: 'S’il te plaît',
      usage: 'De l’arabe « ɛafā-k ». En kabyle, on entend aussi « ma ulac aɣilif » — « s’il n’y a pas de gêne ».',
    },
    {
      mot: 'B-essalama',
      sens: 'Au revoir',
      usage: 'De l’arabe « salāma », la paix — la même racine que « ssalamu ɛlikum ».',
    },
    {
      mot: 'Mliḥ',
      sens: 'Ça va bien',
      usage: 'De l’arabe « mlīḥ », bon, bien.',
    },
    {
      mot: 'Tnayen',
      sens: 'Deux',
      classique: 'Sin',
      usage:
        'Le tarifit compte en arabe au-delà de « un ». Les nombres amazighs (sin, kraḍ, kkuẓ) sont restés vivants au Souss et dans l’Atlas.',
    },
    {
      mot: 'Tlata',
      sens: 'Trois',
      classique: 'Kraḍ',
      usage: 'Même histoire que « tnayen » : les nombres sont le domaine où l’emprunt a le plus avancé.',
    },
    {
      mot: 'Lxedmet',
      sens: 'Le travail',
      classique: 'Tawuri',
      usage: 'Racine arabe « xdm ». « Tawuri » est le mot amazigh, gardé au Souss et dans l’Atlas.',
    },
    {
      mot: 'Axeddam',
      sens: 'Le travailleur',
      usage: 'Racine arabe, forme amazighe : la langue habille l’emprunt à sa façon.',
    },
    {
      mot: 'Afellaḥ',
      sens: 'Le paysan',
      usage: 'De l’arabe « fallāḥ », le cultivateur.',
    },
    {
      mot: 'Ṭṭbib',
      sens: 'Le médecin',
      classique: 'Amejjay',
      usage: '« Amejjay » vient de « ajjy », soigner — il s’emploie surtout en kabyle et dans les médias.',
    },
    {
      mot: 'Lmɛellem',
      sens: 'Le patron, le maître artisan',
      usage: 'De l’arabe « muɛallim », celui qui enseigne le métier.',
    },
    {
      mot: 'Ssuq',
      sens: 'Le marché',
      usage: 'De l’arabe « sūq » — l’emprunt est partagé par toutes les langues amazighes.',
    },
    {
      mot: 'Taḥanut',
      sens: 'La boutique',
      usage: 'De l’arabe « ḥānūt », habillé du t…t féminin amazigh.',
    },
    {
      mot: 'Ryaḍa',
      sens: 'Le sport',
      classique: 'Addal',
      usage: 'C’est le mot de tous les jours. « Addal » est amazigh, créé au XXᵉ siècle et repris par l’école.',
    },
    {
      mot: 'Simana',
      sens: 'La semaine',
      origine: 'espagnol',
      usage:
        'De l’espagnol « semana ». Le Rif est la seule langue amazighe du cours à emprunter autant à l’espagnol qu’à l’arabe — c’est l’héritage de Melilla et de Nador.',
    },
    {
      mot: 'Wah',
      sens: 'Oui',
      // Pas de `classique` : on ne propose que ce qu'une source donne, et
      // aucune de celles consultées ne nomme un « oui » plus ancien au Rif.
      usage:
        'De l’arabe marocain « wah ». C’est le oui de tous les jours au Rif — le linguiste M. Kossmann le range parmi les emprunts du tarifit.',
    },
    {
      mot: 'Lkuṛa',
      sens: 'Le ballon',
      classique: 'Takurt',
      usage:
        'De l’arabe « kura ». « Takurt » porte, elle, la forme amazighe (ta—t) — plusieurs auteurs y voient tout de même un emprunt ancien à la même racine.',
    },
  ],

  shi: [
    {
      mot: 'Ssalamu ɛlikum',
      sens: 'Bonjour (la paix sur vous)',
      classique: 'Azul',
      usage:
        'Au Souss, le bonjour amazigh du matin est « Tifawin » — « les lumières ». « Azul » est la forme moderne, celle de l’école.',
    },
    {
      mot: 'Wa ɛlikum ssalam',
      sens: 'Et sur vous la paix (réponse)',
      classique: 'Azul',
      usage: 'La réponse suit la salutation, toutes deux venues de l’arabe.',
    },
    {
      mot: 'Ak isrbḥ rbbi',
      sens: 'Merci (que Dieu te fasse réussir)',
      classique: 'Tanmmirt',
      usage: 'La formule est celle du Souss ; « tanmmirt » est le mot amazigh du merci.',
    },
    {
      mot: 'Afak',
      sens: 'S’il te plaît',
      usage: 'De l’arabe « ɛafā-k ». À une femme : « afakm ».',
    },
    {
      mot: 'Afakm',
      sens: 'S’il te plaît (à une femme)',
      usage: 'Même emprunt que « afak », avec la marque du féminin amazigh.',
    },
    {
      mot: 'Bslama',
      sens: 'Au revoir',
      usage: 'De l’arabe « bi-s-salāma » — « dans la paix ».',
    },
    {
      mot: 'Brrk',
      sens: 'Bienvenue',
      classique: 'Ansuf',
      usage: '« Ansuf » est le mot amazigh de l’accueil ; il vit surtout en Kabylie.',
    },
    {
      mot: 'Labas',
      sens: 'Ça va',
      usage: 'De l’arabe « la ba’s » — « pas de mal ». Toutes les langues amazighes l’ont adopté.',
    },
    {
      mot: 'Lxdmt',
      sens: 'Le travail',
      classique: 'Tawuri',
      usage: 'Le tachelhit a gardé « tawuri », le mot amazigh — les deux s’entendent au Souss.',
    },
    {
      mot: 'Axddam',
      sens: 'Le travailleur',
      usage: 'Racine arabe « xdm », habillée en amazigh.',
    },
    {
      mot: 'Afllaḥ',
      sens: 'Le paysan',
      usage: 'De l’arabe « fallāḥ ».',
    },
    {
      mot: 'Ṭṭbib',
      sens: 'Le médecin',
      classique: 'Amejjay',
      usage: '« Amejjay » vient de « ajjy », soigner.',
    },
    {
      mot: 'Ssuq',
      sens: 'Le marché',
      usage: 'De l’arabe « sūq ».',
    },
    {
      mot: 'Taḥanut',
      sens: 'La boutique',
      usage: 'De l’arabe « ḥānūt », avec le t…t féminin amazigh autour.',
    },
  ],

  tzm: [
    {
      mot: 'Ssalamu ɛlikum',
      sens: 'Bonjour (la paix sur vous)',
      classique: 'Azul',
      usage:
        'C’est ce qu’on dit au Moyen Atlas. « Azul » est la forme de l’école et des pancartes — les deux sont de l’amazigh d’aujourd’hui.',
    },
    {
      mot: 'Ɛlikum ssalam',
      sens: 'Et sur vous la paix (réponse)',
      classique: 'Azul',
      usage: 'La réponse à la salutation, du même arabe.',
    },
    {
      mot: 'Cukran',
      sens: 'Merci',
      classique: 'Tanmmirt',
      usage:
        'De l’arabe « šukran ». « Tanmmirt » s’emploie surtout à l’écrit et à l’école au Maroc central — mais c’est bien le mot amazigh.',
    },
    {
      mot: 'Bla jmil',
      sens: 'De rien',
      usage: 'De l’arabe — littéralement « sans obligation ».',
    },
    {
      mot: 'Ɛafak',
      sens: 'S’il te plaît',
      usage: 'De l’arabe « ɛafā-k ».',
    },
    {
      mot: 'Mrḥba',
      sens: 'Bienvenue',
      classique: 'Ansuf',
      usage: '« Ansuf » est le mot amazigh de l’accueil, vivant en Kabylie.',
    },
    {
      mot: 'Waxxa',
      sens: 'D’accord',
      usage: 'De l’arabe marocain « waxxa ».',
    },
    {
      mot: 'Labas',
      sens: 'Ça va',
      usage: 'De l’arabe « la ba’s » — « pas de mal ».',
    },
    {
      mot: 'Lxdmt',
      sens: 'Le travail',
      classique: 'Tawuri',
      usage: 'Le Moyen Atlas dit les deux ; « tawuri » est le mot amazigh.',
    },
    {
      mot: 'Axddam',
      sens: 'Le travailleur',
      usage: 'Racine arabe « xdm », forme amazighe.',
    },
    {
      mot: 'Afllaḥ',
      sens: 'Le paysan',
      usage: 'De l’arabe « fallāḥ ». Le berger, lui, garde son nom amazigh : « amksa ».',
    },
    {
      mot: 'Ssuq',
      sens: 'Le marché',
      usage: 'De l’arabe « sūq ».',
    },
  ],

  zgh: [
    {
      mot: 'ⵍⵅⴷⵎⵜ',
      sens: 'Le travail (mot arabe)',
      classique: 'ⵜⴰⵡⵓⵔⵉ',
      sensClassique: 'tawuri — le travail',
      usage:
        'La norme de l’IRCAM retient « tawuri » ; « lxdmt » se lit pourtant partout, parce que c’est ce qu’on dit.',
    },
    {
      mot: 'ⵜⴰⵃⴰⵏⵓⵜ',
      sens: 'La boutique',
      usage: 'De l’arabe « ḥānūt ». Le dictionnaire de l’IRCAM l’enregistre : un emprunt installé reste de la langue.',
    },
    {
      mot: 'ⴰⴼⵍⵍⴰⵃ',
      sens: 'Le paysan',
      usage: 'De l’arabe « fallāḥ », lexicalisé en amazighe standard.',
    },
  ],
}

/**
 * Ce qui attend une décision — affiché nulle part dans l'app, listé dans le
 * tableau de validation (scripts/gen-lexique.mjs) et dans l'onglet
 * « Synthèse » du backoffice.
 *
 * Vide depuis la passe de recherche de novembre 2026 : les douze cas en
 * attente ont été examinés un par un, voir TRANCHES. Un nouveau doute se
 * range ici, avec sa `raison`, en attendant d'être regardé.
 */
export const A_TRANCHER = []

/**
 * Ce qui a été tranché, et sur quoi — le registre des décisions.
 *
 * Douze expressions attendaient. La règle qui les départage est celle de
 * l'en-tête : une modale ne s'affiche que si une source dit que le mot est
 * un emprunt. `decision` vaut :
 *
 *   • 'emprunt'     une source le donne pour emprunté → il entre dans
 *                   EMPRUNTS, la modale s'affiche ;
 *   • 'amazigh'     une source le range dans le fonds de la langue → rien
 *                   à dire, pas de modale ;
 *   • 'formule'     bénédiction ou vœu → pas de modale, par principe ;
 *   • 'sans-source' attesté, mais aucune source consultée n'en établit
 *                   l'origine → pas de modale, et le dictionnaire le note
 *                   comme « discuté ».
 *
 * `source` dit où regarder. Ce registre n'est PAS une validation par un
 * locuteur : il dit ce que des livres permettent d'affirmer, pas plus.
 */
export const TRANCHES = [
  {
    lang: 'kab',
    mot: 'Tanemmirt aṭas',
    sens: 'Merci beaucoup',
    decision: 'amazigh',
    pourquoi:
      'Le Dallet range « aṭas » (beaucoup, trop) sous une racine kabyle, ṬS, avec son état d’annexion (« waṭas »), sans la marque « ar. » qu’il met au mot suivant de la même page. Rien d’emprunté dans la formule.',
    source: 'Dallet, Dictionnaire kabyle-français (1982), racine ṬS',
  },
  {
    lang: 'kab',
    mot: 'Ttxil-k',
    sens: 'S’il te plaît',
    decision: 'sans-source',
    pourquoi:
      'Le Dallet l’enregistre sous sa propre racine, ṬXL, comme « expression de supplication », sans le donner pour emprunt — alors qu’il marque « ar. » le verbe « daxel » deux pages plus loin. Aucune source consultée n’établit une origine arabe.',
    source: 'Dallet, Dictionnaire kabyle-français (1982), racine ṬXL',
  },
  {
    lang: 'rif',
    mot: 'Wah',
    sens: 'Oui',
    decision: 'emprunt',
    pourquoi:
      'Classé parmi les emprunts à l’arabe marocain (« wah », oui) dans le vocabulaire tarifit de M. Kossmann. Il entre au registre : la modale s’affiche.',
    source: 'World Loanword Database, vocabulaire tarifit (M. Kossmann) ; « Loanwords in Tarifiyt », 2009',
  },
  {
    lang: 'rif',
    mot: 'Mliḥ, l-ḥamdu li-llah',
    sens: 'Ça va bien, Dieu merci',
    decision: 'formule',
    pourquoi: 'Formule qui nomme Dieu : une louange ne se remplace pas par un synonyme.',
  },
  {
    lang: 'shi',
    mot: 'Labas, lḥamdulillah',
    sens: 'Ça va, Dieu merci',
    decision: 'formule',
    pourquoi: 'Formule qui nomme Dieu. « Labas » seul garde sa modale, comme dans les autres cours.',
  },
  {
    lang: 'shi',
    mot: 'Yah',
    sens: 'Oui',
    decision: 'sans-source',
    pourquoi: 'Aucune source consultée ne dit d’où vient ce « oui ». Sans source, pas de modale.',
  },
  {
    lang: 'tzm',
    mot: 'Yah',
    sens: 'Oui',
    decision: 'sans-source',
    pourquoi:
      'Origine non établie. À faire confirmer par un locuteur : le manuel du Peace Corps pour le Moyen Atlas donne « ay / ih » pour « oui », pas « yah ».',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007), « Adverbs of opinions »',
  },
  {
    lang: 'tzm',
    mot: 'Lla yɛawn',
    sens: 'Que Dieu t’aide',
    decision: 'formule',
    pourquoi:
      'Bénédiction qui nomme Dieu. Le manuel du Peace Corps la donne telle quelle (« May God help you »), avec sa réponse « lla ysllm ».',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007), salutations',
  },
  {
    lang: 'tzm',
    mot: 'Qqim g lman',
    sens: 'Au revoir (reste dans la paix)',
    decision: 'formule',
    pourquoi:
      'Vœu d’adieu : le verbe est amazigh, « lman » vient de l’arabe « amān ». Un vœu ne se remplace pas. Graphie à faire confirmer : le manuel écrit « qim as g lman ».',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007) : « Goodbye (I leave you in peace) »',
  },
  {
    lang: 'tzm',
    mot: 'Tmunt d wayḍ',
    sens: 'Réponse à « Qqim g lman »',
    decision: 'formule',
    pourquoi:
      'L’autre moitié du même adieu, attestée par le manuel (« You go in peace »). Aucun élément arabe relevé.',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007) : « Goodbye (You go in peace) »',
  },
  {
    lang: 'tzm',
    mot: 'Labas, l-ḥamdullah',
    sens: 'Ça va, Dieu merci',
    decision: 'formule',
    pourquoi: 'Formule qui nomme Dieu. Attestée telle quelle par le manuel du Peace Corps.',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007), salutations',
  },
  {
    lang: 'tzm',
    mot: 'Mayd tɛnit ?',
    sens: 'Comment vas-tu ?',
    decision: 'sans-source',
    pourquoi:
      'La question est bien attestée (« How are you? » dans le manuel), mais la racine du verbe n’est établie par aucune source consultée : le ɛ ne suffit pas à conclure.',
    source: 'Peace Corps Morocco, Tamazight Textbook (2007), salutations',
  },
]

/** Le libellé de chaque décision, pour les tableaux. */
export const DECISIONS = Object.freeze({
  emprunt: 'Emprunt — modale affichée',
  amazigh: 'Fonds amazigh — pas de modale',
  formule: 'Formule, vœu — pas de modale',
  'sans-source': 'Origine non établie — pas de modale',
})

/** Index langue → clé normalisée → entrée, construit une fois. */
const INDEX = Object.fromEntries(
  Object.entries(EMPRUNTS).map(([lang, liste]) => [lang, new Map(liste.map((e) => [cle(e.mot), e]))]),
)

/**
 * L'emprunt correspondant à un mot, ou `null`.
 * @param {string} langId  code du cours ('kab', 'rif'…)
 * @param {string} mot     l'expression amazighe de l'exercice
 */
export function trouverEmprunt(langId, mot) {
  if (!langId || !mot) return null
  return INDEX[langId]?.get(cle(mot)) || null
}

/** Toutes les entrées, à plat — pour la fiche de validation. */
export const tousLesEmprunts = () =>
  Object.entries(EMPRUNTS).flatMap(([lang, liste]) => liste.map((e) => ({ lang, ...e })))
