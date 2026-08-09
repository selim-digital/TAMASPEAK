import { useEffect, useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti.jsx'
import { DosCarte, FiligraneTapis } from './MemoryScreen.jsx'
import { pairesMemoire, cartesMemoire, enTifinagh, estTifinagh } from '../lib/jeux.js'
import { Scene } from '../components/illustrations/Scenes.jsx'
import { partieMemory, jouerMemory } from '../lib/distance.js'
import { playWord } from '../lib/audio.js'
import { track } from '../lib/api.js'
import { sfx } from '../lib/sfx.js'

/**
 * Mémory EN DIRECT — au tour par tour, chacun sur son téléphone.
 *
 * Le tapis est reconstruit localement depuis la graine de la partie (le
 * serveur a fait pareil : il est l'arbitre). À ton tour tu retournes deux
 * cartes ; l'adversaire les VOIT se retourner chez lui au prochain
 * sondage — c'est là que sa mémoire travaille. Une paire te fait
 * rejouer ; un raté passe la main. Tes paires se scellent d'or, les
 * siennes de corail.
 *
 * « Direct » sans WebSocket : le téléphone interroge la partie toutes
 * les 3 secondes tant qu'elle est ouverte — un tour de Mémory dure
 * quelques secondes, l'attente ne se sent pas.
 */

const SONDAGE_MS = 3000

export function MemoryLiveScreen({ course, partieInitiale, onBack }) {
  const [partie, setPartie] = useState(partieInitiale)
  const [ouvertes, setOuvertes] = useState([]) // indices retournés par MOI ce tour
  const [flashAdverse, setFlashAdverse] = useState([]) // le coup adverse, montré un instant
  const [muet, setMuet] = useState(false) // le serveur ne répond plus
  const verrou = useRef(false)
  const coupVu = useRef(JSON.stringify(partieInitiale?.dernierCoup || null))
  const compte = useRef(false) // l'événement de fin, tracé une seule fois
  // Chaque état APPLIQUÉ incrémente la version : la réponse d'un coup,
  // appliquée en différé (le temps de lire les cartes), ne doit jamais
  // écraser un état plus frais arrivé entre-temps par le sondage.
  const version = useRef(0)

  // Le tapis, identique sur les deux téléphones et chez l'arbitre.
  const cartes = useMemo(
    () => cartesMemoire(pairesMemoire(course, partie.paires, partie.seed), partie.seed),
    [course, partie.paires, partie.seed],
  )

  const fini = partie.status === 'fini'
  const gagne = fini && partie.scores.moi > partie.scores.lui
  const egalite = fini && partie.scores.moi === partie.scores.lui

  /** Intègre une partie fraîche du serveur : flashe le coup adverse. */
  function integrer(p) {
    if (!p) {
      setMuet(true)
      return
    }
    setMuet(false)
    const signature = JSON.stringify(p.dernierCoup || null)
    if (signature !== coupVu.current && p.dernierCoup && p.dernierCoup.par !== p.moi) {
      coupVu.current = signature
      setFlashAdverse(p.dernierCoup.cartes)
      if (p.dernierCoup.paire) sfx.pop()
      else sfx.click()
      setTimeout(() => setFlashAdverse([]), 2000)
    } else {
      coupVu.current = signature
    }
    version.current++
    setPartie(p)
  }

  // Le sondage — tant que la partie est ouverte. On saute le battement
  // quand un coup est en cours de lecture (verrou) : c'est la fenêtre de
  // la course état-frais / état-différé.
  useEffect(() => {
    if (fini) return undefined
    const t = setInterval(async () => {
      if (verrou.current) return
      integrer(await partieMemory(partie.id))
    }, SONDAGE_MS)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partie.id, fini])

  // Fin de partie : l'effort compte au classement, une seule fois.
  useEffect(() => {
    if (!fini || compte.current) return
    compte.current = true
    track(gagne ? 'duel_won' : 'duel_played', { lang: partie.lang })
    if (gagne || egalite) sfx.complete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fini])

  async function retourner(idx) {
    if (verrou.current || fini || !partie.monTour) return
    const carte = cartes[idx]
    if (ouvertes.includes(idx) || partie.trouvees[carte.paire] !== undefined) return

    if (carte.face === 'mot') playWord(carte.mot, course.id).catch(() => {})

    if (ouvertes.length === 0) {
      setOuvertes([idx])
      sfx.click()
      return
    }

    const [premier] = ouvertes
    setOuvertes([premier, idx])
    verrou.current = true
    const r = await jouerMemory({ id: partie.id, cartes: [premier, idx] })
    if (!r || r.erreur) {
      // Serveur muet ou coup refusé : on referme, la partie serveur fait foi.
      setTimeout(() => {
        setOuvertes([])
        verrou.current = false
        if (!r) setMuet(true)
        else integrerRafraichi()
      }, 600)
      return
    }
    const paire = cartes[premier].paire === cartes[idx].paire
    if (paire) sfx.correct()
    else sfx.wrong()
    // Laisser lire les deux cartes, puis l'état serveur reprend la main —
    // SAUF si un état plus frais est arrivé entre-temps (garde de version).
    const v = version.current
    setTimeout(() => {
      if (version.current === v) {
        coupVu.current = JSON.stringify(r.dernierCoup || null)
        version.current++
        setPartie(r)
      }
      setOuvertes([])
      verrou.current = false
    }, paire ? 500 : 1100)
  }

  async function integrerRafraichi() {
    integrer(await partieMemory(partie.id))
  }

  const petites = partie.paires > 12

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col bg-cream">
      {fini && (gagne || egalite) && <Confetti count={36} />}

      {/* En-tête : les deux joueurs et le tour */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-extrabold">Mémory en direct</h2>
      </div>

      <div className="mx-4 mb-1 flex items-center gap-2">
        <span
          className={`flex flex-1 items-center justify-between rounded-xl border-2 px-2.5 py-1.5 ${
            partie.monTour && !fini ? 'border-gold bg-yellow-vif/15' : 'border-line bg-cream'
          }`}
        >
          <span className="text-[11px] font-extrabold">Toi</span>
          <span className="text-[13px] font-extrabold tabular-nums text-turquoise-deep">{partie.scores.moi}</span>
        </span>
        <span
          className={`flex flex-1 items-center justify-between rounded-xl border-2 px-2.5 py-1.5 ${
            !partie.monTour && !fini ? 'border-gold bg-yellow-vif/15' : 'border-line bg-cream'
          }`}
        >
          <span className="min-w-0 truncate text-[11px] font-extrabold">{partie.avec || 'En face'}</span>
          <span className="ml-1 text-[13px] font-extrabold tabular-nums text-coral-dark">{partie.scores.lui}</span>
        </span>
      </div>
      {!fini && (
        <p className="mb-1 text-center text-[10.5px] font-bold text-ink-soft" aria-live="polite">
          {muet
            ? 'Le serveur ne répond plus — on réessaie tout seul…'
            : partie.monTour
              ? 'À toi de jouer : retourne deux cartes.'
              : `Au tour de ${partie.avec || 'ton adversaire'}… ses cartes s’afficheront ici.`}
        </p>
      )}

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        <FiligraneTapis />

        {/* Le tapis */}
        <div className={`relative mt-1 grid ${petites ? 'gap-1.5' : 'gap-2'} ${partie.paires <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {cartes.map((carte, idx) => {
            const proprietaire = partie.trouvees[carte.paire] // userId ou undefined
            const acquise = proprietaire !== undefined
            const mienne = proprietaire === partie.moi
            const visible = acquise || ouvertes.includes(idx) || flashAdverse.includes(idx)
            return (
              <button
                key={carte.id}
                type="button"
                onClick={() => retourner(idx)}
                disabled={fini || !partie.monTour}
                aria-label={visible ? carte.texte : 'Carte face cachée'}
                className="animate-enter aspect-[3/4] w-full disabled:cursor-default"
                style={{ perspective: '650px', animationDelay: `${Math.min(idx * 22, 500)}ms` }}
              >
                <span
                  className="relative block h-full w-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: visible ? 'rotateY(180deg)' : 'none',
                    transition: 'transform .45s cubic-bezier(0.2, 1.1, 0.35, 1)',
                  }}
                >
                  <span
                    className="absolute inset-0 overflow-hidden rounded-xl shadow-[0_2px_0_rgba(10,122,105,.35)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <DosCarte />
                  </span>
                  <span
                    className={`absolute inset-0 grid place-items-center overflow-hidden rounded-xl border-2 text-center ${
                      acquise
                        ? mienne
                          ? 'border-gold bg-yellow-vif/10 shadow-[0_0_0_1.5px_rgba(224,168,62,.35)]'
                          : 'border-coral bg-coral/10 shadow-[0_0_0_1.5px_rgba(255,111,97,.3)]'
                        : carte.face === 'mot'
                          ? 'border-line bg-white'
                          : 'border-line bg-sand'
                    } ${carte.face === 'scene' ? '' : 'px-1'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {carte.face === 'mot' ? (
                      <span className="flex flex-col items-center gap-0.5">
                        <span
                          className={`tifinagh font-extrabold leading-tight text-turquoise-deep ${
                            enTifinagh(carte.mot).length > 6 ? 'break-all text-[10.5px]' : 'text-[14px]'
                          }`}
                        >
                          {enTifinagh(carte.mot)}
                        </span>
                        {!estTifinagh(carte.mot) && (
                          <span className="break-words text-[8.5px] font-bold leading-tight text-ink-soft">{carte.mot}</span>
                        )}
                      </span>
                    ) : carte.face === 'scene' ? (
                      <Scene id={carte.scene} className="h-full w-full [&>svg]:h-full [&>svg]:w-full" />
                    ) : (
                      <span className="tifinagh break-words text-[11px] font-extrabold leading-tight text-ink">
                        {carte.texte}
                      </span>
                    )}
                    {acquise && (
                      <span
                        className={`animate-pop absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full text-[9px] font-extrabold text-white ${
                          mienne ? 'bg-gold' : 'bg-coral'
                        }`}
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

        {/* Fin de partie */}
        {fini ? (
          <div className="animate-pop-in relative mt-4 rounded-2xl border-2 border-gold bg-cream px-3 py-4 text-center shadow-[0_6px_16px_-10px_rgba(224,168,62,.5)]">
            <div className="text-[16px] font-extrabold text-turquoise-deep">
              {gagne ? 'Tu as gagné ! 🎉' : egalite ? 'Égalité ! 🤝' : `${partie.avec || 'En face'} l’emporte — la revanche t’attend 💪`}
            </div>
            <div className="mt-0.5 text-[11px] font-bold text-ink-soft">
              {partie.scores.moi} paires contre {partie.scores.lui} · la partie compte au classement du cercle
            </div>
            <button
              type="button"
              onClick={onBack}
              className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
            >
              Retour au cercle
            </button>
          </div>
        ) : (
          <p className="relative mt-3 text-center text-[10px] leading-snug text-ink-soft">
            Tes paires se scellent d’or, les siennes de corail — et tout ce qu’il retourne, tu le vois.
          </p>
        )}
      </div>
    </div>
  )
}
