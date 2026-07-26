import { useEffect, useRef, useState } from 'react'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { NIVEAUX } from '../data/tifinagh.js'
import { dessinerModele, dessinerTraces, evaluerTrace, policePrete, REUSSI } from '../lib/tracing.js'
import { sfx } from '../lib/sfx.js'

const COTE = 260 // côté logique de l'ardoise, en pixels CSS

// Le canvas ne résout pas les variables CSS : les couleurs sont les valeurs
// littérales des jetons `--color-turquoise-deep` et `--color-ink`.
const ENCRE = '#0a7a69'
const MODELE = 'rgba(30,37,48,0.15)'

/**
 * Écrire le tifinagh — l'ardoise.
 *
 * Duolingo fait tracer les caractères du chinois et du japonais ; personne ne
 * le fait pour le tifinagh, qui n'existe dans aucune app d'apprentissage. Or
 * c'est une écriture que la plupart des apprenants n'ont jamais tracée, alors
 * même qu'ils la voient sur les panneaux et à la télévision.
 *
 * Le modèle reste visible en filigrane pendant tout le tracé : on n'est pas là
 * pour tester la mémoire de la forme, mais pour installer le geste. La
 * correction est purement géométrique (voir lib/tracing.js) et volontairement
 * indulgente — un tracé « à peu près » est un tracé réussi.
 */
export function TifinaghScreen({ onBack }) {
  const [niveau, setNiveau] = useState(NIVEAUX[0])
  const [index, setIndex] = useState(0)
  const [traces, setTraces] = useState([])
  const [note, setNote] = useState(null)
  const [prete, setPrete] = useState(false)
  const canvasRef = useRef(null)
  const traceEnCours = useRef(null)

  const item = niveau.items[index]

  useEffect(() => {
    policePrete(120).then(() => setPrete(true))
  }, [])

  // Redessine l'ardoise : modèle en filigrane, puis l'encre de l'élève.
  useEffect(() => {
    const c = canvasRef.current
    if (!c || !prete) return
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    if (c.width !== COTE * dpr) {
      c.width = COTE * dpr
      c.height = COTE * dpr
    }
    const ctx = c.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, COTE, COTE)
    dessinerModele(ctx, item.c, COTE, COTE, { couleur: MODELE })
    dessinerTraces(ctx, traces, { plume: niveau.plume, couleur: ENCRE })
  }, [item, traces, niveau, prete])

  function pointDe(e) {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * COTE, y: ((e.clientY - r.top) / r.height) * COTE }
  }

  // Attention : on capture le trait dans une variable locale plutôt que de
  // lire `traceEnCours.current` DANS la fonction de mise à jour. React exécute
  // celle-ci plus tard, et sur une tape rapide le doigt est déjà relevé —
  // `.current` vaut alors null, et c'est un trait null qui entrerait dans la
  // liste, faisant planter le rendu suivant.
  function debut(e) {
    e.preventDefault()
    try {
      canvasRef.current.setPointerCapture?.(e.pointerId)
    } catch {
      /* certains navigateurs refusent la capture — le tracé marche sans */
    }
    setNote(null)
    const trait = [pointDe(e)]
    traceEnCours.current = trait
    setTraces((t) => [...t, trait])
  }

  function bouge(e) {
    const trait = traceEnCours.current
    if (!trait) return
    e.preventDefault()
    trait.push(pointDe(e))
    setTraces((t) => [...t.slice(0, -1), [...trait]])
  }

  function fin() {
    traceEnCours.current = null
  }

  function effacer() {
    setTraces([])
    setNote(null)
    sfx.click()
  }

  function verifier() {
    const r = evaluerTrace({
      texte: item.c,
      traces,
      largeur: COTE,
      hauteur: COTE,
      plume: niveau.plume,
      tolerance: niveau.tolerance,
    })
    setNote(r)
    if (r.note >= REUSSI) {
      sfx.correct()
      sfx.pop(0.3)
    } else {
      sfx.click()
    }
  }

  function suivant() {
    setIndex((i) => (i + 1) % niveau.items.length)
    setTraces([])
    setNote(null)
  }

  function changerNiveau(n) {
    setNiveau(n)
    setIndex(0)
    setTraces([])
    setNote(null)
    sfx.click()
  }

  const reussi = note && note.note >= REUSSI

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Écrire le tifinagh</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        {/* Les trois niveaux */}
        <div className="mt-2 flex gap-1.5">
          {NIVEAUX.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => changerNiveau(n)}
              className={`flex-1 rounded-xl border-2 px-2 py-1.5 text-[11.5px] font-extrabold transition ${
                niveau.id === n.id ? 'border-turquoise bg-turquoise/10 text-turquoise-deep' : 'border-line bg-cream text-ink-soft'
              }`}
            >
              {n.titre}
            </button>
          ))}
        </div>
        <p className="mt-1 text-center text-[10px] text-ink-soft">{niveau.detail}</p>

        {/* Ce qu'il faut écrire */}
        <div className="mt-3 text-center">
          <div className="text-[15px] font-extrabold">
            {item.lat}
            {item.fr && <span className="font-bold text-ink-soft"> — {item.fr}</span>}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
            {index + 1} / {niveau.items.length}
          </div>
        </div>

        {/* L'ardoise */}
        <div className="relative mx-auto mt-3" style={{ width: COTE, maxWidth: '100%' }}>
          <canvas
            ref={canvasRef}
            onPointerDown={debut}
            onPointerMove={bouge}
            onPointerUp={fin}
            onPointerCancel={fin}
            onPointerLeave={fin}
            aria-label={`Ardoise pour écrire ${item.lat}`}
            className="w-full touch-none rounded-2xl border-2 border-line bg-white"
            style={{ aspectRatio: '1 / 1' }}
          />
          {!prete && (
            <p className="absolute inset-0 grid place-items-center text-[11px] text-ink-soft">chargement…</p>
          )}
          {traces.length === 0 && prete && !note && (
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[10.5px] text-ink-soft">
              suis la lettre grise avec ton doigt
            </p>
          )}
        </div>

        {/* Retour, jamais une sanction */}
        {note && (
          <div
            className="animate-rise mx-auto mt-3 rounded-2xl border-2 px-3 py-2.5 text-center"
            style={{
              width: COTE,
              maxWidth: '100%',
              borderColor: reussi ? 'var(--color-turquoise)' : 'var(--color-line)',
              background: reussi ? 'rgba(16,196,168,.08)' : 'transparent',
            }}
          >
            <div className="text-[13px] font-extrabold" style={{ color: reussi ? 'var(--color-turquoise-deep)' : 'var(--color-ink)' }}>
              {reussi ? 'C’est ça !' : 'Presque — reprends le tracé'}
            </div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-ink-soft">
              {reussi
                ? 'Le geste est là. Passe au suivant.'
                : note.rappel < note.precision
                  ? 'Il manque une partie de la lettre : couvre tout le gris.'
                  : 'Reste bien sur le gris, sans déborder.'}
            </div>
          </div>
        )}

        <div className="mx-auto mt-3 flex gap-2" style={{ width: COTE, maxWidth: '100%' }}>
          <button
            type="button"
            onClick={effacer}
            className="flex-1 rounded-xl border-2 border-line bg-cream py-2.5 text-[12.5px] font-extrabold text-ink-soft"
          >
            Effacer
          </button>
          {reussi ? (
            <button
              type="button"
              onClick={suivant}
              className="flex-[2] rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={verifier}
              disabled={traces.length === 0}
              className="flex-[2] rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:bg-sand-2 disabled:text-ink-soft disabled:shadow-none"
            >
              Vérifier
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={suivant}
          className="mx-auto mt-2 block text-[11px] font-bold text-ink-soft underline"
        >
          Passer celle-ci
        </button>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
          <Akermus height={56} state="curious" className="flex-none" />
          <p className="text-[11px] leading-snug text-ink-soft">
            {niveau.note ||
              'Le modèle reste visible : on n’est pas là pour tester ta mémoire, mais pour que ta main apprenne le geste. Rien n’est noté ni conservé.'}
          </p>
        </div>
      </div>
    </div>
  )
}
