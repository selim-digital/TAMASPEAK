import { useMemo, useState } from 'react'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { missionsPour } from '../data/missions.js'
import { addToLexique, removeFromLexique } from '../lib/progress.js'
import { sfx } from '../lib/sfx.js'

/**
 * Les missions — la partie de l'app qui se joue hors de l'app.
 *
 * L'apprenant va poser une question à quelqu'un qui parle la langue, puis
 * revient noter la réponse. Le mot entre dans son lexique avec le nom de qui
 * l'a dit : c'est le seul endroit où le parler d'une famille prime sur la
 * norme du cours.
 *
 * Aucune correction, aucune validation : on n'a pas les moyens de juger un
 * mot rapporté d'un village, et ce n'est pas souhaitable qu'on les ait.
 */
export function MissionScreen({ course, progress, profile, onSave, onBack }) {
  const faites = progress.missionsFaites || []
  const lexique = progress.lexique || []
  const proposees = useMemo(() => missionsPour(profile?.reason, faites), [profile?.reason, faites])

  const [ouverte, setOuverte] = useState(null) // mission dépliée
  const [mot, setMot] = useState('')
  const [sens, setSens] = useState('')
  const [de, setDe] = useState('')
  const [flash, setFlash] = useState(null)

  function ouvrir(m) {
    sfx.click()
    setOuverte(ouverte?.id === m.id ? null : m)
    setMot('')
    setSens('')
  }

  function noter() {
    if (!mot.trim()) return
    onSave(addToLexique(progress, { mot, sens, de, missionId: ouverte?.id }))
    sfx.correct()
    setFlash(`« ${mot.trim()} » est dans ton lexique.`)
    setTimeout(() => setFlash(null), 2600)
    setOuverte(null)
    setMot('')
    setSens('')
  }

  function effacer(entree) {
    onSave(removeFromLexique(progress, entree.mot))
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Missions</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
          <Akermus height={64} state="curious" className="flex-none" />
          <p className="text-[11.5px] leading-snug text-ink">
            Une mission se joue <strong>hors de l’app</strong> : tu vas poser une question à
            quelqu’un qui parle {course.name}, puis tu reviens noter sa réponse.
            <span className="mt-1 block text-ink-soft">
              Ce que tu rapportes n’est jamais corrigé. Chez toi on dit peut-être autrement que dans
              le cours — c’est ta version qui compte ici.
            </span>
          </p>
        </div>

        {flash && (
          <p className="animate-rise mt-3 rounded-xl border border-turquoise/40 bg-turquoise/10 px-3 py-2 text-center text-[11.5px] font-bold text-turquoise-deep">
            {flash}
          </p>
        )}

        <div className="mt-5 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          À faire {proposees.length > 0 && <span className="tabular-nums">({proposees.length})</span>}
        </div>

        {proposees.length === 0 ? (
          <p className="text-[12px] leading-snug text-ink-soft">
            Toutes les missions sont faites. Ton lexique est en dessous — continue à l’enrichir
            quand tu entends un mot que tu ne connaissais pas.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {proposees.map((m) => {
              const deplie = ouverte?.id === m.id
              return (
                <div
                  key={m.id}
                  className={`overflow-hidden rounded-2xl border-2 transition ${
                    deplie ? 'border-turquoise bg-white' : 'border-line bg-cream'
                  }`}
                >
                  <button type="button" onClick={() => ouvrir(m)} className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-extrabold">{m.titre}</span>
                      {!deplie && (
                        <span className="mt-0.5 block truncate text-[10.5px] text-ink-soft">{m.consigne}</span>
                      )}
                    </span>
                    <span className="flex-none text-ink-soft">{deplie ? '▾' : '▸'}</span>
                  </button>

                  {deplie && (
                    <div className="px-3.5 pb-3.5">
                      <p className="text-[12px] leading-snug text-ink">{m.consigne}</p>
                      <p className="mt-1.5 rounded-xl bg-sand px-2.5 py-2 text-[10.5px] leading-snug text-ink-soft">
                        {m.aide}
                        {m.exemple && (
                          <span className="mt-1 block">
                            Par exemple : <span className="font-extrabold text-ink">{m.exemple}</span>
                          </span>
                        )}
                      </p>

                      <div className="mt-3 flex flex-col gap-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft" htmlFor={`mot-${m.id}`}>
                          Ce que tu as entendu
                        </label>
                        <input
                          id={`mot-${m.id}`}
                          value={mot}
                          onChange={(e) => setMot(e.target.value.slice(0, 60))}
                          placeholder="Le mot ou la phrase, tel quel"
                          className="rounded-xl border-2 border-line bg-white px-3 py-2 text-[14px] font-bold outline-none focus:border-turquoise"
                        />
                        <input
                          value={sens}
                          onChange={(e) => setSens(e.target.value.slice(0, 60))}
                          placeholder="Ce que ça veut dire (facultatif)"
                          className="rounded-xl border-2 border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-turquoise"
                        />
                        <input
                          value={de}
                          onChange={(e) => setDe(e.target.value.slice(0, 24))}
                          placeholder="Qui te l’a dit ? (facultatif)"
                          className="rounded-xl border-2 border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-turquoise"
                        />
                        <button
                          type="button"
                          onClick={noter}
                          disabled={!mot.trim()}
                          className="rounded-xl bg-turquoise py-2.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:opacity-40 disabled:shadow-none"
                        >
                          Ajouter à mon lexique
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Le lexique personnel */}
        <div className="mt-7 mb-2 flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
            Mon lexique
          </span>
          <span className="text-[10px] font-extrabold tabular-nums text-ink-soft">{lexique.length}</span>
        </div>

        {lexique.length === 0 ? (
          <p className="text-[12px] leading-snug text-ink-soft">
            Vide pour l’instant. Le premier mot que tu rapporteras de chez toi sera ici.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {[...lexique].reverse().map((e) => (
              <div key={e.mot} className="flex items-center gap-2.5 rounded-2xl border border-line bg-cream px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-extrabold">{e.mot}</div>
                  <div className="truncate text-[10.5px] text-ink-soft">
                    {e.sens || 'sans traduction'}
                    {e.de && ` · dit par ${e.de}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => effacer(e)}
                  aria-label={`Retirer ${e.mot} du lexique`}
                  className="flex-none text-[16px] text-ink-soft"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Ce lexique t’appartient. Il reste sur ton téléphone et n’est jamais corrigé.
        </p>
      </div>
    </div>
  )
}
