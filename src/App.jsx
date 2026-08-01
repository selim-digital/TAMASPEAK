import { useState, useEffect, useRef } from 'react'
import { PhoneFrame } from './components/PhoneFrame.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { OnboardingScreen } from './screens/OnboardingScreen.jsx'
import { PathScreen } from './screens/PathScreen.jsx'
import { LessonScreen } from './screens/LessonScreen.jsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.jsx'
import { ChestRewardScreen } from './screens/ChestRewardScreen.jsx'
import { UnitCompleteScreen } from './screens/UnitCompleteScreen.jsx'
import { ChallengeCompleteScreen } from './screens/ChallengeCompleteScreen.jsx'
import { TrophiesScreen } from './screens/TrophiesScreen.jsx'
import { LanguagesScreen } from './screens/LanguagesScreen.jsx'
import { ProfileScreen } from './screens/ProfileScreen.jsx'
import { DuelIntroScreen, DuelResultScreen } from './screens/DuelScreen.jsx'
import { ContributeVoiceScreen, MicIcon } from './screens/ContributeVoiceScreen.jsx'
import { DuoScreen } from './screens/DuoScreen.jsx'
import { MissionScreen } from './screens/MissionScreen.jsx'
import { TifinaghScreen } from './screens/TifinaghScreen.jsx'
import { NotificationsScreen } from './screens/NotificationsScreen.jsx'
import { JeuxScreen } from './screens/JeuxScreen.jsx'
import { MemoryScreen } from './screens/MemoryScreen.jsx'
import { MotsCroisesScreen } from './screens/MotsCroisesScreen.jsx'
import { QuizScreen } from './screens/QuizScreen.jsx'
import { AujourdhuiScreen } from './screens/AujourdhuiScreen.jsx'
import { TabBar } from './components/TabBar.jsx'
import { FaitCard } from './components/FaitCard.jsx'
import { faitPour } from './data/faits.js'
import { nonLues } from './lib/notifications.js'
import { HistoryScreen } from './screens/HistoryScreen.jsx'
import { loadVoiceIndex } from './lib/speakerVoice.js'
import { track, flushEvents, syncStore, pushStore, sessionState, sessionHint, setEmailPrefs } from './lib/api.js'
import { notifsServeur, rejoindreCercle, lireDefi, creerDefi, scorerDefi, mesDemandes } from './lib/distance.js'
import { CercleScreen } from './screens/CercleScreen.jsx'
import { EnregistrerScreen } from './screens/EnregistrerScreen.jsx'
import { AccountScreen } from './screens/AccountScreen.jsx'
import { AbonnementScreen } from './screens/AbonnementScreen.jsx'
import { FeedbackScreen } from './screens/FeedbackScreen.jsx'
import { etatAbonnement, uniteOuverte, rejoindreFamille, oublierAbonnement } from './lib/abonnement.js'
import { makeSeed, seededPick, readDuelFromUrl, clearDuelFromUrl, contentDigest } from './lib/challenge.js'
import { FamilyCarousel } from './components/mascots/FamilyCarousel.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { JewelDefs } from './components/jewels/JewelDefs.jsx'
import { DebugBar } from './components/DebugBar.jsx'
import { GemIcon } from './components/jewels/StatIcons.jsx'
import { getCourse, isUnitComplete } from './data/courses.js'
import { ECRANS } from './data/screens.js'
import { XP_PER_LESSON, CHEST_GEMS, UNIT_BONUS, CHALLENGE, JEUX } from './data/economy.js'
import {
  loadStore,
  saveStore,
  resetStore,
  progressOf,
  withProgress,
  hasProfile,
  applyStatuses,
  completeLesson,
  openChest,
  recordChallenge,
  challengeAvailable,
  xpToday,
  lessonsDone,
  lexiqueSize,
  resetLanguage,
  recordMemoryWin,
  recordMotsNiveau,
  recordQuiz,
  depenserGemmes,
} from './lib/progress.js'

/**
 * Paramètres de retour lus UNE FOIS, au chargement du module — pas dans un
 * initialiseur d'état : en développement, le mode strict de React monte
 * chaque composant deux fois, et un initialiseur qui consomme l'URL au
 * premier montage ne voit plus rien au second (vécu : le bandeau « compte
 * supprimé » n'apparaissait jamais).
 */
const PARAMS_RETOUR = new URLSearchParams(window.location.search)
const AUTH_ERREUR = PARAMS_RETOUR.get('error')
const COMPTE_SUPPRIME = PARAMS_RETOUR.has('compte-supprime')
// Un lien d'invitation au cercle (…/?cercle=CODE) : mémorisé ici, honoré
// une fois la session confirmée (il faut être connecté pour rejoindre).
const CERCLE_CODE = PARAMS_RETOUR.get('cercle')
// Une place de pack famille (…/?famille=CODE) — même mécanique.
const FAMILLE_CODE = PARAMS_RETOUR.get('famille')
// Le retour de la caisse Stripe : 'ok' | 'annule' | 'retour' (portail).
const ABONNEMENT_RETOUR = PARAMS_RETOUR.get('abonnement')
if (CERCLE_CODE || FAMILLE_CODE || ABONNEMENT_RETOUR) {
  window.history.replaceState(null, '', window.location.pathname)
}
if (ABONNEMENT_RETOUR) {
  // Le verdict en cache date d'AVANT le paiement : le garder ferait afficher
  // « pas abonné » à quelqu'un qui vient de payer, le temps que le webhook
  // arrive. On force une relecture au serveur.
  oublierAbonnement()
}
if (AUTH_ERREUR || COMPTE_SUPPRIME) {
  window.history.replaceState(null, '', window.location.pathname)
  if (COMPTE_SUPPRIME) {
    // Supprimer son compte, c'est demander une VRAIE table rase : garder la
    // progression locale (l'ancien choix) faisait revenir l'utilisateur
    // « déjà connu » — sans onboarding, avec « Reprendre » au lieu de
    // « Commencer ». Vécu et corrigé : tout part.
    try {
      localStorage.removeItem('tama-speak:session-hint')
      localStorage.removeItem('tama-speak:v3')
      localStorage.removeItem('tama-speak:events-queue')
      localStorage.removeItem('tama-speak:feedback-queue')
      localStorage.removeItem('tama-speak:abonnement')
    } catch {
      /* stockage indisponible */
    }
  }
}

function pickRandom(arr, n) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

export default function App() {
  const [screen, setScreen] = useState(ECRANS.ACCUEIL)
  const [store, setStore] = useState(loadStore)
  const [pendingLang, setPendingLang] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeChest, setActiveChest] = useState(null)
  const [completedUnit, setCompletedUnit] = useState(null)
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 })
  const [challengeExercises, setChallengeExercises] = useState([])
  const [duel, setDuel] = useState(null)
  const [, setVoicesReady] = useState(false)
  // undefined = on ne sait pas encore ; null = pas de session ; objet = connecté.
  const [user, setUser] = useState(undefined)
  /**
   * L'état de session, en clair — règles anti-boucle du comité :
   *   'inconnu'   : vérification en cours — ON NE ROUTE JAMAIS VERS LA
   *                 CONNEXION DEPUIS CET ÉTAT (c'était le bug : connecté,
   *                 mais renvoyé vers la connexion à chaque ouverture) ;
   *   'optimiste' : un indice local dit « connecté hier » — on laisse
   *                 entrer, la vérification confirme en arrière-plan et ne
   *                 dégrade que sur refus EXPLICITE du serveur ;
   *   'connecte' | 'anonyme' : confirmés par le serveur ;
   *   'horsligne' : le serveur n'a pas répondu — mode local, on n'exige
   *                 pas l'impossible.
   */
  const [sessionEtat, setSessionEtat] = useState(() => (sessionHint() ? 'optimiste' : 'inconnu'))
  // Tap sur « Commencer » pendant la vérification : on mémorise l'intention
  // et on route dès que la réponse arrive (bouton « · · · » en attendant).
  const [departEnAttente, setDepartEnAttente] = useState(false)
  // Un retour de Google en échec revient sur /?error=… : on le dit en clair
  // sur l'accueil au lieu de laisser un « rien » inexplicable, puis on
  // nettoie l'URL.
  const authErreur = AUTH_ERREUR
  // Retour du clic de confirmation de suppression : le compte n'existe
  // plus, l'accueil le dit clairement — et l'indice de session est tombé
  // (voir la lecture au chargement du module, au-dessus du composant).
  const compteSupprime = COMPTE_SUPPRIME
  // Notifications venues du serveur (cercle : défis, demandes de voix).
  const [notifsServ, setNotifsServ] = useState([])
  // La demande d'enregistrement en cours de réponse (écran micro).
  const [demandeActive, setDemandeActive] = useState(null)
  // Résultat du lien d'invitation au cercle, affiché sur l'accueil.
  const [cercleInfo, setCercleInfo] = useState(null)
  // L'écran compte a deux visages : porte d'entrée obligatoire (verrou de
  // l'accueil) ou gestion volontaire (depuis le profil).
  const [compteObligatoire, setCompteObligatoire] = useState(false)
  // Le wording de l'écran compte suit l'intention ('creer' | 'connexion') :
  // le flux est le même derrière, mais l'utilisateur doit reconnaître son cas.
  const [compteIntention, setCompteIntention] = useState('creer')
  /**
   * L'abonnement. `undefined` = pas encore su, `null` = serveur muet.
   * DANS LES DEUX CAS ON N'IMPOSE RIEN : le verrou (uniteOuverte) n'existe
   * que sur un « non » explicite du serveur — même règle que la session.
   */
  const [abonnement, setAbonnement] = useState(undefined)
  // Résultat du lien d'invitation au pack famille, affiché sur l'accueil.
  const [familleInfo, setFamilleInfo] = useState(null)

  useEffect(() => {
    saveStore(store)
  }, [store])

  // `hasVoice()` est synchrone (elle est appelée en plein rendu d'exercice) et
  // s'appuie sur un index chargé une fois depuis IndexedDB. Sans le re-rendu
  // qui suit, les mots enregistrés ne deviendraient audibles qu'au 2ᵉ passage.
  useEffect(() => {
    loadVoiceIndex().then(() => setVoicesReady(true))
  }, [])

  // Trace d'usage (pseudonyme, mise en file hors-ligne — voir lib/api.js).
  // Sans compte ou sans serveur, tout ceci est inerte : le local d'abord.
  useEffect(() => {
    track('app_opened')
    flushEvents()
  }, [])

  // Vérification de session à l'ouverture — c'est aussi ici qu'aboutit le
  // retour de Google (rechargement complet). Connecté : sync max/union, la
  // progression locale est INTACTE et se retrouve enrichie, jamais écrasée.
  // La dégradation vers « anonyme » n'arrive que sur réponse EXPLICITE du
  // serveur ; une panne réseau laisse l'optimisme (ou passe hors-ligne).
  useEffect(() => {
    let timeout = null
    sessionState().then(({ state, user: u }) => {
      clearTimeout(timeout)
      if (state === 'authenticated') {
        setUser(u)
        setSessionEtat('connecte')
        syncStore(loadStore()).then(({ store: fusion, synced }) => {
          if (synced) setStore(fusion)
        })
      } else if (state === 'anonymous') {
        setUser(null)
        setSessionEtat('anonyme')
      } else {
        // Injoignable : l'indice local décide — optimiste si connecté hier,
        // hors-ligne sinon. Jamais « anonyme » sans réponse du serveur.
        setUser(sessionHint() ? undefined : null)
        setSessionEtat(sessionHint() ? 'optimiste' : 'horsligne')
      }
    })
    // Réseau muet : au bout de 5 s on cesse d'attendre — mode local.
    timeout = setTimeout(() => {
      setSessionEtat((s) => (s === 'inconnu' ? 'horsligne' : s))
    }, 5000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Les notifications du cercle : au moment où la session se confirme, puis
  // toutes les deux minutes — un rythme de facteur, pas de télégraphe. Le
  // serverless n'offre pas de temps réel ; il n'en faut pas : tout ici est
  // asynchrone par nature (un défi se joue quand on peut).
  useEffect(() => {
    if (sessionEtat !== 'connecte') return
    let vivant = true
    const relever = () => notifsServeur().then((n) => vivant && setNotifsServ(n))
    relever()
    const intervalle = setInterval(relever, 120000)
    return () => {
      vivant = false
      clearInterval(intervalle)
    }
  }, [sessionEtat])

  /**
   * L'abonnement se relit à chaque changement d'état de session — se
   * connecter, c'est justement le moment où l'on peut enfin savoir. On le
   * relit AUSSI au retour de la caisse : le webhook Stripe et la redirection
   * du navigateur courent en parallèle, et le navigateur gagne souvent.
   * D'où le second passage, deux secondes plus tard.
   */
  const [abonnementTic, setAbonnementTic] = useState(0)
  const relireAbonnement = () => setAbonnementTic((n) => n + 1)
  useEffect(() => {
    if (sessionEtat === 'inconnu') return
    let vivant = true
    etatAbonnement().then((e) => vivant && setAbonnement(e))
    // Le webhook a quelques centaines de millisecondes de retard sur le
    // retour de Stripe : on redemande une fois, sans insister davantage.
    const rattrapage =
      ABONNEMENT_RETOUR === 'ok' && abonnementTic === 0
        ? setTimeout(() => etatAbonnement().then((e) => vivant && setAbonnement(e)), 2500)
        : null
    return () => {
      vivant = false
      if (rattrapage) clearTimeout(rattrapage)
    }
  }, [sessionEtat, abonnementTic])

  /**
   * Le retour de la caisse arrive sur l'accueil (Stripe redirige vers la
   * racine). Le laisser là serait cruel : quelqu'un qui vient de payer doit
   * voir une confirmation, pas l'écran d'accueil habituel. On l'emmène donc
   * une fois sur l'écran d'abonnement — une seule fois, d'où le garde-fou.
   */
  const retourTraite = useRef(false)
  useEffect(() => {
    if (!ABONNEMENT_RETOUR || retourTraite.current || sessionEtat === 'inconnu') return
    retourTraite.current = true
    setScreen(ECRANS.ABONNEMENT)
  }, [sessionEtat])

  // Le lien d'invitation au pack famille : même règle que le cercle, il
  // s'honore une fois la session confirmée (il faut un compte pour occuper
  // une place — chacun garde sa progression).
  useEffect(() => {
    if (sessionEtat !== 'connecte' || !FAMILLE_CODE) return
    rejoindreFamille(FAMILLE_CODE).then(({ statut, avec }) => {
      setFamilleInfo(
        statut === 'ok'
          ? `Ta place est prise${avec ? ` dans le pack de ${avec}` : ''} — tous les cours sont ouverts pour toi.`
          : statut === 'deja'
            ? 'Cette invitation a déjà servi — tu es peut-être déjà dans le pack.'
            : statut === 'complet'
              ? 'Ce pack famille est complet (4 personnes).'
              : statut === 'inactif'
                ? 'Ce pack famille n’est pas actif pour le moment.'
                : statut === 'introuvable'
                  ? 'Cette invitation ne mène nulle part — demande à ton proche d’en renvoyer une.'
                  : null,
      )
      if (statut === 'ok') {
        oublierAbonnement()
        relireAbonnement()
      }
    })
  }, [sessionEtat])

  // Le lien d'invitation s'honore dès que la session est confirmée.
  useEffect(() => {
    if (sessionEtat !== 'connecte' || !CERCLE_CODE) return
    rejoindreCercle(CERCLE_CODE).then(({ statut, avec }) => {
      setCercleInfo(
        statut === 'ok'
          ? `Te voilà dans le cercle${avec ? ` de ${avec}` : ''} ! Vous pouvez vous défier et vous demander des mots.`
          : statut === 'deja'
            ? 'Ce lien a déjà servi — vous êtes peut-être déjà reliés. Regarde dans Mon cercle.'
            : statut === 'introuvable'
              ? 'Ce lien d’invitation ne mène nulle part — demande à ton proche d’en renvoyer un.'
              : null,
      )
    })
  }, [sessionEtat])

  /**
   * La respiration : toutes les ~75 secondes, sur un écran CALME (jamais
   * en plein exercice), une carte « Le savais-tu ? » se pose. L'index vit
   * dans le store (ordre fixe) : le quiz sait exactement ce qui a été vu.
   */
  const [faitAffiche, setFaitAffiche] = useState(null)
  // Refs lues depuis l'intervalle : le réarmer à chaque navigation
  // remettrait le compte à rebours à zéro sans cesse.
  const screenRef = useRef(screen)
  screenRef.current = screen
  const faitIndexRef = useRef(store.faitIndex || 0)
  faitIndexRef.current = store.faitIndex || 0
  const faitVisibleRef = useRef(false)
  faitVisibleRef.current = !!faitAffiche
  useEffect(() => {
    const CALMES = new Set([
      ECRANS.AUJOURDHUI, ECRANS.CHEMIN, ECRANS.PROFIL, ECRANS.CERCLE, ECRANS.LANGUES,
      ECRANS.TROPHEES, ECRANS.JEUX, ECRANS.MISSIONS, ECRANS.HISTOIRE, ECRANS.FAMILLE,
      ECRANS.LECON_FINIE,
    ])
    const intervalle = setInterval(() => {
      if (!CALMES.has(screenRef.current) || faitVisibleRef.current) return
      setFaitAffiche(faitPour(faitIndexRef.current))
      setStore((s) => ({ ...s, faitIndex: (s.faitIndex || 0) + 1 }))
    }, 75000)
    return () => clearInterval(intervalle)
  }, [])

  // Un lien de défi ouvre directement l'écran d'annonce — au chargement, mais
  // aussi si l'app est DÉJÀ ouverte (cas de la PWA : le clic sur le lien ne
  // change alors que le fragment, sans recharger la page).
  useEffect(() => {
    const handle = () => {
      const incoming = readDuelFromUrl()
      if (!incoming) return
      setDuel(incoming)
      setScreen(ECRANS.DUEL_INTRO)
      clearDuelFromUrl()
    }
    handle()
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])

  // Langue active → son cours et sa progression.
  const course = getCourse(store.lang)
  const progress = progressOf(store, course)
  // Un défi peut porter sur une langue que l'élève n'a pas commencée : on
  // utilise son cours sans toucher à sa langue active.
  const duelCourse = duel ? getCourse(duel.lang) : null

  /** Met à jour la progression de la langue active. */
  const setProgress = (updater) =>
    setStore((s) => {
      const current = progressOf(s, getCourse(s.lang))
      const next = typeof updater === 'function' ? updater(current) : updater
      return withProgress(s, s.lang, next)
    })

  const unitsWithStatuses = course.units.map((u) => applyStatuses(u, progress.statuses))
  const canChallenge = challengeAvailable(progress)

  /**
   * La leçon en cours — LE geste du jour (bouton « Continuer » de l'écran
   * Aujourd'hui et du chemin). Un coffre disponible passe avant : il se
   * réclame en un geste et débloque la suite.
   */
  const leconCourante = (() => {
    const node = course.orderedNodes.find((n) => {
      const st = progress.statuses[n.id]
      return n.type === 'chest' ? st === 'available' : st === 'current'
    })
    return node ? { node, unit: course.unitOfLesson(node.id) } : null
  })()

  /**
   * Refonte C : la barre d'onglets est masquée pendant les flux immersifs
   * (leçon, duel, micro, récompenses…) — on ne sort pas d'une leçon par
   * accident — et avant l'entrée dans l'app (accueil, onboarding, compte).
   */
  const SANS_BARRE = new Set([
    ECRANS.ACCUEIL, ECRANS.ONBOARDING, ECRANS.COMPTE, ECRANS.LECON,
    ECRANS.LECON_FINIE, ECRANS.COFFRE, ECRANS.UNITE_FINIE, ECRANS.DEFI,
    ECRANS.DEFI_FINI, ECRANS.DUEL_INTRO, ECRANS.DUEL, ECRANS.DUEL_RESULTAT,
    ECRANS.DUO, ECRANS.ENREGISTRER,
  ])

  /** Entrer dans l'app depuis l'accueil, selon l'état de session. */
  function demarrer() {
    // Règles du comité : connecté, optimiste ou hors-ligne → on entre.
    // Anonyme CONFIRMÉ → connexion. Inconnu → on attend la réponse
    // (bouton « · · · »), on ne route JAMAIS vers la connexion à l'aveugle.
    if (sessionEtat === 'anonyme') {
      setCompteIntention('creer')
      setCompteObligatoire(true)
      setScreen(ECRANS.COMPTE)
    } else if (sessionEtat === 'inconnu') {
      setDepartEnAttente(true)
    } else {
      setScreen(hasProfile(store) ? ECRANS.AUJOURDHUI : ECRANS.ONBOARDING)
    }
  }

  // L'intention de départ mémorisée se réalise dès que la session est connue.
  useEffect(() => {
    if (!departEnAttente || sessionEtat === 'inconnu') return
    setDepartEnAttente(false)
    demarrer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departEnAttente, sessionEtat])

  /** Bascule vers une langue : déjà commencée → chemin, sinon onboarding court. */
  function pickLanguage(langId) {
    if (store.byLang?.[langId]) {
      setStore((s) => ({ ...s, lang: langId }))
      setScreen(ECRANS.CHEMIN)
    } else {
      setPendingLang(langId)
      setScreen(ECRANS.ONBOARDING)
    }
  }

  function finishOnboarding({ lang, level, reason, dailyGoalXp, contact }) {
    const langId = lang || store.lang
    setStore((s) => {
      const next = {
        ...s,
        lang: langId,
        profile: s.profile || { reason, dailyGoalXp },
      }
      const langProgress = progressOf(next, getCourse(langId))
      return withProgress(next, langId, { ...langProgress, level })
    })
    // L'opt-in email choisi à l'étape « reste en contact » part au serveur —
    // c'est l'interrupteur que le cron des relances consulte. Envoi en
    // arrière-plan : un échec réseau ne bloque pas l'entrée dans l'app.
    if (contact && contact !== 'non') {
      setEmailPrefs({ relances: true, resumeHebdo: contact === 'tout' })
    }
    setPendingLang(null)
    setScreen(ECRANS.AUJOURDHUI)
  }

  /**
   * Le quiz de fin de leçon (demande de Selim : 3 questions) — de la
   * RÉVISION, tirée des leçons déjà terminées : la répétition espacée est
   * ce qui ancre. Première leçon d'une langue : rien à réviser, pas de quiz.
   */
  function avecQuizFin(c, p, lessonId) {
    const base = c.getExercises(lessonId)
    const pool = c.orderedNodes
      .filter((n) => n.type !== 'chest' && n.id !== lessonId && p.statuses[n.id] === 'done')
      .flatMap((n) => c.getExercises(n.id))
      .filter((ex) => ['qcm', 'listen', 'image', 'culture', 'sentence'].includes(ex.type))
    if (!pool.length) return base
    return [...base, ...pickRandom(pool, 3).map((ex) => ({ ...ex, quizFin: true }))]
  }

  // Figés au lancement : recalculer à chaque rendu retirerait le hasard du
  // quiz de fin sous les pieds de l'élève.
  const [lessonExercises, setLessonExercises] = useState([])

  /**
   * Le verrou d'abonnement, en un seul endroit — l'unité de rang `i` du cours
   * en cours est-elle ouverte ? Rend `true` tant que le serveur n'a pas dit
   * « non » (hors-ligne, panne, boutique fermée) : voir lib/abonnement.js.
   */
  const uniteOuverteIci = (i) => uniteOuverte(i, abonnement)

  function startLesson(node) {
    // Deuxième garde, après celle du chemin : une leçon ne s'ouvre jamais
    // sans passer par ici (défis, liens, reprises…).
    const unit = course.unitOfLesson(node.id)
    const rang = course.units.findIndex((u) => u.id === unit?.id)
    if (rang >= 0 && !uniteOuverteIci(rang)) {
      setScreen(ECRANS.ABONNEMENT)
      return
    }
    setActiveLesson(node)
    setLessonExercises(avecQuizFin(course, progress, node.id))
    setScreen(ECRANS.LECON)
  }

  /** « Continuer » depuis Aujourd'hui : leçon → jouer, coffre → ouvrir. */
  function continuerParcours(node) {
    if (node.type === 'chest') {
      setActiveChest(node)
      setScreen(ECRANS.COFFRE)
    } else {
      startLesson(node)
    }
  }

  function finishLesson(result) {
    const unit = course.unitOfLesson(activeLesson.id)
    const before = isUnitComplete(progress.statuses, unit)
    let np = completeLesson(course, progress, activeLesson.id, { xpGain: XP_PER_LESSON, perfect: result.perfect })
    const justDone = !before && isUnitComplete(np.statuses, unit)
    if (justDone) np = { ...np, gems: (np.gems || 0) + UNIT_BONUS }
    setProgress(np)
    setLastResult(result)
    setCompletedUnit(justDone ? unit : null)
    track('lesson_completed', { lang: course.id, xp: XP_PER_LESSON })
    setScreen(ECRANS.LECON_FINIE)
  }

  function afterLessonComplete() {
    setScreen(completedUnit ? 'unitcomplete' : 'path')
  }

  function startChallenge() {
    setChallengeExercises(pickRandom(course.challengePool(), CHALLENGE.size))
    setScreen(ECRANS.DEFI)
  }

  function finishChallenge(result) {
    setLastResult(result)
    const passed = result.correct >= Math.ceil(result.total * 0.6)
    if (passed) {
      setProgress((p) => recordChallenge(p, { xpGain: CHALLENGE.xpGain, gems: CHALLENGE.gems }))
      track('challenge_done', { lang: course.id, xp: CHALLENGE.xpGain })
    }
    setScreen(ECRANS.DEFI_FINI)
  }

  /** Lance un défi sur la langue en cours (le lien sera créé à la fin). */
  function startDuel() {
    setDuel({ lang: course.id, seed: makeSeed(), size: CHALLENGE.size, correct: null, total: null, from: '' })
    setScreen(ECRANS.DUEL_INTRO)
  }

  /** Duel de Mémory : même tapis de cartes sur les deux téléphones. */
  function startMemoryDuel() {
    setDuel({ jeu: 'memory', lang: course.id, seed: makeSeed(), size: 8, correct: null, total: null, from: '' })
    setScreen(ECRANS.DUEL_INTRO)
  }

  /** Duel de mots croisés : même grille, chrono — la plus rapide gagne. */
  function startMotsDuel() {
    setDuel({ jeu: 'mots', lang: course.id, seed: makeSeed(), size: 5, correct: null, total: null, from: '' })
    setScreen(ECRANS.DUEL_INTRO)
  }

  function finishDuel(result) {
    setLastResult(result)
    // L'effort compte pour le classement du cercle : chaque duel joué est
    // tracé, une victoire (en RELEVANT un défi — au lancement il n'y a
    // encore personne en face) l'est en plus.
    const memory = duel?.jeu === 'memory'
    const mots = duel?.jeu === 'mots'
    const mine = memory ? result.coups : mots ? result.secondes : result.correct
    const releve = duel?.correct != null
    const gagne = releve && (memory || mots ? mine < duel.correct : mine > duel.correct)
    track(gagne ? 'duel_won' : 'duel_played', { lang: duel?.lang })
    // Défi de cercle : le score part au serveur, qui prévient l'autre
    // téléphone. En arrière-plan — l'écran de résultat n'attend pas.
    const d = duel?.distant
    if (d?.role === 'createur') {
      creerDefi({
        pour: d.pour,
        lang: duel.lang,
        seed: duel.seed,
        size: duel.size,
        version: contentDigest(getCourse(duel.lang).challengePool()),
        correct: result.correct,
        total: result.total,
      })
    } else if (d?.role === 'adversaire') {
      scorerDefi({ code: d.code, correct: result.correct, total: result.total })
    }
    setScreen(ECRANS.DUEL_RESULTAT)
  }

  /** Défi de cercle : on joue d'abord, le défi part avec le score. */
  function defierMembre(membre) {
    setDuel({
      lang: course.id,
      seed: makeSeed(),
      size: CHALLENGE.size,
      correct: null,
      total: null,
      from: '',
      distant: { role: 'createur', pour: membre.userId, avec: membre.name },
    })
    setScreen(ECRANS.DUEL_INTRO)
  }

  /**
   * Toucher une notification : on mène DIRECTEMENT à l'action (demande de
   * Selim — aucune carte morte). Les locales portent leur écran de
   * destination (`ecran`) ; celles du cercle portent de quoi agir (`data`).
   */
  async function ouvrirNotifServeur(n) {
    if (n.ecran) {
      setScreen(n.ecran)
      return
    }
    if (n.kind === 'demande-audio' && n.data?.demandeId) {
      const d = await mesDemandes()
      const demande = d?.recues?.find((x) => x.id === n.data.demandeId)
      if (demande) {
        setDemandeActive(demande)
        setScreen(ECRANS.ENREGISTRER)
        return
      }
      setScreen(ECRANS.CERCLE) // déjà répondue (autre appareil ?) : le cercle le montre
      return
    }
    if (n.kind === 'defi' && n.data?.code) {
      const defi = await lireDefi(n.data.code)
      if (defi && defi.status === 'ouvert' && defi.role === 'adversaire') {
        setDuel({
          lang: defi.lang,
          seed: defi.seed,
          size: defi.size,
          version: defi.version || '',
          correct: defi.scoreCreateur,
          total: defi.totalCreateur,
          from: defi.de,
          distant: { role: 'adversaire', code: defi.code, avec: defi.de },
        })
        setScreen(ECRANS.DUEL_INTRO)
        return
      }
    }
    // audio-recu, cercle, defi-fini, défi déjà clos… : tout se voit là-bas.
    setScreen(ECRANS.CERCLE)
  }

  function handleReset() {
    setStore(resetStore())
    setPendingLang(null)
    setScreen(ECRANS.ACCUEIL)
  }

  const nextUnitExists = completedUnit
    ? course.units.findIndex((u) => u.id === completedUnit.id) < course.units.length - 1
    : false

  return (
    <div className="min-h-full bg-sand text-ink">
      <JewelDefs />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-0 py-0 sm:px-4 sm:py-8">
        <header className="mb-6 hidden w-full items-center justify-between sm:flex">
          <LogoLockup iconSize={38} />
          <span className="flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            {course.name} · {progress.xp} XP · <GemIcon size={15} /> {progress.gems}
          </span>
        </header>

        <PhoneFrame>
          {screen === ECRANS.ACCUEIL && (
            <WelcomeScreen
              etat={sessionEtat}
              dejaCommence={hasProfile(store)}
              name={user?.name || store.profile?.name}
              attente={departEnAttente}
              erreur={authErreur}
              info={
                compteSupprime
                  ? 'Ton compte et tes données ont été supprimés — tu repars de zéro. Ansuf, quand tu veux !'
                  : familleInfo || cercleInfo
              }
              onStart={demarrer}
              onLogin={() => {
                setCompteIntention('connexion')
                setCompteObligatoire(true)
                setScreen(ECRANS.COMPTE)
              }}
              onChangeAccount={() => {
                setCompteObligatoire(false)
                setScreen(ECRANS.COMPTE)
              }}
            />
          )}

          {screen === ECRANS.ONBOARDING && (
            <OnboardingScreen hasProfile={hasProfile(store)} presetLang={pendingLang} onFinish={finishOnboarding} />
          )}

          {screen === ECRANS.AUJOURDHUI && (
            <AujourdhuiScreen
              course={course}
              name={user?.name || store.profile?.name}
              avatar={store.profile?.avatar}
              notifCount={nonLues(store, course, progress).length + notifsServ.filter((n) => !n.lue).length}
              xpTodayValue={xpToday(progress)}
              dailyGoalXp={store.profile?.dailyGoalXp}
              streak={progress.streak}
              leconCourante={leconCourante}
              canChallenge={canChallenge}
              fait={faitPour(Math.max((store.faitIndex || 1) - 1, 0))}
              recitsLusCount={(progress.recitsLus || []).length}
              suggestions={notifsServ.filter((n) => !n.lue && ['demande-audio', 'defi'].includes(n.kind)).slice(0, 2)}
              abonnement={abonnement}
              onContinuer={continuerParcours}
              onChemin={() => setScreen(ECRANS.CHEMIN)}
              onChallenge={startChallenge}
              onQuiz={() => setScreen(ECRANS.QUIZ)}
              onHistoire={() => setScreen(ECRANS.HISTOIRE)}
              onTifinagh={() => setScreen(ECRANS.TIFINAGH)}
              onNotifs={() => setScreen(ECRANS.NOTIFS)}
              onProfile={() => setScreen(ECRANS.PROFIL)}
              onLanguages={() => setScreen(ECRANS.LANGUES)}
              onAbonnement={() => setScreen(ECRANS.ABONNEMENT)}
              onOuvrirNotif={ouvrirNotifServeur}
            />
          )}

          {screen === ECRANS.CHEMIN && (
            <PathScreen
              course={course}
              units={unitsWithStatuses}
              xp={progress.xp}
              gems={progress.gems}
              streak={progress.streak}
              cheerCount={lessonsDone(course, progress)}
              leconCourante={leconCourante}
              onSelectLesson={startLesson}
              onOpenChest={(node) => {
                setActiveChest(node)
                setScreen(ECRANS.COFFRE)
              }}
              onFamily={() => setScreen(ECRANS.FAMILLE)}
              onLanguages={() => setScreen(ECRANS.LANGUES)}
              onProfile={() => setScreen(ECRANS.PROFIL)}
              onNotifs={() => setScreen(ECRANS.NOTIFS)}
              onAbonnement={() => setScreen(ECRANS.ABONNEMENT)}
              uniteOuverte={uniteOuverteIci}
              notifCount={nonLues(store, course, progress).length + notifsServ.filter((n) => !n.lue).length}
              avatar={store.profile?.avatar}
            />
          )}

          {screen === ECRANS.PROFIL && (
            <ProfileScreen
              store={store}
              onSave={setStore}
              onDuel={startDuel}
              onAccount={() => {
                setCompteObligatoire(false)
                setScreen(ECRANS.COMPTE)
              }}
              onAbonnement={() => setScreen(ECRANS.ABONNEMENT)}
              abonnement={abonnement}
              onFeedback={() => setScreen(ECRANS.FEEDBACK)}
              onTrophees={() => setScreen(ECRANS.TROPHEES)}
              onFamille={() => setScreen(ECRANS.FAMILLE)}
              onResetLang={(langId) => {
                // Le zéro voulu : local + serveur, sans fusion (voir pushStore).
                setStore((s) => {
                  const apres = resetLanguage(s, langId)
                  pushStore(apres)
                  return apres
                })
              }}
              onBack={() => setScreen(ECRANS.AUJOURDHUI)}
            />
          )}

          {screen === ECRANS.FEEDBACK && (
            <FeedbackScreen lang={course.id} onBack={() => setScreen(ECRANS.PROFIL)} />
          )}

          {screen === ECRANS.ABONNEMENT && (
            <AbonnementScreen
              retour={ABONNEMENT_RETOUR}
              onBack={() => {
                // Revenir de l'écran d'abonnement relit l'état : on a pu
                // rejoindre un pack famille ou résilier entre-temps.
                relireAbonnement()
                setScreen(ECRANS.PROFIL)
              }}
            />
          )}

          {screen === ECRANS.COMPTE && (
            <AccountScreen
              store={store}
              obligatoire={compteObligatoire}
              intention={compteIntention}
              onStoreMerged={setStore}
              onSession={(u) => {
                setUser(u)
                setSessionEtat(u ? 'connecte' : 'anonyme')
              }}
              onBack={() => {
                if (!compteObligatoire) {
                  setScreen(ECRANS.PROFIL)
                } else if (user) {
                  // Connexion faite (l'écran avance tout seul) : on entre.
                  setScreen(hasProfile(store) ? ECRANS.AUJOURDHUI : ECRANS.ONBOARDING)
                } else {
                  // Retour sans connexion : l'accueil, toujours verrouillé.
                  setScreen(ECRANS.ACCUEIL)
                }
              }}
            />
          )}

          {screen === ECRANS.DUEL_INTRO && duelCourse && (
            <DuelIntroScreen
              duel={duel}
              course={duelCourse}
              avatar={store.profile?.avatar}
              onStart={() => setScreen(ECRANS.DUEL)}
              onCancel={() => {
                setDuel(null)
                setScreen(ECRANS.AUJOURDHUI)
              }}
            />
          )}

          {screen === ECRANS.DUEL && duelCourse && duel.jeu === 'memory' && (
            <MemoryScreen
              course={duelCourse}
              duel={duel}
              onFinishDuel={finishDuel}
              onBack={() => setScreen(ECRANS.JEUX)}
            />
          )}

          {screen === ECRANS.DUEL && duelCourse && duel.jeu === 'mots' && (
            <MotsCroisesScreen
              course={duelCourse}
              duel={duel}
              onFinishDuel={finishDuel}
              onBack={() => setScreen(ECRANS.JEUX)}
            />
          )}

          {screen === ECRANS.DUEL && duelCourse && duel.jeu !== 'memory' && duel.jeu !== 'mots' && (
            <LessonScreen
              exercises={seededPick(duelCourse.challengePool(), duel.size, duel.seed)}
              lang={duelCourse.id}
              onExit={() => setScreen(ECRANS.CHEMIN)}
              onFinish={finishDuel}
            />
          )}

          {screen === ECRANS.DUEL_RESULTAT && duelCourse && (
            <DuelResultScreen
              duel={duel}
              course={duelCourse}
              result={lastResult}
              name={store.profile?.name}
              avatar={store.profile?.avatar}
              onDone={() => {
                setDuel(null)
                setScreen(ECRANS.AUJOURDHUI)
              }}
            />
          )}

          {screen === ECRANS.LANGUES && (
            <LanguagesScreen store={store} onPick={pickLanguage} onBack={() => setScreen(ECRANS.AUJOURDHUI)} />
          )}

          {screen === ECRANS.FAMILLE && (
            <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-8 pb-5 text-center">
              <div className="mb-2 flex items-center gap-3 text-left">
                <button type="button" onClick={() => setScreen(ECRANS.PROFIL)} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
                  ←
                </button>
                <h2 className="text-lg font-extrabold">La famille</h2>
              </div>
              <FamilyCarousel />

              {/* Les personnages sont dessinés ; les voix, elles, viennent de
                  vraies personnes. C'est ici qu'on va les chercher. */}
              <button
                type="button"
                onClick={() => setScreen(ECRANS.CONTRIBUER)}
                className="mt-4 flex w-full items-center gap-3 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3.5 py-3 text-left"
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-turquoise text-white">
                  <MicIcon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-extrabold">Faire parler le cours</span>
                  <span className="block text-[10.5px] leading-snug text-ink-soft">
                    Un locuteur enregistre les mots, les leçons deviennent sonores.
                  </span>
                </span>
              </button>
            </div>
          )}

          {screen === ECRANS.CONTRIBUER && (
            <ContributeVoiceScreen course={course} onBack={() => setScreen(ECRANS.CERCLE)} />
          )}

          {screen === ECRANS.DUO && (
            <DuoScreen course={course} joueurParDefaut={store.profile} onBack={() => setScreen(ECRANS.JEUX)} />
          )}

          {screen === ECRANS.TIFINAGH && <TifinaghScreen onBack={() => setScreen(ECRANS.AUJOURDHUI)} />}

          {screen === ECRANS.JEUX && (
            <JeuxScreen
              course={course}
              progress={progress}
              onMemory={() => setScreen(ECRANS.MEMORY)}
              onMemoryDuel={startMemoryDuel}
              onMots={() => setScreen(ECRANS.MOTS)}
              onMotsDuel={startMotsDuel}
              onCercle={() => setScreen(ECRANS.CERCLE)}
              onQuiz={() => setScreen(ECRANS.QUIZ)}
              onDuo={() => setScreen(ECRANS.DUO)}
              faitIndex={store.faitIndex || 0}
              onBack={() => setScreen(ECRANS.AUJOURDHUI)}
            />
          )}

          {screen === ECRANS.QUIZ && (
            <QuizScreen
              faitIndex={store.faitIndex || 0}
              recitsLus={progress.recitsLus || []}
              onRecompense={(xp) => {
                setProgress((p) => recordQuiz(p, xp))
                track('quiz_done', { lang: course.id, xp })
              }}
              onBack={() => setScreen(ECRANS.JEUX)}
            />
          )}

          {screen === ECRANS.MEMORY && (
            <MemoryScreen
              course={course}
              onWin={() => {
                setProgress((p) => recordMemoryWin(p, { xpGain: JEUX.memory.xpGain }))
                track('memory_won', { lang: course.id, xp: JEUX.memory.xpGain })
              }}
              onBack={() => setScreen(ECRANS.JEUX)}
            />
          )}

          {screen === ECRANS.MOTS && (
            <MotsCroisesScreen
              course={course}
              progress={progress}
              gems={progress.gems}
              onNiveauFini={(niveauId, dejaFait) => {
                setProgress((p) => recordMotsNiveau(p, niveauId, JEUX.mots))
                track('mots_level_done', { lang: course.id, xp: dejaFait ? JEUX.mots.xpRejoue : JEUX.mots.xpGain })
              }}
              onIndice={() => setProgress((p) => depenserGemmes(p, JEUX.indice))}
              onBack={() => setScreen(ECRANS.JEUX)}
            />
          )}

          {screen === ECRANS.NOTIFS && (
            <NotificationsScreen
              store={store}
              course={course}
              progress={progress}
              serveur={notifsServ}
              onAction={ouvrirNotifServeur}
              onSave={setStore}
              onBack={() => {
                // Le badge serveur tombe localement aussi (le POST est parti).
                setNotifsServ((ns) => ns.map((n) => ({ ...n, lue: true })))
                setScreen(ECRANS.AUJOURDHUI)
              }}
            />
          )}

          {screen === ECRANS.CERCLE && (
            <CercleScreen
              course={course}
              onDefier={defierMembre}
              onJouerDefi={(code) => ouvrirNotifServeur({ kind: 'defi', data: { code } })}
              onMissions={() => setScreen(ECRANS.MISSIONS)}
              onContribuer={() => setScreen(ECRANS.CONTRIBUER)}
              onEnregistrer={(d) => {
                setDemandeActive(d)
                setScreen(ECRANS.ENREGISTRER)
              }}
              onBack={() => setScreen(ECRANS.AUJOURDHUI)}
            />
          )}

          {screen === ECRANS.ENREGISTRER && demandeActive && (
            <EnregistrerScreen
              demande={demandeActive}
              onDone={() => {
                setDemandeActive(null)
                setScreen(ECRANS.CERCLE)
              }}
              onBack={() => {
                setDemandeActive(null)
                setScreen(ECRANS.CERCLE)
              }}
            />
          )}

          {screen === ECRANS.HISTOIRE && (
            <HistoryScreen progress={progress} onSave={setProgress} onBack={() => setScreen(ECRANS.AUJOURDHUI)} />
          )}

          {screen === ECRANS.MISSIONS && (
            <MissionScreen
              course={course}
              progress={progress}
              profile={store.profile}
              onSave={setProgress}
              onBack={() => setScreen(ECRANS.CERCLE)}
            />
          )}

          {screen === ECRANS.LECON && (
            <LessonScreen
              exercises={lessonExercises.length ? lessonExercises : course.getExercises(activeLesson?.id)}
              lang={course.id}
              onExit={() => setScreen(ECRANS.CHEMIN)}
              onFinish={finishLesson}
            />
          )}

          {screen === ECRANS.LECON_FINIE && (
            <LessonCompleteScreen
              correct={lastResult.correct}
              total={lastResult.total}
              xp={XP_PER_LESSON}
              streak={progress.streak}
              cheerCount={lessonsDone(course, progress)}
              courseName={course.name}
              onContinue={afterLessonComplete}
            />
          )}

          {screen === ECRANS.COFFRE && (
            <ChestRewardScreen
              gems={CHEST_GEMS}
              chest={activeChest}
              course={course}
              onContinue={() => {
                setProgress((p) => openChest(course, p, activeChest.id, { gems: CHEST_GEMS }))
                track('chest_opened', { lang: course.id })
                setScreen(ECRANS.CHEMIN)
              }}
            />
          )}

          {screen === ECRANS.UNITE_FINIE && (
            <UnitCompleteScreen
              unit={completedUnit}
              gems={UNIT_BONUS}
              hasNext={nextUnitExists}
              courseName={course.name}
              onContinue={() => {
                setCompletedUnit(null)
                setScreen(ECRANS.CHEMIN)
              }}
            />
          )}

          {screen === ECRANS.DEFI && (
            <LessonScreen
              exercises={challengeExercises}
              lang={course.id}
              onExit={() => setScreen(ECRANS.CHEMIN)}
              onFinish={finishChallenge}
            />
          )}

          {screen === ECRANS.DEFI_FINI && (
            <ChallengeCompleteScreen
              correct={lastResult.correct}
              total={lastResult.total}
              xp={CHALLENGE.xpGain}
              gems={CHALLENGE.gems}
              onContinue={() => setScreen(ECRANS.CHEMIN)}
            />
          )}

          {screen === ECRANS.TROPHEES && (
            <TrophiesScreen course={course} progress={progress} onBack={() => setScreen(ECRANS.PROFIL)} />
          )}
          {/* Refonte C : la barre d'onglets — cinq familles sous le pouce,
              masquée pendant les flux immersifs (leçon, duel, micro…). */}
          {!SANS_BARRE.has(screen) && <TabBar ecran={screen} onGo={setScreen} />}

          {/* La respiration : posée par-dessus l'écran calme du moment. */}
          <FaitCard
            fait={faitAffiche}
            onClose={() => setFaitAffiche(null)}
            onQuiz={() => {
              setFaitAffiche(null)
              setScreen(ECRANS.QUIZ)
            }}
          />
        </PhoneFrame>

        <DebugBar screen={screen} onGo={setScreen} onReset={handleReset} />
      </div>
    </div>
  )
}
