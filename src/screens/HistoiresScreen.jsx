import { useEffect, useMemo, useRef, useState } from 'react'
import { ExerciseChoice } from '../components/ExerciseChoice.jsx'
import { TiticheEtTomatiche } from '../components/mascots/TiticheTomatiche.jsx'
import {
  HISTOIRES,
  NIVEAUX,
  composer,
  motsDe,
  uniteDe,
  histoireDebloquee,
  paragraphesOuverts,
  prochaineHistoire,
} from '../data/histoires.js'
import { XP_HISTOIRE } from '../data/economy.js'
import { histoireLue } from '../lib/progress.js'
import { sfx } from '../lib/sfx.js'

const LETTERS = ['A', 'B', 'C', 'D']

/** Un paragraphe composé : le français, et les mots amazighs en gras. */
function Paragraphe({ segments }) {
  return (
    <p className="text-[14px] leading-relaxed text-ink">
      {segments.map((s, i) =>
        s.mot ? (
          <span key={i}>
            <b className="font-extrabold text-turquoise-deep">{s.mot}</b>
            {s.premier && <span className="text-ink-soft"> ({s.glose})</span>}
          </span>
        ) : (
          <span key={i}>{s.texte}</span>
        ),
      )}
    </p>
  )
}

/**
 * La lecture d'une histoire.
 *
 * Trois états, décidés par l'appelant :
 *   • tout est ouvert  → le texte entier, la leçon, puis la question ;
 *   • le début seul    → les premiers paragraphes, puis l'invitation à
 *                        s'abonner, posée sur le fondu du paragraphe suivant ;
 *   • rien d'ouvert    → le titre, la valeur, et l'invitation.
 * Se tromper à la question ne coûte rien : on relit, on répond de nouveau.
 */
export function Histoire({ histoire, langId, ouverts, deja, onFini, onFermer, onAbonnement }) {
  const [choisi, setChoisi] = useState(null)
  const [repondu, setRepondu] = useState(false)
  const hautRef = useRef(null)
  const paragraphes = useMemo(() => composer(histoire, langId), [histoire, langId])
  const mots = useMemo(() => motsDe(histoire, langId), [histoire, langId])
  const entier = ouverts >= paragraphes.length
  const niveau = NIVEAUX[histoire.niveau]

  useEffect(() => {
    hautRef.current?.scrollTo?.({ top: 0 })
  }, [histoire.id])

  const juste = repondu && choisi === histoire.question.answer

  function valider() {
    if (choisi === null) return
    setRepondu(true)
    if (choisi === histoire.question.answer) {
      sfx.correct()
      if (!deja) onFini(histoire.id)
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
        <h2 className="truncate text-lg font-extrabold">{histoire.titre}</h2>
      </div>

      <div ref={hautRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="mt-2 flex items-end gap-3 rounded-2xl border border-line bg-sand px-3 pt-3">
          <TiticheEtTomatiche height={78} className="flex-none" />
          <div className="min-w-0 flex-1 pb-3">
            <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">
              {niveau.label} · {niveau.duree}
            </span>
            <span className="block text-[13px] font-extrabold text-turquoise-deep">{histoire.valeur}</span>
            {mots.length > 0 && (
              <span className="mt-0.5 block text-[10.5px] leading-snug text-ink-soft">
                {mots.length} {mots.length > 1 ? 'mots amazighs' : 'mot amazigh'} à reconnaître
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {paragraphes.slice(0, ouverts).map((p, i) => (
            <Paragraphe key={i} segments={p} />
          ))}
        </div>

        {!entier && (
          <div className="relative mt-3">
            {/* Le paragraphe suivant, qui s'efface : on voit que l'histoire continue. */}
            {ouverts > 0 && (
              <div
                className="pointer-events-none max-h-14 select-none overflow-hidden opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
                aria-hidden="true"
              >
                <Paragraphe segments={paragraphes[ouverts]} />
              </div>
            )}
            <div className="mt-2 rounded-2xl border-2 border-gold/50 bg-gold/10 px-3.5 py-3.5 text-center">
              <h3 className="text-[14px] font-extrabold">
                {ouverts > 0 ? 'La suite de l’histoire est réservée aux abonnés' : 'Cette histoire est réservée aux abonnés'}
              </h3>
              <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
                {ouverts > 0
                  ? 'Que vont faire Titiche et Tomatiche ? Abonne-toi pour lire la fin — et toutes les autres histoires.'
                  : 'Abonne-toi pour lire toutes les histoires de Titiche et Tomatiche.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  sfx.click()
                  onAbonnement?.()
                }}
                className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
              >
                Découvrir l’abonnement
              </button>
            </div>
          </div>
        )}

        {entier && (
          <>
            <p className="mt-5 rounded-2xl border border-turquoise/40 bg-turquoise/5 px-3.5 py-3 text-center text-[13px] font-extrabold leading-snug text-turquoise-deep">
              {histoire.lecon}
            </p>

            <div className="mt-4 rounded-2xl border-2 border-line bg-sand px-3.5 py-3">
              <h3 className="text-[13.5px] font-extrabold">{histoire.question.prompt}</h3>
              <div className="mt-2.5 flex flex-col gap-2">
                {histoire.question.choices.map((c, i) => (
                  <ExerciseChoice
                    key={c}
                    letter={LETTERS[i]}
                    text={c}
                    state={
                      !repondu
                        ? choisi === c
                          ? 'selected'
                          : 'idle'
                        : c === histoire.question.answer
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
                  Pas tout à fait — la réponse est dans l’histoire, relis-la.
                </p>
              )}
              {juste && (
                <p className="animate-rise mt-2.5 text-center text-[12px] font-extrabold text-turquoise-deep">
                  {deja ? 'C’est ça.' : `C’est ça ! +${XP_HISTOIRE} XP`}
                </p>
              )}

              <button
                type="button"
                onClick={juste ? onFermer : valider}
                disabled={choisi === null}
                className="mt-3 w-full rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:bg-sand-2 disabled:text-ink-soft disabled:shadow-none"
              >
                {juste ? 'Revenir aux histoires' : 'Vérifier'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * La liste des histoires — l'onglet « Histoires » de l'écran Histoire.
 *
 * Une histoire verrouillée reste VISIBLE, avec son titre et ce qu'il faut
 * terminer pour l'obtenir : c'est tout le principe du teaser. On ne cache
 * pas ce qu'on veut donner envie de gagner.
 */
export function HistoiresOnglet({ course, progress, suiteOuverte, onOuvrir }) {
  const lues = HISTOIRES.filter((h) => histoireLue(progress, h.id)).length
  const prochaine = prochaineHistoire(course, progress)

  return (
    <>
      <div className="mt-2 flex items-end gap-2.5 rounded-2xl border border-line bg-sand px-3 pt-3">
        <TiticheEtTomatiche height={66} className="flex-none" />
        <p className="pb-3 text-[11.5px] leading-snug text-ink">
          Titiche et sa sœur Tomatiche vivent au village. À chaque histoire, une leçon de vie — et
          des mots amazighs à reconnaître.
          <span className="mt-1 block text-ink-soft">
            À lire, ou à raconter à vos enfants. Chaque unité terminée en débloque une.
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-2">
          <div
            className="h-full rounded-full bg-turquoise transition-all duration-700"
            style={{ width: `${Math.round((lues / HISTOIRES.length) * 100)}%` }}
          />
        </div>
        <span className="flex-none text-[11px] font-extrabold tabular-nums text-ink-soft">
          {lues} / {HISTOIRES.length}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {HISTOIRES.map((h, i) => {
          const debloquee = histoireDebloquee(course, progress, h)
          const lue = histoireLue(progress, h.id)
          const ouverts = paragraphesOuverts(h, suiteOuverte)
          const entier = ouverts >= h.texte.length
          const unite = uniteDe(course, h)
          const niveau = NIVEAUX[h.niveau]
          const estProchaine = prochaine?.histoire.id === h.id
          return (
            <button
              key={h.id}
              type="button"
              disabled={!debloquee}
              onClick={() => {
                sfx.click()
                onOuvrir(h)
              }}
              className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition ${
                !debloquee
                  ? 'border-line bg-sand/60'
                  : lue
                    ? 'border-turquoise/40 bg-turquoise/5'
                    : 'border-line bg-cream active:scale-[.99]'
              }`}
            >
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-full border-2 text-[13px] font-extrabold ${
                  lue
                    ? 'border-turquoise bg-turquoise text-white'
                    : debloquee
                      ? 'border-turquoise text-turquoise-deep'
                      : 'border-line text-ink-soft'
                }`}
              >
                {lue ? '✓' : debloquee ? i + 1 : '🔒'}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[13px] font-extrabold ${debloquee ? '' : 'text-ink-soft'}`}>
                  {h.titre}
                </span>
                <span className="block truncate text-[10.5px] text-ink-soft">
                  {h.valeur} · {niveau.label} · {niveau.duree}
                </span>
                {!debloquee && unite && (
                  <span className="mt-0.5 block text-[10.5px] font-bold leading-snug text-coral-dark">
                    {estProchaine && prochaine.restantes > 0
                      ? `Plus que ${prochaine.restantes} leçon${prochaine.restantes > 1 ? 's' : ''} — termine « ${unite.title} »`
                      : `Termine « ${unite.title} » pour la débloquer`}
                  </span>
                )}
              </span>
              {debloquee && !entier && (
                <span className="flex-none rounded-full bg-gold/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-gold-deep">
                  {ouverts > 0 ? 'Début gratuit' : 'Abonnés'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
        Des histoires écrites pour Tama Speak. Les mots amazighs viennent de tes leçons ; ils
        restent à valider par des locuteurs natifs, comme le reste du contenu.
      </p>
    </>
  )
}
