/**
 * LES EMPRUNTS À L'ARABE — le registre, et ce que l'app en dit.
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
 *   2. Les formules qui nomment Dieu (« Lla yɛawn », « Qqim g lman »…) ne
 *      sont PAS dans le registre : ce sont des bénédictions, pas des choix
 *      de vocabulaire, et proposer de les « remplacer » n'aurait aucun sens.
 *      Elles figurent dans A_TRANCHER, pour décision de Selim.
 *   3. Ce qui n'est pas sûr n'est pas affiché : les mots dont l'origine est
 *      discutée (ttxil-k, wah, yah…) attendent dans A_TRANCHER.
 *
 * Tout ce fichier est PROVISOIRE tant qu'un locuteur natif ne l'a pas
 * validé, comme le reste du contenu (voir README).
 */

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
 * tableau de validation (scripts/gen-lexique.mjs).
 *
 * `raison` dit pourquoi ce n'est pas tranché : soit l'origine est discutée
 * par les sources, soit l'expression nomme Dieu et n'appelle pas de
 * « mot plus classique » — on ne remplace pas une bénédiction par un
 * synonyme.
 */
export const A_TRANCHER = [
  { lang: 'kab', mot: 'Ttxil-k', sens: 'S’il te plaît', raison: 'Origine discutée — arabe ou fonds kabyle selon les auteurs.' },
  { lang: 'kab', mot: 'Tanemmirt aṭas', sens: 'Merci beaucoup', raison: '« aṭas » (beaucoup) est parfois donné comme emprunt ; le mot principal, lui, est amazigh.' },
  { lang: 'rif', mot: 'Wah', sens: 'Oui', raison: 'Probable emprunt à l’arabe maghrébin — à confirmer.' },
  { lang: 'rif', mot: 'Mliḥ, l-ḥamdu li-llah', sens: 'Ça va bien, Dieu merci', raison: 'Formule qui nomme Dieu — modale à écarter ou à reformuler.' },
  { lang: 'rif', mot: 'Simana', sens: 'La semaine', raison: 'Emprunt à l’ESPAGNOL, pas à l’arabe — mérite peut-être sa propre modale.' },
  { lang: 'shi', mot: 'Yah', sens: 'Oui', raison: 'Origine discutée — à confirmer par un locuteur du Souss.' },
  { lang: 'shi', mot: 'Labas, lḥamdulillah', sens: 'Ça va, Dieu merci', raison: 'Formule qui nomme Dieu — modale à écarter ou à reformuler.' },
  { lang: 'tzm', mot: 'Yah', sens: 'Oui', raison: 'Origine discutée — à confirmer.' },
  { lang: 'tzm', mot: 'Lla yɛawn', sens: 'Que Dieu t’aide', raison: 'Bénédiction — aucun « mot plus classique » à proposer.' },
  { lang: 'tzm', mot: 'Qqim g lman', sens: 'Au revoir (reste dans la paix)', raison: 'Formule mixte : verbe amazigh, « lman » (amān) arabe. Bénédiction.' },
  { lang: 'tzm', mot: 'Labas, l-ḥamdullah', sens: 'Ça va, Dieu merci', raison: 'Formule qui nomme Dieu — modale à écarter ou à reformuler.' },
  { lang: 'tzm', mot: 'Mayd tɛnit ?', sens: 'Comment vas-tu ?', raison: 'Le ɛ suggère une racine arabe — à trancher.' },
  { lang: 'tzm', mot: 'Tmunt d wayḍ', sens: 'Réponse à « Qqim g lman »', raison: 'Formule d’adieu — à examiner avec la précédente.' },
]

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
