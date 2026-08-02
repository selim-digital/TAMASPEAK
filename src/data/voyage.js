/**
 * LE VOYAGE — la couche narrative du parcours bêta.
 *
 * Ce fichier ne contient AUCUN contenu linguistique amazigh. C'est un choix,
 * et il est structurant : le protocole de validation (docs/pedagogie-voyage.md,
 * §8) interdit de publier une phrase complète sans deux locuteurs natifs
 * indépendants, et une phrase engage infiniment plus qu'un mot — elle porte un
 * registre, une situation, une manière de s'adresser à quelqu'un.
 *
 * La bêta réutilise donc le corpus kabyle déjà en place et n'ajoute que le
 * récit, en français. Le jour où un locuteur écrit les répliques amazighes des
 * hôtes, elles viendront ici, marquées `status: 'validated'`, et pas avant.
 *
 * ------------------------------------------------------------------
 * L'ARMATURE, en trois décisions de Selim
 * ------------------------------------------------------------------
 *
 * 1. LA TROUPE VOYAGE. Un noyau accompagne l'élève du premier paysage au
 *    dernier — ce qui attache n'est pas le manque, c'est l'habitude : savoir
 *    qui va dire quoi, reconnaître Aqcic à sa façon de poser une question.
 *
 * 2. LES ANCIENS TIENNENT LA MAISON et reparaissent aux GRANDES ÉTAPES. Une
 *    présence continue cesse de se remarquer ; une présence rare se remarque
 *    toujours. Leur venue signale le seuil, et ils sont les seuls à pouvoir
 *    constater la progression — ils ne t'ont pas entendu depuis huit unités.
 *
 * 3. L'ORDRE DES PAYSAGES NE COMMANDE RIEN. journeyFor() fait partir chaque
 *    langue de chez elle : un récit accroché à la géographie serait
 *    inécrivable. Le fil est porté par les personnages, pas par la carte.
 *    D'où la règle d'écriture absolue ci-dessous.
 *
 * RÈGLE D'ÉCRITURE — aucune référence ordinale dans un texte d'escale.
 * Interdits : « après le Rif », « déjà quatre régions », « plus au sud ».
 * Autorisés : « plus loin », « le lendemain », « un jour de marche ». Chaque
 * escale doit tenir en deuxième position comme en neuvième.
 *
 * TON — phrases courtes, verbes concrets, aucun adjectif d'émerveillement.
 * Pas de « majestueux », pas de « millénaire », pas de « âme ». On dit ce qui
 * se passe. Trois à six phrases : c'est une app, pas un roman.
 */

/** Le noyau qui voyage — identifiants de components/mascots/Family.jsx. */
export const NOYAU = ['aqcic', 'taqcict', 'yemma', 'baba']

/** Ceux qui tiennent la maison et ne paraissent qu'aux seuils. */
export const ANCIENS = ['setti', 'jeddi']

/**
 * Les hôtes, un par paysage — des RENCONTRES, pas des porteurs de récit.
 * Ils donnent la couleur locale et un mot pour le carnet, puis la troupe
 * repart. C'est ce qui permet de garder la richesse régionale sans repayer
 * une amnésie toutes les cinq leçons.
 *
 * Chacun a un métier d'AUJOURD'HUI. Aucun sage, aucun artisan mystique,
 * aucune figure historique déguisée (les dix-neuf de personnages.js restent
 * dans la galerie Histoire — les mélanger transformerait l'histoire en
 * fantasy et discréditerait les deux).
 */
export const HOTES = {
  kmont: { nom: 'Ferroudja', metier: 'greffe les oliviers et tient le registre des arbres' },
  kcote: { nom: 'Meziane', metier: 'répare des moteurs de barque à Tigzirt' },
  rif: { nom: 'Mimun', metier: 'conduit la ligne Al Hoceima – Nador' },
  atlas: { nom: 'Itto', metier: 'vétérinaire de transhumance' },
  aures: { nom: 'Nedjma', metier: 'tisse, et compte ses commandes à voix haute' },
  mzab: { nom: 'Brahim', metier: 'potier — ses jarres servent à partager l’eau des jardins' },
  ksar: { nom: 'Zahra', metier: 'garde les clés du grenier collectif' },
  oasis: { nom: 'Aksil', metier: 'pollinise les palmiers à la main, en avril' },
  dunes: { nom: 'Tili', metier: 'camion-citerne — ravitaille trois campements' },
  hoggar: { nom: 'Rhissa', metier: 'relève le niveau des puits pour l’État' },
  // Le Tassili n'a VOLONTAIREMENT pas d'hôte : la paroi gravée, la troupe
  // autour, et personne pour traduire. C'est l'élève qui lit.
  tassili: null,
}

/**
 * Les escales — un texte par paysage, clos sur lui-même.
 *
 * Écrites pour fonctionner à n'importe quelle position du parcours : c'est
 * ce qui rend le récit compatible avec les cinq langues, dont l'itinéraire
 * diffère. Relire chaque ligne en se demandant « est-ce que ça tient si
 * c'est la deuxième étape ? et si c'est la neuvième ? ».
 */
export const ESCALES = {
  kmont:
    'Le car vous laisse au col, une heure avant le village. La crête tient encore un peu de neige ; en bas, les terrasses d’oliviers descendent jusqu’à la route. Ici, on ne vous demandera pas d’où vous venez — on attendra de voir si tu sais dire bonjour.',
  kcote:
    'L’air change avant qu’on voie la mer : il devient tiède et salé. Meziane travaille moteur ouvert, pièces alignées sur une bâche, et il parle en montant. Il faut deux jours de beau pour sortir, dit-il. Aqcic a déjà les pieds dans l’eau.',
  rif:
    'La ligne s’arrête où la route se fend. Mimun connaît chaque nid-de-poule par son nom et freine avant, sans regarder. Il vous prévient : ici, la langue ressemble à la tienne juste assez pour te faire trébucher.',
  atlas:
    'Les cèdres commencent d’un coup, comme une porte. Itto arrive en fin de journée, les mains encore froides — trois bêtes à voir avant la nuit. Elle t’explique le trajet des troupeaux : ils montent quand vous descendez.',
  aures:
    'Les maisons tiennent au flanc du ravin, les terrasses au-dessus du vide. Nedjma travaille en comptant tout haut, et sa voix porte plus loin que le métier à tisser. Elle te fait répéter les nombres jusqu’à ce que tu ne cherches plus.',
  mzab:
    'Vous arrivez avec le mot qu’on vous a donné plus loin. Ici, il se dit autrement : Brahim l’entend, hésite, puis rit. Il fabrique des jarres dont la contenance sert à partager l’eau entre les jardins — se tromper d’un mot, chez lui, se paie en litres. Baba veut comprendre le calcul avant de boire.',
  ksar:
    'Le grenier tient au bout du village, plus haut que tout le reste. Zahra en garde les clés, une par famille, sur un anneau qu’elle ne pose jamais. Chaque case a un nom, chaque nom veut dire ce qu’on y range.',
  oasis:
    'On entend l’eau avant de la voir : elle passe sous les palmiers dans des rigoles pas plus larges qu’une main. Aksil monte, redescend, remonte — c’est avril, il polinise à la main, un arbre après l’autre. Il n’a pas le temps de répéter deux fois.',
  dunes:
    'La piste disparaît, puis revient. Tili conduit debout dans son siège pour voir plus loin que le capot ; trois campements attendent sa citerne. Il donne les distances en heures, jamais en kilomètres — et il a raison.',
  hoggar:
    'La pierre est noire et la lumière tape juste. Rhissa relève le niveau des puits, un carnet par vallée, des chiffres qu’il envoie à l’administration. Il t’apprend à dire où sont les choses : ici, se tromper de direction ne pardonne pas.',
  tassili:
    'Il n’y a personne. Les gravures sont là, sur la paroi, à hauteur d’homme — des bêtes, des mains. Personne pour te dire ce qu’elles racontent, et personne ne le sait vraiment. Ce que tu sais lire, tu le lis à voix haute.',
}

/**
 * Les quatre GRANDES ÉTAPES, où Setti et Jeddi reparaissent.
 *
 * Aucun compteur à inventer : units.js découpe déjà le cours en trois
 * niveaux, et les seuils sont les changements de niveau — plus le départ et
 * l'arrivée. On les exprime en index d'unité (0 = première unité), donc le
 * récit reste attaché à l'ARC et jamais au paysage.
 */
export const SEUILS = {
  0: {
    titre: 'Le départ',
    texte:
      'Le car attend au col. Setti a fait le pain pour la route et le donne à Yemma, qui n’en voulait pas. Jeddi ne descend pas jusqu’au car ; il regarde de la terrasse, une main levée. Ils restent, vous partez.',
  },
  8: {
    titre: 'Ils sont venus',
    texte:
      'Ils sont là en arrivant, tous les deux, comme s’ils avaient toujours été là. Setti te fait dire les mots un par un, sans t’aider. Elle écoute jusqu’au bout. Puis elle dit à Jeddi, pas à toi : « il ne disait pas ça, avant. »',
  },
  10: {
    titre: 'Le chemin de Jeddi',
    texte:
      'Jeddi a fait cette route à pied, il y a longtemps, et il ne se souvient plus du nom du village au milieu. Il te demande de le lui rapporter. Setti, elle, ne demande rien : elle t’écoute parler avec les gens d’ici, et ça lui suffit.',
  },
  12: {
    titre: 'Le retour',
    texte:
      'Vous rentrez. Setti a mis la table pour sept sans qu’on lui dise combien vous seriez. Jeddi veut le nom du village, et tu l’as. On te demande de raconter — et cette fois, tu racontes dans la langue.',
  },
}

/** Cette unité est-elle une grande étape (les anciens reparaissent) ? */
export const estSeuil = (unitIndex) => Object.prototype.hasOwnProperty.call(SEUILS, unitIndex)

/** Le fragment de récit d'une unité : son escale, et le seuil s'il y en a un. */
export function recitDe(unitIndex, landId) {
  return {
    seuil: SEUILS[unitIndex] || null,
    escale: ESCALES[landId] || null,
    hote: HOTES[landId] || null,
    // Qui accompagne à cette étape : le noyau toujours, les anciens aux seuils.
    presents: estSeuil(unitIndex) ? [...NOYAU, ...ANCIENS] : NOYAU,
  }
}
