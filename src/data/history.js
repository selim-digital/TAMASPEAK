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
