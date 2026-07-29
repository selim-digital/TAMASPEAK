import { useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti.jsx'
import { pairesMemoire, cartesMemoire, enTifinagh, estTifinagh } from '../lib/jeux.js'
import { Scene } from '../components/illustrations/Scenes.jsx'
import { playWord } from '../lib/audio.js'
import { sfx } from '../lib/sfx.js'
import { lire, ecrire } from '../lib/storage.js'
import { JEUX } from '../data/economy.js'

/**
 * Mémory — retrouve chaque mot amazigh (écrit en TIFINAGH, graphie latine
 * et sens français en appui) et son image, ou son sens quand le mot n'a
 * pas d'illustration.
 *
 * Deux niveaux de jeu :
 *   · Normal    — la carte « mot » porte aussi le sens français (quand sa
 *                 jumelle est une image : si la jumelle EST le sens, le
 *                 répéter ici donnerait la paire d'office) ;
 *   · Difficile — sans français : tifinagh et latin seuls, la mémoire du
 *                 SENS travaille avec celle des positions.
 *
 * En DUEL (téléphones distants), le tapis est tiré d'une graine commune
 * transportée par le lien : les deux joueurs retournent exactement les
 * mêmes cartes, et le moins de coups gagne.
 *
 * Règle de dessin assumée : PAS de visage, pas d'yeux — les illustrations
 * sont celles des leçons (Scenes.jsx, formes simples et silhouettes), et
 * le dos des cartes un losange tissé (le motif du chemin). Retourner une
 * carte « mot » la fait aussi entendre.
 */

/** Dos de carte : losange kabyle sur fond turquoise, purement géométrique. */
function DosCarte() {
  return (
    <svg viewBox="0 0 60 80" className="h-full w-full" aria-hidden="true">
      <rect width="60" height="80" rx="10" fill="var(--color-turquoise)" />
      <rect x="3" y="3" width="54" height="74" rx="8" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
      <path d="M30 22 L44 40 L30 58 L16 40 Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 32 L38 40 L30 48 L22 40 Z" fill="rgba(255,255,255,.7)" />
      <path d="M30 8 L34 13 L30 18 L26 13 Z M30 62 L34 67 L30 72 L26 67 Z" fill="rgba(255,255,255,.35)" />
    </svg>
  )
}

const TAILLES = [
  { paires: 6, label: '12 cartes' },
  { paires: 8, label: '16' },
  { paires: 10, label: '20' },
]

const CLE_DIFFICILE = 'tama-speak:memory-difficile'

export function MemoryScreen({ course, duel = null, onWin, onFinishDuel, onBack }) {
  const [taille, setTaille] = useState(duel ? duel.size : 6)
  const [dur, setDur] = useState(() => !duel && lire(CLE_DIFFICILE) === 'oui')
  // `manche` force un nouveau tirage — les cartes ne se re-mélangent
  // jamais en cours de partie, même si le composant se re-rend.
  const [manche, setManche] = useState(0)
  const cartes = useMemo(() => {
    const graine = duel?.seed || null
    const paires = pairesMemoire(course, duel ? duel.size : taille, graine)
    return cartesMemoire(paires, graine)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, taille, manche, duel?.seed])
  const nbPaires = cartes.length / 2

  const [ouvertes, setOuvertes] = useState([]) // ids des cartes face visible (0, 1 ou 2)
  const [trouvees, setTrouvees] = useState(() => new Set()) // n° de paires gagnées
  const [coups, setCoups] = useState(0)
  const [serie, setSerie] = useState(0) // paires d'affilée sans se tromper
  const verrou = useRef(false)
  const recompense = useRef(false)

  const gagne = trouvees.size === nbPaires && nbPaires > 0

  function raz() {
    setOuvertes([])
    setTrouvees(new Set())
    setCoups(0)
    setSerie(0)
    verrou.current = false
    recompense.current = false
  }

  function rejouer(nouvellesPaires = taille) {
    setTaille(nouvellesPaires)
    setManche((m) => m + 1)
    raz()
    sfx.click()
  }

  function changerNiveau(difficile) {
    setDur(difficile)
    ecrire(CLE_DIFFICILE, difficile ? 'oui' : 'non')
    sfx.click()
  }

  function retourner(carte) {
    if (verrou.current || gagne) return
    if (ouvertes.includes(carte.id) || trouvees.has(carte.paire)) return

    // La carte « mot » se fait entendre — jamais bloquant.
    if (carte.face === 'mot') playWord(carte.mot, course.id).catch(() => {})

    if (ouvertes.length === 0) {
      setOuvertes([carte.id])
      sfx.click()
      return
    }

    const premiere = cartes.find((c) => c.id === ouvertes[0])
    setOuvertes([premiere.id, carte.id])
    setCoups((n) => n + 1)

    if (premiere.paire === carte.paire) {
      // Paire ! Un court instant les deux faces restent lisibles ensemble.
      // Le verrou garantit qu'aucune autre paire ne se résout d'ici le
      // timeout : `trouvees` capturé ici est donc bien l'état courant, et
      // la récompense (qui touche App) reste HORS de l'updater d'état.
      const coupsFinaux = coups + 1
      verrou.current = true
      setTimeout(() => {
        const suivantes = new Set(trouvees)
        suivantes.add(carte.paire)
        setTrouvees(suivantes)
        setOuvertes([])
        verrou.current = false
        if (suivantes.size === nbPaires && !recompense.current) {
          recompense.current = true
          sfx.complete()
          onWin?.({ coups: coupsFinaux, paires: nbPaires })
        }
      }, 450)
      setSerie((s) => {
        const n = s + 1
        if (n >= 2) sfx.combo(n)
        else sfx.correct()
        return n
      })
    } else {
      // Raté : les deux cartes se referment après lecture — sans sanction.
      verrou.current = true
      setSerie(0)
      sfx.wrong()
      setTimeout(() => {
        setOuvertes([])
        verrou.current = false
      }, 950)
    }
  }

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col bg-cream">
      {gagne && <Confetti />}
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">{duel ? 'Mémory — duel' : 'Mémory'}</h2>
        <span className="ml-auto text-[11px] font-bold tabular-nums text-ink-soft">
          {trouvees.size}/{nbPaires} paires · {coups} {coups > 1 ? 'coups' : 'coup'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        {duel ? (
          <p className="mt-1 text-center text-[10.5px] font-bold text-ink-soft">
            Le même tapis que {duel.from || 'ton ami'} — le moins de coups gagne.
          </p>
        ) : (
          <>
            {/* Taille de la partie */}
            <div className="mt-1 flex gap-1.5">
              {TAILLES.map((t) => (
                <button
                  key={t.paires}
                  type="button"
                  onClick={() => rejouer(t.paires)}
                  className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11.5px] font-extrabold transition ${
                    taille === t.paires
                      ? 'border-turquoise bg-turquoise/10 text-turquoise-deep'
                      : 'border-line bg-cream text-ink-soft'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* Niveau : avec ou sans le français */}
            <div className="mt-1.5 flex gap-1.5">
              <button
                type="button"
                onClick={() => changerNiveau(false)}
                className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11px] font-extrabold transition ${
                  !dur ? 'border-turquoise bg-turquoise/10 text-turquoise-deep' : 'border-line bg-cream text-ink-soft'
                }`}
              >
                Normal · avec français
              </button>
              <button
                type="button"
                onClick={() => changerNiveau(true)}
                className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11px] font-extrabold transition ${
                  dur ? 'border-coral bg-coral/10 text-coral-dark' : 'border-line bg-cream text-ink-soft'
                }`}
              >
                Difficile · sans français
              </button>
            </div>
          </>
        )}

        {/* Le tapis de cartes */}
        <div className={`mt-3 grid gap-2 ${taille === 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {cartes.map((carte) => {
            const visible = ouvertes.includes(carte.id) || trouvees.has(carte.paire)
            const acquise = trouvees.has(carte.paire)
            return (
              <button
                key={carte.id}
                type="button"
                onClick={() => retourner(carte)}
                aria-label={visible ? carte.texte : 'Carte face cachée'}
                className="aspect-[3/4] w-full"
                style={{ perspective: '600px' }}
              >
                <span
                  className="relative block h-full w-full transition-transform duration-300"
                  style={{ transformStyle: 'preserve-3d', transform: visible ? 'rotateY(180deg)' : 'none' }}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-xl" style={{ backfaceVisibility: 'hidden' }}>
                    <DosCarte />
                  </span>
                  <span
                    className={`absolute inset-0 grid place-items-center overflow-hidden rounded-xl border-2 px-1 text-center ${
                      acquise
                        ? 'border-turquoise bg-turquoise/10'
                        : carte.face === 'mot'
                          ? 'border-line bg-white'
                          : 'border-line bg-sand'
                    } ${acquise ? 'opacity-90' : ''}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {carte.face === 'mot' ? (
                      // Le mot : tifinagh en grand, graphie latine en appui —
                      // sauf pour l'amazighe standard, déjà écrit en tifinagh.
                      // Le sens français s'ajoute en mode normal, quand la
                      // jumelle est une image (sinon il donnerait la paire).
                      <span className="flex flex-col items-center gap-0.5">
                        <span
                          className={`tifinagh font-extrabold leading-tight text-turquoise-deep ${
                            enTifinagh(carte.mot).length > 6 ? 'break-all text-[11px]' : 'text-[14px]'
                          }`}
                        >
                          {enTifinagh(carte.mot)}
                        </span>
                        {!estTifinagh(carte.mot) && (
                          <span className="break-words text-[8.5px] font-bold leading-tight text-ink-soft">
                            {carte.mot}
                          </span>
                        )}
                        {!dur && carte.scene && (
                          <span className="break-words text-[8px] font-bold italic leading-tight text-coral-dark">
                            {carte.sens}
                          </span>
                        )}
                      </span>
                    ) : carte.face === 'scene' ? (
                      // L'illustration des leçons — formes simples, sans yeux.
                      <Scene id={carte.scene} className="w-full" />
                    ) : (
                      <span className="tifinagh break-words text-[11.5px] font-extrabold leading-tight text-ink">
                        {carte.texte}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Victoire */}
        {gagne ? (
          <div className="animate-pop-in mt-4 rounded-2xl border-2 border-turquoise bg-turquoise/10 px-3 py-3.5 text-center">
            <div className="text-[15px] font-extrabold text-turquoise-deep">Igerrez ! Toutes les paires !</div>
            <div className="mt-0.5 text-[11px] font-bold text-ink-soft">
              {coups} coups pour {nbPaires} paires
              {!duel && <> · +{JEUX.memory.xpGain} XP</>}
            </div>
            <div className="mt-2.5 flex gap-2">
              {duel ? (
                <button
                  type="button"
                  onClick={() => onFinishDuel?.({ coups, paires: nbPaires })}
                  className="flex-1 rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
                >
                  Voir le résultat
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => rejouer()}
                    className="flex-1 rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
                  >
                    Rejouer
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 rounded-xl border-2 border-line bg-cream py-2.5 text-[13px] font-extrabold text-ink-soft"
                  >
                    Retour
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-center text-[10.5px] leading-snug text-ink-soft">
            Chaque mot en tifinagh a son image (ou son sens) quelque part — les cartes « mot » se font entendre.
          </p>
        )}
      </div>
    </div>
  )
}
