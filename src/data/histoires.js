/**
 * Les histoires de Titiche et Tomatiche — dix récits propriétaires, à lire ou
 * à raconter aux enfants. Un frère et une sœur, un village, et à chaque fois
 * une leçon de vie : l'entraide, la vérité, le pardon, le partage…
 *
 * RÈGLES D'ÉCRITURE (décisions de Selim) :
 *   • Histoires PROPRIÉTAIRES uniquement. Les fables du domaine public
 *     (Basset, 1897) ont été lues puis écartées : la ruse y est récompensée
 *     et plusieurs tournent la prière en dérision.
 *   • Rien de surnaturel : ni magie, ni ogre, ni talisman, ni présage. Les
 *     enfants agissent, et c'est leur geste qui dénoue l'histoire.
 *   • Dieu est nommé « Rebbi » en kabyle, « Dieu » ailleurs. La formule
 *     « si Dieu le veut » vit DANS le récit, jamais en ritournelle de fin,
 *     et sous trois formes qui alternent : ma yebɣa Rebbi, ma yebɣa Yillu,
 *     et le français.
 *   • Longueurs variées, pour des niveaux variés (voir NIVEAUX).
 *
 * LE TEXTE EST FRANÇAIS, LES MOTS SONT AMAZIGHS. Chaque histoire est écrite
 * une seule fois ; les mots amazighs y sont des jetons `{soleil}` que
 * `composer()` remplace par le mot du cours en cours. Quand le cours n'a pas
 * ce mot, le jeton retombe sur le français — une histoire en tarifit porte
 * donc moins de mots qu'en kabyle, mais AUCUN mot inventé.
 *
 *   {soleil}          → « tafukt (le soleil) » en kabyle, « le soleil » sinon
 *   {Soleil}          → même chose, avec la majuscule de début de phrase
 *   {eau|de l’eau}    → même mot, mais une autre glose française à cet endroit
 *
 * La traduction entre parenthèses n'est donnée qu'à la PREMIÈRE apparition
 * d'un mot dans une histoire : ensuite le mot tient seul, c'est le but.
 *
 * SOURCE DES MOTS : le vocabulaire de chaque cours, et rien d'autre.
 * `npm run check:histoires` le vérifie mot par mot. Les seules exceptions
 * sont listées dans HORS_LEXIQUE, et sont à faire valider par un locuteur
 * natif au même titre que le reste du contenu (voir le README).
 */

/** Combien d'histoires ont un début gratuit (les premières de la liste). */
export const NB_GRATUITES_EN_PARTIE = 2

export const NIVEAUX = {
  1: { label: 'Tout-petits', duree: '1 min' },
  2: { label: 'Petits lecteurs', duree: '2 min' },
  3: { label: 'Grands lecteurs', duree: '4 min' },
}

/**
 * Les mots. `fr` est la glose par défaut ; les autres clés sont les cours.
 * Les mots sont écrits comme ils se lisent en milieu de phrase ; les noms
 * propres (Yemma, Rebbi…) gardent leur majuscule.
 */
export const MOTS = {
  // — le monde —
  soleil: { fr: 'le soleil', kab: 'tafukt' },
  village: { fr: 'le village', kab: 'taddart' },
  maison: { fr: 'la maison', kab: 'axxam', shi: 'tigmmi', tzm: 'taddart', zgh: 'ⵜⵉⴳⵎⵎⵉ' },
  porte: { fr: 'la porte', kab: 'tawwurt' },
  marche: { fr: 'le marché', kab: 'ssuq', rif: 'ssuq', shi: 'ssuq' },
  nuage: { fr: 'le nuage', kab: 'asigna' },
  pluie: { fr: 'la pluie', kab: 'ageffur' },
  neige: { fr: 'la neige', kab: 'adfel' },
  vent: { fr: 'le vent', kab: 'aḍu' },
  nuit: { fr: 'la nuit', kab: 'iḍ' },
  jour: { fr: 'le jour', kab: 'ass' },
  matin: { fr: 'le matin', kab: 'tanezzayt' },
  soir: { fr: 'le soir', kab: 'tameddit' },
  aujourdhui: { fr: 'aujourd’hui', kab: 'ass-a' },
  demain: { fr: 'demain', kab: 'azekka', rif: 'tiwecca', shi: 'azkka', tzm: 'askka' },
  maintenant: { fr: 'maintenant', kab: 'tura' },

  // — les gens —
  maman: { fr: 'Maman', kab: 'Yemma', rif: 'Yemma', shi: 'Immi', tzm: 'Mma' },
  papa: { fr: 'Papa', kab: 'Baba', rif: 'Baba', shi: 'Baba', tzm: 'Bba' },
  grandpere: { fr: 'Grand-père', kab: 'Jeddi', tzm: 'Bbaḥllu' },
  frere: { fr: 'mon frère', kab: 'gma' },
  soeur: { fr: 'ma sœur', kab: 'weltma' },
  garcon: { fr: 'le garçon', kab: 'aqcic' },
  enfants: { fr: 'les enfants', kab: 'arrac' },
  homme: { fr: 'l’homme', kab: 'argaz', rif: 'aryaz', zgh: 'ⴰⵔⴳⴰⵣ' },
  maitre: { fr: 'le maître', kab: 'aselmad', shi: 'aslmad', zgh: 'ⴰⵙⵍⵎⴰⴷ' },
  eleve: { fr: 'l’élève', kab: 'anelmad', shi: 'anlmad', zgh: 'ⴰⵏⵍⵎⴰⴷ' },
  dieu: { fr: 'Dieu', kab: 'Rebbi' },

  // — le corps, les choses —
  main: { fr: 'la main', kab: 'afus', shi: 'afus', tzm: 'afus', zgh: 'ⴰⴼⵓⵙ' },
  pied: { fr: 'le pied', kab: 'aḍar', shi: 'aḍar', tzm: 'aḍar', zgh: 'ⴰⴹⴰⵔ' },
  tete: { fr: 'la tête', kab: 'aqerruy', shi: 'ixf', tzm: 'ixf', zgh: 'ⵉⵅⴼ' },
  coeur: { fr: 'le cœur', kab: 'ul', rif: 'uř' },
  pain: { fr: 'le pain', kab: 'aɣrum', rif: 'aɣrum', shi: 'aɣrum', tzm: 'aɣrum', zgh: 'ⴰⵖⵔⵓⵎ' },
  eau: { fr: 'l’eau', kab: 'aman', rif: 'aman', shi: 'aman', tzm: 'aman', zgh: 'ⴰⵎⴰⵏ' },
  miel: { fr: 'le miel', kab: 'tament' },
  the: { fr: 'le thé', kab: 'atay' },
  olives: { fr: 'les olives', kab: 'aẓemmur' },
  argent: { fr: 'l’argent', kab: 'idrimen' },
  livre: { fr: 'le livre', kab: 'adlis', zgh: 'ⴰⴷⵍⵉⵙ' },
  ballon: { fr: 'le ballon', kab: 'takurt', rif: 'takurt', shi: 'takurt', tzm: 'takurt', zgh: 'ⵜⴰⴽⵓⵔⵜ' },
  jeu: { fr: 'le jeu', kab: 'urar', shi: 'urar', tzm: 'urar', zgh: 'ⵓⵔⴰⵔ' },
  course: { fr: 'la course', kab: 'tazzla', rif: 'tazzřa', shi: 'tazzla', tzm: 'tazzla', zgh: 'ⵜⴰⵣⵣⵍⴰ' },
  chat: { fr: 'le chat', kab: 'amcic' },
  noir: { fr: 'noir', kab: 'aberkan' },
  entraide: { fr: 'l’entraide', kab: 'tiwizi' },

  // — compter —
  un: { fr: 'un', kab: 'yiwen', rif: 'ijjen', shi: 'yan', tzm: 'yan', zgh: 'ⵢⴰⵏ' },
  deux: { fr: 'deux', kab: 'sin', rif: 'tnayen', shi: 'sin', tzm: 'sin', zgh: 'ⵙⵉⵏ' },
  trois: { fr: 'trois', kab: 'kraḍ', rif: 'tlata', shi: 'kraḍ', tzm: 'kraḍ', zgh: 'ⴽⵔⴰⴹ' },
  quatre: { fr: 'quatre', kab: 'kkuẓ', shi: 'kkuẓ', tzm: 'kkuẓ' },
  cinq: { fr: 'cinq', kab: 'semmus', shi: 'smmus', tzm: 'smmus' },

  // — se parler —
  bonjour: { fr: 'bonjour', kab: 'azul', rif: 'ssalamu ɛlikum', shi: 'ssalamu ɛlikum', tzm: 'ssalamu ɛlikum', zgh: 'ⴰⵣⵓⵍ' },
  oui: { fr: 'oui', kab: 'ih', rif: 'wah', shi: 'yah', tzm: 'yah', zgh: 'ⵢⵢⵉⵀ' },
  non: { fr: 'non', kab: 'ala', rif: 'lla', shi: 'uhu', tzm: 'uhu', zgh: 'ⵓⵀⵓ' },
  merci: { fr: 'merci', kab: 'tanemmirt', rif: 'barek llahu fik', shi: 'tanmmirt', tzm: 'cukran', zgh: 'ⵜⴰⵏⵎⵎⵉⵔⵜ' },
  mercibcp: { fr: 'merci beaucoup', kab: 'tanemmirt aṭas' },
  pardon: { fr: 'pardonne-moi', kab: 'semmeḥ-iyi' },
  svp: { fr: 's’il te plaît', kab: 'ttxil-k', rif: 'ɛafak', shi: 'afak', tzm: 'ɛafak' },
  bienvenue: { fr: 'bienvenue à toi !', kab: 'ansuf yes-k !' },
  cava: { fr: 'ça va ?', kab: 'labas ?' },
  ademain: { fr: 'à demain !', kab: 'ar tufat !' },
  quoi: { fr: 'qu’est-ce que c’est ?', kab: 'd acu-yagi ?' },
  comprendspas: { fr: 'je ne comprends pas', kab: 'ur fhimeɣ ara' },
  viens: { fr: 'viens !', kab: 'as-d !' },
  va: { fr: 'va !', kab: 'ṛuḥ !' },
  cours: { fr: 'cours !', kab: 'azzel !', rif: 'azzeř !', shi: 'azzl !', tzm: 'azzl !', zgh: 'ⴰⵣⵣⵍ' },
  mange: { fr: 'mange !', kab: 'ečč !' },
  bois: { fr: 'bois !', kab: 'sew !' },
  boisthe: { fr: 'bois du thé', kab: 'sew atay' },

  // — « si Dieu le veut », sous ses deux formes kabyles —
  sidieur: { fr: 'si Dieu le veut', kab: 'ma yebɣa Rebbi' },
  sidieuy: { fr: 'si Dieu le veut', kab: 'ma yebɣa Yillu' },
}

/**
 * Les mots qui ne viennent PAS du vocabulaire d'un cours. La liste est courte
 * et tenue à la main, exprès : tout ce qui y figure est à faire valider par
 * un locuteur natif avant diffusion large.
 *   • Rebbi, ma yebɣa Rebbi, ma yebɣa Yillu — demandés par Selim ;
 *   • Jeddi — le grand-père de la famille dessinée (mascots/Family.jsx).
 */
export const HORS_LEXIQUE = {
  kab: ['Rebbi', 'ma yebɣa Rebbi', 'ma yebɣa Yillu', 'Jeddi'],
}

export const HISTOIRES = [
  {
    id: 'olives',
    titre: 'Les olives avant la pluie',
    valeur: 'L’entraide',
    niveau: 2,
    debutLibre: 4,
    texte: [
      'Ce matin-là, {soleil} brillait sur {village}. Titiche sortit de {maison} avec {ballon} sous le bras.',
      '— {Bonjour}, {soeur} ! {Viens} On va jouer !',
      'En chemin, ils virent leur vieille voisine, seule sous son olivier. Par terre, il y avait partout {olives|des olives}, et son panier était presque vide.',
      '— Mes enfants, dit-elle, regardez ce gros {nuage|nuage}. La pluie est une miséricorde de {dieu}, mais si {pluie} tombe avant ce soir, mes olives à terre seront perdues.',
      'Titiche regarda son ballon. Tomatiche regarda le nuage. Puis ils se regardèrent.',
      '— {Jeu} peut attendre, {frere}, dit Tomatiche. Les olives, non.',
      '— Alors au travail ! Et {sidieur}, on aura fini avant la pluie.',
      'Mais à deux, le panier se remplissait lentement. Alors Titiche courut appeler {enfants} du village :',
      '— Venez ! C’est {entraide} !',
      '{Un}, {deux}, {trois}… bientôt dix petites mains ramassaient ensemble. Quand la première goutte tomba, le dernier panier était rentré.',
      '— {Mercibcp}, mes enfants ! dit la voisine. Elle leur offrit {pain|du pain} chaud et {miel|du miel}.',
      '— C’est drôle, dit Titiche, la bouche pleine. J’ai {coeur} encore plus content que le ventre.',
      '— C’est normal, sourit Tomatiche. Une seule {main|main} ramasse peu. Beaucoup de mains font une récolte.',
      '— {Demain}, on joue au ballon ?',
      '— {Oui} ! {Ademain}',
    ],
    lecon: 'Aider avant de jouer — et à plusieurs, tout devient léger.',
    question: {
      prompt: 'Pourquoi Titiche et Tomatiche ont-ils posé leur ballon ?',
      answer: 'Pour aider la voisine avant la pluie',
      choices: [
        'Parce qu’ils étaient fatigués',
        'Pour aider la voisine avant la pluie',
        'Parce que le ballon était crevé',
      ],
    },
  },
  {
    id: 'miel',
    titre: 'Le pot de miel',
    valeur: 'Dire la vérité',
    niveau: 1,
    debutLibre: 3,
    texte: [
      'Sur l’étagère, il y avait le pot de {miel|miel} de {maman}. Titiche voulut juste goûter. Le pot glissa de sa {main|main}… et se cassa.',
      '— Dis que c’est {chat} ! souffla une petite voix dans sa tête.',
      'Tomatiche regarda son frère :',
      '— {Non}, {frere}. Le chat n’a rien fait. Et {dieu} voit tout.',
      'Quand {maman} entra, Titiche avait {coeur} qui battait fort.',
      '— {Pardon}, {maman}. C’est moi.',
      '{Maman} regarda le pot, puis son fils.',
      '— Un pot cassé, ça se remplace. Un enfant qui dit la vérité, ça n’a pas de prix.',
      '— La prochaine fois, si Dieu le veut, je demanderai d’abord, promit Titiche.',
    ],
    lecon: 'La vérité fait peur une minute ; le mensonge pèse longtemps.',
    question: {
      prompt: 'Qu’a fait Titiche quand sa maman est entrée ?',
      answer: 'Il a dit la vérité et demandé pardon',
      choices: [
        'Il a accusé le chat',
        'Il s’est caché',
        'Il a dit la vérité et demandé pardon',
      ],
    },
  },
  {
    id: 'dispute',
    titre: 'Le ballon de la dispute',
    valeur: 'Demander pardon',
    niveau: 1,
    texte: [
      '— C’est MON tour ! cria Titiche.',
      '— {Non} ! C’est le mien ! cria Tomatiche.',
      'Chacun tira {ballon} de son côté. Puis chacun partit bouder, l’un devant {porte}, l’autre sous l’olivier. {Jeu} était fini, et personne n’avait gagné.',
      '{Soleil} descendait. Tomatiche pensa : « À quoi sert un ballon, toute seule ? »',
      'Elle revint la première.',
      '— {Pardon}, {frere}.',
      '— Non, c’est moi. {Pardon}, {soeur}.',
      '— {Maintenant}, on joue ensemble ?',
      '— {Oui} ! Et demain aussi, {sidieuy} !',
    ],
    lecon: 'Le plus fort n’est pas celui qui gagne la dispute : c’est celui qui revient le premier.',
    question: {
      prompt: 'Qui a fait le premier pas après la dispute ?',
      answer: 'Tomatiche, en demandant pardon',
      choices: [
        'Tomatiche, en demandant pardon',
        'Personne, ils sont restés fâchés',
        'Leur maman les a obligés',
      ],
    },
  },
  {
    id: 'pain',
    titre: 'Le pain chaud',
    valeur: 'Partager',
    niveau: 2,
    texte: [
      '{Maman} sortit du four {pain} tout chaud. Elle en donna un à chacun pour le goûter.',
      'Dehors, un petit {garcon|garçon} regardait de loin. Il ne demandait rien, mais ses yeux suivaient le pain.',
      'Titiche avait très faim. Il regarda son pain, puis le garçon. Il le coupa en {deux}.',
      '— {Viens} {Mange}',
      'Tomatiche apporta {eau|de l’eau}.',
      '— {Bois}',
      '— {Merci}, dit le garçon avec un grand sourire.',
      'Le soir, Titiche dit à sa sœur :',
      '— C’est bizarre. J’ai mangé la moitié, et je suis rassasié tout entier.',
      '— C’est {dieu} qui met la bénédiction dans ce qu’on partage.',
      '— Alors demain, {sidieur}, on l’invite à la maison.',
    ],
    lecon: 'Ce qu’on partage ne diminue pas.',
    question: {
      prompt: 'Qu’a fait Titiche de son pain ?',
      answer: 'Il l’a coupé en deux pour le partager',
      choices: [
        'Il l’a mangé en cachette',
        'Il l’a coupé en deux pour le partager',
        'Il l’a gardé pour le lendemain',
      ],
    },
  },
  {
    id: 'chat',
    titre: 'Le chat qui avait soif',
    valeur: 'La bonté envers les animaux',
    niveau: 2,
    texte: [
      'Ce jour-là, {soleil} tapait fort. Sous le mur, un petit {chat|chat} {noir} miaulait tout bas, la langue sèche.',
      'Des {enfants|enfants} riaient et voulaient lui lancer des cailloux.',
      '— {Non} ! dit Tomatiche. Il a soif, c’est tout. C’est une créature de {dieu}, comme nous.',
      '— {Cours}, {frere} !',
      'Titiche fila vers {maison} et revint avec {eau|de l’eau} dans un bol.',
      'Le chat but, but, but. Puis il se frotta contre {pied} de Titiche.',
      'Les autres enfants ne riaient plus. L’un d’eux demanda doucement :',
      '— Je peux lui donner à boire, moi aussi ?',
      '— {Oui}. Et {sidieuy}, on remplira son bol tous les jours.',
    ],
    lecon: 'Être bon avec plus petit que soi, c’est être grand.',
    question: {
      prompt: 'De quoi le petit chat avait-il besoin ?',
      answer: 'D’eau, parce qu’il avait soif',
      choices: [
        'De jouer avec les enfants',
        'De rentrer dans la maison',
        'D’eau, parce qu’il avait soif',
      ],
    },
  },
  {
    id: 'neige',
    titre: 'L’invité de la neige',
    valeur: 'L’hospitalité',
    niveau: 3,
    texte: [
      '{Nuit} tombait et {neige} recouvrait {village}. Dans {maison}, le feu craquait. Titiche et Tomatiche comptaient les flocons derrière la vitre.',
      'Soudain, on frappa à {porte}. Toc, toc, toc.',
      '— Qui peut bien venir par un temps pareil ? chuchota Tomatiche.',
      'C’était un vieil {homme|homme}, un voyageur, tout blanc de neige. Son manteau était raide de froid et ses mains tremblaient.',
      'Tomatiche eut un peu peur : elle ne le connaissait pas. Elle se cacha derrière {papa}. Mais {papa} ouvrit grand :',
      '— {Bienvenue}',
      '— Mais {papa}, souffla Titiche, on ne sait pas qui c’est…',
      '— On sait l’essentiel : il a froid et il est loin de chez lui. L’invité est un cadeau que {dieu} envoie. On l’honore d’abord, on fait connaissance ensuite.',
      'Alors Titiche approcha un coussin du feu. Tomatiche, qui n’avait plus peur, servit {the}. {Maman} apporta {pain|du pain} et des figues.',
      '— {Boisthe}, dit Tomatiche timidement.',
      'Le voyageur but, se réchauffa, et ses mains cessèrent de trembler. Puis il raconta les villages qu’il avait traversés, les montagnes, les rivières, les marchés. Les enfants écoutèrent, les yeux brillants, jusqu’à ce que leurs paupières tombent.',
      'Au matin, {soleil} faisait briller la neige. Le voyageur reprit son bâton.',
      '— {Mercibcp}. Que {dieu} garde cette maison et ceux qui y vivent.',
      '— Tu reviendras nous voir ? demanda Titiche.',
      '— {Sidieuy}, mon garçon.',
      'Quand il eut disparu au tournant du chemin, Tomatiche dit tout bas :',
      '— Hier, j’avais peur de lui. Aujourd’hui, il me manque déjà.',
    ],
    lecon: 'Une porte ouverte réchauffe plus qu’un feu.',
    question: {
      prompt: 'Pourquoi le papa a-t-il ouvert sa porte au voyageur ?',
      answer: 'Parce qu’il avait froid et qu’on honore l’invité',
      choices: [
        'Parce qu’il le connaissait depuis longtemps',
        'Parce qu’il avait froid et qu’on honore l’invité',
        'Parce que le voyageur avait promis un cadeau',
      ],
    },
  },
  {
    id: 'course',
    titre: 'La grande course',
    valeur: 'Jouer juste',
    niveau: 2,
    texte: [
      'C’était le jour de {course} du village. {Un}, {deux}, {trois}… {Cours}',
      'Titiche filait comme {vent}. Devant lui, il ne restait qu’un garçon. Soudain, le garçon tomba et se tint {pied}.',
      'Titiche pouvait gagner. Il s’arrêta.',
      '— {Cava} Donne-moi {main}.',
      'Ils finirent la course ensemble, en boitant, les derniers. Tomatiche applaudit plus fort que pour le premier.',
      '— Tu n’as pas gagné, {frere}.',
      '— {Non}. Mais je suis content dans {coeur}.',
      '{Grandpere} sourit dans sa barbe :',
      '— Aujourd’hui, c’est toi qui es arrivé le plus loin.',
      '— L’an prochain, si Dieu le veut, on courra tous les deux, dit Tomatiche.',
    ],
    lecon: 'On peut perdre la course et gagner l’estime.',
    question: {
      prompt: 'Qu’a fait Titiche quand le garçon est tombé ?',
      answer: 'Il s’est arrêté pour l’aider',
      choices: [
        'Il s’est arrêté pour l’aider',
        'Il a couru plus vite pour gagner',
        'Il a appelé le maître',
      ],
    },
  },
  {
    id: 'piece',
    titre: 'La pièce du marché',
    valeur: 'Rendre ce qui n’est pas à soi',
    niveau: 3,
    texte: [
      '{Aujourdhui}, c’était jour de {marche|marché}. {Maman} confia {argent} aux enfants :',
      '— Achetez {olives|des olives}, et revenez vite.',
      'Le marché était plein de bruits et d’odeurs : les épices, les beignets, les marchands qui appelaient. Titiche s’arrêta net devant un étal de bonbons rouges et dorés.',
      '— Pas maintenant, dit Tomatiche en le tirant par la manche.',
      'Le marchand d’olives était pressé : il servait trois clients à la fois. Il rendit la monnaie très vite. Sur le chemin du retour, Tomatiche recompta :',
      '— {Trois}, {quatre}, {cinq}… Il nous a rendu une pièce en trop !',
      'Titiche pensa aussitôt aux bonbons rouges et dorés.',
      '— Avec ça, on peut en acheter tout un sachet. Le marchand ne s’en rendra même pas compte.',
      '— Lui, non, dit Tomatiche. Mais nous, on le saura. Et {dieu} le sait déjà. Cette pièce n’est pas à nous.',
      'Titiche regarda la pièce dans sa {main|main}. Elle brillait. Elle était lourde, aussi — plus lourde qu’une pièce ordinaire.',
      '— Tu as raison, dit-il enfin.',
      '— {Va}, {frere}. Je t’attends ici avec le panier.',
      'Titiche courut jusqu’à l’étal.',
      '— {Pardon|excuse-moi}. Tu nous as rendu une pièce en trop. Elle est à toi.',
      'Le marchand resta la louche en l’air. Puis il sourit jusqu’aux oreilles et remplit un petit cornet d’olives.',
      '— Tiens. Ça, c’est un cadeau : tu peux le prendre. Et dis à ta mère qu’elle a des enfants en or.',
      'Sur le chemin, la poche de Titiche était plus légère d’une pièce. Son cœur aussi était plus léger.',
      '— On reviendra chez lui la semaine prochaine, {sidieur} ?',
      '— {Oui}. Il a les meilleures olives… et maintenant, c’est notre ami.',
    ],
    lecon: 'Ce qui n’est pas à toi ne te rendra jamais heureux.',
    question: {
      prompt: 'Qu’ont fait les enfants de la pièce rendue en trop ?',
      answer: 'Ils l’ont rapportée au marchand',
      choices: [
        'Ils ont acheté des bonbons',
        'Ils l’ont donnée à leur maman',
        'Ils l’ont rapportée au marchand',
      ],
    },
  },
  {
    id: 'livre',
    titre: 'Le livre difficile',
    valeur: 'Oser demander, persévérer',
    niveau: 3,
    texte: [
      'À l’école, {maitre} ouvrit {livre}. Les autres enfants lisaient vite, d’une seule traite. Titiche, lui, butait sur chaque mot. Les lettres dansaient devant ses yeux.',
      'Il avait honte. Il baissa {tete} et fit semblant de suivre.',
      'À côté de lui, Tomatiche avait tout vu. Elle lui souffla :',
      '— Dis-le. Demander, ce n’est pas une honte. La honte, c’est de rester sans savoir.',
      'Titiche hésita. Et si les autres riaient ? Puis il leva la main, tout rouge :',
      '— {Comprendspas}. {Svp}, encore une fois ?',
      'Personne ne rit. Le maître sourit :',
      '— Voilà un vrai {eleve|élève}. Celui qui demande apprend. Celui qui se tait reste où il est.',
      'Ce soir-là, le frère et la sœur s’assirent près de la lampe.',
      '— Une page chaque {soir|soir}, proposa Tomatiche. Pas plus. Mais tous les soirs.',
      'Le premier soir, Titiche lut un mot, puis deux. C’était long. Il voulut refermer le livre.',
      '— Encore une ligne, dit Tomatiche. Juste une.',
      'Le deuxième soir, il lut une ligne entière. La semaine suivante, un paragraphe. Certains soirs, il se trompait et recommençait. Tomatiche ne se moquait jamais : elle attendait.',
      'Un {matin|matin}, à l’école, le maître demanda qui voulait lire. Titiche leva la main. Il lut toute la page, sans s’arrêter.',
      '— Voilà ce que donne la patience, dit le maître.',
      'En sortant, Titiche dit à sa sœur :',
      '— Demain, je lirai la page suivante, {sidieuy}. Et après, c’est moi qui t’aiderai.',
    ],
    lecon: 'Un peu chaque jour vaut mieux que beaucoup un seul jour.',
    question: {
      prompt: 'Comment Titiche a-t-il appris à lire la page ?',
      answer: 'En demandant de l’aide et en lisant un peu chaque soir',
      choices: [
        'En demandant de l’aide et en lisant un peu chaque soir',
        'En faisant semblant de suivre',
        'En apprenant tout en une seule nuit',
      ],
    },
  },
  {
    id: 'yemma',
    titre: 'La surprise',
    valeur: 'La bonté envers les parents',
    niveau: 1,
    texte: [
      'Ce {matin|matin}, {maman} était fatiguée. Elle s’était levée avant {soleil}, comme chaque {jour|jour}.',
      '— Elle fait tout pour nous, dit Tomatiche. Et nous ?',
      'Sans rien dire, Titiche alla chercher {eau|de l’eau}. Tomatiche rangea {maison}. Ensemble, ils préparèrent {the} et {pain}.',
      '— {Maman} ! {Viens}',
      '{Maman} regarda la maison rangée, le thé chaud, ses deux enfants.',
      '— {Quoi}',
      '— C’est pour toi. {Merci}, {maman}, pour tous les jours.',
      '{Maman} les serra contre elle.',
      '— Que {dieu} vous garde, mes enfants.',
      '— Et demain, {sidieur}, on recommence !',
    ],
    lecon: 'Dire merci à ses parents, c’est d’abord les aider sans qu’ils le demandent.',
    question: {
      prompt: 'Comment les enfants ont-ils dit merci à leur maman ?',
      answer: 'En l’aidant sans qu’elle le demande',
      choices: [
        'En lui achetant un cadeau',
        'En l’aidant sans qu’elle le demande',
        'En restant sages dans leur chambre',
      ],
    },
  },
]

export const NB_HISTOIRES = HISTOIRES.length
export const histoireParId = (id) => HISTOIRES.find((h) => h.id === id) || null

/* ------------------------------------------------------------------ */
/* Composer le texte dans la langue du cours                           */
/* ------------------------------------------------------------------ */

/** Le parcours bêta partage le kabyle : mêmes mots (voir data/courses.js). */
const langueDeBase = (langId) => (String(langId).startsWith('kab') ? 'kab' : langId)

const majuscule = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const JETON = /\{([^}|]+)(?:\|([^}]*))?\}/g

/**
 * Un paragraphe → une suite de segments prêts à afficher.
 *   { texte }                      du français
 *   { mot, glose, premier }        un mot amazigh ; `premier` = on affiche la glose
 * `vus` est partagé entre les paragraphes d'une même histoire.
 */
function composerParagraphe(source, langId, vus) {
  const base = langueDeBase(langId)
  const segments = []
  let fin = 0
  for (const m of source.matchAll(JETON)) {
    if (m.index > fin) segments.push({ texte: source.slice(fin, m.index) })
    const brut = m[1]
    const cle = brut.toLowerCase()
    const entree = MOTS[cle]
    if (!entree) throw new Error(`histoires.js : jeton inconnu {${brut}}`)
    const cap = brut.charAt(0) !== cle.charAt(0)
    const glose = m[2] ?? entree.fr
    const mot = entree[base]
    if (mot) {
      segments.push({ mot: cap ? majuscule(mot) : mot, glose, premier: !vus.has(cle) })
      vus.add(cle)
    } else {
      segments.push({ texte: cap ? majuscule(glose) : glose })
    }
    fin = m.index + m[0].length
  }
  if (fin < source.length) segments.push({ texte: source.slice(fin) })
  return segments
}

/** Toute l'histoire, composée pour un cours : un tableau de paragraphes. */
export function composer(histoire, langId) {
  const vus = new Set()
  return histoire.texte.map((p) => composerParagraphe(p, langId, vus))
}

/** Les mots amazighs qu'une histoire fait lire dans un cours, sans doublon. */
export function motsDe(histoire, langId) {
  const mots = new Map()
  for (const p of composer(histoire, langId)) {
    for (const s of p) if (s.mot && s.premier) mots.set(s.mot.toLowerCase(), s)
  }
  return [...mots.values()]
}

/* ------------------------------------------------------------------ */
/* Le déblocage — une histoire se gagne en terminant une unité          */
/* ------------------------------------------------------------------ */

/**
 * Rang (1 = la première) de l'unité qui débloque l'histoire de rang `rang`.
 *
 * Les deux premières histoires — celles dont le début est gratuit — tombent
 * ensemble à la fin de l'unité 1, la seule unité libre : sans cela, un élève
 * non abonné ne pourrait jamais atteindre le début gratuit de la deuxième.
 * Ensuite, une histoire par unité tant que le cours a assez d'unités (kabyle),
 * et une répartition régulière sinon (les cours à quatre unités).
 */
export function uniteRequise(course, rang) {
  const u = course.units.length
  if (rang <= NB_GRATUITES_EN_PARTIE) return 1
  if (u >= NB_HISTOIRES - 1) return rang - 1
  return Math.min(u, Math.max(1, Math.ceil((rang * u) / NB_HISTOIRES)))
}

const uniteFinie = (statuses, unit) =>
  !!unit && unit.lessons.filter((l) => l.type !== 'chest').every((l) => statuses?.[l.id] === 'done')

/** L'unité (objet du cours) qui débloque cette histoire. */
export function uniteDe(course, histoire) {
  const rang = HISTOIRES.indexOf(histoire) + 1
  return course.units[uniteRequise(course, rang) - 1] || null
}

export const histoireDebloquee = (course, progress, histoire) =>
  uniteFinie(progress?.statuses, uniteDe(course, histoire))

/** Les histoires que la fin de CETTE unité vient de débloquer. */
export const histoiresDeLUnite = (course, unit) =>
  unit ? HISTOIRES.filter((h) => uniteDe(course, h)?.id === unit.id) : []

/**
 * La prochaine histoire à gagner, et ce qu'il reste à faire pour l'obtenir —
 * c'est le teaser de fin de leçon. `null` quand tout est débloqué.
 */
export function prochaineHistoire(course, progress) {
  const histoire = HISTOIRES.find((h) => !histoireDebloquee(course, progress, h))
  if (!histoire) return null
  const unite = uniteDe(course, histoire)
  if (!unite) return null
  const restantes = unite.lessons.filter(
    (l) => l.type !== 'chest' && progress?.statuses?.[l.id] !== 'done',
  ).length
  return { histoire, unite, restantes }
}

/**
 * Jusqu'où peut-on lire ? Rend le nombre de paragraphes ouverts.
 *
 * Le début des deux premières histoires est gratuit ; la suite, et toutes
 * les autres histoires, demandent l'abonnement. `suiteOuverte` vient de
 * lib/abonnement.js et suit la règle maison : un serveur muet n'interdit rien.
 */
export function paragraphesOuverts(histoire, suiteOuverte) {
  if (suiteOuverte) return histoire.texte.length
  return histoire.debutLibre || 0
}
