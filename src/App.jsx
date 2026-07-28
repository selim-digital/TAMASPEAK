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
import { HistoryScreen } from './screens/HistoryScreen.jsx'
import { loadVoiceIndex } from './lib/speakerVoice.js'
import { track, flushEvents, me, syncStore, serverKnown } from './lib/api.js'
import { AccountScreen } from './screens/AccountScreen.jsx'
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
} from './lib/progress.js'

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
  // L'écran compte a deux visages : porte d'entrée obligatoire (verrou de
  // l'accueil) ou gestion volontaire (depuis le profil).
  const [compteObligatoire, setCompteObligatoire] = useState(false)

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

  // Connecté ? On synchronise à l'ouverture : lecture du serveur, fusion
  // max/union, réécriture. C'est aussi ici qu'aboutit le retour de Google
  // (rechargement complet de la page) — la session est posée, la
  // progression locale est INTACTE et se retrouve enrichie, jamais écrasée.
  useEffect(() => {
    me().then((u) => {
      setUser(u ?? null)
      if (!u) return
      syncStore(loadStore()).then(({ store: fusion, synced }) => {
        if (synced) setStore(fusion)
      })
    })
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
              onStart={() => {
                // Le compte est requis pour commencer (décision produit) —
                // SAUF si le serveur est absent ou pas encore sondé : on
                // n'exige pas l'impossible, et on ne bloque jamais l'entrée
                // sur un aléa réseau.
                if (user || serverKnown() === false) {
                  setScreen(hasProfile(store) ? ECRANS.CHEMIN : ECRANS.ONBOARDING)
                } else {
                  setCompteObligatoire(true)
                  setScreen(ECRANS.COMPTE)
                }
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
              onBack={() => setScreen(ECRANS.CHEMIN)}
            />
          )}

          {screen === ECRANS.COMPTE && (
            <AccountScreen
              store={store}
              obligatoire={compteObligatoire}
              onStoreMerged={setStore}
              onSession={setUser}
              onBack={() => {
                if (!compteObligatoire) {
                  setScreen(ECRANS.PROFIL)
                } else if (user) {
                  // « Continuer → » après connexion : on entre dans l'app.
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
