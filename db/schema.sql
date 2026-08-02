-- Tama Speak — schéma Neon (Postgres serverless).
--
-- Région : créer le projet Neon en **eu-central-1 (Francfort)** — décision
-- issue de la revue RGPD (public UE, minimiser les transferts hors UE).
--
-- Principe directeur, hérité du produit : LE LOCAL RESTE LA SOURCE DE VÉRITÉ.
-- L'app fonctionne entièrement sans compte et hors-ligne ; ces tables ne font
-- que synchroniser (progress_snapshots), mesurer (events), relier (feedbacks)
-- et notifier (notifications). Aucune table n'est nécessaire au fonctionnement
-- de l'app.
--
-- RGPD, décisions gravées dans le schéma :
--   • aucun champ origine / ethnie / « langue maternelle » / localisation ;
--   • l'opt-in email est FAUX par défaut (email_prefs.relances) ;
--   • la suppression d'un compte purge tout par cascade (ON DELETE CASCADE) ;
--   • events est pseudonymisé : user_id + type + langue + jour, rien d'autre.

-- ------------------------------------------------------------------
-- Authentification — tables Better Auth.
-- Le schéma qui fait foi est celui généré par `npx @better-auth/cli generate`
-- (il suit la version installée). Copie de référence du cœur :
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------
-- Progression — un instantané JSON par utilisateur.
-- C'est le store local (`tama-speak:v3`) tel quel : le serveur ne cherche
-- pas à comprendre la progression, il la garde. La fusion (max/union) se
-- fait CÔTÉ CLIENT, là où vit déjà toute la logique de progression.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS progress_snapshots (
  user_id TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  store JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------
-- Événements — la table qui manquait à tout le reste.
-- Sans historique daté, ni rétention J1/J7/J30, ni classement hebdomadaire
-- ne sont calculables (les compteurs locaux sont cumulatifs).
-- Pseudonymisée à dessein : pas de contenu, pas de détail de réponse.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  type TEXT NOT NULL,          -- 'lesson_completed' | 'chest_opened' | 'challenge_done'
                               -- | 'duo_played' | 'mission_done' | 'app_opened'
  lang TEXT,                   -- kab | rif | shi | tzm | zgh (null si hors cours)
  xp INT NOT NULL DEFAULT 0,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_user_at ON events (user_id, at);
CREATE INDEX IF NOT EXISTS events_at ON events (at);           -- courbes d'activité
CREATE INDEX IF NOT EXISTS events_type_at ON events (type, at); -- rétention par type

-- ------------------------------------------------------------------
-- Feedback — volontairement accueillant : l'emoji seul suffit
-- (le public n'est pas toujours à l'aise à l'écrit en français).
-- user_id est FACULTATIF : on accepte le feedback anonyme.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feedbacks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  mood TEXT NOT NULL,          -- 'love' | 'good' | 'meh' | 'bad'
  category TEXT,               -- 'idee' | 'bug' | 'contenu' | 'autre'
  message TEXT,                -- facultatif, 1000 caractères max (contrainte ci-dessous)
  lang TEXT,                   -- langue étudiée au moment de l'envoi
  status TEXT NOT NULL DEFAULT 'nouveau', -- 'nouveau' | 'vu' | 'traite'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT feedbacks_message_len CHECK (char_length(message) <= 1000)
);

CREATE INDEX IF NOT EXISTS feedbacks_status ON feedbacks (status, created_at DESC);

-- ------------------------------------------------------------------
-- Notifications in-app (serveur → app). Les rappels locaux (objectif du
-- jour, série) sont générés SUR l'appareil et ne passent pas par ici.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  kind TEXT NOT NULL,          -- 'nouveaute' | 'defi' | 'info' | 'demande-audio'
                               -- | 'audio-recu' | 'cercle' | 'defi-fini'
                               -- (+ 'email-…' : anti-doublon du cron, jamais affiché)
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,                  -- de quoi AGIR : {demandeId} ou {code} du défi
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user ON notifications (user_id, created_at DESC);

-- ------------------------------------------------------------------
-- Préférences email. `relances` est FAUX par défaut : l'opt-in se coche
-- dans l'app, jamais d'office (RGPD + délivrabilité : un opt-in réel fait
-- moins de plaintes spam, et Resend suspend à 0,08 %).
-- ------------------------------------------------------------------

-- ------------------------------------------------------------------
-- Quota d'emails — le garde-fou de l'audit. Le palier Resend gratuit est
-- de 100 envois/JOUR : sans compteur partagé, un bug de relance ou un
-- abus d'envoi de codes épuise le quota et TUE la connexion par code.
-- Règles appliquées dans api/_lib/email.js : 5/jour par adresse,
-- 80/jour au total (marge de 20 pour les codes de connexion).
-- ------------------------------------------------------------------

-- Journal des envois d'email — la « panne lisible en 30 s » de l'audit,
-- appliquée aux emails après l'affaire de l'email de suppression
-- introuvable : chaque tentative laisse une trace ANONYME (gabarit,
-- statut, raison — jamais d'adresse), lisible via /api/health.
CREATE TABLE IF NOT EXISTS journal_emails (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  template TEXT NOT NULL,
  statut TEXT NOT NULL,        -- 'envoye' | 'refus-quota' | 'erreur: …'
  at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_quota (
  day DATE NOT NULL,
  email TEXT NOT NULL,
  n INT NOT NULL DEFAULT 0,
  PRIMARY KEY (day, email)
);

CREATE TABLE IF NOT EXISTS email_prefs (
  user_id TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  relances BOOLEAN NOT NULL DEFAULT FALSE,
  resume_hebdo BOOLEAN NOT NULL DEFAULT FALSE,
  unsubscribed_at TIMESTAMPTZ, -- désabonnement one-click : tout s'arrête
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Le palmarès du cercle (classements semaine/mois/année envoyés par
-- email) : le consentement vient de l'ACTE de se relier à quelqu'un —
-- l'écran du cercle le dit en clair. Révocable dans l'app et par le
-- désabonnement one-click, comme tout le reste.
ALTER TABLE email_prefs ADD COLUMN IF NOT EXISTS palmares BOOLEAN NOT NULL DEFAULT TRUE;

-- ------------------------------------------------------------------
-- Le CERCLE — jouer à distance, en famille et entre amis.
--
-- Un lien de cercle relie DEUX personnes, point. Pas de « groupe » avec
-- rôles et administrateurs : l'app modélise « ma grand-mère et moi », pas
-- une organisation. L'invitation est un code à partager (WhatsApp) ; le
-- lien n'existe qu'une fois le code utilisé par quelqu'un de connecté.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cercle_liens (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  createur TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  invite TEXT REFERENCES "user"("id") ON DELETE CASCADE, -- NULL tant que le code n'est pas utilisé
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS cercle_createur ON cercle_liens (createur);
CREATE INDEX IF NOT EXISTS cercle_invite ON cercle_liens (invite);

-- ------------------------------------------------------------------
-- Demandes d'enregistrement — « dis-moi ce mot avec ta voix ».
--
-- A demande un mot à B (membre de son cercle) ; B reçoit une notification
-- dans l'app, enregistre sur SON téléphone, et l'audio revient à A — qui
-- peut l'installer dans ses leçons (IndexedDB local, plomberie E2).
--
-- L'audio est stocké en base64 TEXT, plafonné (~500 Ko binaire) : quelques
-- secondes de voix compressée pèsent 30 à 80 Ko, le plafond est large.
-- Même règle que les contributions locales : AUCUNE IA, AUCUNE notation —
-- on transporte la voix telle quelle, attribuée et effaçable.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS demandes_audio (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  de_user TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,   -- qui demande
  pour_user TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE, -- qui enregistre
  lang TEXT,
  texte TEXT NOT NULL,          -- le mot ou l'expression demandée
  sens TEXT,                    -- ce que ça veut dire (facultatif)
  status TEXT NOT NULL DEFAULT 'attente', -- 'attente' | 'fait' | 'decline'
  audio_b64 TEXT,               -- l'enregistrement, en base64
  audio_type TEXT,              -- mime (audio/webm, audio/mp4…)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answered_at TIMESTAMPTZ,
  CONSTRAINT demandes_texte_len CHECK (char_length(texte) <= 120),
  CONSTRAINT demandes_audio_len CHECK (char_length(audio_b64) <= 800000)
);

CREATE INDEX IF NOT EXISTS demandes_pour ON demandes_audio (pour_user, status);
CREATE INDEX IF NOT EXISTS demandes_de ON demandes_audio (de_user, created_at DESC);

-- ------------------------------------------------------------------
-- Défis à distance — même mécanique que le défi par lien (une GRAINE
-- commune, les deux joueurs tirent les mêmes questions), mais les scores
-- vivent au serveur : plus modifiables dans une URL, et chacun joue
-- depuis son téléphone, quand il peut.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS defis (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  createur TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  adversaire TEXT REFERENCES "user"("id") ON DELETE CASCADE,
  lang TEXT NOT NULL,
  seed TEXT NOT NULL,
  size INT NOT NULL DEFAULT 5,
  version TEXT,                 -- empreinte du contenu (voir lib/challenge.js)
  score_createur INT,
  total_createur INT,
  score_adversaire INT,
  total_adversaire INT,
  status TEXT NOT NULL DEFAULT 'ouvert', -- 'ouvert' | 'fini'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS defis_createur ON defis (createur, created_at DESC);
CREATE INDEX IF NOT EXISTS defis_adversaire ON defis (adversaire, created_at DESC);

-- Les notifications actionnables (défi reçu, demande d'audio) transportent
-- de quoi agir : l'id de la demande, le code du défi. Colonne ajoutée après
-- coup — l'ALTER est idempotent pour les bases déjà installées.
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS data JSONB;

-- ------------------------------------------------------------------
-- LE LEXIQUE — l'atelier du contenu : valider, corriger, enregistrer.
--
-- Ces deux tables servent le BACKOFFICE (public/admin.html), pas l'app.
-- L'app continue de lire son contenu dans `src/data/courses/*.js` : c'est
-- ce qui la rend hors-ligne, et cela ne change pas.
--
-- Règle qui gouverne la table : LE CONTENU SÈME, L'ATELIER TRAVAILLE.
--   • `cle`   = le terme TEL QU'IL EST DANS LE COURS. Il ne bouge jamais :
--               c'est lui qui relie la ligne au contenu de l'app, donc au
--               nom de fichier audio (slug) et aux exercices.
--   • `terme` = la forme RETENUE après relecture. C'est elle qu'on édite.
--     Quand `terme` diffère de `cle`, on lit la correction d'un coup d'œil,
--     et on sait qu'il reste à la reporter dans le fichier du cours.
--
-- L'ensemencement (api/_lib/lexique.js) est idempotent et n'écrase JAMAIS
-- une édition humaine : il insère ce qui manque, complète un `sens` vide,
-- et se tait sur le reste. Une entrée peut aussi être créée à la main
-- (`source = 'ajout'`) — le dictionnaire n'est pas prisonnier des leçons.
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lexique (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lang TEXT NOT NULL,          -- kab | rif | shi | tzm | zgh (jamais 'kab-beta')
  cle TEXT,                    -- terme d'origine dans le cours ; NULL si ajout manuel
  terme TEXT NOT NULL,         -- la forme retenue — ÉDITABLE
  sens TEXT,                   -- le français — ÉDITABLE
  notes TEXT,                  -- variante régionale, registre, doute du relecteur
  categorie TEXT NOT NULL DEFAULT 'mot',    -- 'mot' | 'expression' | 'lettre'
  source TEXT NOT NULL DEFAULT 'cours',
    -- 'dictionnaire' : semé depuis src/data/dictionnaire.js (la référence)
    -- 'cours'        : semé depuis course.vocabulary(), à défaut de dictionnaire
    -- 'ajout'        : créé à la main au backoffice — n'est dans aucun cours
  unite TEXT,                  -- d'où ça vient dans le parcours (contexte du relecteur)
  lecons TEXT,                 -- les leçons où le terme apparaît ('l1 l4 …')
  rang INT NOT NULL DEFAULT 0, -- ordre du parcours : la liste se lit comme le cours
  statut TEXT NOT NULL DEFAULT 'a-valider',
    -- 'a-valider' : personne n'a encore relu
    -- 'valide'    : un locuteur natif confirme la forme et le sens
    -- 'a-revoir'  : un doute est posé (voir `notes`) — ni validé ni jeté
    -- 'rejete'    : à retirer du cours ; reste en base pour ne pas
    --               ressusciter au prochain ensemencement
  valide_par TEXT,             -- l'email de l'admin qui a tranché
  valide_le TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lexique_terme_len CHECK (char_length(terme) BETWEEN 1 AND 120),
  CONSTRAINT lexique_sens_len CHECK (char_length(sens) <= 200),
  CONSTRAINT lexique_notes_len CHECK (char_length(notes) <= 1000)
);

-- Une seule ligne par terme de cours : c'est ce qui rend l'ensemencement
-- rejouable à chaque ouverture du backoffice sans jamais dupliquer.
CREATE UNIQUE INDEX IF NOT EXISTS lexique_cle_unique
  ON lexique (lang, cle) WHERE cle IS NOT NULL;
CREATE INDEX IF NOT EXISTS lexique_lang_statut ON lexique (lang, statut);
CREATE INDEX IF NOT EXISTS lexique_ordre ON lexique (lang, rang, terme);

-- Les QUATRE VOIX. Un mot n'est pas dit pareil par une grand-mère et par un
-- enfant, et un enfant qui apprend a besoin d'entendre une voix d'enfant :
-- on collecte donc les quatre, et une entrée n'est sonore pour de bon que
-- lorsqu'elle les a toutes.
--
-- L'audio dort en base64, plafonné (~500 Ko binaire) comme `demandes_audio` :
-- quelques secondes de voix compressée pèsent 30 à 80 Ko. Même règle morale
-- que partout ailleurs dans ce projet — AUCUNE IA, AUCUNE reconstitution de
-- voix : on garde le fichier tel quel, attribué à son auteur et effaçable.
CREATE TABLE IF NOT EXISTS lexique_audio (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lexique_id BIGINT NOT NULL REFERENCES lexique(id) ON DELETE CASCADE,
  voix TEXT NOT NULL,          -- 'femme' | 'homme' | 'fille' | 'garcon'
  audio_b64 TEXT NOT NULL,
  audio_type TEXT NOT NULL DEFAULT 'audio/webm',
  locuteur TEXT,               -- qui a prêté sa voix (attribution, pas pistage)
  depose_par TEXT,             -- l'email de l'admin qui a déposé le fichier
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lexique_audio_len CHECK (char_length(audio_b64) <= 800000),
  CONSTRAINT lexique_audio_voix CHECK (voix IN ('femme', 'homme', 'fille', 'garcon'))
);

-- Une prise par voix et par entrée : ré-enregistrer REMPLACE (UPSERT).
-- Garder l'historique des prises ratées ne servirait personne.
CREATE UNIQUE INDEX IF NOT EXISTS lexique_audio_unique
  ON lexique_audio (lexique_id, voix);

-- ------------------------------------------------------------------
-- ABONNEMENTS — la monétisation.
--
-- Règle qui gouverne ces trois tables : STRIPE FAIT FOI. On ne recopie ici
-- que ce qu'il faut pour répondre « cette personne a-t-elle accès ? » sans
-- appeler Stripe à chaque ouverture d'écran (latence, quotas, panne d'un
-- tiers). La vérité — montants, moyens de paiement, factures, litiges — vit
-- chez Stripe, et AUCUN numéro de carte ne transite ni ne dort ici : le
-- paiement se fait sur les pages hébergées par Stripe (Checkout, Portail).
--
-- Deux zones tarifaires (voir src/data/tarifs.js) : Europe/Amériques et
-- Afrique/Asie. La zone est décidée par le SERVEUR à la souscription et
-- gravée ici — elle ne se renégocie pas à chaque connexion (quelqu'un en
-- voyage garde son tarif).
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS abonnements (
  user_id TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  stripe_customer TEXT UNIQUE,     -- cus_… (créé au premier passage en caisse)
  stripe_subscription TEXT UNIQUE, -- sub_…
  plan TEXT,                       -- 'solo' | 'famille'
  zone TEXT,                       -- 'nord' | 'sud'
  statut TEXT NOT NULL DEFAULT 'aucun',
    -- 'aucun'    : jamais abonné
    -- 'attente'  : passage en caisse commencé, paiement pas encore confirmé
    -- 'essai'    : période d'essai en cours (trialing)
    -- 'actif'    : payé (active)
    -- 'retard'   : impayé, accès maintenu jusqu'à periode_fin (past_due/unpaid)
    -- 'annule'   : terminé (canceled)
  periode_fin TIMESTAMPTZ,         -- fin de la période PAYÉE : l'accès court jusque-là
  annule_a_la_fin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS abonnements_statut ON abonnements (statut);

-- Le PACK FAMILLE — quatre personnes : le titulaire + 3 proches.
--
-- Même modèle que le cercle : une invitation est un CODE à partager
-- (WhatsApp), et le lien n'existe qu'une fois le code utilisé par quelqu'un
-- de connecté. Chacun garde SA progression et SON compte ; seul l'accès est
-- partagé. Le titulaire peut retirer quelqu'un, et personne d'autre.
CREATE TABLE IF NOT EXISTS famille_membres (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proprietaire TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  membre TEXT REFERENCES "user"("id") ON DELETE CASCADE, -- NULL tant que le code dort
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS famille_proprietaire ON famille_membres (proprietaire);
CREATE INDEX IF NOT EXISTS famille_membre ON famille_membres (membre);
-- Une personne n'est membre que d'UN seul pack famille : sans cette
-- contrainte, un même compte pourrait figurer dans plusieurs packs et le
-- décompte des 4 places deviendrait faux.
CREATE UNIQUE INDEX IF NOT EXISTS famille_membre_unique
  ON famille_membres (membre) WHERE membre IS NOT NULL;

-- Journal des webhooks Stripe — l'anti-doublon.
-- Stripe REJOUE ses événements (c'est sa garantie de livraison : au moins
-- une fois, pas exactement une fois). Sans cette table, un rejeu de
-- `checkout.session.completed` pourrait re-déclencher des effets de bord.
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,             -- evt_…
  type TEXT NOT NULL,
  recu_le TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stripe_events_recu ON stripe_events (recu_le);
