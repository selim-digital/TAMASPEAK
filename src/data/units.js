/**
 * Unités & chemin d'apprentissage du cours de KABYLE.
 * status lesson: 'locked' | 'current' | 'done'
 * status chest : 'locked' | 'available' | 'done'
 * type: 'lesson' (défaut) | 'chest'
 *
 * Les helpers (orderedNodes, initialStatuses…) vivent dans data/courses.js :
 * ils sont génériques et liés à chaque langue.
 */
export const units = [
  {
    id: 'u1',
    level: 'Initiation',
    unitLabel: 'Unité 1',
    title: 'Les salutations — Azul !',
    trophy: '👋',
    lessons: [
      // Le parcours COMMENCE à Azul. Les statuts « done/current » qui
      // traînaient ici depuis le premier maquettage faisaient démarrer tout
      // nouvel apprenant à la leçon 3, les deux premières faussement
      // cochées — signalé par Selim, corrigé avec une migration des profils
      // touchés (voir loadStore).
      { id: 'l1', title: 'Azul', icon: '👋', status: 'current' },
      { id: 'l2', title: 'Politesse', icon: '🙏', status: 'locked' },
      { id: 'l3', title: 'Se présenter', icon: '★', status: 'locked' },
      { id: 'chest1', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l4', title: 'Ça va ?', icon: '💬', status: 'locked' },
      { id: 'l5', title: 'Au revoir', icon: '👋', status: 'locked' },
    ],
  },
  {
    id: 'u2',
    level: 'Initiation',
    unitLabel: 'Unité 2',
    title: 'Réponses & politesse',
    trophy: '🙏',
    lessons: [
      { id: 'l6', title: 'Oui / Non', icon: '✅', status: 'locked' },
      { id: 'l7', title: 'Dire merci', icon: '🙏', status: 'locked' },
      { id: 'chest2', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l8', title: 'Accueillir', icon: '🚪', status: 'locked' },
      { id: 'l9', title: 'Révision', icon: '🔁', status: 'locked' },
    ],
  },
  {
    id: 'u3',
    level: 'Initiation',
    unitLabel: 'Unité 3',
    title: 'À la maison — Axxam',
    trophy: '🏠',
    lessons: [
      { id: 'l10', title: 'La maison', icon: '🏠', status: 'locked' },
      { id: 'l11', title: 'Manger & boire', icon: '🍞', status: 'locked' },
      { id: 'chest3', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l12', title: 'Le thé', icon: '🫖', status: 'locked' },
      { id: 'l13', title: 'Autour de moi', icon: '🐾', status: 'locked' },
    ],
  },
  {
    id: 'u4',
    level: 'Initiation',
    unitLabel: 'Unité 4',
    title: 'La famille & les phrases',
    // Règle maison : aucun visage, aucun œil — la famille se dit par le
    // lien (nœud, mains, cœurs), jamais par des figures.
    trophy: '🤝',
    lessons: [
      { id: 'l14', title: 'La famille', icon: '🪢', status: 'locked' },
      { id: 'l15', title: 'Frère & sœur', icon: '💞', status: 'locked' },
      { id: 'chest4', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l16', title: 'Phrases du jour', icon: '💬', status: 'locked' },
      { id: 'l17', title: 'Grande révision', icon: '🏅', status: 'locked' },
    ],
  },
  {
    id: 'u5',
    level: 'Initiation',
    unitLabel: 'Unité 5',
    title: 'Les nombres — Amḍan',
    trophy: '🔢',
    lessons: [
      { id: 'l18', title: 'Un à trois', icon: '3️⃣', status: 'locked' },
      { id: 'l19', title: 'Quatre & cinq', icon: '5️⃣', status: 'locked' },
      { id: 'chest5', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l20', title: 'Compter', icon: '🧮', status: 'locked' },
    ],
  },
  {
    id: 'u6',
    level: 'Initiation',
    unitLabel: 'Unité 6',
    title: 'Les couleurs — Initen',
    trophy: '🎨',
    lessons: [
      { id: 'l21', title: 'Rouge & vert', icon: '🟥', status: 'locked' },
      { id: 'l22', title: 'Jaune, noir, blanc', icon: '🟨', status: 'locked' },
      { id: 'l23', title: 'Révision couleurs', icon: '🌈', status: 'locked' },
    ],
  },
  {
    id: 'u7',
    level: 'Initiation',
    unitLabel: 'Unité 7',
    title: 'Au marché — Ssuq',
    trophy: '🛒',
    lessons: [
      { id: 'l24', title: 'Au souk', icon: '🛍️', status: 'locked' },
      { id: 'l25', title: 'Miel & olives', icon: '🫒', status: 'locked' },
      { id: 'chest7', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l26', title: 'Acheter', icon: '💰', status: 'locked' },
    ],
  },
  {
    id: 'u8',
    level: 'Initiation',
    unitLabel: 'Unité 8',
    title: 'La météo — Tignewt',
    trophy: '☀️',
    lessons: [
      { id: 'l27', title: 'Soleil & pluie', icon: '🌦️', status: 'locked' },
      { id: 'l28', title: 'Neige & vent', icon: '❄️', status: 'locked' },
      { id: 'l29', title: 'Quel temps ?', icon: '🌤️', status: 'locked' },
    ],
  },
  {
    id: 'u9',
    level: 'Découverte',
    unitLabel: 'Unité 9',
    title: 'Peuples & territoires',
    trophy: '🗺️',
    lessons: [
      { id: 'l30', title: 'Les Imazighen', icon: 'ⵣ', status: 'locked' },
      { id: 'l31', title: 'Les régions', icon: '🏔️', status: 'locked' },
      { id: 'chest9', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l32', title: 'Le drapeau', icon: '🏳️', status: 'locked' },
    ],
  },
  {
    id: 'u10',
    level: 'Découverte',
    unitLabel: 'Unité 10',
    title: 'Histoire & culture',
    trophy: '📜',
    lessons: [
      { id: 'l33', title: 'Le tifinagh', icon: '🔤', status: 'locked' },
      { id: 'l34', title: 'Figures & fêtes', icon: '🎉', status: 'locked' },
      { id: 'l35', title: 'Grande révision', icon: '🏅', status: 'locked' },
    ],
  },

  // ---- Niveau Confirmé — demandé par Selim : « ajoute les niveaux
  // supérieurs ». Corps, personnes, temps qui passe, pronoms et premières
  // phrases d'action. Vocabulaire à valider par un locuteur natif, comme
  // tout le cours (il entre automatiquement dans la liste d'enregistrement).
  {
    id: 'u11',
    level: 'Confirmé',
    unitLabel: 'Unité 11',
    title: 'Le corps & les gens',
    trophy: '🖐️',
    lessons: [
      { id: 'l36', title: 'Le corps', icon: '🖐️', status: 'locked' },
      { id: 'l37', title: 'Les gens', icon: '👣', status: 'locked' },
      { id: 'chest11', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l38', title: 'Réviser le corps', icon: '🏅', status: 'locked' },
    ],
  },
  {
    id: 'u12',
    level: 'Confirmé',
    unitLabel: 'Unité 12',
    title: 'Le temps qui passe',
    trophy: '🌙',
    lessons: [
      { id: 'l39', title: 'Jour & nuit', icon: '🌙', status: 'locked' },
      { id: 'l40', title: 'Matin & soir', icon: '🌅', status: 'locked' },
      { id: 'chest12', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l41', title: 'Hier & demain', icon: '📅', status: 'locked' },
    ],
  },
  {
    id: 'u13',
    level: 'Confirmé',
    unitLabel: 'Unité 13',
    title: 'Parler & agir',
    trophy: '🎓',
    lessons: [
      { id: 'l42', title: 'Moi, toi, lui', icon: 'ⵏ', status: 'locked' },
      { id: 'l43', title: 'Manger & boire', icon: '🍽️', status: 'locked' },
      { id: 'chest13', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l44', title: 'Phrases utiles', icon: '💬', status: 'locked' },
      { id: 'l45', title: 'Grande révision', icon: '🎓', status: 'locked' },
    ],
  },

  // ---- « Au travail » et « au sport » — demandés par Selim, et présents
  // dans les CINQ cours. Ce sont les deux domaines où l'amazigh moderne
  // emprunte le plus à l'arabe : chaque unité enseigne donc le mot d'usage
  // ET le mot amazigh, sans en cacher un derrière l'autre (voir la modale
  // des emprunts, data/emprunts.js).
  {
    id: 'u14',
    level: 'Confirmé',
    unitLabel: 'Unité 14',
    title: 'Au travail — Axeddim',
    trophy: '🛠️',
    lessons: [
      { id: 'l46', title: 'Le travail', icon: '🛠️', status: 'locked' },
      { id: 'l47', title: 'Les métiers', icon: '👷', status: 'locked' },
      { id: 'chest14', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l48', title: 'Où travailles-tu ?', icon: '💬', status: 'locked' },
      { id: 'l49', title: 'Révision du travail', icon: '🏅', status: 'locked' },
    ],
  },
  {
    id: 'u15',
    level: 'Confirmé',
    unitLabel: 'Unité 15',
    title: 'Au sport — Addal',
    trophy: '🏃',
    lessons: [
      { id: 'l50', title: 'Le sport', icon: '🏃', status: 'locked' },
      { id: 'l51', title: 'Courir & bouger', icon: '👟', status: 'locked' },
      { id: 'chest15', type: 'chest', title: 'Cadeau', icon: '🎁', status: 'locked' },
      { id: 'l52', title: 'Jouer ensemble', icon: '🤾', status: 'locked' },
      { id: 'l53', title: 'Révision du sport', icon: '🏅', status: 'locked' },
    ],
  },
]

