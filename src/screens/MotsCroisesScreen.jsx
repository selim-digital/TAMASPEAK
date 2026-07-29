import { useEffect, useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti.jsx'
import { niveauxMots, grilleDuel, enTifinagh, enLatin, estTifinagh } from '../lib/jeux.js'
import { playWord } from '../lib/audio.js'
import { sfx } from '../lib/sfx.js'
import { lire, ecrire } from '../lib/storage.js'
import { JEUX } from '../data/economy.js'
import { GemIcon } from '../components/jewels/StatIcons.jsx'

/**
 * Mots croisés à la roue de lettres (façon « Words of Wonders »).
 *
 * Un niveau par unité du cours : une petite grille croisée, une roue de
 * lettres en bas. On relie les lettres du doigt (ou on les tape une à
 * une) pour former un mot amazigh ; trouvé, il se pose dans la grille et
 * se fait entendre. Les SENS FRANÇAIS servent d'indices permanents :
 * on ne devine pas au hasard, on se souvient — c'est là que la langue
 * s'installe.
 *
 * Les gemmes gagnées ailleurs trouvent ici leur usage : un indice révèle
 * une lettre de la grille.
 */

const LARGEUR_GRILLE = 312 // px disponibles pour la grille dans le téléphone

/** Majuscule d'affichage — inerte pour le tifinagh, correcte pour ɣ, ḍ, ẓ… */
const maj = (l) => l.toLocaleUpperCase('fr')

/** L'écriture d'affichage choisie, mémorisée par langue. */
const cleScript = (courseId) => `tama-speak:mots-script:${courseId}`

/** Un temps de jeu compact pour l'en-tête (« 1:23 »). */
const chrono = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function MotsCroisesScreen({ course, progress = {}, gems = 0, duel = null, onNiveauFini, onIndice, onFinishDuel, onBack }) {
  const niveaux = useMemo(() => niveauxMots(course), [course])
  const faits = progress.jeux?.motsFaits || []
  const [niveau, setNiveau] = useState(null)
  // Le niveau était-il déjà réussi à son OUVERTURE ? La récompense de fin
  // en dépend, et le statut « fait » change justement pendant la partie.
  const [dejaFait, setDejaFait] = useState(false)

  // En duel, pas de liste : la grille vient de la graine du lien — la même
  // que celle de l'ami, quel que soit le téléphone.
  const niveauDuel = useMemo(() => (duel ? grilleDuel(course, duel.seed) : null), [course, duel])
  if (duel) {
    if (!niveauDuel) {
      // Cours trop pauvre pour une grille (ne devrait pas arriver) : on le
      // dit au lieu d'un écran vide.
      return (
        <div className="animate-enter grid min-h-0 flex-1 place-items-center px-6 text-center text-[12px] text-ink-soft">
          Ce cours n'a pas assez de mots pour un duel de grille.
        </div>
      )
    }
    return (
      <NiveauMots
        key={niveauDuel.id}
        course={course}
        niveau={niveauDuel}
        duel={duel}
        gems={0}
        onFinishDuel={onFinishDuel}
        onQuitter={onBack}
      />
    )
  }

  if (!niveau) {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        <div className="flex items-center gap-3 px-4 pt-8 pb-1">
          <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
            ←
          </button>
          <h2 className="text-lg font-extrabold">Mots croisés</h2>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold tabular-nums text-ink-soft">
            <GemIcon size={13} /> {gems}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            Un niveau par unité du cours. Les sens français sont tes indices — forme les mots amazighs avec la
            roue de lettres.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {niveaux.map((n, i) => {
              const fait = faits.includes(n.id)
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setDejaFait(fait)
                    setNiveau(n)
                    sfx.click()
                  }}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left transition active:scale-[0.99] ${
                    fait ? 'border-turquoise/40 bg-turquoise/5' : 'border-line bg-cream'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-full text-[13px] font-extrabold ${
                      fait ? 'bg-turquoise text-white' : 'bg-sand-2 text-ink-soft'
                    }`}
                  >
                    {fait ? '✓' : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-extrabold">{n.titre}</span>
                    <span className="block text-[10.5px] text-ink-soft">
                      {n.grille.mots.length} mots · {n.lettres.length} lettres
                    </span>
                  </span>
                  {fait && <span className="text-[10px] font-extrabold text-turquoise-deep">rejouable</span>}
                </button>
              )
            })}
          </div>
          {niveaux.length === 0 && (
            <p className="mt-6 text-center text-[11.5px] text-ink-soft">
              Ce cours n'a pas encore assez de vocabulaire pour une grille — reviens après quelques leçons.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <NiveauMots
      key={niveau.id}
      course={course}
      niveau={niveau}
      dejaFait={dejaFait}
      gems={gems}
      onIndice={onIndice}
      onFini={() => onNiveauFini?.(niveau.id, dejaFait)}
      onQuitter={() => setNiveau(null)}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Un niveau en cours de jeu                                           */
/* ------------------------------------------------------------------ */

function NiveauMots({ course, niveau, dejaFait, gems, duel = null, onIndice, onFini, onFinishDuel, onQuitter }) {
  const { grille, lettres } = niveau
  const [trouves, setTrouves] = useState(() => new Set()) // index de mots
  // Le chrono du duel : il court dès l'ouverture de la grille et s'arrête
  // à la victoire — c'est LE score, le plus rapide gagne.
  const [secondes, setSecondes] = useState(0)
  const [reveles, setReveles] = useState(() => new Set()) // "x,y" révélés à l'indice
  const [sel, setSel] = useState([]) // indices de lettres de la roue
  const [modeTap, setModeTap] = useState(false)
  const [toast, setToast] = useState(null) // { mot, sens } ou { info }
  const [secousse, setSecousse] = useState(0)
  const drag = useRef(null)
  const recompense = useRef(false)
  // L'écriture d'affichage : celle du cours par défaut, et le choix du
  // joueur est retenu par langue. Seul l'AFFICHAGE change — la grille,
  // la roue et la validation vivent dans la graphie d'origine du cours.
  const [script, setScript] = useState(
    () => lire(cleScript(course.id)) || (estTifinagh(lettres.join('')) ? 'tif' : 'lat'),
  )
  const changerScript = (s) => {
    setScript(s)
    ecrire(cleScript(course.id), s)
    sfx.click()
  }
  /** Une lettre, dans l'écriture d'affichage choisie. */
  const afficher = (l) => (script === 'tif' ? enTifinagh(l) : maj(enLatin(l)))
  /** Un mot entier en latin — la graphie du cours reste la référence. */
  const motLatin = (mot) => (estTifinagh(mot) ? enLatin(mot) : mot)
  /**
   * Un mot trouvé se montre TOUJOURS en entier : tifinagh, latin, et la
   * traduction vient à côté — c'est le moment d'apprentissage, on ne le
   * tronque pas selon l'écriture choisie.
   */
  const motComplet = (mot) => (
    <>
      <span className="tifinagh">{enTifinagh(mot)}</span> · {motLatin(mot)}
    </>
  )

  const gagne = trouves.size === grille.mots.length

  useEffect(() => {
    if (!duel || gagne) return undefined
    const t = setInterval(() => setSecondes((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [duel, gagne])

  // Les cases de la grille, chacune avec la liste des mots qui la portent.
  const cellules = useMemo(() => {
    const map = new Map()
    grille.mots.forEach((m, mi) => {
      m.lettres.forEach((l, i) => {
        const x = m.x + (m.dir === 'h' ? i : 0)
        const y = m.y + (m.dir === 'v' ? i : 0)
        const k = `${x},${y}`
        const c = map.get(k) || { x, y, lettre: l, mots: [] }
        c.mots.push(mi)
        map.set(k, c)
      })
    })
    return [...map.values()]
  }, [grille])

  const celluleVisible = (c) => c.mots.some((mi) => trouves.has(mi)) || reveles.has(`${c.x},${c.y}`)
  const resteCachee = cellules.some((c) => !celluleVisible(c))

  // Le toast d'un mot trouvé s'efface seul.
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  /* ---- Sélection à la roue : glisser, ou taper lettre à lettre ---- */

  function debutSel(i, e) {
    if (gagne) return
    e.preventDefault()
    if (modeTap) {
      setSel((s) => (s[s.length - 1] === i ? s.slice(0, -1) : s.includes(i) ? s : [...s, i]))
      sfx.click()
      return
    }
    drag.current = { actif: true, multi: false }
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* la capture est un confort — le glisser marche souvent sans */
    }
    setSel([i])
    sfx.click()
  }

  function bougeSel(e) {
    if (!drag.current?.actif) return
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const btn = el?.closest?.('[data-roue]')
    if (!btn) return
    const i = Number(btn.dataset.roue)
    setSel((s) => {
      if (s[s.length - 1] === i) return s
      // Revenir sur l'avant-dernière lettre la « dé-sélectionne » (geste WOW).
      if (s[s.length - 2] === i) return s.slice(0, -1)
      if (s.includes(i)) return s
      drag.current.multi = true
      return [...s, i]
    })
  }

  function finSel() {
    if (!drag.current?.actif) return
    const multi = drag.current.multi
    drag.current = null
    if (multi) valider()
    // Tape simple : la lettre reste posée, on continue lettre à lettre.
    else setModeTap(true)
  }

  function effacerSel() {
    setSel([])
    setModeTap(false)
    sfx.click()
  }

  function valider(selection) {
    const s = selection || sel
    setSel([])
    setModeTap(false)
    const mot = s.map((i) => lettres[i]).join('')
    if (mot.length < 2) return
    const idx = grille.mots.findIndex((m) => m.mot.toLowerCase() === mot)
    if (idx < 0) {
      sfx.wrong()
      setSecousse((k) => k + 1)
      return
    }
    if (trouves.has(idx)) {
      setToast({ info: 'Déjà trouvé !' })
      sfx.click()
      return
    }
    const m = grille.mots[idx]
    playWord(m.mot, course.id).catch(() => {})
    setToast({ mot: m.mot, sens: m.sens })
    // On calcule l'ensemble hors de l'updater : appeler onFini depuis un
    // updater d'état, c'est modifier App pendant le rendu — React proteste,
    // à raison. Ici on est dans un gestionnaire d'événement, c'est sûr.
    const suivants = new Set(trouves)
    suivants.add(idx)
    setTrouves(suivants)
    if (suivants.size === grille.mots.length && !recompense.current) {
      recompense.current = true
      sfx.complete()
      onFini?.()
    } else {
      sfx.correct()
    }
  }

  /** Révèle la première lettre encore cachée d'un mot non trouvé. */
  function indice() {
    if (gems < JEUX.indice || gagne) return
    for (let mi = 0; mi < grille.mots.length; mi++) {
      if (trouves.has(mi)) continue
      const m = grille.mots[mi]
      for (let i = 0; i < m.lettres.length; i++) {
        const x = m.x + (m.dir === 'h' ? i : 0)
        const y = m.y + (m.dir === 'v' ? i : 0)
        const c = cellules.find((cc) => cc.x === x && cc.y === y)
        if (c && !celluleVisible(c)) {
          setReveles((r) => new Set(r).add(`${x},${y}`))
          onIndice?.()
          sfx.chest()
          return
        }
      }
    }
  }

  /* ---- Géométrie ---- */

  const gap = 3
  const caseW = Math.min(38, Math.floor((LARGEUR_GRILLE - gap * (grille.w - 1)) / grille.w))
  const nbL = lettres.length
  const roueW = 232
  const rayonRoue = nbL > 8 ? 92 : 84
  const tailleLettre = nbL > 8 ? 40 : 46
  const posLettre = (i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / nbL
    return {
      x: roueW / 2 + rayonRoue * Math.cos(a),
      y: roueW / 2 + rayonRoue * Math.sin(a),
    }
  }

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col bg-cream">
      {gagne && <Confetti />}
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onQuitter} aria-label="Retour aux niveaux" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-extrabold">{niveau.titre}</h2>
        {/* La bascule d'écriture : latin ⇄ tifinagh, les deux se valent. */}
        <div className="flex flex-none overflow-hidden rounded-lg border border-line" role="group" aria-label="Écriture d'affichage">
          <button
            type="button"
            onClick={() => changerScript('lat')}
            aria-pressed={script === 'lat'}
            className={`px-2 py-1 text-[10px] font-extrabold ${script === 'lat' ? 'bg-turquoise text-white' : 'bg-cream text-ink-soft'}`}
          >
            Abc
          </button>
          <button
            type="button"
            onClick={() => changerScript('tif')}
            aria-pressed={script === 'tif'}
            className={`tifinagh px-2 py-1 text-[10px] font-extrabold ${script === 'tif' ? 'bg-turquoise text-white' : 'bg-cream text-ink-soft'}`}
          >
            ⵣⴰ
          </button>
        </div>
        {duel ? (
          <span className="rounded-lg bg-coral/10 px-2 py-1 text-[12px] font-extrabold tabular-nums text-coral-dark">
            ⏱ {chrono(secondes)}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold tabular-nums text-ink-soft">
            <GemIcon size={13} /> {gems}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-5">
        {duel && !gagne && (
          <p className="text-center text-[10px] font-bold text-ink-soft">
            La même grille que {duel.from || 'ton ami'} — sans indices, la plus rapide gagne.
          </p>
        )}
        {/* La grille */}
        <div className="mt-1 flex justify-center">
          <div
            className="relative"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${grille.w}, ${caseW}px)`,
              gridTemplateRows: `repeat(${grille.h}, ${caseW}px)`,
              gap: `${gap}px`,
            }}
          >
            {cellules.map((c) => {
              const visible = celluleVisible(c)
              const parIndice = reveles.has(`${c.x},${c.y}`) && !c.mots.some((mi) => trouves.has(mi))
              return (
                <div
                  key={`${c.x},${c.y}`}
                  style={{ gridColumn: c.x + 1, gridRow: c.y + 1 }}
                  className={`tifinagh grid place-items-center rounded-md border-2 font-extrabold ${
                    visible
                      ? parIndice
                        ? 'border-gold bg-yellow-vif/20 text-gold-deep'
                        : 'animate-pop border-turquoise bg-turquoise/10 text-turquoise-deep'
                      : 'border-line bg-white'
                  }`}
                >
                  <span style={{ fontSize: Math.max(12, caseW * 0.48) }}>{visible ? afficher(c.lettre) : ''}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Les indices : les sens français, cœur pédagogique du jeu */}
        <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
          {grille.mots.map((m, mi) => {
            const fait = trouves.has(mi)
            return (
              <span
                key={mi}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                  fait
                    ? 'border-turquoise/50 bg-turquoise/10 text-turquoise-deep'
                    : 'border-line bg-sand text-ink-soft'
                }`}
              >
                {fait ? (
                  <>
                    {motComplet(m.mot)} — {m.sens}
                  </>
                ) : (
                  <>
                    {m.sens} · {m.lettres.length} lettres
                  </>
                )}
              </span>
            )
          })}
        </div>

        {/* Fin de niveau */}
        {gagne ? (
          <div className="animate-pop-in mx-auto mt-3 w-full max-w-[280px] rounded-2xl border-2 border-turquoise bg-turquoise/10 px-3 py-3.5 text-center">
            <div className="text-[15px] font-extrabold text-turquoise-deep">Grille remplie — Igerrez !</div>
            <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-bold text-ink-soft">
              {duel ? (
                <>
                  {grille.mots.length} mots en {chrono(secondes)}
                </>
              ) : dejaFait ? (
                <>+{JEUX.mots.xpRejoue} XP (niveau rejoué)</>
              ) : (
                <>
                  +{JEUX.mots.xpGain} XP · +{JEUX.mots.gems} <GemIcon size={12} />
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                duel ? onFinishDuel?.({ secondes, mots: grille.mots.length }) : onQuitter()
              }
              className="mt-2.5 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
            >
              {duel ? 'Voir le résultat' : 'Autres niveaux'}
            </button>
          </div>
        ) : (
          <>
            {/* Le mot en cours de formation */}
            <div key={secousse} className={`${secousse ? 'animate-shake' : ''} mt-2.5 flex h-9 items-center justify-center gap-1`}>
              {sel.length === 0 ? (
                <span className="text-[10.5px] text-ink-soft">
                  {toast?.info || (toast ? (
                    <b className="text-turquoise-deep">
                      {motComplet(toast.mot)} — {toast.sens}
                    </b>
                  ) : 'relie les lettres pour former un mot')}
                </span>
              ) : (
                sel.map((i, j) => (
                  <span
                    key={j}
                    className="tifinagh grid h-8 w-7 place-items-center rounded-md bg-turquoise text-[15px] font-extrabold text-white"
                  >
                    {afficher(lettres[i])}
                  </span>
                ))
              )}
            </div>

            {/* La roue */}
            <div className="flex flex-none justify-center">
              <div
                className="relative touch-none select-none"
                style={{ width: roueW, height: roueW }}
                onPointerMove={bougeSel}
                onPointerUp={finSel}
                onPointerCancel={finSel}
              >
                <div className="absolute inset-3 rounded-full border-2 border-line bg-sand/60" aria-hidden="true" />
                {/* Le fil qui relie les lettres sélectionnées */}
                <svg className="pointer-events-none absolute inset-0" width={roueW} height={roueW} aria-hidden="true">
                  {sel.length > 1 && (
                    <polyline
                      points={sel.map((i) => `${posLettre(i).x},${posLettre(i).y}`).join(' ')}
                      fill="none"
                      stroke="var(--color-turquoise)"
                      strokeOpacity=".5"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                {lettres.map((l, i) => {
                  const p = posLettre(i)
                  const prise = sel.includes(i)
                  return (
                    <button
                      key={i}
                      type="button"
                      data-roue={i}
                      onPointerDown={(e) => debutSel(i, e)}
                      className={`tifinagh absolute grid place-items-center rounded-full border-2 font-extrabold transition-colors ${
                        prise
                          ? 'border-turquoise-dark bg-turquoise text-white'
                          : 'border-line bg-white text-ink'
                      }`}
                      style={{
                        width: tailleLettre,
                        height: tailleLettre,
                        left: p.x - tailleLettre / 2,
                        top: p.y - tailleLettre / 2,
                        fontSize: tailleLettre * 0.42,
                      }}
                      aria-label={`Lettre ${afficher(l)}`}
                    >
                      {afficher(l)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions : valider (mode lettre à lettre) et indice */}
            <div className="mx-auto mt-1 flex w-full max-w-[260px] gap-2">
              {modeTap && sel.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={effacerSel}
                    aria-label="Effacer le mot en cours"
                    className="flex-none rounded-xl border-2 border-line bg-cream px-3.5 py-2 text-[13px] font-extrabold text-ink-soft"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => valider()}
                    className="flex-1 rounded-xl bg-turquoise py-2 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
                  >
                    Valider
                  </button>
                </>
              ) : duel ? (
                // Pas d'indice en duel : les deux joueurs affrontent la même
                // grille avec les mêmes armes.
                <p className="flex-1 py-2 text-center text-[10.5px] font-bold text-ink-soft">
                  Pas d'indice en duel — que le meilleur gagne !
                </p>
              ) : (
                <button
                  type="button"
                  onClick={indice}
                  disabled={gems < JEUX.indice || !resteCachee}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-line bg-cream py-2 text-[12px] font-extrabold text-ink-soft disabled:opacity-50"
                >
                  Indice · {JEUX.indice} <GemIcon size={12} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
