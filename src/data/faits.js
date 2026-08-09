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

  {
    id: 'bougafer',
    cat: 'histoire',
    texte:
      'En 1933, à Bougafer, un millier de combattants Aït Atta menés par Assou Oubasslam tinrent plus d’un mois face à des dizaines de milliers de soldats et à l’aviation — avant une reddition négociée, tête haute.',
    question: {
      prompt: 'Que s’est-il passé à Bougafer en 1933 ?',
      answer: 'La grande résistance des Aït Atta menée par Assou Oubasslam',
      choices: [
        'La grande résistance des Aït Atta menée par Assou Oubasslam',
        'La fondation d’une ville nouvelle',
        'Un tremblement de terre',
        'La signature de l’indépendance',
      ],
    },
  },
  {
    id: 'kaocen-fait',
    cat: 'histoire',
    texte:
      'En 1916, le Touareg Kaocen ag Mohammed souleva l’Aïr contre la France et assiégea Agadez pendant trois mois — le grand soulèvement touareg contre la colonisation.',
    question: {
      prompt: 'Qui mena la grande révolte touarègue de 1916-1917 ?',
      answer: 'Kaocen ag Mohammed',
      choices: ['Kaocen ag Mohammed', 'Tin Hinan', 'Abd el-Krim', 'Firhoun de Tombouctou'],
    },
  },
  {
    id: 'matanza',
    cat: 'histoire',
    texte:
      'Les Guanches des Canaries — un peuple berbère — ont résisté 94 ans à la conquête castillane (1402-1496). En 1494 à Acentejo, ils infligèrent à l’Espagne l’une de ses pires défaites du siècle.',
    question: {
      prompt: 'Combien de temps les Canaries ont-elles résisté à la conquête castillane ?',
      answer: 'Près d’un siècle — de 1402 à 1496',
      choices: ['Près d’un siècle — de 1402 à 1496', 'Deux ans', 'Dix ans', 'Elles n’ont pas résisté'],
    },
  },
  {
    id: 'papes-africains',
    cat: 'histoire',
    texte:
      'Trois papes de Rome sont venus d’Afrique du Nord : Victor Iᵉʳ, Miltiade et Gélase Iᵉʳ. L’Afrique romaine fut l’un des cœurs du christianisme ancien — Tertullien et Augustin en sont aussi les enfants.',
    question: {
      prompt: 'Lequel de ces papes venait d’Afrique du Nord ?',
      answer: 'Gélase Iᵉʳ',
      choices: ['Gélase Iᵉʳ', 'Grégoire Iᵉʳ', 'Léon Iᵉʳ', 'Innocent III'],
    },
  },
  {
    id: 'kairouan-fait',
    cat: 'histoire',
    texte:
      'Kairouan, fondée en 670 par Uqba ibn Nafi dans l’actuelle Tunisie, devint l’une des grandes villes du monde musulman — le point de départ de l’islamisation de l’Afrique du Nord.',
    question: {
      prompt: 'En quelle année Kairouan fut-elle fondée ?',
      answer: 'En 670',
      choices: ['En 670', 'En 711', 'En 943', 'En 1070'],
    },
  },
  {
    id: 'tahert',
    cat: 'histoire',
    texte:
      'Dès 761, l’imamat ibadite de Tahert rayonna sur le Maghreb central pendant un siècle et demi. Son héritage vit toujours : le Mzab, Djerba et le djebel Nefoussa sont ibadites — et berbérophones.',
    question: {
      prompt: 'Quel héritage religieux relie le Mzab, Djerba et le Nefoussa ?',
      answer: 'L’ibadisme, hérité de l’imamat de Tahert',
      choices: [
        'L’ibadisme, hérité de l’imamat de Tahert',
        'Le donatisme',
        'Le malikisme uniquement',
        'Aucun lien entre eux',
      ],
    },
  },
  {
    id: 'ghriba',
    cat: 'histoire',
    texte:
      'La présence juive en Afrique du Nord a plus de deux mille ans. À Djerba, la synagogue de la Ghriba passe pour l’une des plus anciennes traditions juives du continent africain.',
    question: {
      prompt: 'Que trouve-t-on à Djerba depuis l’Antiquité ?',
      answer: 'Une des plus anciennes communautés juives d’Afrique',
      choices: [
        'Une des plus anciennes communautés juives d’Afrique',
        'Le plus vieux monastère chrétien',
        'La première mosquée du Maghreb',
        'Un temple romain intact',
      ],
    },
  },
  {
    id: 'madghacen',
    cat: 'histoire',
    texte:
      'Le Madghacen, immense mausolée royal numide élevé il y a plus de 2 200 ans près de l’actuelle Batna, est l’un des plus anciens monuments d’Afrique du Nord — les rois amazighs bâtissaient pour l’éternité.',
    question: {
      prompt: 'Qu’est-ce que le Madghacen ?',
      answer: 'Un mausolée royal numide vieux de plus de 2 200 ans',
      choices: [
        'Un mausolée royal numide vieux de plus de 2 200 ans',
        'Une forteresse ottomane',
        'Un théâtre romain',
        'Une mosquée almohade',
      ],
    },
  },
  {
    id: 'tertullien',
    cat: 'histoire',
    texte:
      'Le premier grand auteur chrétien de langue latine n’était ni romain ni grec : Tertullien écrivait à Carthage, en Afrique du Nord, vers l’an 200.',
    question: {
      prompt: 'D’où écrivait Tertullien, premier grand auteur chrétien latin ?',
      answer: 'De Carthage, en Afrique du Nord',
      choices: ['De Carthage, en Afrique du Nord', 'De Rome', 'D’Athènes', 'De Jérusalem'],
    },
  },

  /* ---------------- langue (suite) ---------------- */
  {
    id: 'tifinagh-unicode',
    cat: 'langue',
    texte:
      'Le tifinagh est entré dans le standard Unicode en 2005 : depuis, ⵜⵉⴼⵉⵏⴰⵖ s’écrit sur n’importe quel téléphone ou ordinateur du monde — un alphabet antique devenu numérique.',
    question: {
      prompt: 'Que s’est-il passé pour le tifinagh en 2005 ?',
      answer: 'Il est entré dans le standard Unicode',
      choices: [
        'Il est entré dans le standard Unicode',
        'Il a été interdit',
        'Il a été inventé',
        'Il est devenu obligatoire en France',
      ],
    },
  },
  {
    id: 'langues-soeurs',
    cat: 'langue',
    texte:
      'Kabyle, tachelhit, tarifit, tamasheq… sont des langues SŒURS : un Kabyle et un Chleuh ne se comprennent pas spontanément, comme un Français et un Italien. Un tronc commun, des branches bien distinctes.',
    question: {
      prompt: 'Un Kabyle et un Chleuh se comprennent-ils spontanément ?',
      answer: 'Pas toujours — ce sont des langues sœurs, comme français et italien',
      choices: [
        'Pas toujours — ce sont des langues sœurs, comme français et italien',
        'Oui, parfaitement : c’est la même langue',
        'Non, aucun mot commun',
        'Seulement à l’écrit',
      ],
    },
  },
  {
    id: 'aman-commun',
    cat: 'langue',
    texte:
      'Certains mots traversent tout Tamazgha : aman (l’eau) se dit pareil — ou presque — de l’Atlantique à Siwa. Le fonds commun des langues amazighes affleure dans les mots de la vie.',
    question: {
      prompt: 'Quel mot se dit presque pareil dans toutes les langues amazighes ?',
      answer: 'Aman — l’eau',
      choices: ['Aman — l’eau', 'Bonjour', 'Merci', 'Le pain'],
    },
  },
  {
    id: 'feraoun',
    cat: 'langue',
    texte:
      'En 1950, l’instituteur kabyle Mouloud Feraoun publie Le Fils du pauvre — un classique lu depuis par des générations d’écoliers, où la Kabylie entre en littérature de l’intérieur.',
    question: {
      prompt: 'Qui a écrit Le Fils du pauvre (1950) ?',
      answer: 'Mouloud Feraoun',
      choices: ['Mouloud Feraoun', 'Mouloud Mammeri', 'Kateb Yacine', 'Assia Djebar'],
    },
  },
  {
    id: 'radio-kabyle',
    cat: 'langue',
    texte:
      'La radio parle kabyle depuis 1948 : les émissions en kabyle de Radio Alger — devenues la Chaîne 2 — ont porté la langue, ses poètes et ses contes dans les foyers bien avant l’école.',
    question: {
      prompt: 'Depuis quand la radio émet-elle en kabyle ?',
      answer: 'Depuis 1948',
      choices: ['Depuis 1948', 'Depuis 2002', 'Depuis 1980', 'Depuis 1962'],
    },
  },

  /* ---------------- culture ---------------- */
  {
    id: 'taguella',
    cat: 'culture',
    texte:
      'Au Sahara, la taguella — galette touarègue — cuit sous le sable chauffé par les braises. On la rompt et on la partage dans un même plat : le pain du désert est un pain d’hospitalité.',
    question: {
      prompt: 'Comment cuit la taguella, le pain touareg ?',
      answer: 'Sous le sable chauffé par les braises',
      choices: ['Sous le sable chauffé par les braises', 'Dans un four à bois', 'À la vapeur', 'Sur une pierre plate'],
    },
  },
  {
    id: 'burnous',
    cat: 'culture',
    texte:
      'Le burnous — grand manteau de laine à capuche, souvent blanc — est l’un des vêtements emblématiques d’Afrique du Nord ; on le pose sur les épaules des invités d’honneur.',
    question: {
      prompt: 'Qu’est-ce qu’un burnous ?',
      answer: 'Un manteau de laine à capuche',
      choices: ['Un manteau de laine à capuche', 'Un turban', 'Une ceinture brodée', 'Un tapis de selle'],
    },
  },
  {
    id: 'imensi-yennayer',
    cat: 'culture',
    texte:
      'Le soir de Yennayer, on prépare un repas d’abondance — imensi n Yennayer — souvent un couscous généreux : bien commencer l’année, c’est d’abord bien nourrir les siens.',
    question: {
      prompt: 'Qu’est-ce que l’imensi n Yennayer ?',
      answer: 'Le repas d’abondance du nouvel an amazigh',
      choices: [
        'Le repas d’abondance du nouvel an amazigh',
        'Un chant de mariage',
        'Le premier labour',
        'Une course de chevaux',
      ],
    },
  },

  /* ---------------- culture (déjà en place) ---------------- */
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
]

/** Le fait à montrer pour un index donné (rotation infinie, ordre fixe). */
export const faitPour = (index) => FAITS[((index % FAITS.length) + FAITS.length) % FAITS.length]

/** Les faits déjà vus pour un index donné — la matière du quiz. */
export const faitsVus = (index) => FAITS.slice(0, Math.min(index, FAITS.length))

export const NB_FAITS = FAITS.length
