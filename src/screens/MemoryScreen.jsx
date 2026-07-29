import { useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti.jsx'
import { pairesMemoire, cartesMemoire } from '../lib/jeux.js'
import { playWord } from '../lib/audio.js'
import { sfx } from '../lib/sfx.js'
import { JEUX } from '../data/economy.js'

/**
 * Mémory — retrouve chaque mot amazigh et son sens français.
 *
 * Règle de dessin assumée : PAS de visage, pas d'être vivant. Les cartes
 * portent du texte, et leur dos un losange tissé (le motif du chemin).
 * Retourner une carte « mot » la fait aussi entendre : la mémoire de
 * l'oreille travaille avec celle des yeux.
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
  { paires: 8, label: '16 cartes' },
]

export function MemoryScreen({ course, onWin, onBack }) {
  const [taille, setTaille] = useState(6)
  // `manche` force un nouveau tirage — les cartes ne se re-mélangent
  // jamais en cours de partie, même si le composant se re-rend.
  const [manche, setManche] = useState(0)
  const cartes = useMemo(() => {
    const paires = pairesMemoire(course, taille)
    return cartesMemoire(paires)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, taille, manche])
  const nbPaires = cartes.length / 2

  const [ouvertes, setOuvertes] = useState([]) // ids des cartes face visible (0, 1 ou 2)
  const [trouvees, setTrouvees] = useState(() => new Set()) // n° de paires gagnées
  const [coups, setCoups] = useState(0)
  const [serie, setSerie] = useState(0) // paires d'affilée sans se tromper
  const verrou = useRef(false)
  const recompense = useRef(false)

  const gagne = trouvees.size === nbPaires && nbPaires > 0

  function rejouer(nouvellesPaires = taille) {
    setTaille(nouvellesPaires)
    setManche((m) => m + 1)
    setOuvertes([])
    setTrouvees(new Set())
    setCoups(0)
    setSerie(0)
    verrou.current = false
    recompense.current = false
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
          onWin?.()
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
        <h2 className="text-lg font-extrabold">Mémory</h2>
        <span className="ml-auto text-[11px] font-bold tabular-nums text-ink-soft">
          {trouvees.size}/{nbPaires} paires · {coups} {coups > 1 ? 'coups' : 'coup'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
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

        {/* Le tapis de cartes */}
        <div className={`mt-3 grid gap-2 ${taille === 8 ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
                    }`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span
                      className={`tifinagh break-words text-[11.5px] font-extrabold leading-tight ${
                        carte.face === 'mot' ? 'text-turquoise-deep' : 'text-ink'
                      } ${acquise ? 'opacity-80' : ''}`}
                    >
                      {carte.texte}
                    </span>
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
              {coups} coups pour {nbPaires} paires · +{JEUX.memory.xpGain} XP
            </div>
            <div className="mt-2.5 flex gap-2">
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
            </div>
          </div>
        ) : (
          <p className="mt-3 text-center text-[10.5px] leading-snug text-ink-soft">
            Chaque mot amazigh a son sens français quelque part — les cartes « mot » se font entendre.
          </p>
        )}
      </div>
    </div>
  )
}
