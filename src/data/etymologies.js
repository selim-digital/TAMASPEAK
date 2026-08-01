/**
 * LA COUCHE ÉTYMOLOGIQUE — d'où viennent les mots, et ce qu'ils portent.
 *
 * C'est la seule partie du dictionnaire écrite À LA MAIN : les entrées, les
 * traductions et les correspondances entre langues, elles, sont dérivées du
 * contenu des cours (voir data/dictionnaire.js). Ici on ajoute ce qu'aucun
 * exercice ne contient — la racine, l'origine, l'histoire du mot.
 *
 * TOUT CE FICHIER EST À VALIDER par un linguiste ou un locuteur natif, au
 * même titre que le vocabulaire. L'étymologie amazighe est un terrain où les
 * auteurs se contredisent souvent : quand c'est le cas, on l'écrit
 * (`discute: true`) au lieu de trancher à leur place. Une note absente vaut
 * mieux qu'une note inventée — le dictionnaire affiche simplement l'origine
 * générale et se tait sur le reste.
 *
 * CLÉS. La clé est la forme normalisée (voir lib/translit.js) : minuscules,
 * sans diacritique, tifinagh translittéré. « Aḍar », « aḍar » et « ⴰⴹⴰⵔ »
 * partagent donc la clé « adar », et une seule note sert les cinq cours —
 * c'est exactement ce qu'on veut d'un fonds commun. Quand une langue diverge,
 * on préfixe : « rif:ur » l'emporte sur « ur ».
 */

/** Les grandes familles d'origine, telles qu'affichées. */
export const ORIGINES = Object.freeze({
  amazigh: {
    label: 'Fonds amazigh',
    couleur: 'turquoise',
    detail: 'Mot du fonds ancien, souvent présent du Rif au Sahara.',
  },
  neo: {
    label: 'Néologisme amazigh',
    couleur: 'cobalt',
    detail:
      'Mot formé au XXᵉ siècle sur des racines amazighes, pour nommer ce que la langue n’avait pas eu à nommer — l’école, le sport, l’administration.',
  },
  arabe: {
    label: 'Emprunt à l’arabe',
    couleur: 'gold',
    detail:
      'Installé depuis des siècles. Un emprunt ancien fait partie de la langue : ce n’est pas une faute, c’est une histoire.',
  },
  espagnol: {
    label: 'Emprunt à l’espagnol',
    couleur: 'coral',
    detail: 'Surtout dans le Rif, par Melilla et Nador.',
  },
  voyageur: {
    label: 'Mot voyageur',
    couleur: 'silver',
    detail: 'Venu de plus loin encore, en passant par plusieurs langues avant d’arriver ici.',
  },
})

/**
 * @typedef  {object} Etymologie
 * @property {keyof ORIGINES} origine
 * @property {string}  [racine]   la racine consonantique, quand elle est claire
 * @property {string}  [note]     une ou deux phrases, jamais plus
 * @property {boolean} [discute]  les sources ne s'accordent pas
 * @property {string}  [voir]     un autre mot du dictionnaire à rapprocher
 */
export const ETYMOLOGIES = Object.freeze({
  /* ---------------- salutations & politesse ---------------- */
  azul: {
    origine: 'amazigh',
    note: 'Donné par l’Amawal (1974) et rapproché du touareg « ahul ». Le dictionnaire de l’IRCAM ne le marque PAS néologisme, contrairement à « adlis » ou « tinml » — c’est ce qui en fait la bonne réponse du cours d’amazighe standard.',
    discute: true,
  },
  tanemmirt: {
    origine: 'amazigh',
    racine: 'NMR',
    note: 'Le merci kabyle, repris par la norme marocaine sous la graphie « tanmmirt » — sans e, le schwa ne s’écrit pas.',
  },
  ansuf: { origine: 'amazigh', note: 'L’accueil, en kabyle. « Ansuf yes-k » : bienvenue à toi.' },
  tifawin: {
    origine: 'amazigh',
    racine: 'FW',
    note: 'Littéralement « les lumières » — le bonjour du matin au Souss.',
    voir: 'Tafukt',
  },
  'ar tufat': {
    origine: 'amazigh',
    note: '« Jusqu’au matin » : tufat, c’est le matin qui vient. On ne se quitte pas, on se donne rendez-vous.',
  },
  'ssalamu elikum': { origine: 'arabe', note: 'La salutation musulmane, partagée par tout le Maghreb.' },
  'wa elikum ssalam': { origine: 'arabe', note: 'La réponse obligée : et sur vous la paix.' },
  'elikum ssalam': { origine: 'arabe', note: 'La forme courte de la réponse, au Maroc central.' },
  marhba: { origine: 'arabe', note: 'De « marḥaban ». « Mrḥba » au Maroc central.' },
  mrhba: { origine: 'arabe', note: 'De l’arabe « marḥaban » — bienvenue.' },
  brrk: { origine: 'arabe', racine: 'BRK', note: 'De la racine arabe de la bénédiction, baraka.' },
  'barek llahu fik': { origine: 'arabe', note: 'Que Dieu te bénisse — le merci du Rif.' },
  cukran: { origine: 'arabe', note: 'De « šukran ».' },
  eafak: { origine: 'arabe', note: 'De « ɛafā-k ». « Afak » au Souss, « afakm » à une femme.' },
  afak: { origine: 'arabe', note: 'De « ɛafā-k ». Au féminin : afakm.' },
  afakm: { origine: 'arabe', note: 'La forme adressée à une femme : l’emprunt prend la marque amazighe.' },
  labas: { origine: 'arabe', note: 'De « la ba’s » — littéralement « pas de mal ».' },
  bslama: { origine: 'arabe', note: 'De « bi-s-salāma » — dans la paix.' },
  'b essalama': { origine: 'arabe', note: 'Même formule qu’au Souss, avec l’article du Rif.' },
  mlih: { origine: 'arabe', note: 'De « mlīḥ » — bon, bien.' },
  waxxa: { origine: 'arabe', note: 'De l’arabe marocain — d’accord, soit.' },
  'bla jmil': { origine: 'arabe', note: 'Littéralement « sans obligation » : tu ne me dois rien.' },
  'semmeh iyi': { origine: 'arabe', racine: 'SMḤ', note: 'De « samaḥ », pardonner.', voir: 'Suref-iyi' },
  'ttxil k': {
    origine: 'amazigh',
    note: 'Origine débattue : fonds kabyle pour les uns, tournure arabe pour les autres.',
    discute: true,
  },
  'amek tellid': { origine: 'amazigh', racine: 'ILI', note: 'De « ili », être : comment es-tu ?' },
  'azul amek tellid': {
    origine: 'amazigh',
    note: 'Le salut puis la question, sans un mot d’emprunt : la formule kabyle entière.',
    voir: 'Amek telliḍ ?',
  },
  'anda tellid': { origine: 'amazigh', racine: 'ILI', note: 'Même verbe « ili » : où es-tu ?' },
  'ur fhimegh ara': {
    origine: 'amazigh',
    note: 'La négation kabyle tient en deux morceaux qui encadrent le verbe : ur… ara. En oublier un, c’est dire l’inverse.',
  },

  /* ---------------- oui, non ---------------- */
  ih: { origine: 'amazigh', note: 'Le oui kabyle.' },
  ala: { origine: 'amazigh', note: 'Le non kabyle.' },
  uhu: { origine: 'amazigh', note: 'Le non marocain, du Souss à l’Atlas.' },
  yyih: { origine: 'amazigh', note: 'Le oui de la norme écrite.' },
  lla: { origine: 'amazigh', note: 'Le non du Rif.', discute: true },
  wah: { origine: 'arabe', note: 'Probable emprunt à l’arabe maghrébin — à confirmer.', discute: true },
  yah: { origine: 'amazigh', note: 'Origine discutée : fonds amazigh ou emprunt.', discute: true },

  /* ---------------- la famille ---------------- */
  baba: { origine: 'amazigh', note: 'Mot du langage enfantin, comme dans beaucoup de langues. « Bba » au Moyen Atlas.' },
  bba: { origine: 'amazigh', note: 'Mon père, au Maroc central.' },
  yemma: { origine: 'amazigh', note: 'Maman — « immi » au Souss, « mma » au Moyen Atlas.' },
  immi: { origine: 'amazigh', note: 'Maman, au Souss.' },
  mma: { origine: 'amazigh', note: 'Ma mère, au Moyen Atlas.' },
  gma: {
    origine: 'amazigh',
    note: 'Mot composé : « g(u)-ma », le fils de ma mère. La parenté amazighe se dit par la mère.',
    voir: 'Weltma',
  },
  weltma: {
    origine: 'amazigh',
    note: 'Composé lui aussi : « welt-ma », la fille de ma mère. Le Rif en fait « učma ».',
    voir: 'Gma',
  },
  ucma: { origine: 'amazigh', note: 'Ma sœur, au Rif — même composé que le kabyle « weltma ».' },
  bbahllu: { origine: 'amazigh', note: 'Grand-père, au Moyen Atlas ; « mmaḥllu » pour la grand-mère.' },
  mmahllu: { origine: 'amazigh', note: 'Grand-mère, au Moyen Atlas.' },

  /* ---------------- les gens, le corps ---------------- */
  argaz: { origine: 'amazigh', note: 'L’homme, du Rif au Sahara. Le tarifit dit « aryaz » : le g y devient y.' },
  aryaz: { origine: 'amazigh', note: 'L’homme, au Rif — « argaz » ailleurs.', voir: 'Argaz' },
  tamettut: { origine: 'amazigh', note: 'La femme. Le t…t qui l’encadre est la marque du féminin.' },
  tamghart: {
    origine: 'amazigh',
    racine: 'MƔR',
    note: 'De la racine « être grand » : la femme d’âge, celle qui compte. « Amɣar », c’est l’ancien, le chef.',
  },
  aqcic: { origine: 'amazigh', note: 'Le garçon ; « taqcict », la fille.' },
  taqcict: { origine: 'amazigh', note: 'La fille — le même mot que « aqcic », passé au féminin.' },
  ilemzi: { origine: 'amazigh', racine: 'LMẒ', note: 'Le jeune homme ; « tilemẓit » pour la jeune fille.' },
  tilemzit: { origine: 'amazigh', racine: 'LMẒ', note: 'La jeune fille.' },
  arrac: { origine: 'amazigh', note: 'Les enfants, en kabyle — un pluriel qui n’a pas de singulier courant.' },
  afus: { origine: 'amazigh', note: 'La main, dans toutes les langues amazighes, jusqu’au touareg.' },
  adar: { origine: 'amazigh', note: 'Le pied — pan-amazigh, et inchangé du Rif au Souss.' },
  aqerruy: { origine: 'amazigh', note: 'La tête, en kabyle. Le sud dit « ixf ».', voir: 'Ixf' },
  ixf: {
    origine: 'amazigh',
    note: 'La tête, au Maroc — et aussi « soi-même » : « ixf-inu », moi-même.',
    voir: 'Aqerruy',
  },
  ul: { origine: 'amazigh', note: 'Le cœur. Le tarifit en fait « uř » : son l ancien devient ř.' },
  'rif:ur': { origine: 'amazigh', note: 'Le cœur, au Rif — c’est « ul » ailleurs, avec le passage l → ř.', voir: 'Ul' },

  /* ---------------- la maison, le village ---------------- */
  axxam: { origine: 'amazigh', note: 'La maison kabyle — la maisonnée autant que le bâtiment.' },
  tigmmi: { origine: 'amazigh', note: 'La maison, au Souss et dans la norme écrite.' },
  taddart: {
    origine: 'amazigh',
    note: 'FAUX-AMI : le village en kabyle, la MAISON au Maroc central. Le même mot, deux échelles.',
  },
  tawwurt: { origine: 'amazigh', note: 'La porte.' },
  adlis: {
    origine: 'neo',
    note: 'Créé pour l’école. Le dictionnaire de l’IRCAM le marque « néo. » — contrairement à azul ou tanmmirt.',
  },
  tinml: { origine: 'neo', racine: 'LMD', note: 'L’école, formé sur « lmed », apprendre. Marqué « néo. » par l’IRCAM.' },
  tanarit: { origine: 'neo', note: 'Le bureau — mot moderne, formé pour nommer un lieu qui n’existait pas au village.' },

  /* ---------------- manger, boire ---------------- */
  aman: {
    origine: 'amazigh',
    note: 'L’eau — toujours au pluriel, jamais au singulier, comme si l’eau ne pouvait pas se compter. Identique du Rif au Souss.',
  },
  aghrum: { origine: 'amazigh', note: 'Le pain, partout pareil — un des mots les plus stables de la langue.' },
  atay: {
    origine: 'voyageur',
    note: 'Venu de Chine par l’arabe maghrébin. Le mot a voyagé avec la boisson : il n’y a pas de thé amazigh plus ancien que lui.',
  },
  tament: { origine: 'amazigh', note: 'Le miel — mot du fonds, jusqu’au touareg.' },
  azemmur: { origine: 'amazigh', note: 'L’olive et l’olivier. Le mot est amazigh ; les Romains l’ont croisé ici.' },
  amcic: {
    origine: 'amazigh',
    note: 'Le chat. Sans doute une onomatopée d’appel, partagée avec l’arabe maghrébin — l’emprunt pourrait aller dans les deux sens.',
    discute: true,
  },

  /* ---------------- le marché, l'argent ---------------- */
  ssuq: {
    origine: 'arabe',
    note: 'De « sūq ». L’emprunt est si ancien et si complet qu’aucun mot amazigh ne lui fait concurrence.',
  },
  tahanut: { origine: 'arabe', note: 'De « ḥānūt », habillé du t…t féminin amazigh.' },
  idrimen: {
    origine: 'voyageur',
    note: 'Arrivé par l’arabe « dirham », lui-même venu du grec « drachmê » : trois langues pour une pièce de monnaie.',
  },

  /* ---------------- couleurs ---------------- */
  azeggagh: { origine: 'amazigh', racine: 'ZGƔ', note: 'Le rouge.' },
  azegzaw: {
    origine: 'amazigh',
    racine: 'ZGZ',
    note: 'Le vert — et souvent le bleu. Beaucoup de langues amazighes ne séparent pas les deux : c’est la couleur de ce qui pousse et de ce qui est frais.',
  },
  awragh: { origine: 'amazigh', racine: 'WRƔ', note: 'Le jaune, de la même racine que « urɣ », l’or.' },
  aberkan: { origine: 'amazigh', racine: 'BRK', note: 'Le noir.' },
  amellal: { origine: 'amazigh', racine: 'MLL', note: 'Le blanc.' },

  /* ---------------- nombres ---------------- */
  yiwen: { origine: 'amazigh', note: 'Un, en kabyle. Le Maroc dit « yan », et « yat » au féminin.' },
  yan: { origine: 'amazigh', note: 'Un, au Maroc ; « yat » au féminin.' },
  yat: { origine: 'amazigh', note: 'Une — le féminin de « yan ».' },
  ijjen: { origine: 'amazigh', note: 'Un, au Rif. Au-delà, le Rif compte en arabe.' },
  sin: { origine: 'amazigh', note: 'Deux. Conservé au Souss et dans l’Atlas ; le Rif dit « tnayen », de l’arabe.' },
  krad: { origine: 'amazigh', note: 'Trois — un des nombres que le Souss a le mieux gardés.' },
  kkuz: { origine: 'amazigh', note: 'Quatre.' },
  semmus: { origine: 'amazigh', note: 'Cinq ; « smmus » au Maroc.' },
  smmus: { origine: 'amazigh', note: 'Cinq, au Maroc.' },
  tnayen: { origine: 'arabe', note: 'Deux, emprunté à l’arabe — le Rif a perdu la série amazighe au-delà de un.' },
  tlata: { origine: 'arabe', note: 'Trois, emprunté à l’arabe.' },

  /* ---------------- le temps ---------------- */
  ass: { origine: 'amazigh', note: 'Le jour. « Ass-a » : ce jour-ci, aujourd’hui.' },
  id: { origine: 'amazigh', note: 'La nuit.' },
  tanezzayt: { origine: 'amazigh', note: 'Le matin, en kabyle.' },
  tameddit: { origine: 'amazigh', note: 'Le soir, en kabyle.' },
  azekka: { origine: 'amazigh', note: 'Demain — « azkka » au Souss, « askka » au Moyen Atlas, « tiwecca » au Rif.' },
  azkka: { origine: 'amazigh', note: 'Demain, au Souss.' },
  askka: { origine: 'amazigh', note: 'Demain, au Moyen Atlas.' },
  tiwecca: { origine: 'amazigh', note: 'Demain, au Rif.' },
  idelli: { origine: 'amazigh', note: 'Hier.' },
  tura: { origine: 'amazigh', note: 'Maintenant.' },

  /* ---------------- la nature, la météo ---------------- */
  tafukt: {
    origine: 'amazigh',
    racine: 'FK / FW',
    note: 'Le soleil — même famille que « tifawin », les lumières, le bonjour du Souss.',
    voir: 'Tifawin',
  },
  ageffur: { origine: 'amazigh', note: 'La pluie, en kabyle.' },
  adfel: { origine: 'amazigh', note: 'La neige — le mot des montagnes, du Djurdjura à l’Atlas.' },
  adu: { origine: 'amazigh', note: 'Le vent.' },
  asigna: { origine: 'amazigh', note: 'Le nuage.' },

  /* ---------------- le travail ---------------- */
  tawuri: {
    origine: 'amazigh',
    note: 'Le travail, la tâche, la fonction. Donné pour le kabyle par Dallet, et bien vivant au Souss et dans l’Atlas — c’est le mot que la norme marocaine retient.',
  },
  axeddim: { origine: 'arabe', racine: 'XDM', note: 'De la racine arabe « xdm », servir, travailler.', voir: 'Tawuri' },
  axeddam: { origine: 'arabe', racine: 'XDM', note: 'Même racine arabe, avec la forme amazighe du nom de métier.' },
  axddam: { origine: 'arabe', racine: 'XDM', note: 'Le travailleur, au Maroc.' },
  lxedmet: { origine: 'arabe', racine: 'XDM', note: 'Le travail, au Rif.', voir: 'Tawuri' },
  lxdmt: { origine: 'arabe', racine: 'XDM', note: 'Le travail — la forme marocaine, avec l’article arabe soudé.' },
  afellah: { origine: 'arabe', note: 'De « fallāḥ », le cultivateur.', voir: 'Amekraz' },
  afllah: { origine: 'arabe', note: 'De « fallāḥ ».' },
  amekraz: {
    origine: 'amazigh',
    racine: 'KRZ',
    note: 'Le laboureur, de « krez », labourer — le mot amazigh du travail de la terre.',
  },
  amksa: { origine: 'amazigh', racine: 'KS', note: 'Le berger, de « ks », faire paître.' },
  aselmad: { origine: 'neo', racine: 'LMD', note: 'De « slmed », faire apprendre — l’enseignant.', voir: 'Anelmad' },
  aslmad: { origine: 'neo', racine: 'LMD', note: 'L’enseignant, au Maroc.' },
  anelmad: { origine: 'neo', racine: 'LMD', note: 'De « lmed », apprendre — l’élève.', voir: 'Aselmad' },
  anlmad: { origine: 'neo', racine: 'LMD', note: 'L’élève, au Maroc.' },
  amejjay: { origine: 'neo', racine: 'JJY', note: 'Le médecin, de « ajjy », guérir. Mot des médias et de l’école.' },
  ttbib: { origine: 'arabe', note: 'De « ṭabīb ». C’est ce qu’on dit partout au Maghreb.', voir: 'Amejjay' },
  lmeellem: { origine: 'arabe', note: 'De « muɛallim », celui qui enseigne le métier — le patron d’atelier.' },
  igr: { origine: 'amazigh', note: 'Le champ — pan-amazigh ; « iger » au Rif.' },
  iger: { origine: 'amazigh', note: 'Le champ, au Rif.' },
  tiwizi: {
    origine: 'amazigh',
    note: 'L’entraide : le village travaille chez l’un, puis chez l’autre, sans salaire. Une institution autant qu’un mot.',
  },
  ulli: { origine: 'amazigh', note: 'Les brebis et les chèvres — un pluriel sans singulier, comme « aman ».', voir: 'Aman' },
  tafunast: { origine: 'amazigh', note: 'La vache ; le taureau, c’est « afunas ».' },
  aghyul: { origine: 'amazigh', note: 'L’âne — pan-amazigh.' },
  simana: { origine: 'espagnol', note: 'La semaine, de l’espagnol « semana » — un des nombreux mots venus de Melilla.' },

  /* ---------------- le sport, le jeu ---------------- */
  addal: {
    origine: 'neo',
    note: 'Le sport — mot du XXᵉ siècle, formé sur des racines amazighes et repris par l’école et la télévision.',
  },
  urar: { origine: 'amazigh', note: 'Le jeu. Le pluriel « uraren » vaut pour les jeux d’enfants.' },
  uraren: { origine: 'amazigh', note: 'Les jeux — le pluriel de « urar ».' },
  tazzla: { origine: 'amazigh', racine: 'ZL', note: 'La course, de « azzel », courir.', voir: 'Azzel !' },
  tazzra: { origine: 'amazigh', racine: 'ZL', note: 'La course, au Rif — le l ancien y devient ř.', voir: 'Tazzla' },
  azzel: { origine: 'amazigh', racine: 'ZL', note: 'Cours ! — l’impératif du verbe courir.' },
  azzl: { origine: 'amazigh', racine: 'ZL', note: 'Cours ! au Maroc.' },
  azzer: { origine: 'amazigh', racine: 'ZL', note: 'Cours ! au Rif.' },
  takurt: {
    origine: 'amazigh',
    note: 'La balle, le ballon. Elle porte la forme amazighe (ta—t) ; certains auteurs y voient tout de même un emprunt ancien à l’arabe « kura ».',
    discute: true,
  },
  lkura: { origine: 'arabe', note: 'De « kura », le ballon — la forme d’usage au Rif et au Maroc.', voir: 'Takurt' },
  ryada: { origine: 'arabe', note: 'De « riyāḍa », le sport — ce qu’on dit tous les jours.', voir: 'Addal' },
  eumm: { origine: 'arabe', note: 'De « ɛām », nager. Le kabyle n’a pas gardé de verbe propre pour la nage.' },

  /* ---------------- pronoms & grammaire ---------------- */
  nekk: { origine: 'amazigh', note: 'Moi. Les pronoms indépendants amazighs sont très stables d’une langue à l’autre.' },
  kecc: {
    origine: 'amazigh',
    note: 'Toi, à un homme. L’amazigh distingue le masculin et le féminin à la deuxième personne — le français, non.',
    voir: 'Kemm',
  },
  kemm: { origine: 'amazigh', note: 'Toi, à une femme.', voir: 'Kečč' },
  netta: { origine: 'amazigh', note: 'Lui ; « nettat » pour elle.' },
  nettat: { origine: 'amazigh', note: 'Elle.' },
  'ass a': { origine: 'amazigh', note: 'Ass (le jour) + -a, qui montre ce qui est proche : ce jour-ci.', voir: 'Ass' },
  'as d': {
    origine: 'amazigh',
    note: 'Le verbe « as » (venir) suivi de -d, la particule qui ramène vers celui qui parle. Sans elle, on part.',
  },
  ecc: { origine: 'amazigh', note: 'Mange ! — impératif du verbe « ečč ».' },
  sew: { origine: 'amazigh', note: 'Bois ! — impératif du verbe « sew ».' },
  ruh: {
    origine: 'arabe',
    note: 'Va, pars. Rapproché de l’arabe « rāḥ » ; le kabyle a aussi « ddu », du fonds amazigh.',
    discute: true,
  },
  'd acu yagi': { origine: 'amazigh', note: '« acu » (quoi) suivi de -agi, ceci : qu’est-ce que ceci ?' },
  melmi: { origine: 'amazigh', note: 'Quand ?' },
  'azul fell ak': { origine: 'amazigh', note: 'Azul + fell-ak, « sur toi » — le salut se pose sur quelqu’un.' },
  'ansuf yes k': { origine: 'amazigh', note: 'Ansuf + yes-k, « avec toi ».' },
  'aql i labas': { origine: 'amazigh', note: '« Aql-i », me voici — puis labas, l’emprunt arabe.', voir: 'Labas' },
  'anda txeddmed': { origine: 'amazigh', note: '« Anda », où — suivi du verbe à la deuxième personne (t… -ḍ).' },
  'xeddmegh deg wexxam': {
    origine: 'amazigh',
    note: 'Le -ɣ final, c’est « je ». Et « axxam » devient « wexxam » après la préposition : c’est l’état d’annexion, la marque la plus reconnaissable de la grammaire amazighe.',
    voir: 'Axxam',
  },
  'tanemmirt atas': { origine: 'amazigh', note: 'Tanemmirt + aṭas, beaucoup.', voir: 'Tanemmirt' },
  'sew atay': { origine: 'amazigh', note: 'Impératif « sew » + atay, le mot voyageur du thé.', voir: 'Atay' },
  'manzakin': {
    origine: 'amazigh',
    note: 'Comment vas-tu ? — la terminaison change avec le genre : « manzakmin ? » à une femme.',
  },
  'mamec teggid': { origine: 'amazigh', note: 'Comment vas-tu ?, au Rif.' },
  'mayd tenit': {
    origine: 'amazigh',
    note: 'Comment vas-tu ?, au Moyen Atlas. Le ɛ laisse penser à une racine arabe — à trancher.',
    discute: true,
  },
  'is thnna ghur k': {
    origine: 'amazigh',
    note: '« Is » ouvre la question, « ɣur-k » veut dire chez toi. On demande la tranquillité de la maison, pas la santé.',
    discute: true,
  },
  tanmmirt: { origine: 'amazigh', racine: 'NMR', note: 'Merci — la graphie sans schwa, celle du Maroc et de la norme.', voir: 'Tanemmirt' },

  /* ---------------- formules qui nomment Dieu ---------------- */
  // Elles ne sont pas dans le registre des emprunts (voir data/emprunts.js) :
  // une bénédiction ne se remplace pas par un synonyme. Le dictionnaire, lui,
  // peut en dire l'origine sans rien proposer à la place.
  'lla yeawn': { origine: 'arabe', note: 'Que Dieu t’aide — ce qu’on dit à quelqu’un en plein travail.' },
  'qqim g lman': {
    origine: 'amazigh',
    note: 'Formule mixte : « qqim » (reste) est amazigh, « lman » vient de l’arabe « amān », la sauvegarde.',
  },
  'ak isrbh rbbi': { origine: 'arabe', note: 'Que Dieu te fasse réussir — le merci du Souss.' },
  'labas lhamdulillah': { origine: 'arabe', note: 'Ça va, Dieu merci.' },
  'labas l hamdullah': { origine: 'arabe', note: 'Ça va, Dieu merci — la forme du Moyen Atlas.' },
  'mlih l hamdu li llah': { origine: 'arabe', note: 'Ça va bien, Dieu merci — la forme du Rif.' },

  /* ---------------- l'écriture, l'identité ---------------- */
  tifinagh: {
    origine: 'amazigh',
    note: 'Le nom de l’écriture. Souvent lu « les phéniciennes », par rapprochement avec l’alphabet punique — lecture répandue, mais discutée.',
    discute: true,
  },
  amazigh: {
    origine: 'amazigh',
    racine: 'MZƔ',
    note: 'Traduit d’ordinaire par « homme libre ». Le pluriel est « Imazighen », le féminin « Tamazight ».',
    discute: true,
  },
})

/** L'étymologie d'un mot : d'abord la note propre à la langue, sinon la commune. */
export function etymologieDe(cle, langId) {
  return ETYMOLOGIES[`${langId}:${cle}`] || ETYMOLOGIES[cle] || null
}
