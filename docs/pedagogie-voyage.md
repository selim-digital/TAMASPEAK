# Faire vivre une histoire — propositions des comités

> Document de décision, rédigé à la demande de Selim (« convoque des comités
> experts »). Quatre comités ont été réunis : **didactique des langues**,
> **narration & personnages**, **game design & rétention**, **culture & langue
> amazighe**. Ce texte est leur synthèse, avec les points où ils se
> contredisent laissés visibles — c'est là que se prennent les décisions.
>
> Rien ici n'est implémenté. Ce sont des propositions.

---

## 1. Le diagnostic, en chiffres

Selim : « là c'est plat et on n'est pas embarqué ». Les comités confirment, et
la mesure est plus dure que l'intuition.

**Quatre cours sur cinq n'ont aucune phrase, aucune image, aucun son.**

| Cours | qcm | match | image | listen | **sentence** | culture |
| --- | --- | --- | --- | --- | --- | --- |
| kab | 73 | 29 | 34 | 19 | **10** | 23 |
| rif | 27 | 5 | 0 | 0 | **0** | 6 |
| shi | 26 | 5 | 0 | 0 | **0** | 7 |
| tzm | 26 | 5 | 0 | 0 | **0** | 7 |
| zgh | 26 | 8 | 0 | 0 | **0** | 12 |

L'unité 1 — celle qui est gratuite, donc celle qui décide de tout — est, dans
quatre langues sur cinq, un enchaînement de QCM mot↔mot. C'est mécaniquement
plat.

**Les autres mesures :**

- **95 % de mots isolés.** En kabyle, la première phrase de plus de deux mots
  arrive à `lessons.js:114` — leçon 12, unité 3. Environ 45 minutes de jeu.
  Duolingo en produit une au troisième écran.
- **Zéro exercice de production.** Les six fabriques de `exercises.js`
  prennent toutes `answer` + `choices`, et `LessonScreen.jsx:250` les rend
  toutes par la même liste de boutons. `match` inclus : apparier n'est pas
  produire. L'élève n'assemble jamais rien.
- **Zéro répétition espacée.** `progress.js` ne stocke que des statuts de
  *leçon*. Rien ne mémorise qu'un élève s'est trompé sur *Ansuf* :
  `LessonScreen.jsx:66` agrège un `correctCount` et le jette ligne 141. Le
  quiz de fin (`App.jsx:484`) tire **au hasard**, pas par faiblesse. Et les
  révisions (`l9`, `l17`, `l35`, `l45`) sont écrites en dur, identiques pour
  tout le monde.
- **Onze taps avant le premier mot amazigh.** L'onboarding se termine sur
  `AUJOURDHUI` (`App.jsx:469`) — un tableau de bord vide : objectif 0/20,
  série 0. Il faut encore taper « Continuer » pour atteindre une leçon.
- **Des personnages qui ne parlent jamais.** Les six de `Family.jsx` sont
  dessinés, ont des bios et des répliques — et n'apparaissent dans aucun
  exercice. `cheerFor(count)` les tire au hasard, sans lien avec l'unité, le
  paysage ou ce que l'élève vient de faire. Le même `cheer` est même rendu
  sous *chaque* unité ouverte (`PathScreen.jsx:285`).

**Ce qui manque tient en un mot : la récurrence.** « Retrouver un personnage »
suppose de l'avoir déjà croisé au même endroit, dans le même rôle, plusieurs
fois. Or `cheerFor` est un tirage : le personnage qui t'encourage aujourd'hui
n'est pas celui d'hier, et aucun d'eux n'a jamais dit une phrase que tu devais
comprendre. Ce ne sont pas des personnages, ce sont des vignettes en rotation.

---

## 2. La bonne nouvelle : presque tout est déjà là

Trois découvertes changent l'estimation du coût.

**Les phrases existent déjà, elles sont enterrées.** `Ansuf yes-k` et
`Aql-i labas` sont à `lessons.js:152-153` — leçon 17. `D acu-yagi ?` et
`Ur fhimeɣ ara` à `lessons.js:415-428` — leçons 42 à 44. Les remonter en
unité 1 est un **réordonnancement**, pas une écriture de contenu.

**L'exercice de dialogue existe déjà — et il a été inventé pour le tarifit.**
`rif.js:37` : « *On te dit « Ssalamu ɛlikum ». Que réponds-tu ?* » C'est le
seul exercice de toute l'app qui place l'élève dans une interaction. Il est
présent dans `rif`, `shi`, `tzm` — et **absent du kabyle**, le cours vaisseau.

**Les scènes dessinées sont indépendantes de la langue.**
`Scenes.jsx` contient une vingtaine d'illustrations (thé, pain, eau, maison,
chat, porte, livre, soleil, pluie, souk, olives, drapeau…). Elles ne servent
qu'au kabyle. Les ouvrir aux quatre autres cours ne demande **aucun dessin et
aucun mot nouveau** — seulement de remplacer des QCM par des `image()` sur du
vocabulaire déjà validé.

Et aussi : le **lexique personnel** (`progress.js:175`, `addToLexique`) et les
**missions** (`missions.js`) sont déjà exactement le « carnet de voyage » dont
le récit a besoin. L'armature narrative peut s'y brancher au lieu de créer un
système parallèle.

---

## 3. Palier 1 — basique, efficace, les 5 langues en parallèle

Ordonné par effet/coût décroissant. Aucun ne demande de contenu linguistique
lourd. Les cinq premiers tiennent en une demi-journée.

| # | Changement | Fichier | Effort |
| --- | --- | --- | --- |
| 1 | **Finir l'onboarding *dans* la leçon 1.** Remplacer `setScreen(AUJOURDHUI)` par le lancement du premier nœud. L'élève apprend « Azul » avant d'avoir vu un tableau de bord. | `App.jsx:469` | S |
| 2 | **Couper l'onboarding en deux.** Avant la leçon : langue + pourquoi (2 taps). Après : objectif, opt-in email, présentation de la famille. Réduire les 4 diapos produit à une. 11 taps → 3. | `OnboardingScreen.jsx` | S/M |
| 3 | **Ouvrir les scènes aux 4 autres langues.** ~4 `image()` par unité, sur du vocabulaire déjà là. | `courses/*.js` | S |
| 4 | **Remonter les phrases existantes en unité 1** (§2) et **porter l'exercice de dialogue au kabyle.** Le formaliser en fabrique `repond()`. | `lessons.js`, `exercises.js` | M |
| 5 | **Attribuer l'énoncé à quelqu'un.** Champ optionnel `qui` : *Setti — « Azul fell-ak »*, silhouette à gauche. Défaut : rotation stable. | `exercises.js`, `LessonScreen.jsx:208` | M |
| 6 | **Faire dire les éloges par le personnage** plutôt que par `PRAISES` anonymes. | `LessonScreen.jsx:98` | S |
| 7 | **Retirer les cœurs** (voir ci-dessous). | `LessonScreen.jsx` | S |
| 8 | **Célébrer le jour 1.** « Série : 1 » ne veut rien dire à la première leçon — écrire « Premier jour ! ». | `LessonCompleteScreen.jsx:96` | S |
| 9 | **Mémoire par item + révision générée.** Stocker `{mot: {vus, err, force, prochain}}`, tirer le quiz de fin par faiblesse et non au hasard, remplacer les 4 leçons de révision en dur par un nœud généré. | `progress.js`, `App.jsx:477` | L |

### Les cœurs : une contradiction ouverte dans le code

`economy.js:9-14` porte une règle explicite : « **RÈGLE À NE PAS ENFREINDRE :
[…] Pas de cœurs, pas de vies, pas d'énergie** », avec l'argument — juste — que
sur un public adulte que la honte de mal parler bloque déjà, ce serait la faute
la plus coûteuse possible.

Et `LessonScreen.jsx:65` déclare `useState(5)`, ligne 116 décrémente, ligne 177
affiche. **Aucun code ne lit jamais `hearts === 0`** : les seules occurrences
dans tout `src/` sont ces trois-là, plus un passage inerte à `onFinish` que
`finishLesson` ignore.

L'app affiche donc une menace qu'elle n'exécute pas. C'est le pire des trois
mondes : ça stresse le débutant, ça ne motive personne, et ça enseigne que les
signaux de l'app sont du décor. **Proposition : remplacer par un compteur
d'erreurs neutre** — « 2 à revoir », en encre douce, pas en corail — et faire
revenir ces mots-là dans le quiz de fin. Même information, retournée du côté de
l'apprentissage.

### Trois pièges de Duolingo à ne pas copier

1. **Rien ne coupe jamais une session commencée.** C'est déjà écrit dans
   `economy.js` ; il faut que le code obéisse.
2. **Jamais de culpabilisation.** `OnboardingScreen.jsx:50` promet « Jamais de
   reproche » — cette promesse doit tenir jusque dans les notifications. Le
   rappel dit ce qu'il y a à faire, jamais ce qui a été manqué.
3. **La série ne doit pas être une dette.** Compter les jours actifs sur 7
   glissants, ou accorder un jour de grâce silencieux. Et ne jamais vendre de
   « réparation de série » : ce serait monétiser une angoisse qu'on a
   soi-même fabriquée. Corollaire : **pas de ligues.** Le cercle d'amis fait
   le même travail social sans le coût.

---

## 4. Palier 2 — l'armature narrative du voyage

> **Décision de Selim, qui commande tout ce qui suit.** L'élève doit vivre une
> aventure à travers les sections, en traversant plusieurs paysages,
> **accompagné des mêmes personnages du début à la fin**. Le comité narration
> avait proposé l'inverse — une famille qui reste au village et un hôte
> différent à chaque région, le moteur étant l'éloignement. Cette version est
> écartée. Ce qui suit est l'armature corrigée.

### La prémisse

Tu ne pars pas seul, et tu ne pars pas de rien : **la famille voyage avec
toi**. Les six d'`Family.jsx` plus Akermus forment une troupe qui traverse les
onze paysages du premier au dernier. Le décor change, les compagnons non.

Chaque région traversée parle une langue cousine de la tienne : parfois tu
comprends, parfois presque, parfois plus du tout. Le voyage sert à vérifier
**jusqu'où ta langue porte** — et la troupe est là pour que cette épreuve ne
soit jamais solitaire.

**Le moteur dramatique n'est ni une quête ni un danger : c'est le
compagnonnage.** Ce qui attache l'élève, ce n'est pas le manque, c'est
**l'habitude** — retrouver les mêmes voix, savoir qui va dire quoi, reconnaître
Aqcic à sa façon de poser une question avant même de lire son nom. C'est
exactement le ressort de Duolingo : neuf personnages qui reviennent, qu'on
finit par connaître. Et l'habitude est précisément ce qui fait revenir un
utilisateur demain.

Le voyage n'est pas non plus une fuite : à mesure qu'on avance, **la troupe
apprend en même temps que toi**. Aqcic se trompe et se corrige, Setti reconnaît
un mot qu'elle croyait perdu, Jeddi retrouve un chemin qu'il avait fait jeune.
Le dernier paysage, le Tassili, n'a personne pour traduire : des gravures sur
la paroi, et vous êtes sept à les regarder. Ce que tu sais lire, tu le lis à
voix haute — pour eux.

### Le problème de l'ordre variable, résolu par la troupe

`journeyFor()` fait partir chaque langue de chez elle, puis déroule l'ordre
fixe : le tachelhit commence au Ksar, le kabyle au Djurdjura. Un récit accroché
à la **géographie** serait donc impossible à écrire.

**La troupe résout cela d'elle-même.** Si la continuité est portée par les
personnages et non par les régions, l'ordre des paysages n'a plus d'importance
narrative. Le fil, c'est que Setti et Aqcic sont toujours là. Les paysages
redeviennent ce qu'ils sont — un décor qui change, la preuve visible qu'on
avance.

Deux règles d'écriture suffisent alors, au lieu des trois couches qu'exigeait
la version précédente :

1. **L'arc est attaché à l'index d'unité, jamais au paysage.** Treize étapes,
   identiques pour les cinq langues : on part (u1–u2), on s'enhardit (u3–u8),
   on va loin (u9–u13). C'est la troupe qui progresse, pas la carte.
2. **Aucune référence ordinale dans un texte d'escale.** Interdits : « après le
   Rif », « déjà quatre régions ». Autorisés : « plus loin », « le lendemain ».
   Chaque escale doit tenir en position 2 comme en position 9.

**Le carnet, lui, reste** — et il existe déjà : `addToLexique`
(`progress.js:175`) enregistre un mot *avec le nom de qui l'a dit*. C'est le
carnet de voyage, écrit avant qu'on en ait besoin. Chaque escale peut s'ouvrir
en citant le dernier mot reçu : « *Tu arrives avec {mot}. Ici, on ne le dit pas
comme ça.* » Une phrase générée, onze escales indépendantes, un fil continu
dans n'importe quel ordre.

### Le ton, en trois règles

**Phrases courtes, verbes concrets, jamais d'adjectif d'émerveillement.** Pas
de « majestueux », pas de « millénaire », pas de « âme ». On dit ce qui se
passe. Trois à six phrases par fragment : c'est une app, pas un roman.

**Départ — Djurdjura, cours de kabyle**

> Le car vous laisse au col, une heure avant le village. La crête tient encore
> un peu de neige ; en bas, les terrasses d'oliviers descendent jusqu'à la
> route. Jeddi est déjà en train de marcher. Setti compte les sacs. Ici, on ne
> vous demandera pas d'où vous venez — on attendra de voir si tu sais dire
> bonjour.

**Ouverture — Unité 1, Azul**

> Azul, c'est bonjour, et c'est un peu plus : la main ouverte qu'on montre
> avant d'arriver. Yemma te fait répéter deux fois avant de frapper à la porte.
> Aqcic, lui, a déjà frappé. Cinq leçons. De quoi entrer quelque part.

**Fin d'unité 1**

> Tu as dit azul, et on t'a répondu. Ferroudja, qui greffe des oliviers depuis
> l'aube, te donne un mot pour la route : celui qu'on lance dans le dos de
> quelqu'un qui s'en va. Setti le répète pour elle-même, deux fois. Elle ne
> l'avait pas entendu depuis longtemps. Un mot dans le carnet.

**Escale type — M'zab, en position quelconque**

> Vous arrivez avec le mot qu'on vous a donné plus loin. Ici, il se dit
> autrement : Brahim l'entend, hésite, puis rit. Il fabrique des jarres dont la
> contenance sert à partager l'eau entre les jardins — se tromper d'un mot,
> chez lui, se paie en litres. Baba veut comprendre le calcul avant de boire.
> Aqcic a déjà bu.

**Note de mise en scène.** Les fragments citent **un ou deux compagnons à la
fois**, jamais les six. La troupe est permanente dans l'histoire, pas à
l'écran : c'est ce qui la rend tenable sur un téléphone (voir « la règle de
mise en scène » plus bas).

### Le casting

**La troupe — permanente, du premier paysage au dernier.** Sept présences, sept
registres, jamais interchangeables. C'est la fin du `cheerFor` aléatoire : on ne
tire plus un personnage au hasard, on sait qui parle et pourquoi.

| Compagnon | Ce qu'il est dans le voyage | Ce qu'il porte dans la langue |
| --- | --- | --- |
| **Akermus** | celui qui doute tout haut | la forme fausse, puis la bonne |
| **Aqcic** | il arrive toujours le premier | les questions |
| **Taqcict** | elle compte, elle liste, elle retient | énumérations, nombres |
| **Yemma** | elle fait répéter avant de frapper | salutations, accueil, formules |
| **Baba** | il veut comprendre avant d'agir | impératifs, explications |
| **Setti** | elle reconnaît des mots qu'elle croyait perdus | mots anciens, bénédictions d'usage |
| **Jeddi** | il a déjà fait ce chemin, autrement | directions, conseils, le passé |

**Ce qui les fait exister, et c'est le point le plus important :** ils
**apprennent avec l'élève**. Aqcic se trompe et se corrige ; Setti retrouve un
mot ; Baba demande une explication que l'élève vient d'obtenir. Un compagnon
qui sait déjà tout n'est pas un compagnon, c'est un professeur — et l'app en a
déjà un, c'est le moteur de leçon.

**La règle de mise en scène — permanent dans l'histoire, pas à l'écran.** La
troupe est constante, mais **on n'en montre qu'un ou deux à la fois** : celui
que la scène appelle. Six silhouettes en permanence sur un téléphone seraient
illisibles, et le comité game design alerterait sur l'encombrement vertical.
Duolingo tient neuf personnages récurrents en n'en affichant qu'un ou deux par
exercice. Même règle ici : le casting est permanent, le cadrage tourne.

**Hôtes régionaux — des rencontres, pas des porteurs de récit.** Un par
paysage, le temps d'une étape. Ils donnent la couleur locale et **un mot pour
le carnet**, puis la troupe repart. C'est ce qui permet de garder toute la
richesse régionale sans repayer une amnésie tous les cinq leçons. Chacun a un
**métier daté d'aujourd'hui** et, sur recommandation du comité culturel, **un
rapport ambivalent à sa langue** :

| Paysage | Hôte | Métier | Apporte |
| --- | --- | --- | --- |
| Djurdjura | Ferroudja | greffe les oliviers, tient un registre | salutations |
| Côte kabyle | Meziane | répare des moteurs de barque à Tigzirt | la météo |
| Rif | Mimun | conduit la ligne Al Hoceima–Nador | oui/non, les prix |
| Haut Atlas | Itto | vétérinaire de transhumance | animaux, corps |
| Aurès–Ghoufi | Nedjma | tisse, compte ses commandes à voix haute | les nombres |
| M'zab | Brahim | potier, jarres calibrées pour l'eau | mesures, maison |
| Ksar du Sud | Zahra | garde les clés du grenier collectif | nourriture |
| Oasis | Aksil | pollinise les palmiers à la main, en avril | saisons |
| Grand Erg | Tili | camion-citerne, ravitaille trois campements | jour/nuit |
| Hoggar | Rhissa | relève le niveau des puits pour l'État | pronoms |
| Tassili | *personne* | la paroi gravée | lecture seule |

**Ce qui les tient debout : chacun se trompe sur ta langue une fois, et tu le
corriges.** Un hôte qu'on ne peut jamais corriger est un décor.

Le Tassili, dernière étape, n'a volontairement pas d'hôte : la paroi gravée, et
la troupe autour. Personne pour traduire. C'est l'élève qui lit.

Le comité culturel ajoute une figure qu'il tient pour la meilleure de toutes :
**une grand-mère qui refuse d'enseigner sa langue**, parce qu'elle l'associe à
la pauvreté. Elle vaut mille sages du désert — et elle touche au vrai sujet
émotionnel de l'app (§6).

### Les personnages dans les exercices

Un champ optionnel `by` sur les fabriques :
`sentence('Ansuf yes-k', 'Sois le bienvenu', […], { by: 'zahra' })`. À
l'affichage : silhouette 40 px (sans visage, règle intacte) + nom en gras +
phrase entre guillemets. Zéro nouvel écran — c'est la mise en page de
`FamilyCheer`, réduite.

**L'attribution n'est pas cosmétique, elle est grammaticale.** Chaque compagnon
porte la forme qui lui est assignée dans le tableau ci-dessus, et il la porte
**pendant tout le voyage** — c'est ce qui le rend reconnaissable. Une question
en amazigh, c'est Aqcic ; une bénédiction d'usage, c'est Setti. Au bout de trois
unités, l'élève sait qui va parler avant de lire le nom. Les hôtes, eux,
portent le lexique de leur métier, le temps de leur étape.

Deux règles : un mot isolé n'a pas de locuteur (une phrase sur trois environ,
sinon le procédé s'use) ; et **sur erreur, le personnage reformule, il ne juge
pas** — « Setti le redit plus lentement ».

*Ce que ça change à la mémorisation :* une phrase associée à une source stable
acquiert un indice de rappel supplémentaire (qui / où). En révision, on peut
alors interroger par la source — « Qu'est-ce que Zahra t'a appris à
demander ? » — ce qui produit du **rappel actif** là où le QCM ne produisait
que de la reconnaissance.

---

## 5. Le voyage est virtuel — et deux défauts de `journey.js`

**Une objection écartée par Selim, et elle méritait de l'être.** Le comité
culturel avait soulevé que la frontière Algérie–Maroc est fermée depuis 1994 et
qu'un personnage marchant de Kabylie au Rif serait invraisemblable. L'objection
suppose un récit de voyage réaliste. Or ce n'en est pas un : **l'élève traverse
les pays amazighs virtuellement, à travers les leçons**. `journey.js` fait déjà
exactement cela — une unité, un paysage en toile de fond. Personne ne prétend
marcher, donc il n'y a pas de frontière à franchir.

C'est même ce qui rend l'armature du §4 plus simple qu'elle n'en avait l'air :
il n'y a pas de fiction de voyageur à construire. **Le seul qui progresse, c'est
l'élève lui-même**, et les paysages sont le décor de sa progression. Les trois
couches (arc / escales / chez soi) et le dispositif du « dernier mot reçu »
tiennent tels quels — ils n'ont jamais eu besoin d'un personnage qui marche.

Ce qui reste à trancher est d'un autre ordre : **deux défauts structurels de
`journey.js`**, réels indépendamment du cadrage narratif.

1. **L'itinéraire est faux pour les langues marocaines.** Un apprenant de
   tachelhit fait Ksar → **Kabylie** → côte kabyle → Rif → Haut Atlas. Il
   traverse la Kabylie à l'unité 2 en apprenant du tachelhit. Chaque langue
   doit avoir son ordre propre, partant de son aire et s'en éloignant.
2. **Le Souss n'a pas de paysage.** Le pays de l'arganier — aire de la
   deuxième langue de l'app — est absent des onze. Sur onze paysages, sept ou
   huit sont algériens, alors que trois des cinq langues sont marocaines.
   Manquent aussi Djerba/Nefoussa, Siwa, les Canaries, la diaspora.

---

## 6. Les lignes rouges

### Ce qui se dit, ce qui se dit avec soin, ce qui se tait

**Sans précaution :** toute l'histoire ancienne et médiévale ; la
reconnaissance constitutionnelle (Maroc 2011, Algérie 2016) ; le Printemps
berbère de 1980 ; la répression coloniale ; l'arabisation post-indépendance et
l'interruption de la transmission familiale. C'est déjà dans `history.js` et
c'est bien fait.

**Avec soin :** le Printemps noir de 2001 (une ligne factuelle, sans chiffres
contestés — continuer ainsi) ; le Hirak du Rif de 2016-2017, sujet vif au
Maroc, **à revérifier à la date de publication** et probablement à ne pas
transformer en épisode ; la question touarègue au Mali et au Niger, où
l'itinéraire réel traverse des zones de guerre.

**À taire :** toute position sur le Sahara occidental ; toute carte avec des
frontières d'États ; l'autonomisme kabyle et le MAK. Sur ce dernier point,
l'argument n'est pas commercial mais humain : le mentionner exposerait l'app
*et les futurs validateurs résidant en Algérie*.

**Point de vigilance à décider consciemment :** `units.js` u9 contient une
leçon « Le drapeau » (`l32`). L'emblème est largement accepté, mais son port a
valu des poursuites en Algérie en 2019.

**Sur « Tamazgha » :** le mot est un néologisme du mouvement culturel amazigh
des années 1970-80, pas un toponyme historique — il postule une aire unifiée.
En commentaire de code, aucun problème. Or il est **en surface** :
`JeuxScreen.jsx:223` et `QuizScreen.jsx:111` affichent « Quiz Tamazgha ». À
arbitrer, en cohérence avec la règle de nommage déjà posée dans
`languages.js`.

**Ce qu'il serait lâche d'omettre :** que la langue a été empêchée, pas
seulement « oubliée » ; que des gens sont morts pour elle ; que beaucoup de
grands-parents ont **choisi** de ne pas transmettre parce que la langue était
un stigmate social. Le récit « aujourd'hui » de `history.js` frôle ce point
sans le nommer. C'est le vrai sujet émotionnel de l'app.

### Les archétypes interdits

Le nomade sage qui parle par proverbes ; l'artisan mystique ; la vieille
tisserande « gardienne de la mémoire » ; le berger enfant ; **la femme au
tatouage** — le tatouage facial est en voie de disparition et souvent renié par
celles qui le portent, associé à un stigmate et à une pratique subie enfant ;
en faire un emblème esthétique reproduit l'affiche touristique coloniale.

Et surtout **le « Berbère fier et indomptable »** : c'est le mythe kabyle forgé
par l'administration française pour opposer un Kabyle « civilisable » à un
Arabe. Le reproduire en éloge, c'est reconduire la taxinomie.

**Piège idéologique majeur :** tout contraste implicite amazigh / arabe
s'installe sans qu'on le veuille, par les détails. Relire chaque scène en se
demandant : *ce personnage est-il bon parce qu'il est amazigh ?*

**Autres interdits, rappelés par les deux comités :** la figure historique
déguisée (les 19 de `personnages.js` restent dans la galerie Histoire — les
mélanger transforme l'histoire en fantasy et discrédite les deux) ; le pathos
de la langue mourante (faux, insultant pour des millions de locuteurs, et un
moteur qui s'éteint en trois jours) ; l'unanimisme pan-amazigh — **la friction
entre variétés est le sujet, pas un défaut à masquer** ; l'objet magique (le
carnet est un carnet — une amulette enfreindrait aussi la règle
d'ornementation).

### Les confusions de peuples à ne pas commettre

- **Aurès = chaoui (tacawit)**, pas kabyle. Langue distincte, non enseignée
  par l'app. Traverser les Aurès sans le dire efface un peuple.
- **M'zab = mozabite (tumzabt), ibadite** — ni sunnite ni chiite, avec ses
  propres institutions.
- **Hoggar/Tassili = touareg (tamahaq)**, et l'art rupestre du Tassili est
  néolithique : ses auteurs **ne sont pas identifiables comme amazighs**. Le
  paysage ne doit pas laisser croire « nos ancêtres ont peint ça ».
- **« Ksar du Sud », « L'oasis », « Grand Erg »** sont trois décors sans
  peuple. Soit on nomme un lieu réel avec sa société — y compris la
  stratification qu'on ne met pas en scène à la légère —, soit on assume le
  décor et on n'y met pas d'habitants.

**Comment assumer de traverser des régions où l'on ne parle pas la langue
étudiée : en en faisant le sujet.** Le voyageur arrive, ne comprend pas, doit
demander. « Ici on dit *taddart* pour la maison ; chez toi ça veut dire le
village. » Ce faux-ami est **déjà documenté dans `tzm.js`** : c'est une scène
toute écrite. Le défaut devient la meilleure leçon de sociolinguistique de
l'app.

### Registre : ce qui est sûr en kabyle, ce qui ne l'est pas

Le kabyle réel est massivement mêlé d'arabe algérien et de français. **Un
dialogue kabyle sans un seul mot arabe est un dialogue faux.** Le purisme et le
laisser-aller sont deux façons de rater.

**Sûr :** *azul*, *tanemmirt* — cas rare où le néologisme de l'*Amawal* a
réellement gagné chez les locuteurs kabyles, contrairement au Rif et au Souss,
et c'est pourquoi `lessons.js` a raison là où `rif.js` a raison de refuser ;
*azul fell-ak / fell-am* ; *ih / ala* ; *labas ?* ; *ansuf* ; et tout le
lexique concret (*axxam, aman, aɣrum, atay, amcic*).

**Pas sûr, et actuellement non signalé :** au-delà de deux ou trois, **le
kabyle courant compte en arabe**. L'unité 5 (`lessons.js`, l18–l20) enseigne
*Yiwen / Sin / Kraḍ / Kkuẓ / Semmus* comme si la série berbère était vivante —
c'est de la forme scolaire, **exactement le piège que `rif.js` a
explicitement évité** pour ses propres numéraux. Il faut y porter la même note
d'usage. Idem pour les jours et les mois (arabes), et pour tout néologisme
d'objet moderne. La variation Grande / Petite Kabylie n'est assumée nulle part.

**Deux corrections de contenu signalées au passage :**

- `lessons.js:132` glose *Yemma* par « Mère ». En kabyle, *yemma* signifie déjà
  « **ma** mère » — nom inaliénablement possédé. `rif.js:123` dit « Maman » :
  c'est meilleur. À corriger dans les cinq cours.
- `D tawwurt` (proposé pour l'unité 2) : la sandhi *d* + *t* initial pourrait
  donner une assimilation selon les parlers. **À faire trancher par un
  locuteur avant publication, sinon retirer ce couple.**

**Les formes féminines `fell-am` et `yes-m` n'existent nulle part dans le
corpus actuel.** Elles sont attendues par symétrie et l'usage est très
probable, mais ce sont des **propositions à valider**, pas des faits.

### L'islam et le fait religieux

Les formules religieuses ne sont pas un ajout à la langue amazighe : elles en
sont le tissu. *Barek llahu fik* au Rif, *Lla yɛawn* au Moyen Atlas,
*Ak isrbḥ rbbi* en tachelhit — les trois cours le documentent déjà, sources à
l'appui. En kabyle : *Ṛebbi yeḥrez*, *Llah ibarek*, *bismillah*, *ma yebɣa
Ṛebbi*. Les effacer produirait une langue de laboratoire.

**La justesse tient en une ligne : enseigner l'usage, jamais la doctrine.** Le
critère est « que dit-on quand… », pas « que doit-on croire ». Glose littérale
+ fonction : « *Barek llahu fik* — que Dieu te bénisse : c'est comme ça qu'on
dit merci. » Un apprenant non croyant doit pouvoir l'employer sans se sentir
sommé.

Ne pas mettre : versets, contenu de dogme, jugement sur les pratiques
préislamiques. Et **ne pas faire du sunnisme malékite le défaut universel des
Amazighs** — ils ont été chrétiens (Augustin, donatisme), juifs (Djerba), et
sont ibadites au M'zab, à Djerba, au Nefoussa. `history.js` couvre déjà ces
trois-là : garder cet équilibre.

*Note du comité au fondateur :* le risque n'est pas de mettre trop d'islam,
c'est qu'un lecteur militant laïc accuse l'app d'arabiser la langue. La défense
est déjà écrite — ces formules viennent de Mourigh & Kossmann, du Peace Corps,
de Serhoual. **La source protège.** Dans le récit, la ligne est simple : le
narrateur ne prescrit jamais, les personnages vivent.

---

## 7. La bêta kabyle

**La forme.** Un cours parallèle, pas une refonte. `COURSES.kab` reste ; on
ajoute `kab-beta` dans `courses.js` avec son propre contenu. Le store est déjà
multi-langues (`progress.js:222-290`) : rien à changer. Sur `LanguagesScreen`,
une carte distincte et honnête — « **Kabyle — Le voyage (bêta)** · nouvelle
façon d'apprendre, dis-nous ce que tu en penses ». On n'A/B-teste pas en
cachette : on invite.

**Le feedback.** `FeedbackScreen.jsx` est le bon canal — l'emoji seul suffit à
envoyer. Deux ajouts minuscules : ajouter `'beta'` aux catégories dans
`api/feedback.js`, et déclencher l'écran à la fin de l'unité bêta 1 avec la
question posée à voix haute : « *Tu préfères celle-ci ou l'ancienne ?* »

**Les métriques.** Contrairement à ce qu'on pourrait croire, l'app **a** de la
mesure : `api/events.js` accepte `lesson_completed` avec un champ `lang`, et
`api/admin.js?r=stats` calcule déjà des cohortes J1/J7/J30. Il suffit
d'ajouter `kab-beta` aux deux listes blanches (`api/events.js:30` et
`api/feedback.js`) — **aucune fonction serverless nouvelle**, le plafond de
douze est préservé.

Les trois chiffres qui décident :

1. **Achèvement de l'unité 1**, bêta contre standard — le seul qui compte
   vraiment.
2. **J7**, cours contre cours.
3. **Le ratio ☀️/⛈️** des feedbacks tagués `beta`.

**La règle d'extension, à décider maintenant et pas après avoir vu les
chiffres :** si l'achèvement de l'unité 1 gagne ≥ 10 points **et** que le J7 ne
baisse pas, on porte la structure aux quatre autres langues — la structure
seulement, chaque langue écrivant ses propres hôtes. Sinon on garde la bêta
comme cours à part et on ne l'étend pas.

---

## 8. Protocole de validation du contenu narratif

Le contenu actuel est du vocabulaire isolé, et le README dit déjà qu'il est
provisoire. **Une phrase engage infiniment plus qu'un mot** : elle porte un
registre, une situation, une manière de s'adresser à quelqu'un. D'où un
protocole plus strict, par épisode :

0. **Fiche d'intention** avant toute écriture : région, langue parlée sur
   place, personnages, formules employées, points sensibles identifiés.
1. **Rédaction en amazigh d'abord**, par ou avec un locuteur natif rémunéré.
   *C'est la seule règle qui compte vraiment* : traduire du français produit du
   français en habit kabyle, et c'est ainsi que le calque entre.
2. **Validation linguistique par deux natifs indépendants** de la variété
   (idéalement un de Grande, un de Petite Kabylie). Quatre questions fermées :
   *Est-ce que ça se dit ? Le diriez-vous ainsi ? Quel registre ? Que
   diriez-vous à la place ?* Désaccord = la forme sort, ou passe en note
   « variantes ».
3. **Validation régionale — non négociable :** tout épisode situé hors de
   l'aire de la langue est relu par une personne **originaire de cette
   région** (un Chaoui pour les Aurès, un Mozabite pour le M'zab, un Touareg
   pour le Hoggar). C'est la clause qui empêche le folklore.
4. **Relecture de sensibilité politique** par quelqu'un qui vit sur place,
   avec droit de veto sans justification.
5. **Relecture d'usage religieux** : les formules tombent-elles au bon moment.
6. **Audio natif uniquement** — jamais de synthèse pour une réplique de
   personnage.

**Jamais publié sans validation :** toute phrase complète (par opposition au
mot isolé — c'est la ligne rouge) ; tout dialogue attribué à un personnage
régional ; toute affirmation sur un peuple, un rite ou une pratique ; toute
date, carte ou frontière ; toute forme absente des corpus cités ; tout audio.

**Garde technique, pas seulement discipline :** ajouter un champ
`status: 'draft' | 'validated'` dans les données narratives et un filtre en
production, pour qu'aucun contenu non validé ne *puisse* s'afficher. Étendre
`content-review.csv` — déjà un bon outil — avec les colonnes phrase / registre
/ région / validateur 1 / validateur 2 / verdict.

**Enfin : rémunérer les validateurs, et les créditer nommément s'ils le
souhaitent.** Une app qui parle de transmission ne peut pas se construire sur
du travail natif gratuit.

---

## 9. Ce que les comités recommandent de faire en premier

**Cette semaine, sans validation linguistique** (rien de tout cela n'invente
un mot) :

1. Finir l'onboarding dans la leçon 1, et le raccourcir.
2. Ouvrir les scènes illustrées aux quatre langues sans image.
3. Retirer les cœurs.
4. Remonter en unité 1 les phrases déjà écrites et déjà enfouies.
5. Attribuer les énoncés aux personnages, et leur faire dire les éloges.

C'est le « basique mais efficace » demandé, sur les cinq langues, sans risque
de contenu. La première session change de nature pour un coût très faible.

**Le point 5 est aussi la première brique de la troupe** : dès qu'un énoncé est
attribué à Setti ou à Aqcic *de façon stable*, la récurrence commence — et
c'est elle qui manque aujourd'hui (§1). On peut donc poser le compagnonnage
avant d'écrire une seule ligne de récit, sur les cinq langues, sans validation
de locuteur : il suffit d'assigner à chaque compagnon la forme grammaticale
qu'il portera pour toujours (tableau du §4) et de s'y tenir.

**Ensuite, et dans cet ordre :**

6. Corriger l'itinéraire des langues marocaines et ajouter le Souss (§5).
7. Écrire l'unité 1 narrative en kabyle **avec un locuteur** — la troupe au
   départ du Djurdjura, Ferroudja en rencontre —, la faire valider, la publier
   en bêta.
8. La mémoire par item et la révision générée — le plus gros chantier
   technique, et celui qui fait tenir l'app sur la durée.

**Une remarque des comités, qu'il vaut la peine de reprendre telle quelle :**
le problème n'est pas le sérieux du contenu. Les en-têtes de `rif.js` et
`zgh.js` sont d'un niveau philologique qu'on ne voit jamais dans une app grand
public — la découverte de l'abréviation « néo. » du dictionnaire IRCAM pour
trancher sur *azul* est du vrai travail. Le problème est que **ce sérieux est
servi sous forme de fiches de vocabulaire**. Selim a raison, et le remède est
moins coûteux qu'il n'y paraît : deux des cinq premiers changements ne
demandent aucune ligne de code, et trois ne demandent aucun mot nouveau.
