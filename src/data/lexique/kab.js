/**
 * DICTIONNAIRE ÉTENDU — KABYLE (taqbaylit). Premier lot.
 *
 * Ces mots ne sont enseignés par AUCUNE leçon : ils existent pour que le
 * dictionnaire mérite son nom, et pour qu'on ait où puiser en écrivant les
 * unités suivantes plutôt que d'inventer. La fiche de chaque entrée le dit :
 * « pas encore dans les leçons ».
 *
 * CONTENU PROVISOIRE, À VALIDER PAR UN LOCUTEUR NATIF — comme tout le reste
 * de l'app, et plus encore ici : c'est le premier lot écrit d'un coup, sans
 * le filtre qu'imposait l'écriture d'un exercice. Les références visées sont
 * celles déjà citées par le cours de kabyle :
 *   • J.-M. Dallet, « Dictionnaire kabyle-français », SELAF, 1982
 *   • K. Naït-Zerrad, « Dictionnaire des racines berbères »
 *   • Amawal (1974) pour les néologismes, signalés comme tels
 *
 * CE QUE CE LOT NE PRÉTEND PAS FAIRE :
 *
 *   • PAS DE PLURIELS. Le pluriel kabyle est irrégulier (afus → ifassen,
 *     axxam → ixxamen, tiṭ → allen) et se retient mot par mot. En deviner
 *     trois cents produirait trois cents fautes plausibles, bien pires que
 *     l'absence. C'est la passe suivante, à faire avec un locuteur ; les
 *     quelques pluriels ici sont ceux qui servent de mot à part entière
 *     (allen, tuɣmas, ulli — des pluriels sans singulier d'usage).
 *   • PAS D'ÉTAT D'ANNEXION. « axxam » devient « wexxam » après préposition ;
 *     la règle est régulière mais pas mécanique, et elle appartient à une
 *     couche de grammaire que le dictionnaire n'a pas encore.
 *   • PAS DE CONJUGAISON. Les verbes sont donnés à l'impératif singulier,
 *     qui est la forme de citation usuelle du kabyle.
 *
 * NOTE DE GRAMMAIRE, VALABLE POUR TOUT LE LOT : le kabyle a peu d'adjectifs.
 * La plupart des qualités se disent avec un VERBE — on ne dit pas « il est
 * chaud » mais « yeḥma », il a chauffé. Les entrées marquées `adj` sont donc
 * les vrais adjectifs, en nombre limité ; le reste est rangé en verbes.
 *
 * RÈGLE MAISON APPLIQUÉE ICI AUSSI : ni musique ni danse — pas de « chanter »,
 * pas de « danser », pas d'instrument.
 */

const n = (mot, fr, theme, note) => ({ mot, fr, theme, type: 'nom', note })
const v = (mot, fr, note) => ({ mot, fr, theme: 'verbes', type: 'verbe', note })
const adj = (mot, fr, note) => ({ mot, fr, theme: 'qualites', type: 'adj', note })
const o = (mot, fr, note) => ({ mot, fr, theme: 'outils', type: 'outil', note })
const x = (mot, fr, theme, note) => ({ mot, fr, theme, type: 'expr', note })

export const KAB = [
  /* ---------------- Le corps ---------------- */
  n('Udem', 'Le visage', 'corps'),
  n('Tiṭ', 'L’œil', 'corps', 'Son pluriel est « allen » — un mot entièrement différent.'),
  n('Allen', 'Les yeux', 'corps', 'Pluriel irrégulier de « tiṭ ».'),
  n('Ameẓẓuɣ', 'L’oreille', 'corps'),
  n('Anzaren', 'Le nez', 'corps', 'Toujours au pluriel : le nez se dit par ses deux narines.'),
  n('Imi', 'La bouche', 'corps'),
  n('Iles', 'La langue', 'corps', 'L’organe et la parole, comme en français.'),
  n('Tuɣmas', 'Les dents', 'corps'),
  n('Acebbub', 'La chevelure', 'corps'),
  n('Amgerḍ', 'Le cou', 'corps'),
  n('Tayett', 'L’épaule', 'corps'),
  n('Iɣil', 'Le bras', 'corps'),
  n('Aḍad', 'Le doigt', 'corps'),
  n('Idis', 'Le côté, le flanc', 'corps'),
  n('Aɛebbuḍ', 'Le ventre', 'corps'),
  n('Tasa', 'Le foie', 'corps', 'Siège de l’affection en kabyle : « a tasa-w » se dit à celui qu’on aime, là où le français dirait « mon cœur ».'),
  n('Afud', 'Le genou', 'corps'),
  n('Idammen', 'Le sang', 'corps'),
  n('Iɣes', 'L’os', 'corps'),
  n('Aksum', 'La chair, la viande', 'corps'),
  n('Aglim', 'La peau', 'corps'),
  n('Aẓar', 'La racine, la veine', 'corps', 'Le même mot pour la racine d’un arbre et la veine d’un corps.'),

  /* ---------------- La famille ---------------- */
  n('Mmi', 'Mon fils', 'famille'),
  n('Yelli', 'Ma fille', 'famille'),
  n('Ayetma', 'Mes frères', 'famille', 'Pluriel de « gma » — « les fils de ma mère ».'),
  n('Yessetma', 'Mes sœurs', 'famille', 'Pluriel de « weltma ».'),
  n('Jeddi', 'Mon grand-père', 'famille'),
  n('Setti', 'Ma grand-mère', 'famille'),
  n('Ɛemmi', 'Mon oncle paternel', 'famille'),
  n('Xali', 'Mon oncle maternel', 'famille', 'Le kabyle distingue l’oncle du côté du père et celui du côté de la mère.'),
  n('Ɛemti', 'Ma tante paternelle', 'famille'),
  n('Xalti', 'Ma tante maternelle', 'famille'),
  n('Isli', 'Le marié', 'famille'),
  n('Tislit', 'La mariée, la belle-fille', 'famille'),
  n('Tarwa', 'La progéniture, les enfants', 'famille'),
  n('Adrum', 'Le clan, la lignée', 'famille'),
  n('Tawacult', 'La famille', 'famille'),

  /* ---------------- Les gens ---------------- */
  n('Amɣar', 'Le vieil homme, le chef', 'gens', 'De la racine MƔR, être grand : l’âge et l’autorité dans le même mot.'),
  n('Amdakkel', 'L’ami', 'gens'),
  n('Tamdakkelt', 'L’amie', 'gens'),
  n('Ajar', 'Le voisin', 'gens'),
  n('Tajart', 'La voisine', 'gens'),
  n('Anebgi', 'L’invité', 'gens'),
  n('Aberrani', 'L’étranger', 'gens'),
  n('Medden', 'Les gens', 'gens'),
  n('Aɣerfan', 'Le peuple', 'gens'),

  /* ---------------- La maison ---------------- */
  n('Tazeqqa', 'La pièce, la chambre', 'maison'),
  n('Lḥiḍ', 'Le mur', 'maison'),
  n('Ssqef', 'Le plafond, le toit', 'maison'),
  n('Lkanun', 'Le foyer, l’âtre', 'maison', 'Le feu au centre de la maison — et, par extension, la maisonnée.'),
  n('Times', 'Le feu', 'maison'),
  n('Tafat', 'La lumière', 'maison'),
  n('Tillas', 'L’obscurité', 'maison'),
  n('Usu', 'Le lit', 'maison'),
  n('Tasumta', 'L’oreiller', 'maison'),
  n('Akursi', 'La chaise', 'maison'),
  n('Ṭṭabla', 'La table', 'maison'),
  n('Taqbuct', 'La tasse, le bol', 'maison'),
  n('Tabaqit', 'L’assiette', 'maison'),
  n('Taɣenǧawt', 'La cuiller', 'maison'),
  n('Ajenwi', 'Le couteau', 'maison'),
  n('Tissegnit', 'L’aiguille', 'maison'),
  n('Amrar', 'La corde', 'maison'),
  n('Lkaɣeḍ', 'Le papier', 'maison'),

  /* ---------------- Le village & la ville ---------------- */
  n('Tamdint', 'La ville', 'village'),
  n('Tajmaɛt', 'L’assemblée du village, la place', 'village', 'Le lieu où le village décide — l’institution autant que la place.'),
  n('Lǧameɛ', 'La mosquée', 'village'),
  n('Aɣerbaz', 'L’école', 'village'),
  n('Abrid', 'Le chemin, la route', 'village'),
  n('Tala', 'La fontaine', 'village', 'Point d’eau du village, et lieu de rencontre.'),
  n('Aɣbalu', 'La source', 'village'),
  n('Aqbu', 'Le col, le défilé', 'village'),

  /* ---------------- Manger & boire ---------------- */
  n('Seksu', 'Le couscous', 'manger'),
  n('Aɣi', 'Le lait', 'manger'),
  n('Udi', 'Le beurre', 'manger'),
  n('Zzit', 'L’huile', 'manger'),
  n('Lmelḥ', 'Le sel', 'manger'),
  n('Tamellalt', 'L’œuf', 'manger'),
  n('Ibawen', 'Les fèves', 'manger'),
  n('Tiẓurin', 'Le raisin', 'manger'),
  n('Tazart', 'Les figues sèches', 'manger'),
  n('Tibexsisin', 'Les figues fraîches', 'manger'),
  n('Tiyni', 'Les dattes', 'manger'),
  n('Lbeṣel', 'L’oignon', 'manger'),
  n('Ifelfel', 'Le poivron, le piment', 'manger'),
  n('Imensi', 'Le dîner', 'manger'),
  n('Imekli', 'Le déjeuner', 'manger'),
  n('Lefṭur', 'Le petit-déjeuner', 'manger'),
  n('Tibḥirt', 'Le potager', 'manger'),

  /* ---------------- Les animaux ---------------- */
  n('Aqjun', 'Le chien', 'animaux'),
  n('Aserdun', 'Le mulet', 'animaux'),
  n('Ayis', 'Le cheval', 'animaux'),
  n('Azger', 'Le bœuf', 'animaux'),
  n('Tixsi', 'La brebis', 'animaux'),
  n('Ikerri', 'Le mouton', 'animaux'),
  n('Taɣaṭ', 'La chèvre', 'animaux'),
  n('Ayaziḍ', 'Le coq', 'animaux'),
  n('Tayaziṭ', 'La poule', 'animaux'),
  n('Afrux', 'L’oiseau', 'animaux'),
  n('Agḍiḍ', 'L’oiseau', 'animaux'),
  n('Tasekkurt', 'La perdrix', 'animaux'),
  n('Uccen', 'Le chacal', 'animaux', 'Le personnage des contes kabyles : rusé, et toujours puni.'),
  n('Izem', 'Le lion', 'animaux'),
  n('Insi', 'Le hérisson', 'animaux'),
  n('Ilef', 'Le sanglier', 'animaux'),
  n('Ifis', 'L’hyène', 'animaux'),
  n('Azrem', 'Le serpent', 'animaux'),
  n('Tazizwit', 'L’abeille', 'animaux'),
  n('Izi', 'La mouche', 'animaux'),

  /* ---------------- La nature ---------------- */
  n('Adrar', 'La montagne', 'nature'),
  n('Asif', 'La rivière', 'nature'),
  n('Aẓru', 'La pierre, le rocher', 'nature'),
  n('Akal', 'La terre, le sol', 'nature'),
  n('Igenni', 'Le ciel', 'nature'),
  n('Itri', 'L’étoile', 'nature'),
  n('Itran', 'Les étoiles', 'nature'),
  n('Aggur', 'La lune, le mois', 'nature', 'Le même mot pour l’astre et pour le mois — la lune mesurait le temps.'),
  n('Tamurt', 'Le pays, la terre', 'nature', '« Tamurt-iw » : mon pays. C’est aussi ainsi qu’on dit la Kabylie, « tamurt n Leqbayel ».'),
  n('Lebḥer', 'La mer', 'nature'),
  n('Azaɣar', 'La plaine', 'nature'),
  n('Tiɣilt', 'La colline', 'nature'),
  n('Asɣar', 'Le bois', 'nature'),
  n('Ttejra', 'L’arbre', 'nature'),
  n('Aseklu', 'L’arbre', 'nature', 'Néologisme de l’Amawal, proposé pour remplacer « ttejra », venu de l’arabe.'),
  n('Ijeǧǧigen', 'Les fleurs', 'nature'),
  n('Tuga', 'L’herbe', 'nature'),
  n('Aɣanim', 'Le roseau', 'nature'),

  /* ---------------- Le temps qu'il fait ---------------- */
  n('Asemmiḍ', 'Le froid', 'meteo'),
  n('Azɣal', 'La chaleur', 'meteo'),
  n('Tignewt', 'Le temps qu’il fait', 'meteo'),

  /* ---------------- Le temps qui passe ---------------- */
  n('Useggas', 'L’année', 'temps'),
  n('Imalas', 'La semaine', 'temps', 'Néologisme de l’Amawal ; dans la rue, on entend « ssmana », de l’arabe.'),
  n('Ssmana', 'La semaine', 'temps'),
  n('Tasaɛet', 'L’heure', 'temps'),
  n('Yennayer', 'Le nouvel an amazigh', 'temps', 'Célébré le 12 janvier — le premier jour du calendrier agraire.'),
  o('Zik', 'Tôt, autrefois'),
  o('Imir', 'Alors, à ce moment-là'),

  /* ---------------- Les nombres ---------------- */
  n('Sḍis', 'Six', 'nombres', 'Au-delà de trois, le kabyle courant compte en arabe : la série amazighe est restée vivante au Souss, pas ici.'),
  n('Sa', 'Sept', 'nombres'),
  n('Tam', 'Huit', 'nombres'),
  n('Tẓa', 'Neuf', 'nombres'),
  n('Mraw', 'Dix', 'nombres', 'Forme amazighe, surtout écrite ; on dit « ɛecṛa » en parlant.'),
  n('Ɛecṛa', 'Dix', 'nombres'),
  n('Meyya', 'Cent', 'nombres'),
  n('Agim', 'Mille', 'nombres', 'Néologisme de l’Amawal.'),

  /* ---------------- Les couleurs ---------------- */
  n('Azerwal', 'Le bleu', 'couleurs', 'Le bleu se dit aussi « azegzaw », qui couvre le vert : beaucoup de langues amazighes ne séparent pas les deux.'),
  n('Aqehwi', 'Le marron', 'couleurs'),

  /* ---------------- Le travail ---------------- */
  n('Aḥeddad', 'Le forgeron', 'travail', 'Métier tenu à part dans le village kabyle — le forgeron et le bijoutier d’Ath Yenni viennent de là.'),
  n('Anejjar', 'Le menuisier', 'travail'),
  n('Ameksa', 'Le berger', 'travail'),
  n('Axemmas', 'Le métayer', 'travail', 'Celui qui travaille la terre d’un autre pour un cinquième de la récolte.'),
  n('Aẓeṭṭa', 'Le tissage, le métier à tisser', 'travail', 'Le métier vertical des femmes, dressé dans la maison.'),
  n('Ssuma', 'Le prix', 'travail'),
  n('Ssnaɛa', 'Le métier, le savoir-faire', 'travail'),
  n('Tabzimt', 'La fibule', 'travail', 'Le bijou d’argent émaillé d’Ath Yenni qui agrafe la robe — c’est lui qui a donné ses couleurs à cette app.'),
  n('Ameqyas', 'Le bracelet', 'travail'),
  n('Aselham', 'Le burnous', 'travail'),
  n('Tacacit', 'La calotte, le bonnet', 'travail'),
  n('Aqendur', 'La robe, la gandoura', 'travail'),

  /* ---------------- Les verbes ---------------- */
  v('Ddu', 'Aller, accompagner'),
  v('Qqim', 'S’asseoir, rester'),
  v('Kker', 'Se lever'),
  v('Ffeɣ', 'Sortir'),
  v('Kcem', 'Entrer'),
  v('Ali', 'Monter'),
  v('Ṣubb', 'Descendre'),
  v('Lḥu', 'Marcher'),
  v('Uɣal', 'Revenir, redevenir'),
  v('Aru', 'Écrire'),
  v('Ɣer', 'Lire, étudier, appeler', 'Le même verbe pour lire et pour appeler quelqu’un.'),
  v('Ẓer', 'Voir'),
  v('Muqel', 'Regarder'),
  v('Sel', 'Entendre, écouter'),
  v('Ini', 'Dire'),
  v('Ssiwel', 'Parler, appeler'),
  v('Meslay', 'Parler, converser'),
  v('Steqsi', 'Interroger'),
  v('Ssuter', 'Demander'),
  v('Err', 'Rendre, répondre'),
  v('Efk', 'Donner'),
  v('Ddem', 'Prendre'),
  v('Awi', 'Emporter'),
  v('Sers', 'Poser'),
  v('Erǧu', 'Attendre'),
  v('Ẓẓu', 'Planter'),
  v('Krez', 'Labourer', 'Racine du mot « amekraz », le laboureur.'),
  v('Sɣ', 'Acheter'),
  v('Zzenz', 'Vendre'),
  v('Bnu', 'Construire'),
  v('Sired', 'Laver'),
  v('Ṭṭes', 'Dormir'),
  v('Bɣu', 'Vouloir'),
  v('Issin', 'Savoir, connaître'),
  v('Fhem', 'Comprendre'),
  v('Ttu', 'Oublier'),
  v('Cfu', 'Se souvenir'),
  v('Ḥemmel', 'Aimer'),
  v('Ili', 'Être, exister'),
  v('Sɛu', 'Avoir'),
  v('Bdu', 'Commencer'),
  v('Fak', 'Finir'),
  v('Ɣiwel', 'Se dépêcher'),
  v('Suref', 'Pardonner', 'Le mot du fonds kabyle, là où « semmeḥ » vient de l’arabe.'),
  v('Ẓall', 'Prier'),
  v('Uẓum', 'Jeûner'),
  v('Amen', 'Croire'),
  v('Ɛreḍ', 'Essayer, inviter'),
  v('Wet', 'Frapper'),
  v('Ɛumm', 'Nager'),

  /* ---------------- Les qualités ---------------- */
  adj('Ameqqran', 'Grand'),
  adj('Ameẓyan', 'Petit'),
  adj('Aqbur', 'Ancien'),
  adj('Ajdid', 'Neuf'),
  adj('Azedgan', 'Propre'),
  adj('Aẓidan', 'Sucré, doux'),
  adj('Amerẓag', 'Amer'),
  adj('Azuran', 'Épais, gros'),
  adj('Areqqaq', 'Fin, mince'),
  adj('Aɣezzfan', 'Long'),
  adj('Awezlan', 'Court'),
  adj('Aẓawali', 'Pauvre'),
  adj('Ameṛkanti', 'Riche'),
  v('Lhu', 'Être bien, aller bien', 'Le kabyle a peu d’adjectifs : la plupart des qualités se disent avec un verbe. « Yelha » — c’est bien.'),
  v('Diri', 'Être mauvais'),
  v('Ḥmu', 'Être chaud'),
  v('Semmeḍ', 'Être froid'),

  /* ---------------- Les mots-outils ---------------- */
  o('Anda', 'Où'),
  o('Amek', 'Comment'),
  o('Ayɣer', 'Pourquoi'),
  o('Anwa', 'Qui (à un homme)'),
  o('Anta', 'Qui (à une femme)'),
  o('Acu', 'Quoi'),
  o('Acḥal', 'Combien'),
  o('Ihi', 'Donc, alors'),
  o('Maca', 'Mais'),
  o('Neɣ', 'Ou'),
  o('Daɣen', 'Aussi, encore'),
  o('Yal', 'Chaque'),
  o('Kra', 'Quelque chose, un peu'),
  o('Ulac', 'Il n’y a pas'),
  o('Yella', 'Il y a'),
  o('Mačči', 'Ce n’est pas'),
  o('Aṭas', 'Beaucoup'),
  o('Cwiṭ', 'Un peu'),
  o('Akk', 'Tout, tous'),
  o('Deg', 'Dans'),
  o('Seg', 'De, depuis'),
  o('Ɣef', 'Sur, à propos de'),
  o('Ddaw', 'Sous'),
  o('Sennig', 'Au-dessus de'),
  o('Zdat', 'Devant'),
  o('Deffir', 'Derrière'),
  o('Gar', 'Entre'),
  o('Akked', 'Avec'),
  o('Dagi', 'Ici'),
  o('Dihin', 'Là-bas'),
  o('Sya', 'D’ici'),

  /* ---------------- Les paroles ---------------- */
  x('Ṣbeḥ lxir', 'Bonjour (le matin)', 'paroles'),
  x('Ar timlilit', 'À bientôt', 'paroles', 'Littéralement « jusqu’à la rencontre ».'),
  x('D acu i d isem-ik ?', 'Quel est ton nom ? (à un homme)', 'paroles'),
  x('Isem-iw…', 'Je m’appelle…', 'paroles'),
  x('Ansi i d-tekkiḍ ?', 'D’où viens-tu ?', 'paroles'),
  x('Ur ẓriɣ ara', 'Je ne sais pas', 'paroles'),
  x('Ɛawen-iyi', 'Aide-moi', 'paroles'),
  x('Ma ulac aɣilif', 'S’il te plaît', 'paroles', 'Littéralement « s’il n’y a pas de gêne » — la formule kabyle, là où « ɛafak » vient de l’arabe.'),
  x('Yerbeḥ', 'D’accord, entendu', 'paroles'),
  x('D tidet', 'C’est vrai', 'paroles'),
  x('A tasa-w', 'Mon amour', 'paroles', 'Littéralement « ô mon foie » — l’affection kabyle passe par le foie, pas par le cœur.'),
]
