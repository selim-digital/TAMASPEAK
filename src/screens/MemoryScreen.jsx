import { useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti.jsx'
import { pairesMemoire, cartesMemoire, nbPairesMemoire, enTifinagh, estTifinagh } from '../lib/jeux.js'
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
 * Habillage : dos de carte tissé (losanges d'Ath Yenni sur fond profond),
 * tapis sur filigrane de losanges, retournement à ressort, paire gagnée
 * scellée d'un liséré doré, combo qui s'envole, victoire notée en étoiles
 * (le nombre de coups par rapport au minimum possible). Règle de dessin
 * inchangée : PAS de visage, pas d'yeux — silhouettes et motifs seulement.
 *
 * Cinq tailles de tapis (12 → 30 cartes), bornées au vocabulaire réel du
 * cours. Deux niveaux : Normal (le sens français s'affiche sur la carte
 * mot quand sa jumelle est une image) et Difficile (sans français).
 *
 * En DUEL (téléphones distants), le tapis est tiré d'une graine commune
 * transportée par le lien : mêmes cartes des deux côtés, le moins de
 * coups gagne.
 */

/* ------------------------------------------------------------------ */
/* Habillage                                                            */
/* ------------------------------------------------------------------ */

/** Dos de carte : tissage de losanges sur fond turquoise profond. */
function DosCarte() {
  return (
    <svg viewBox="0 0 60 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="memory-dos" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12CDB0" />
          <stop offset="0.55" stopColor="#0BA98F" />
          <stop offset="1" stopColor="#0a7a69" />
        </linearGradient>
      </defs>
      <rect width="60" height="80" rx="9" fill="url(#memory-dos)" />
      {/* trame tissée en filigrane */}
      <g stroke="#ffffff" strokeWidth="1" opacity=".14">
        <path d="M0 10 L30 40 L0 70 M60 10 L30 40 L60 70" fill="none" />
        <path d="M14 0 L44 30 M44 0 L14 30 M14 80 L44 50 M44 80 L14 50" fill="none" />
      </g>
      {/* médaillon central : losange à trois niveaux */}
      <path d="M30 18 L48 40 L30 62 L12 40 Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" opacity=".9" />
      <path d="M30 26 L42 40 L30 54 L18 40 Z" fill="none" stroke="#FFD98E" strokeWidth="1.4" strokeLinejoin="round" opacity=".85" />
      <path d="M30 33 L36 40 L30 47 L24 40 Z" fill="#fff" opacity=".9" />
      <circle cx="30" cy="40" r="1.6" fill="#E0A83E" />
      {/* petits losanges des pointes */}
      <path d="M30 5 L34 10 L30 15 L26 10 Z M30 65 L34 70 L30 75 L26 70 Z" fill="#fff" opacity=".4" />
      <path d="M6 36 L10 40 L6 44 L2 40 Z M54 36 L58 40 L54 44 L50 40 Z" fill="#fff" opacity=".28" />
      {/* liséré doré */}
      <rect x="2" y="2" width="56" height="76" rx="7.5" fill="none" stroke="#E9C989" strokeWidth="1" opacity=".55" />
    </svg>
  )
}

/** Filigrane de losanges derrière le tapis — le motif du chemin. */
function FiligraneTapis() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="memory-losanges" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M13 4 L22 13 L13 22 L4 13 Z" fill="none" stroke="var(--color-turquoise-deep)" strokeWidth="1" opacity=".06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#memory-losanges)" />
    </svg>
  )
}

/** Étoiles de fin de partie — l'efficacité, jamais une sanction. */
function Etoiles({ n }) {
  return (
    <div className="flex justify-center gap-1.5" aria-label={`${n} étoile${n > 1 ? 's' : ''} sur 3`}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width="30"
          height="30"
          viewBox="0 0 24 24"
          className={i < n ? 'animate-pop-in' : ''}
          style={{ animationDelay: `${i * 160}ms` }}
          aria-hidden="true"
        >
          <path
            d="M12 2.5 L14.9 8.6 L21.5 9.5 L16.7 14.1 L17.9 20.7 L12 17.5 L6.1 20.7 L7.3 14.1 L2.5 9.5 L9.1 8.6 Z"
            fill={i < n ? 'var(--color-yellow-vif)' : 'var(--color-sand-2)'}
            stroke={i < n ? 'var(--color-gold-deep)' : 'var(--color-line)'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */

const TAILLES = [
  { paires: 6, cartes: 12 },
  { paires: 8, cartes: 16 },
  { paires: 10, cartes: 20 },
  { paires: 12, cartes: 24 },
  { paires: 15, cartes: 30 },
]

const CLE_DIFFICILE = 'tama-speak:memory-difficile'

/** Colonnes du tapis selon sa taille — les grandes cartes d'abord. */
const colonnesDe = (paires) => (paires <= 6 ? 'grid-cols-3' : paires <= 12 ? 'grid-cols-4' : 'grid-cols-5')

/** 3 étoiles ≤ 40 % de coups en trop, 2 ≤ 100 %, 1 sinon. */
const etoilesDe = (coups, paires) => (coups <= paires * 1.4 ? 3 : coups <= paires * 2 ? 2 : 1)

export function MemoryScreen({ course, duel = null, onWin, onFinishDuel, onBack }) {
  const dispo = useMemo(() => nbPairesMemoire(course), [course])
  const tailles = TAILLES.filter((t) => t.paires <= dispo)
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
  const petites = nbPaires > 12 // tapis 30 cartes : tout se resserre un peu

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
      }, 500)
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

  const etoiles = etoilesDe(coups, nbPaires)

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col bg-cream">
      {gagne && <Confetti count={40} />}

      {/* En-tête : titre, compteur de coups, barre de paires */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">{duel ? 'Mémory — duel' : 'Mémory'}</h2>
        {/* Le combo s'envole dès deux paires d'affilée */}
        {serie >= 2 && !gagne && (
          <span key={serie} className="animate-float-up text-[12px] font-extrabold text-coral-dark" aria-hidden="true">
            Combo ×{serie} 🔥
          </span>
        )}
        <span className="ml-auto rounded-full border border-line bg-sand px-2.5 py-1 text-[10.5px] font-extrabold tabular-nums text-ink-soft">
          {coups} {coups > 1 ? 'coups' : 'coup'}
        </span>
      </div>
      <div className="mx-4 mb-1 h-[5px] overflow-hidden rounded-full bg-sand-2">
        <div
          className="h-full rounded-full bg-turquoise transition-all duration-500"
          style={{ width: `${(trouvees.size / Math.max(1, nbPaires)) * 100}%` }}
        />
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        <FiligraneTapis />
        {duel ? (
          <p className="relative mt-1 text-center text-[10.5px] font-bold text-ink-soft">
            Le même tapis que {duel.from || 'ton ami'} — le moins de coups gagne.
          </p>
        ) : (
          <div className="relative">
            {/* Taille du tapis : sélecteur segmenté */}
            <div className="mt-1 flex overflow-hidden rounded-xl border-2 border-line bg-cream">
              {tailles.map((t, i) => (
                <button
                  key={t.paires}
                  type="button"
                  onClick={() => rejouer(t.paires)}
                  className={`flex-1 py-1.5 text-[11.5px] font-extrabold transition ${
                    i > 0 ? 'border-l border-line' : ''
                  } ${taille === t.paires ? 'bg-turquoise text-white' : 'text-ink-soft'}`}
                >
                  {t.cartes}
                </button>
              ))}
              <span className="grid place-items-center border-l border-line bg-sand px-2 text-[9px] font-bold uppercase tracking-wide text-ink-soft">
                cartes
              </span>
            </div>
            {/* Niveau : avec ou sans le français */}
            <div className="mt-1.5 flex overflow-hidden rounded-xl border-2 border-line bg-cream">
              <button
                type="button"
                onClick={() => changerNiveau(false)}
                className={`flex-1 py-1.5 text-[11px] font-extrabold transition ${
                  !dur ? 'bg-turquoise text-white' : 'text-ink-soft'
                }`}
              >
                Normal · avec français
              </button>
              <button
                type="button"
                onClick={() => changerNiveau(true)}
                className={`flex-1 border-l border-line py-1.5 text-[11px] font-extrabold transition ${
                  dur ? 'bg-coral text-white' : 'text-ink-soft'
                }`}
              >
                Difficile · sans
              </button>
            </div>
          </div>
        )}

        {/* Le tapis de cartes */}
        <div className={`relative mt-3 grid ${petites ? 'gap-1.5' : 'gap-2'} ${colonnesDe(nbPaires)}`}>
          {cartes.map((carte, i) => {
            const visible = ouvertes.includes(carte.id) || trouvees.has(carte.paire)
            const acquise = trouvees.has(carte.paire)
            return (
              <button
                key={carte.id}
                type="button"
                onClick={() => retourner(carte)}
                aria-label={visible ? carte.texte : 'Carte face cachée'}
                className="animate-enter aspect-[3/4] w-full"
                style={{ perspective: '650px', animationDelay: `${Math.min(i * 22, 500)}ms` }}
              >
                <span
                  className="relative block h-full w-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: visible ? 'rotateY(180deg)' : 'none',
                    transition: 'transform .45s cubic-bezier(0.2, 1.1, 0.35, 1)',
                  }}
                >
                  {/* dos tissé */}
                  <span
                    className="absolute inset-0 overflow-hidden rounded-xl shadow-[0_2px_0_rgba(10,122,105,.35)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <DosCarte />
                  </span>
                  {/* face */}
                  <span
                    className={`absolute inset-0 grid place-items-center overflow-hidden rounded-xl border-2 text-center ${
                      acquise
                        ? 'border-gold bg-yellow-vif/10 shadow-[0_0_0_1.5px_rgba(224,168,62,.35)]'
                        : carte.face === 'mot'
                          ? 'border-line bg-white shadow-[0_1.5px_0_var(--color-line)]'
                          : 'border-line bg-sand shadow-[0_1.5px_0_var(--color-line)]'
                    } ${carte.face === 'scene' ? '' : 'px-1'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {carte.face === 'mot' ? (
                      // Le mot : tifinagh en grand, graphie latine en appui —
                      // sauf pour l'amazighe standard, déjà écrit en tifinagh.
                      // Le sens français s'ajoute en mode normal, quand la
                      // jumelle est une image (sinon il donnerait la paire).
                      <span className={`flex flex-col items-center ${petites ? 'gap-0' : 'gap-0.5'}`}>
                        <span
                          className={`tifinagh font-extrabold leading-tight text-turquoise-deep ${
                            enTifinagh(carte.mot).length > 6 || petites ? 'break-all text-[10.5px]' : 'text-[14px]'
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
                      // L'illustration des leçons — plein cadre, sans yeux.
                      <Scene id={carte.scene} className="h-full w-full [&>svg]:h-full [&>svg]:w-full" />
                    ) : (
                      <span className="tifinagh break-words text-[11px] font-extrabold leading-tight text-ink">
                        {carte.texte}
                      </span>
                    )}
                    {/* sceau de paire gagnée */}
                    {acquise && (
                      <span
                        className="animate-pop absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-gold text-[9px] font-extrabold text-white"
                        aria-hidden="true"
                      >
                        ✓
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
          <div className="animate-pop-in relative mt-4 rounded-2xl border-2 border-gold bg-cream px-3 py-4 text-center shadow-[0_6px_16px_-10px_rgba(224,168,62,.5)]">
            <Etoiles n={etoiles} />
            <div className="mt-1.5 text-[16px] font-extrabold text-turquoise-deep">Igerrez ! Toutes les paires !</div>
            <div className="mt-0.5 text-[11px] font-bold text-ink-soft">
              {coups} coups pour {nbPaires} paires
              {!duel && <> · +{JEUX.memory.xpGain} XP</>}
            </div>
            <div className="mt-3 flex gap-2">
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
          <p className="relative mt-3 text-center text-[10.5px] leading-snug text-ink-soft">
            Chaque mot en tifinagh a son image (ou son sens) quelque part — les cartes « mot » se font entendre.
          </p>
        )}
      </div>
    </div>
  )
}
