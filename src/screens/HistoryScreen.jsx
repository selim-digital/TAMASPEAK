import { useEffect, useRef, useState } from 'react'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { RECITS, recitParId } from '../data/history.js'
import { PERSONNAGES } from '../data/personnages.js'
import { XP_RECIT } from '../data/economy.js'
import { LAND_BY_ID } from '../data/journey.js'
import { recordRecit, recitLu, recitsLus } from '../lib/progress.js'
import { sfx } from '../lib/sfx.js'

const LETTERS = ['A', 'B', 'C', 'D']

/**
 * La lecture d'un récit, puis sa question.
 *
 * Le texte reste affiché sous la question : on ne teste pas la mémoire
 * immédiate, on vérifie qu'on a lu. Se tromper ne coûte rien et ne fait rien
 * perdre — on peut répondre de nouveau.
 */
function Recit({ recit, deja, onFini, onFermer }) {
  const [choisi, setChoisi] = useState(null)
  const [repondu, setRepondu] = useState(false)
  const hautRef = useRef(null)

  useEffect(() => {
    hautRef.current?.scrollTo?.({ top: 0 })
  }, [recit.id])

  const juste = repondu && choisi === recit.question.answer

  function valider() {
    if (choisi === null) return
    setRepondu(true)
    if (choisi === recit.question.answer) {
      sfx.correct()
      if (!deja) onFini(recit.id)
    } else {
      sfx.wrong()
    }
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onFermer} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="truncate text-lg font-extrabold">{recit.titre}</h2>
      </div>

      <div ref={hautRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="relative mt-2 overflow-hidden rounded-2xl border border-line">
          <img src={LAND_BY_ID[recit.land]} alt="" className="h-28 w-full object-cover" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
            {recit.epoque}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          {recit.texte.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-line bg-sand px-3.5 py-3">
          <h3 className="text-[13.5px] font-extrabold">{recit.question.prompt}</h3>
          <div className="mt-2.5 flex flex-col gap-2">
            {recit.question.choices.map((c, i) => (
              <ExerciseChoice
                key={c}
                letter={LETTERS[i]}
                text={c}
                state={
                  !repondu
                    ? choisi === c
                      ? 'selected'
                      : 'idle'
                    : c === recit.question.answer
                      ? 'correct'
                      : c === choisi
                        ? 'wrong'
                        : 'dim'
                }
                disabled={juste}
                onClick={() => {
                  setChoisi(c)
                  setRepondu(false)
                  sfx.click()
                }}
              />
            ))}
          </div>

          {repondu && !juste && (
            <p className="animate-rise mt-2.5 text-center text-[11.5px] font-bold text-coral-dark">
              Pas tout à fait — la réponse est dans le texte, relis-le.
            </p>
          )}
          {juste && (
            <p className="animate-rise mt-2.5 text-center text-[12px] font-extrabold text-turquoise-deep">
              {deja ? 'C’est ça.' : `C’est ça ! +${XP_RECIT} XP`}
            </p>
          )}

          <button
            type="button"
            onClick={juste ? onFermer : valider}
            disabled={choisi === null}
            className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:bg-sand-2 disabled:text-ink-soft disabled:shadow-none"
          >
            {juste ? 'Revenir à la frise' : 'Vérifier'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * L'histoire des Amazighs — dix récits, de l'art rupestre du Tassili à
 * Yennayer jour férié.
 *
 * Cette histoire appartient à toutes les variétés : elle est donc rangée hors
 * des cours, accessible dès le premier jour, sans dépendre du niveau de langue
 * atteint (voir l'en-tête de data/history.js).
 */
export function HistoryScreen({ progress, onSave, onBack }) {
  const [ouvert, setOuvert] = useState(null)
  // Deux onglets : la frise des récits, et la galerie des personnages —
  // qui renvoie aux récits (une porte d'entrée, pas un doublon).
  const [onglet, setOnglet] = useState('recits')
  const [deplie, setDeplie] = useState(null)
  const lus = recitsLus(progress)

  if (ouvert) {
    return (
      <Recit
        recit={ouvert.recit}
        // Figé à l'ouverture, et non recalculé : sinon la sauvegarde rend
        // aussitôt le récit « déjà lu » et le « +10 XP » disparaît avant
        // d'avoir été vu.
        deja={ouvert.deja}
        onFini={(id) => onSave(recordRecit(progress, id, { xpGain: XP_RECIT }))}
        onFermer={() => setOuvert(null)}
      />
    )
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">L’histoire des Amazighs</h2>
      </div>

      {/* Les onglets : Récits | Personnages. */}
      <div className="flex gap-2 px-4 pt-2">
        {[
          { id: 'recits', label: `Récits (${RECITS.length})` },
          { id: 'personnages', label: `Personnages (${PERSONNAGES.length})` },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              sfx.click()
              setOnglet(o.id)
            }}
            className={`flex-1 rounded-xl border-2 py-2 text-[12px] font-extrabold transition ${
              onglet === o.id
                ? 'border-turquoise bg-turquoise/10 text-turquoise-deep'
                : 'border-line bg-cream text-ink-soft'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {onglet === 'personnages' ? (
          <>
            <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
              <Akermus height={60} state="curious" className="flex-none" />
              <p className="text-[11.5px] leading-snug text-ink">
                De Chachnaq le pharaon à Idir — les grandes figures, du plus ancien au plus récent.
                <span className="mt-1 block text-ink-soft">
                  Touche une figure pour la découvrir, puis lis son récit complet.
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {PERSONNAGES.map((p) => {
                const ouvert2 = deplie === p.id
                const recit = p.recit ? recitParId(p.recit) : null
                return (
                  <div
                    key={p.id}
                    className={`overflow-hidden rounded-2xl border-2 transition ${
                      ouvert2 ? 'border-turquoise bg-white' : 'border-line bg-cream'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sfx.click()
                        setDeplie(ouvert2 ? null : p.id)
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
                    >
                      {/* L'emblème, jamais un portrait (règle maison). */}
                      <span className="relative flex-none">
                        <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-line bg-sand text-[16px]">
                          {p.embleme}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-1.5">
                          <span className="truncate text-[13px] font-extrabold">{p.nom}</span>
                          <span className="flex-none text-[9.5px] font-bold tabular-nums text-ink-soft">
                            {p.dates}
                          </span>
                        </span>
                        <span className="block truncate text-[10.5px] text-ink-soft">{p.role}</span>
                      </span>
                      <span className="flex-none text-ink-soft">{ouvert2 ? '▾' : '▸'}</span>
                    </button>

                    {ouvert2 && (
                      <div className="animate-rise px-3 pb-3">
                        <p className="text-[12px] leading-snug text-ink">{p.bio}</p>
                        {recit && (
                          <button
                            type="button"
                            onClick={() => {
                              sfx.click()
                              setOuvert({ recit, deja: recitLu(progress, recit.id) })
                            }}
                            className="mt-2 w-full rounded-xl bg-turquoise py-2 text-[12px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
                          >
                            Lire son récit → {recit.titre}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
              Pas de portraits — les figures se racontent, elles ne se dessinent pas.
            </p>
          </>
        ) : (
          <>
        <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
          <Akermus height={60} state="curious" className="flex-none" />
          <p className="text-[11.5px] leading-snug text-ink">
            De l’art rupestre du Sahara aux Berbères d’aujourd’hui. {RECITS.length} récits courts,
            à lire dans l’ordre ou pas.
            <span className="mt-1 block text-ink-soft">
              Là où les historiens ne sont pas d’accord, c’est dit — on ne tranche pas à leur place.
            </span>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-2">
            <div
              className="h-full rounded-full bg-turquoise transition-all duration-700"
              style={{ width: `${Math.round((lus / RECITS.length) * 100)}%` }}
            />
          </div>
          <span className="flex-none text-[11px] font-extrabold tabular-nums text-ink-soft">
            {lus} / {RECITS.length}
          </span>
        </div>

        {/* La frise */}
        <div className="relative mt-4">
          {/* Le fil qui relie les époques : il court derrière les pastilles. */}
          <span className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-line" aria-hidden="true" />
          <div className="flex flex-col gap-2.5">
            {RECITS.map((r) => {
              const fait = recitLu(progress, r.id)
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    sfx.click()
                    setOuvert({ recit: r, deja: fait })
                  }}
                  className="relative flex items-center gap-3 text-left"
                >
                  <span
                    className={`z-10 grid h-8 w-8 flex-none place-items-center rounded-full border-2 text-[12px] font-extrabold ${
                      fait
                        ? 'border-turquoise bg-turquoise text-white'
                        : 'border-line bg-cream text-ink-soft'
                    }`}
                  >
                    {fait ? '✓' : ''}
                  </span>
                  <span
                    className={`min-w-0 flex-1 overflow-hidden rounded-2xl border ${
                      fait ? 'border-turquoise/40 bg-turquoise/5' : 'border-line bg-cream'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 px-3 py-2">
                      <img
                        src={LAND_BY_ID[r.land]}
                        alt=""
                        className={`h-10 w-14 flex-none rounded-lg object-cover ${fait ? '' : 'opacity-80'}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">
                          {r.epoque}
                        </span>
                        <span className="block truncate text-[13px] font-extrabold">{r.titre}</span>
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Chaque date a été vérifiée avant d’être écrite. Une seule a été volontairement omise :
          le bilan humain de 1980, sur lequel les sources se contredisent.
        </p>
          </>
        )}
      </div>
    </div>
  )
}
