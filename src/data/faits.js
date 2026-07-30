/**
 * Les faits — la respiration de l'app.
 *
 * Toutes les minutes environ, pendant la navigation, une carte « Le
 * savais-tu ? » offre un fait historique, linguistique ou culturel sur les
 * Amazighs. Puis le QUIZ du coin jeux repose ces faits en questions : ce
 * qu'on a lu en respirant, on le retrouve en jouant — c'est la boucle
 * voulue par Selim (instruire sans interrompre, réviser sans réviser).
 *
 * RÈGLES DU CONTENU, héritées de l'écran histoire :
 *   • chaque fait est vérifié avant d'être écrit ; les points débattus entre
 *     historiens sont dits COMME débattus ou évités ;
 *   • jamais de chiffre contesté ; on décrit ce qui est incontesté ;
 *   • le ton instruit sans jargonner : deux phrases, pas une conférence.
 *
 * Le fait affiché suit un ordre FIXE (store.faitIndex) : le quiz sait ainsi
 * exactement lesquels ont été vus — les réponses sont toujours trouvables.
 */

export const FAITS = [
  /* ---------------- langue ---------------- */
  {
    id: 'afroasiatique',
    cat: 'langue',
    texte:
      'Le berbère forme sa propre branche de la grande famille afro-asiatique — cousin de l’égyptien ancien, et non un dialecte de quoi que ce soit.',
    question: {
      prompt: 'À quelle famille de langues appartient le berbère ?',
      answer: 'La famille afro-asiatique, dont il forme une branche',
      choices: [
        'La famille afro-asiatique, dont il forme une branche',
        'La famille indo-européenne',
        'C’est un dialecte de l’arabe',
        'La famille nigéro-congolaise',
      ],
    },
  },
  {
    id: 'homme-libre',
    cat: 'langue',
    texte:
      'Amazigh est le nom que le peuple se donne : on l’interprète le plus souvent comme « homme libre ». Le pluriel est Imazighen.',
    question: {
      prompt: 'Que signifie le plus souvent « Amazigh » ?',
      answer: 'Homme libre',
      choices: ['Homme libre', 'Homme des montagnes', 'Homme du désert', 'Homme voilé'],
    },
  },
  {
    id: 'libyco-berbere',
    cat: 'langue',
    texte:
      'Le tifinagh descend de l’alphabet libyco-berbère, gravé sur des pierres d’Afrique du Nord depuis plus de deux mille ans. Peu d’alphabets vivants ont une si longue mémoire.',
    question: {
      prompt: 'De quelle écriture descend le tifinagh ?',
      answer: 'De l’alphabet libyco-berbère antique',
      choices: [
        'De l’alphabet libyco-berbère antique',
        'De l’alphabet arabe',
        'De l’alphabet latin',
        'Des hiéroglyphes égyptiens',
      ],
    },
  },
  {
    id: 'touaregs-tifinagh',
    cat: 'langue',
    texte:
      'Ce sont les Touaregs du Sahara qui ont gardé le tifinagh vivant sans interruption jusqu’à aujourd’hui — souvent transmis par les mères, en traçant les lettres dans le sable.',
    question: {
      prompt: 'Qui a conservé le tifinagh sans interruption jusqu’à nos jours ?',
      answer: 'Les Touaregs du Sahara',
      choices: ['Les Touaregs du Sahara', 'Les moines de Kabylie', 'Les scribes de Carthage', 'Les imprimeurs de Fès'],
    },
  },
  {
    id: 'yaz',
    cat: 'langue',
    texte:
      'La lettre ⵣ (yaz) est devenue LE symbole amazigh : elle figure l’homme libre, et elle est au centre du drapeau amazigh. Tu la vois partout dans Tama Speak.',
    question: {
      prompt: 'Quelle lettre tifinagh est le symbole de l’homme libre ?',
      answer: 'ⵣ (yaz)',
      choices: ['ⵣ (yaz)', 'ⴰ (ya)', 'ⵎ (yam)', 'ⵜ (yat)'],
    },
  },
  {
    id: 'feminin-t',
    cat: 'langue',
    texte:
      'En tamazight, le féminin s’écrit souvent en encadrant le mot d’un t… t : amɣar (le vieil homme) devient tamɣart (la vieille femme). Amazigh → Tamazight suit la même logique.',
    question: {
      prompt: 'Comment se forme souvent le féminin en tamazight ?',
      answer: 'En encadrant le mot par t…t (amɣar → tamɣart)',
      choices: [
        'En encadrant le mot par t…t (amɣar → tamɣart)',
        'En ajoutant -a à la fin',
        'En doublant la première lettre',
        'Il n’y a pas de féminin',
      ],
    },
  },
  {
    id: 'racines',
    cat: 'langue',
    texte:
      'Les mots berbères se construisent sur des racines de consonnes. De la racine ẒR (« voir ») viennent des mots comme yeẓra (« il a vu ») — une même racine, toute une famille de mots.',
    question: {
      prompt: 'Sur quoi se construisent les mots berbères ?',
      answer: 'Sur des racines de consonnes',
      choices: ['Sur des racines de consonnes', 'Sur des tons musicaux', 'Sur des préfixes latins', 'Sur des idéogrammes'],
    },
  },
  {
    id: 'millions',
    cat: 'langue',
    texte:
      'Les langues berbères comptent des dizaines de millions de locuteurs — les estimations vont d’environ 25 à plus de 30 millions, du Maroc à l’Égypte et jusqu’au Sahel.',
    question: {
      prompt: 'Combien de personnes parlent une langue berbère, environ ?',
      answer: 'Entre 25 et plus de 30 millions',
      choices: ['Entre 25 et plus de 30 millions', 'Environ 2 millions', 'Environ 500 000', 'Plus de 200 millions'],
    },
  },
  {
    id: 'siwa',
    cat: 'langue',
    texte:
      'On parle berbère jusqu’en Égypte : l’oasis de Siwa, à l’ouest du pays, a sa propre langue amazighe, le siwi. C’est la pointe la plus orientale du monde berbère.',
    question: {
      prompt: 'Dans quel pays se trouve l’oasis berbérophone de Siwa ?',
      answer: 'En Égypte',
      choices: ['En Égypte', 'En Libye', 'En Tunisie', 'Au Soudan'],
    },
  },
  {
    id: 'guanches',
    cat: 'langue',
    texte:
      'Les Guanches, premiers habitants des îles Canaries, parlaient une langue berbère. L’archipel fait donc partie de l’histoire amazighe — en plein océan Atlantique.',
    question: {
      prompt: 'Quel archipel fut peuplé de berbérophones, les Guanches ?',
      answer: 'Les îles Canaries',
      choices: ['Les îles Canaries', 'Les Baléares', 'Madère', 'Les Açores'],
    },
  },
  {
    id: 'tamasheq',
    cat: 'langue',
    texte:
      'La langue des Touaregs — tamasheq, tamahaq selon les régions — se parle sur un territoire immense : Algérie, Libye, Mali, Niger, Burkina Faso. Une même langue, cinq pays.',
    question: {
      prompt: 'Comment s’appelle la langue des Touaregs ?',
      answer: 'Le tamasheq (ou tamahaq)',
      choices: ['Le tamasheq (ou tamahaq)', 'Le tachelhit', 'Le rifain', 'Le siwi'],
    },
  },
  {
    id: 'etat-annexion',
    cat: 'langue',
    texte:
      'Le kabyle n’a pas d’article « le/la » : c’est le mot lui-même qui change de forme selon son rôle dans la phrase — argaz (l’homme) devient wergaz après certaines prépositions.',
    question: {
      prompt: 'Comment le kabyle marque-t-il ce que le français dit avec « le/la » ?',
      answer: 'Le mot change de forme selon son rôle',
      choices: [
        'Le mot change de forme selon son rôle',
        'Avec un article placé après le nom',
        'Avec l’article emprunté au français',
        'Il ne le marque jamais',
      ],
    },
  },
  {
    id: 'agadir-mot',
    cat: 'langue',
    texte:
      'Agadir n’est pas qu’une ville : en tachelhit, agadir désigne le grenier collectif fortifié où chaque famille gardait ses récoltes. Le Maroc en conserve des centaines, les igudar.',
    question: {
      prompt: 'Que signifie « agadir » en tachelhit ?',
      answer: 'Un grenier collectif fortifié',
      choices: ['Un grenier collectif fortifié', 'Un port de pêche', 'Une montagne', 'Un marché'],
    },
  },
  {
    id: 'mammeri-grammaire',
    cat: 'langue',
    texte:
      'En 1976, l’écrivain Mouloud Mammeri publie Tajerrumt n tmaziɣt, une grammaire du kabyle écrite EN kabyle — un acte fondateur pour l’enseignement de la langue.',
    question: {
      prompt: 'Qu’a publié Mouloud Mammeri en 1976 ?',
      answer: 'Une grammaire du kabyle écrite en kabyle',
      choices: [
        'Une grammaire du kabyle écrite en kabyle',
        'Le premier roman en tifinagh',
        'Un dictionnaire arabe-français',
        'Un atlas du Maghreb',
      ],
    },
  },
  {
    id: 'ircam',
    cat: 'langue',
    texte:
      'Depuis 2003, le tifinagh est la graphie officielle de l’amazighe au Maroc : c’est l’IRCAM, l’institut royal de la culture amazighe, qui a standardisé l’alphabet enseigné à l’école.',
    question: {
      prompt: 'Quelle graphie le Maroc a-t-il choisie pour l’amazighe à l’école ?',
      answer: 'Le tifinagh',
      choices: ['Le tifinagh', 'L’alphabet latin', 'L’alphabet arabe', 'Au choix de chaque école'],
    },
  },

  /* ---------------- histoire ---------------- */
  {
    id: 'chachnaq',
    cat: 'histoire',
    texte:
      'Un Amazigh a été pharaon : vers 943 avant notre ère, Chachnaq, issu du peuple libyen des Meshwesh, fonde la XXIIᵉ dynastie d’Égypte. Le calendrier amazigh compte les années depuis son règne.',
    question: {
      prompt: 'Qui fonde la XXIIᵉ dynastie d’Égypte vers 943 av. J.-C. ?',
      answer: 'Chachnaq, un Amazigh des Meshwesh',
      choices: ['Chachnaq, un Amazigh des Meshwesh', 'Ramsès II', 'Massinissa', 'Hannibal'],
    },
  },
  {
    id: 'augustin',
    cat: 'histoire',
    texte:
      'Saint Augustin, l’un des penseurs les plus lus de l’histoire, est né en 354 à Thagaste — aujourd’hui Souk Ahras, en Algérie — dans une famille d’Afrique du Nord.',
    question: {
      prompt: 'Où est né saint Augustin en 354 ?',
      answer: 'À Thagaste, l’actuelle Souk Ahras (Algérie)',
      choices: ['À Thagaste, l’actuelle Souk Ahras (Algérie)', 'À Rome', 'À Carthage', 'À Alexandrie'],
    },
  },
  {
    id: 'apulee',
    cat: 'histoire',
    texte:
      'Le plus ancien roman latin conservé en entier, L’Âne d’or, a été écrit au IIᵉ siècle par Apulée de Madaure, un Nord-Africain qui se disait lui-même « mi-Numide, mi-Gétule ».',
    question: {
      prompt: 'Qui a écrit L’Âne d’or, plus ancien roman latin conservé ?',
      answer: 'Apulée de Madaure, un Nord-Africain',
      choices: ['Apulée de Madaure, un Nord-Africain', 'Virgile', 'Cicéron', 'Sénèque'],
    },
  },
  {
    id: 'juba',
    cat: 'histoire',
    texte:
      'Juba II, roi amazigh de Maurétanie, était aussi un savant : il écrivit des dizaines d’ouvrages et épousa Cléopâtre Séléné, la fille de Cléopâtre. Sa capitale : Caesarea, l’actuelle Cherchell.',
    question: {
      prompt: 'Qui Juba II, roi de Maurétanie, épousa-t-il ?',
      answer: 'Cléopâtre Séléné, fille de Cléopâtre',
      choices: ['Cléopâtre Séléné, fille de Cléopâtre', 'Une princesse romaine', 'La reine Dihya', 'Une princesse numide'],
    },
  },
  {
    id: 'tariq',
    cat: 'histoire',
    texte:
      'En 711, le général amazigh Tariq ibn Ziyad franchit le détroit vers l’Espagne. Le rocher où il débarque porte encore son nom : Gibraltar vient de Jabal Tariq, « la montagne de Tariq ».',
    question: {
      prompt: 'D’où vient le nom « Gibraltar » ?',
      answer: 'De Jabal Tariq, la montagne de Tariq ibn Ziyad',
      choices: [
        'De Jabal Tariq, la montagne de Tariq ibn Ziyad',
        'D’un mot phénicien pour « détroit »',
        'D’un général romain',
        'D’un roi wisigoth',
      ],
    },
  },
  {
    id: 'tin-hinan',
    cat: 'histoire',
    texte:
      'Les Touaregs se disent descendants de Tin Hinan, une ancêtre fondatrice. Un monument funéraire du IVᵉ siècle, à Abalessa dans le Hoggar, porte son nom — une femme à l’origine de tout un peuple.',
    question: {
      prompt: 'Qui est Tin Hinan pour les Touaregs ?',
      answer: 'L’ancêtre fondatrice dont ils se disent descendants',
      choices: [
        'L’ancêtre fondatrice dont ils se disent descendants',
        'Une déesse du désert',
        'La première reine des Aurès',
        'Une poétesse du XXᵉ siècle',
      ],
    },
  },
  {
    id: 'fatma-nsoumer',
    cat: 'histoire',
    texte:
      'Dans les années 1850, Lalla Fatma n’Soumer prend la tête de la résistance kabyle contre la conquête française. Capturée en 1857, elle meurt en détention en 1863 — à 33 ans.',
    question: {
      prompt: 'Qui mena la résistance kabyle dans les années 1850 ?',
      answer: 'Lalla Fatma n’Soumer',
      choices: ['Lalla Fatma n’Soumer', 'Dihya', 'Tin Hinan', 'La reine de Tigzirt'],
    },
  },
  {
    id: 'abdelkrim',
    cat: 'histoire',
    texte:
      'En 1921, à Anoual, Abd el-Krim al-Khattabi inflige à l’armée espagnole l’une de ses pires défaites. La république du Rif qu’il proclame tiendra cinq ans face à deux puissances coloniales.',
    question: {
      prompt: 'Que proclame Abd el-Krim après sa victoire d’Anoual ?',
      answer: 'La république du Rif',
      choices: ['La république du Rif', 'Le royaume du Maroc', 'L’indépendance de l’Algérie', 'L’émirat des Aurès'],
    },
  },
  {
    id: 'dynasties',
    cat: 'histoire',
    texte:
      'Almoravides, Almohades, Mérinides, Zirides, Hammadides : pendant des siècles, ce sont des dynasties amazighes qui ont gouverné le Maghreb — et parfois jusqu’en Andalousie.',
    question: {
      prompt: 'Lesquelles de ces dynasties sont amazighes ?',
      answer: 'Les Almoravides, Almohades et Mérinides',
      choices: [
        'Les Almoravides, Almohades et Mérinides',
        'Les Omeyyades et Abbassides',
        'Les Fatimides seulement',
        'Aucune : le Maghreb n’a pas eu de dynastie locale',
      ],
    },
  },
  {
    id: 'ibn-khaldoun',
    cat: 'histoire',
    texte:
      'Au XIVᵉ siècle, l’historien Ibn Khaldoun consacre une somme entière à l’histoire des Berbères — et les décrit comme un peuple porteur « des vertus qui font l’honneur des nations ».',
    question: {
      prompt: 'Quel historien du XIVᵉ siècle a écrit une histoire des Berbères ?',
      answer: 'Ibn Khaldoun',
      choices: ['Ibn Khaldoun', 'Hérodote', 'Al-Idrissi', 'Léon l’Africain'],
    },
  },
  {
    id: 'cirta',
    cat: 'histoire',
    texte:
      'La capitale du royaume numide s’appelait Cirta. Elle existe toujours : c’est Constantine, en Algérie — l’une des plus anciennes villes du monde habitées sans interruption.',
    question: {
      prompt: 'Quelle ville actuelle fut Cirta, capitale de la Numidie ?',
      answer: 'Constantine',
      choices: ['Constantine', 'Alger', 'Tunis', 'Oran'],
    },
  },

  /* ---------------- culture ---------------- */
  {
    id: 'couscous',
    cat: 'culture',
    texte:
      'Le couscous — seksu en berbère — est né en Afrique du Nord. En 2020, l’UNESCO l’a inscrit au patrimoine immatériel de l’humanité, sur un dossier commun de quatre pays du Maghreb.',
    question: {
      prompt: 'Quand le couscous est-il entré au patrimoine de l’UNESCO ?',
      answer: 'En 2020',
      choices: ['En 2020', 'En 1982', 'En 2003', 'Il n’y est pas'],
    },
  },
  {
    id: 'bijoux-yenni',
    cat: 'culture',
    texte:
      'Les bijoux kabyles en argent, corail et émaux bleus, verts et jaunes viennent surtout des Ath Yenni, en Kabylie. La fibule tabzimt que tu gagnes dans l’app en est un.',
    question: {
      prompt: 'De quel village viennent les célèbres bijoux émaillés kabyles ?',
      answer: 'Des Ath Yenni',
      choices: ['Des Ath Yenni', 'De Tlemcen', 'De Fès', 'De Ghardaïa'],
    },
  },
  {
    id: 'motifs-tissage',
    cat: 'culture',
    texte:
      'Sur les tapis et les poteries berbères, les motifs ne sont pas de simples décorations : losanges, chevrons et croix forment un langage de symboles — protection, fécondité, terre — transmis de mère en fille.',
    question: {
      prompt: 'Que sont les motifs géométriques des tapis berbères ?',
      answer: 'Un langage de symboles transmis de mère en fille',
      choices: [
        'Un langage de symboles transmis de mère en fille',
        'De simples décorations',
        'Des marques de fabricants',
        'Des copies de motifs romains',
      ],
    },
  },
  {
    id: 'arganier',
    cat: 'culture',
    texte:
      'L’arganier ne pousse à l’état naturel que dans le sud-ouest du Maroc, en pays tachelhit. L’huile d’argan, pressée à la main par des coopératives de femmes, en est le trésor.',
    question: {
      prompt: 'Où l’arganier pousse-t-il à l’état naturel ?',
      answer: 'Dans le sud-ouest du Maroc',
      choices: ['Dans le sud-ouest du Maroc', 'Dans tout le Sahara', 'En Kabylie', 'Aux Canaries'],
    },
  },
  {
    id: 'idir-vava',
    cat: 'culture',
    texte:
      'Dans les années 1970, la chanson A Vava Inouva d’Idir — une berceuse kabyle inspirée des veillées — fait le tour du monde et est traduite dans de nombreuses langues.',
    question: {
      prompt: 'Quelle chanson kabyle d’Idir a fait le tour du monde ?',
      answer: 'A Vava Inouva',
      choices: ['A Vava Inouva', 'Ya Rayah', 'Aïcha', 'Abdel Kader'],
    },
  },
  {
    id: 'an-amazigh',
    cat: 'culture',
    texte:
      'Le calendrier amazigh a environ 950 ans d’avance sur le calendrier grégorien : quand tu fêtes 2026, Yennayer ouvre l’an 2976 — les années se comptent depuis le règne du pharaon Chachnaq.',
    question: {
      prompt: 'Quel an amazigh commence pendant l’année 2026 ?',
      answer: '2976',
      choices: ['2976', '2026', '1445', '3026'],
    },
  },
  {
    id: 'taqbaylit-code',
    cat: 'culture',
    texte:
      'Dans les villages kabyles, les affaires communes se décident à la tajmaɛt, l’assemblée du village — une tradition d’organisation collective bien plus ancienne que les mairies.',
    question: {
      prompt: 'Comment s’appelle l’assemblée traditionnelle du village kabyle ?',
      answer: 'La tajmaɛt',
      choices: ['La tajmaɛt', 'La zaouïa', 'Le souk', 'La kasbah'],
    },
  },
  {
    id: 'ahellil',
    cat: 'culture',
    texte:
      'L’ahellil du Gourara — chants collectifs en berbère zénète des oasis algériennes — a été proclamé chef-d’œuvre du patrimoine immatériel de l’humanité par l’UNESCO en 2005.',
    question: {
      prompt: 'Qu’est-ce que l’ahellil du Gourara ?',
      answer: 'Un chant collectif berbère des oasis, distingué par l’UNESCO',
      choices: [
        'Un chant collectif berbère des oasis, distingué par l’UNESCO',
        'Une danse guerrière du Rif',
        'Un plat de fête',
        'Un tissage saharien',
      ],
    },
  },
]

/** Le fait à montrer pour un index donné (rotation infinie, ordre fixe). */
export const faitPour = (index) => FAITS[((index % FAITS.length) + FAITS.length) % FAITS.length]

/** Les faits déjà vus pour un index donné — la matière du quiz. */
export const faitsVus = (index) => FAITS.slice(0, Math.min(index, FAITS.length))

export const NB_FAITS = FAITS.length
