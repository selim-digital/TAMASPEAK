import { useState, useEffect } from 'react'
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
import { nonLues } from './lib/notifications.js'
import { HistoryScreen } from './screens/HistoryScreen.jsx'
import { loadVoiceIndex } from './lib/speakerVoice.js'
import { track, flushEvents, syncStore, sessionState, sessionHint } from './lib/api.js'
import { AccountScreen } from './screens/AccountScreen.jsx'
import { FeedbackScreen } from './screens/FeedbackScreen.jsx'
import { makeSeed, seededPick, readDuelFromUrl, clearDuelFromUrl } from './lib/challenge.js'
import { FamilyCarousel } from './components/mascots/FamilyCarousel.jsx'
import { LogoLockup } from './components/Logo.jsx'
import { JewelDefs } from './components/jewels/JewelDefs.jsx'
import { DebugBar } from './components/DebugBar.jsx'
import { GemIcon } from './components/jewels/StatIcons.jsx'
import { getCourse, isUnitComplete } from './data/courses.js'
import { ECRANS } from './data/screens.js'
import { XP_PER_LESSON, CHEST_GEMS, UNIT_BONUS, CHALLENGE } from './data/economy.js'
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
if (AUTH_ERREUR || COMPTE_SUPPRIME) {
  window.history.replaceState(null, '', window.location.pathname)
  if (COMPTE_SUPPRIME) {
    try {
      localStorage.removeItem('tama-speak:session-hint')
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
  // L'écran compte a deux visages : porte d'entrée obligatoire (verrou de
  // l'accueil) ou gestion volontaire (depuis le profil).
  const [compteObligatoire, setCompteObligatoire] = useState(false)
  // Le wording de l'écran compte suit l'intention ('creer' | 'connexion') :
  // le flux est le même derrière, mais l'utilisateur doit reconnaître son cas.
  const [compteIntention, setCompteIntention] = useState('creer')

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
      setScreen(hasProfile(store) ? ECRANS.CHEMIN : ECRANS.ONBOARDING)
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

  function finishOnboarding({ lang, level, reason, dailyGoalXp }) {
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
    setPendingLang(null)
    setScreen(ECRANS.CHEMIN)
  }

  function startLesson(node) {
    setActiveLesson(node)
    setScreen(ECRANS.LECON)
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

  function finishDuel(result) {
    setLastResult(result)
    setScreen(ECRANS.DUEL_RESULTAT)
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
              name={user?.name || store.profile?.name}
              attente={departEnAttente}
              erreur={authErreur}
              info={compteSupprime ? 'Ton compte a été supprimé — tout ce que le serveur savait de toi est effacé. Ta progression locale reste sur cet appareil.' : null}
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

          {screen === ECRANS.CHEMIN && (
            <PathScreen
              course={course}
              units={unitsWithStatuses}
              xp={progress.xp}
              gems={progress.gems}
              streak={progress.streak}
              xpTodayValue={xpToday(progress)}
              dailyGoalXp={store.profile?.dailyGoalXp}
              cheerCount={lessonsDone(course, progress)}
              canChallenge={canChallenge}
              onSelectLesson={startLesson}
              onOpenChest={(node) => {
                setActiveChest(node)
                setScreen(ECRANS.COFFRE)
              }}
              onChallenge={startChallenge}
              onTrophies={() => setScreen(ECRANS.TROPHEES)}
              onFamily={() => setScreen(ECRANS.FAMILLE)}
              onLanguages={() => setScreen(ECRANS.LANGUES)}
              onProfile={() => setScreen(ECRANS.PROFIL)}
              onDuo={() => setScreen(ECRANS.DUO)}
              onMissions={() => setScreen(ECRANS.MISSIONS)}
              onTifinagh={() => setScreen(ECRANS.TIFINAGH)}
              onHistoire={() => setScreen(ECRANS.HISTOIRE)}
              onNotifs={() => setScreen(ECRANS.NOTIFS)}
              notifCount={nonLues(store, course, progress).length}
              lexiqueCount={lexiqueSize(progress)}
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
              onFeedback={() => setScreen(ECRANS.FEEDBACK)}
              onResetLang={(langId) => {
                // Le zéro voulu : local + serveur, sans fusion (voir pushStore).
                setStore((s) => {
                  const apres = resetLanguage(s, langId)
                  pushStore(apres)
                  return apres
                })
              }}
              onBack={() => setScreen(ECRANS.CHEMIN)}
            />
          )}

          {screen === ECRANS.FEEDBACK && (
            <FeedbackScreen lang={course.id} onBack={() => setScreen(ECRANS.PROFIL)} />
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
                  setScreen(hasProfile(store) ? ECRANS.CHEMIN : ECRANS.ONBOARDING)
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
                setScreen(ECRANS.CHEMIN)
              }}
            />
          )}

          {screen === ECRANS.DUEL && duelCourse && (
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
                setScreen(ECRANS.CHEMIN)
              }}
            />
          )}

          {screen === ECRANS.LANGUES && (
            <LanguagesScreen store={store} onPick={pickLanguage} onBack={() => setScreen(ECRANS.CHEMIN)} />
          )}

          {screen === ECRANS.FAMILLE && (
            <div className="animate-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-8 pb-5 text-center">
              <div className="mb-2 flex items-center gap-3 text-left">
                <button type="button" onClick={() => setScreen(ECRANS.CHEMIN)} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
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
            <ContributeVoiceScreen course={course} onBack={() => setScreen(ECRANS.FAMILLE)} />
          )}

          {screen === ECRANS.DUO && (
            <DuoScreen course={course} joueurParDefaut={store.profile} onBack={() => setScreen(ECRANS.CHEMIN)} />
          )}

          {screen === ECRANS.TIFINAGH && <TifinaghScreen onBack={() => setScreen(ECRANS.CHEMIN)} />}

          {screen === ECRANS.NOTIFS && (
            <NotificationsScreen
              store={store}
              course={course}
              progress={progress}
              onSave={setStore}
              onBack={() => setScreen(ECRANS.CHEMIN)}
            />
          )}

          {screen === ECRANS.HISTOIRE && (
            <HistoryScreen progress={progress} onSave={setProgress} onBack={() => setScreen(ECRANS.CHEMIN)} />
          )}

          {screen === ECRANS.MISSIONS && (
            <MissionScreen
              course={course}
              progress={progress}
              profile={store.profile}
              onSave={setProgress}
              onBack={() => setScreen(ECRANS.CHEMIN)}
            />
          )}

          {screen === ECRANS.LECON && (
            <LessonScreen
              exercises={course.getExercises(activeLesson?.id)}
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
            <TrophiesScreen course={course} progress={progress} onBack={() => setScreen(ECRANS.CHEMIN)} />
          )}
        </PhoneFrame>

        <DebugBar screen={screen} onGo={setScreen} onReset={handleReset} />
      </div>
    </div>
  )
}
