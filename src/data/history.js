/**
 * L'histoire des Amazighs, de la préhistoire à aujourd'hui.
 *
 * POURQUOI CE CONTENU EST COMMUN À TOUTES LES LANGUES et non rangé dans les
 * unités d'un cours : cette histoire est celle de tous les Amazighs. La
 * dupliquer dans les cinq cours multiplierait le même texte par cinq et
 * ferait dépendre l'accès au récit du niveau de langue atteint. Elle vit donc
 * dans son propre écran, lisible dès le premier jour.
 *
 * SOURCES — chaque date ci-dessous a été vérifiée avant d'être écrite :
 *   • Tassili n'Ajjer, Wikipédia EN (art rupestre, 15 000 gravures, UNESCO 1982)
 *   • Berbers / Numidia (Numidie 202–46 av. J.-C., Massinissa mort en 148)
 *   • Jugurtha (règne 118–105, guerre 112–105, mort à Rome en 104)
 *   • Kusaila (Awraba, Altava, Vescera 683, mort en 688)
 *   • Dihya (Aurès, Meskiana 698, morte en 703)
 *   • Almoravid dynasty (Lamtuna/Gudala/Massufa, Marrakech v. 1070, fin 1147)
 *   • Almohad Caliphate (Ibn Tumart, Masmuda, v. 1121 ; Abd al-Mu'min)
 *   • Berber Spring (conférence de Mammeri interdite le 10 mars 1980)
 *   • Tamazight (Maroc officielle le 29 juillet 2011 ; Algérie nationale en
 *     2002, officielle le 7 février 2016)
 *   • Yennayer (12 janvier ; calendrier fixé par Ammar Negadi en 1980, an 1 =
 *     943 av. J.-C. ; férié en Algérie depuis 2018, au Maroc depuis 2023)
 *   • Shoshenq I (Meshwesh, XXIIᵉ dynastie, v. 943 av. J.-C., « Shishak »)
 *   • Juba II (roi de Maurétanie, Caesarea/Cherchell, Cléopâtre Séléné ;
 *     fils Ptolémée tué en 40, annexion romaine)
 *   • Augustine of Hippo (Thagaste 354, évêque d'Hippone 396, mort en 430
 *     pendant le siège vandale)
 *   • Tin Hinan (tombeau d'Abalessa, Hoggar, IVᵉ–Vᵉ s., fouillé en 1925)
 *   • Tariq ibn Ziyad (711, Guadalete ; Gibraltar = Jabal Ṭāriq)
 *   • Ibn Khaldun (Tunis 1332 – Le Caire 1406, Kitāb al-ʿIbar)
 *   • Lalla Fatma n'Soumer (résistance 1854–1857, capturée en 1857,
 *     morte en 1863)
 *   • Abd el-Krim / Rif War (Anoual juillet 1921, république du Rif,
 *     reddition 1926)
 *
 * ⚠️ UN CHIFFRE ÉCARTÉ VOLONTAIREMENT. Les articles du « Printemps berbère »
 * (1980) et du « Printemps noir » (2001) annoncent tous deux 128 morts : c'est
 * une contamination d'une fiche à l'autre. Le bilan de 2001 est solidement
 * établi ; celui de 1980 ne l'est pas. Aucun chiffre de morts n'est donc donné
 * pour 1980 — on décrit ce qui est incontesté.
 *
 * Les points débattus entre historiens (la tribu de Dihya, sa religion, la
 * conversion de Kusayla) sont présentés COMME débattus. Sur une histoire aussi
 * disputée, trancher à la place des historiens serait le pire service à rendre.
 */

/**
 * Un récit = un texte court illustré + une question.
 * `land` renvoie à un paysage de `data/journey.js` — ce sont les images déjà
 * dessinées pour l'app, pas de nouvelles illustrations à produire.
 */
export const RECITS = [
  {
    id: 'tassili',
    epoque: 'Il y a 12 000 ans',
    titre: 'Les images du Sahara',
    land: 'tassili',
    texte: [
      'Avant l’écriture, avant les royaumes, il y avait des peintures. Sur le plateau du Tassili n’Ajjer, au sud-est de l’Algérie, plus de quinze mille gravures et peintures couvrent la roche.',
      'On y voit des troupeaux, des antilopes, des crocodiles, des gens qui chassent et qui dansent. Des crocodiles — au milieu du Sahara. Car le désert n’a pas toujours été un désert : ces images racontent une terre verte, parcourue de rivières.',
      'Les plus anciennes remontent à environ douze mille ans. L’UNESCO a classé le site au patrimoine mondial en 1982.',
    ],
    question: {
      prompt: 'Que montrent surtout les peintures du Tassili n’Ajjer ?',
      answer: 'Des troupeaux et des animaux d’une terre verte',
      choices: [
        'Des troupeaux et des animaux d’une terre verte',
        'Des scènes de guerre entre royaumes',
        'Des cartes du désert actuel',
        'Des textes en tifinagh',
      ],
    },
  },
  {
    id: 'chachnaq',
    epoque: 'Vers 943 av. J.-C.',
    titre: 'Chachnaq, l’Amazigh pharaon',
    land: 'oasis',
    texte: [
      'Vers 943 avant notre ère, un chef issu des Meshwesh — un peuple libyen, ancêtre des Amazighs — monte sur le trône d’Égypte : Chachnaq Iᵉʳ fonde la XXIIᵉ dynastie.',
      'Ce n’est pas une légende : les pierres d’Égypte portent son nom, et la Bible se souvient de lui sous celui de « Shishak », le roi qui marcha sur Jérusalem.',
      'C’est depuis son accession que le calendrier amazigh compte les années. Quand tu fêtes Yennayer, c’est à ce règne-là que remonte le compte.',
    ],
    question: {
      prompt: 'Qu’a fondé Chachnaq vers 943 avant notre ère ?',
      answer: 'La XXIIᵉ dynastie d’Égypte',
      choices: [
        'La XXIIᵉ dynastie d’Égypte',
        'Le royaume de Numidie',
        'La ville de Carthage',
        'Le premier alphabet tifinagh',
      ],
    },
  },
  {
    id: 'massinissa',
    epoque: 'IIIᵉ–IIᵉ siècle av. J.-C.',
    titre: 'Massinissa et le royaume numide',
    land: 'aures',
    texte: [
      'La Numidie fut un royaume amazigh, dans ce qui est aujourd’hui l’est de l’Algérie et la Tunisie. Elle exista comme État de 202 à 46 avant notre ère.',
      'Son roi le plus célèbre, Massinissa, s’allia à Rome contre Carthage. À sa mort, en 148 avant notre ère, son territoire s’étendait de la Maurétanie jusqu’aux frontières carthaginoises.',
      'On lui prête d’avoir voulu sédentariser son peuple et développer l’agriculture. Ce n’était pas un chef de tribu : c’était un roi, avec une monnaie, des villes et une diplomatie.',
    ],
    question: {
      prompt: 'Contre quelle puissance Massinissa s’allia-t-il à Rome ?',
      answer: 'Carthage',
      choices: ['Carthage', 'L’Égypte', 'La Grèce', 'La Perse'],
    },
  },
  {
    id: 'jugurtha',
    epoque: 'IIᵉ siècle av. J.-C.',
    titre: 'Jugurtha, tenir tête à Rome',
    land: 'kmont',
    texte: [
      'Petit-fils de Massinissa, Jugurtha règne sur la Numidie de 118 à 105 avant notre ère. Il tient tête à Rome pendant sept ans : c’est la guerre de Jugurtha, de 112 à 105.',
      'Rome ne le bat pas sur le champ de bataille. Elle l’obtient par une trahison : son allié Bocchus, roi de Maurétanie, le livre en échange de terres.',
      'Emmené à Rome et exhibé dans un triomphe, il meurt en prison en 104 avant notre ère. Son nom est resté celui de la résistance.',
    ],
    question: {
      prompt: 'Comment Rome finit-elle par vaincre Jugurtha ?',
      answer: 'Par la trahison d’un allié qui le livre',
      choices: [
        'Par la trahison d’un allié qui le livre',
        'Par une grande bataille rangée',
        'Par un siège de sa capitale',
        'Par un traité de paix négocié',
      ],
    },
  },
  {
    id: 'juba',
    epoque: 'Ier siècle av.–ap. J.-C.',
    titre: 'Juba II, le roi savant',
    land: 'kcote',
    texte: [
      'Fils d’un roi numide vaincu, élevé à Rome, Juba II reçoit de l’empereur le trône de Maurétanie. Il épouse Cléopâtre Séléné — la fille de Cléopâtre et de Marc Antoine.',
      'Sa capitale, Caesarea — aujourd’hui Cherchell, sur la côte algérienne — devient une ville d’art et de savoir. Car Juba est d’abord un érudit : géographie, histoire, botanique, il écrit des dizaines d’ouvrages, que les auteurs romains citeront pendant des siècles.',
      'Son fils Ptolémée, dernier roi amazigh de Maurétanie, est tué en 40 sur ordre de l’empereur Caligula. Rome annexe alors le royaume — la souveraineté amazighe antique s’éteint là.',
    ],
    question: {
      prompt: 'Qui Juba II épousa-t-il ?',
      answer: 'Cléopâtre Séléné, fille de Cléopâtre',
      choices: [
        'Cléopâtre Séléné, fille de Cléopâtre',
        'Une princesse romaine',
        'La fille de Massinissa',
        'Une reine de Carthage',
      ],
    },
  },
  {
    id: 'augustin',
    epoque: '354–430',
    titre: 'Augustin, le géant de Thagaste',
    land: 'kmont',
    texte: [
      'En 354 naît à Thagaste — aujourd’hui Souk Ahras, en Algérie — un enfant de Numidie nommé Augustin. Sa mère, Monique, porte un nom que l’on rattache souvent à cette terre.',
      'Professeur à Carthage, puis à Rome et Milan, il devient évêque d’Hippone — l’actuelle Annaba. Ses Confessions et La Cité de Dieu comptent parmi les livres les plus lus de l’histoire humaine.',
      'Il meurt en 430, pendant le siège de sa ville. Seize siècles plus tard, on le lit toujours — et il est né, a pensé et est mort en Afrique du Nord.',
    ],
    question: {
      prompt: 'De quelle ville Augustin fut-il évêque ?',
      answer: 'Hippone, l’actuelle Annaba',
      choices: ['Hippone, l’actuelle Annaba', 'Carthage', 'Rome', 'Alexandrie'],
    },
  },
  {
    id: 'tinhinan',
    epoque: 'IVᵉ–Vᵉ siècle',
    titre: 'Tin Hinan, la mère des Touaregs',
    land: 'hoggar',
    texte: [
      'Au cœur du Hoggar, à Abalessa, se dresse un monument funéraire du IVᵉ ou Vᵉ siècle. Les Touaregs y voient le tombeau de Tin Hinan, l’ancêtre dont leurs nobles se disent les descendants.',
      'En 1925, des fouilles y ont mis au jour le squelette d’une femme parée de bijoux d’or et d’argent, enterrée avec les honneurs d’une reine.',
      'Que la tradition et l’archéologie parlent exactement de la même personne, nul ne peut le jurer. Mais l’idée demeure, immense : tout un peuple du désert qui fait remonter son origine à une femme.',
    ],
    question: {
      prompt: 'Où se trouve le tombeau attribué à Tin Hinan ?',
      answer: 'À Abalessa, dans le Hoggar',
      choices: ['À Abalessa, dans le Hoggar', 'À Tombouctou', 'Dans les Aurès', 'À Ghadamès'],
    },
  },
  {
    id: 'kusayla',
    epoque: 'VIIᵉ siècle',
    titre: 'Kusayla',
    land: 'ksar',
    texte: [
      'Au VIIᵉ siècle, Kusayla dirige les Awraba et le royaume d’Altava. Son autorité s’étend de Volubilis, à l’ouest, jusqu’aux Aurès.',
      'En 683, à Vescera — près de l’actuelle Biskra — il défait et tue Uqba ibn Nafi, le fondateur de Kairouan. Il contrôle alors une grande partie de l’Afrique du Nord.',
      'Il meurt en 688 à la bataille de Mamma, très largement inférieur en nombre. Les historiens débattent encore de sa religion et d’une éventuelle conversion : les sources les plus anciennes et les plus tardives ne racontent pas la même histoire.',
    ],
    question: {
      prompt: 'Qu’arrive-t-il à Vescera en 683 ?',
      answer: 'Kusayla y défait et tue Uqba ibn Nafi',
      choices: [
        'Kusayla y défait et tue Uqba ibn Nafi',
        'Kusayla y est fait prisonnier',
        'Kairouan y est fondée',
        'Les Almoravides y sont battus',
      ],
    },
  },
  {
    id: 'dihya',
    epoque: 'VIIᵉ–VIIIᵉ siècle',
    titre: 'Dihya, la reine des Aurès',
    land: 'aures',
    texte: [
      'Après Kusayla, la résistance se rassemble autour d’une femme : Dihya, que les chroniques arabes appellent al-Kahina, « la devineresse ».',
      'Elle règne sur les Aurès, et son autorité porte jusqu’à l’oasis de Ghadamès. En 698, à Meskiana, elle bat le général Hassan ibn al-Nu‘man, qui doit se replier cinq ans durant.',
      'Elle meurt en 703 dans les Aurès. Presque tout le reste est discuté : sa tribu — les Lūwāta pour l’un, les Jarawa pour Ibn Khaldoun —, sa religion, son âge. Ce qui est certain, c’est qu’elle a commandé, gagné, et qu’on s’en souvient encore.',
    ],
    question: {
      prompt: 'Sur quelle région Dihya régnait-elle ?',
      answer: 'Les Aurès',
      choices: ['Les Aurès', 'Le Rif', 'Le Hoggar', 'La vallée du M’zab'],
    },
  },
  {
    id: 'tariq',
    epoque: '711',
    titre: 'Tariq et la montagne',
    land: 'rif',
    texte: [
      'En 711, le général amazigh Tariq ibn Ziyad franchit le détroit qui sépare l’Afrique de l’Espagne, à la tête d’une armée en grande partie berbère.',
      'À la bataille du Guadalete, il défait le roi wisigoth Rodéric. En quelques années, la péninsule bascule : c’est le début d’al-Andalus, huit siècles d’histoire.',
      'Le rocher où il posa le pied porte toujours son nom : Gibraltar, de Jabal Ṭāriq — « la montagne de Tariq ». Un nom amazigh à la porte de l’Europe, sur toutes les cartes du monde.',
    ],
    question: {
      prompt: 'Que signifie « Gibraltar » ?',
      answer: 'Jabal Ṭāriq — la montagne de Tariq',
      choices: [
        'Jabal Ṭāriq — la montagne de Tariq',
        'Le rocher des singes',
        'La porte de l’Espagne',
        'Le détroit du couchant',
      ],
    },
  },
  {
    id: 'almoravides',
    epoque: 'XIᵉ–XIIᵉ siècle',
    titre: 'Les Almoravides',
    land: 'dunes',
    texte: [
      'Dans les années 1050, une coalition de tribus sahariennes — Lamtuna, Gudala, Massufa — se forme dans l’actuelle Mauritanie et au Sahara occidental. Ce sont les Almoravides.',
      'Ils fondent Marrakech vers 1070 et en font leur capitale. Prennent Fès, Tlemcen, Alger, Ceuta, puis Grenade, Cordoue et Séville de l’autre côté du détroit.',
      'À leur apogée, vers 1120, leur empire couvre environ un million de kilomètres carrés — d’Aoudaghost, au sud du Sahara, jusqu’à Saragosse. Il tombe en 1147.',
    ],
    question: {
      prompt: 'Quelle ville les Almoravides fondent-ils vers 1070 ?',
      answer: 'Marrakech',
      choices: ['Marrakech', 'Fès', 'Tlemcen', 'Kairouan'],
    },
  },
  {
    id: 'almohades',
    epoque: 'XIIᵉ–XIIIᵉ siècle',
    titre: 'Les Almohades',
    land: 'atlas',
    texte: [
      'Vers 1121, Ibn Tumart fonde un mouvement parmi les tribus Masmuda du Haut Atlas. Après sa mort en 1130, Abd al-Mu’min lui succède et fonde la dynastie qui régnera.',
      'Les Almohades renversent les Almoravides et bâtissent un empire encore plus vaste : à son apogée, entre 1180 et 1212, il tient une grande partie du Maghreb et d’al-Andalus.',
      'Deux empires successifs, tous deux nés de tribus amazighes, l’un du Sahara et l’autre de l’Atlas, ont ainsi gouverné d’un bout à l’autre de l’Occident musulman.',
    ],
    question: {
      prompt: 'De quelles tribus les Almohades sont-ils issus ?',
      answer: 'Les Masmuda du Haut Atlas',
      choices: [
        'Les Masmuda du Haut Atlas',
        'Les Lamtuna du Sahara',
        'Les Awraba de l’ouest',
        'Les Jarawa des Aurès',
      ],
    },
  },
  {
    id: 'ibnkhaldoun',
    epoque: 'XIVᵉ siècle',
    titre: 'Ibn Khaldoun et les Berbères',
    land: 'mzab',
    texte: [
      'Né à Tunis en 1332, mort au Caire en 1406, Ibn Khaldoun est l’un des plus grands historiens de tous les temps — beaucoup voient en lui un fondateur de la sociologie.',
      'Dans sa grande œuvre, le Kitāb al-ʿIbar, il consacre des volumes entiers à l’histoire des Berbères : dynasties, tribus, généalogies — la source majeure sur le Maghreb médiéval.',
      'Lui qui avait servi les cours mérinide, hafside et zianide écrit des Berbères qu’ils possèdent les vertus qui font l’honneur des nations. Le compliment, sept siècles plus tard, se lit encore.',
    ],
    question: {
      prompt: 'Que contient le Kitāb al-ʿIbar d’Ibn Khaldoun ?',
      answer: 'Une histoire monumentale, dont des volumes sur les Berbères',
      choices: [
        'Une histoire monumentale, dont des volumes sur les Berbères',
        'Un recueil de poésie andalouse',
        'Un traité de médecine',
        'Un atlas des routes sahariennes',
      ],
    },
  },
  {
    id: 'fatma',
    epoque: '1850–1863',
    titre: 'Lalla Fatma n’Soumer',
    land: 'kmont',
    texte: [
      'Quand l’armée française pénètre en Kabylie, dans les années 1850, une jeune femme du village de Werja galvanise la résistance : Lalla Fatma n’Soumer.',
      'En 1854, sur l’oued Sebaou, les combattants qu’elle soutient infligent de lourdes pertes aux colonnes françaises. Il faudra au maréchal Randon une campagne massive pour soumettre la région.',
      'Capturée en 1857, elle meurt en détention en 1863, à trente-trois ans. La Kabylie n’a jamais cessé de dire son nom.',
    ],
    question: {
      prompt: 'Contre quelle conquête Lalla Fatma n’Soumer a-t-elle résisté ?',
      answer: 'La conquête française de la Kabylie',
      choices: [
        'La conquête française de la Kabylie',
        'La conquête espagnole du Rif',
        'La conquête romaine',
        'La conquête ottomane',
      ],
    },
  },
  {
    id: 'abdelkrim',
    epoque: '1921–1926',
    titre: 'Abd el-Krim et la république du Rif',
    land: 'rif',
    texte: [
      'En juillet 1921, à Anoual, les combattants rifains d’Abd el-Krim al-Khattabi infligent à l’armée espagnole l’une des pires défaites qu’une puissance coloniale ait connues.',
      'Dans la foulée, Abd el-Krim proclame la république du Rif : un État moderne, avec ses institutions, dressé au cœur des montagnes.',
      'Il faudra l’alliance de deux puissances — l’Espagne et la France — et des années de guerre pour en venir à bout, en 1926. Exilé, Abd el-Krim restera jusqu’au bout une référence des luttes anticoloniales du monde entier.',
    ],
    question: {
      prompt: 'Que se passe-t-il à Anoual en juillet 1921 ?',
      answer: 'Les Rifains d’Abd el-Krim écrasent l’armée espagnole',
      choices: [
        'Les Rifains d’Abd el-Krim écrasent l’armée espagnole',
        'La France annexe le Rif',
        'La république du Rif capitule',
        'Un traité de paix est signé',
      ],
    },
  },
  {
    id: 'printemps',
    epoque: '1980',
    titre: 'Le Printemps berbère',
    land: 'kmont',
    texte: [
      'Le 10 mars 1980, à l’université de Tizi Ouzou, une conférence de l’écrivain Mouloud Mammeri sur la poésie kabyle est interdite par les autorités.',
      'L’interdiction met le feu aux poudres. Des manifestations éclatent dès le lendemain, une grève générale suit en Kabylie en avril, et la répression s’abat : universités investies, arrestations par centaines.',
      'Le mouvement est écrasé, mais il fonde tout ce qui suivra : c’est de là que naît le mouvement culturel amazigh. Le 20 avril est aujourd’hui une date commémorée.',
    ],
    question: {
      prompt: 'Qu’est-ce qui déclenche le Printemps berbère en mars 1980 ?',
      answer: 'L’interdiction d’une conférence de Mouloud Mammeri',
      choices: [
        'L’interdiction d’une conférence de Mouloud Mammeri',
        'La fermeture d’une école kabyle',
        'L’arrestation d’un chanteur',
        'Une réforme de l’alphabet',
      ],
    },
  },
  {
    id: 'reconnaissance',
    epoque: '2002 · 2011 · 2016',
    titre: 'La langue reconnue',
    land: 'rif',
    texte: [
      'Il aura fallu attendre le XXIᵉ siècle. En Algérie, tamazight devient langue nationale en 2002, après les émeutes de Kabylie de 2001 — le Printemps noir, qui fit plus de cent morts.',
      'Au Maroc, l’amazighe devient langue officielle du royaume le 29 juillet 2011, inscrite dans la Constitution. Le tifinagh y avait été retenu comme graphie officielle dès 2003.',
      'En Algérie, tamazight devient à son tour langue officielle le 7 février 2016. Deux États, deux calendriers, une même reconnaissance arrachée après des décennies.',
    ],
    question: {
      prompt: 'En quelle année l’amazighe devient-il langue officielle au Maroc ?',
      answer: '2011',
      choices: ['2011', '2002', '2016', '1980'],
    },
  },
  {
    id: 'yennayer',
    epoque: 'Aujourd’hui',
    titre: 'Yennayer, le nouvel an',
    land: 'oasis',
    texte: [
      'Yennayer se fête le 12 janvier. C’est le premier jour de l’année amazighe, héritée du calendrier agraire — le 1ᵉʳ janvier julien, décalé de treize jours sur notre calendrier.',
      'Le comput des années est récent : c’est Ammar Negadi qui le fixe en 1980, en prenant pour an 1 l’année 943 avant notre ère, celle où le Meshwesh Chachnaq monte sur le trône d’Égypte.',
      'L’Algérie en fait un jour férié à partir de 2018, le Maroc à partir de 2023. Une fête de village est devenue une fête d’État — en deux générations.',
    ],
    question: {
      prompt: 'À quelle date se fête Yennayer ?',
      answer: 'Le 12 janvier',
      choices: ['Le 12 janvier', 'Le 1ᵉʳ janvier', 'Le 20 avril', 'Le 21 mars'],
    },
  },
]

export const recitParId = (id) => RECITS.find((r) => r.id === id)
export const NB_RECITS = RECITS.length
