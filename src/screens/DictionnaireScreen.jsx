import { useMemo, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { chercher, cousins, synonymes, entree, STATS, VEDETTES, ORIGINES } from '../data/dictionnaire.js'
import { SOURCES } from '../data/emprunts.js'
import { versLatin } from '../lib/translit.js'
import { entreeDicoOuverte } from '../lib/abonnement.js'
import { playWord } from '../lib/audio.js'
import { hasVoice } from '../lib/speakerVoice.js'
import { sfx } from '../lib/sfx.js'

/**
 * LE DICTIONNAIRE — les cinq cours d'un seul coup d'œil.
 *
 * Ce que cet écran apporte et qu'aucune leçon ne peut donner : la vue en
 * travers. Chercher « eau » et voir « aman » identique du Rif au Souss ;
 * chercher « maison » et voir axxam, tigmmi, taddart se partager le
 * territoire ; chercher « travail » et voir l'emprunt et le mot du fonds
 * côte à côte. C'est la carte de la langue, pas une liste de mots.
 *
 * TROIS RÈGLES D'ÉCRAN :
 *
 *   1. LA RECHERCHE N'EST JAMAIS VERROUILLÉE. Même sans abonnement, on voit
 *      le mot, sa langue et son sens. C'est la fiche complète qui est
 *      payante (voir entreeDicoOuverte). Un dictionnaire qui cacherait
 *      jusqu'à l'existence des mots ne servirait à personne.
 *   2. PAS DE SON INVENTÉ. Le bouton d'écoute n'apparaît que pour le kabyle
 *      (le seul cours enregistré) ou lorsqu'un locuteur a contribué sa voix.
 *      Ailleurs, le silence — la règle de toute l'app.
 *   3. CE QU'ON NE SAIT PAS NE S'AFFICHE PAS. Pas d'étymologie devinée, et
 *      la mention « discuté » quand les sources ne s'accordent pas.
 */

const TEINTES = {
  turquoise: 'bg-turquoise/15 text-turquoise-deep',
  cobalt: 'bg-cobalt-vif/15 text-cobalt',
  gold: 'bg-enamel-yellow/20 text-gold-deep',
  coral: 'bg-coral/15 text-coral-dark',
  silver: 'bg-sand-2 text-ink-soft',
}

/**
 * Le badge d'origine. Sans étymologie écrite, il ne disparaît pas : il dit
 * que la case est vide. Une pastille absente laisserait croire que la
 * question ne se pose pas ; « à préciser » dit la vérité — personne ne l'a
 * encore écrite.
 */
function Origine({ etymologie }) {
  const o = etymologie && ORIGINES[etymologie.origine]
  if (!o) {
    return (
      <span className="rounded-full bg-sand-2 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">
        Origine à préciser
      </span>
    )
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide ${TEINTES[o.couleur]}`}>
      {o.label}
      {etymologie.discute && ' · discuté'}
    </span>
  )
}

/** Ce qu'on affiche tant que l'étymologie n'a pas été écrite ni validée. */
function OrigineAVenir() {
  return (
    <p className="text-[12.5px] italic leading-relaxed text-ink-soft">
      L’origine de ce mot n’est pas encore écrite. Elle sera ajoutée après validation par un locuteur
      ou un linguiste, bi-idniLlah.
    </p>
  )
}

/** Une ligne de résultat — verrouillée ou non, elle dit toujours le sens. */
function Resultat({ e, ouverte, onOuvrir }) {
  return (
    <button
      type="button"
      onClick={() => onOuvrir(e)}
      className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-cream px-3 py-2.5 text-left transition active:translate-y-[1px]"
    >
      <div className="min-w-0 flex-1">
        <div className={`truncate text-[15px] font-extrabold ${e.tifinagh ? 'tifinagh' : ''}`}>{e.mot}</div>
        <div className="truncate text-[11.5px] text-ink-soft">{e.sens.join(' · ') || '—'}</div>
      </div>
      <span className="flex-none rounded-full bg-sand-2 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-soft">
        {e.lang}
      </span>
      {!ouverte && (
        <span className="flex-none text-ink-soft" aria-label="Fiche réservée aux abonnés">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <rect x="4" y="10.5" width="16" height="10" rx="2.4" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
      )}
    </button>
  )
}

function Bloc({ titre, children }) {
  return (
    <div className="mt-3.5">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-turquoise-deep">{titre}</div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/** La fiche complète — ce que l'abonnement ouvre. */
function Fiche({ e, onMot }) {
  const [mode, setMode] = useState(null)
  const cous = cousins(e)
  const syn = synonymes(e)
  // Silence par défaut : seul le kabyle est enregistré, et une contribution
  // de locuteur rend audible n'importe quelle langue (voir lib/audio.js).
  const sonore = e.audio && (e.lang === 'kab' || hasVoice(e.lang, e.mot))

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className={`text-[24px] font-extrabold leading-tight tracking-tight ${e.tifinagh ? 'tifinagh' : ''}`}>
            {e.mot}
          </h2>
          {e.tifinagh && <div className="text-[12px] font-bold text-ink-soft">{versLatin(e.mot)}</div>}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-sand-2 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-ink-soft">
              {e.langue}
            </span>
            <Origine etymologie={e.etymologie} />
          </div>
        </div>
        {sonore && (
          <button
            type="button"
            onClick={() => playWord(e.mot, e.lang).then(setMode)}
            aria-label="Écouter la prononciation"
            className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-turquoise-dark text-white transition-transform active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M4 9v6h4l5 5V4L8 9H4z" />
              <path d="M16 8c1.5 1.2 1.5 6.8 0 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {mode === 'tts' || mode === 'synth' ? (
        <div className="mt-1 text-[10.5px] font-semibold text-ink-soft">voix provisoire — enregistrement natif à venir</div>
      ) : null}

      <Bloc titre="Sens">
        <ul className="flex flex-col gap-0.5">
          {(e.sens.length ? e.sens : ['—']).map((s) => (
            <li key={s} className="text-[14px] font-bold">
              {s}
            </li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre={e.etymologie?.racine ? `Origine · racine ${e.etymologie.racine}` : 'Origine'}>
        {e.etymologie?.note ? (
          <p className="text-[12.5px] leading-relaxed text-ink">{e.etymologie.note}</p>
        ) : (
          <OrigineAVenir />
        )}
        {e.etymologie?.discute && (
          <p className="mt-1 text-[11px] italic leading-snug text-ink-soft">
            Les sources ne s’accordent pas sur ce point — à valider.
          </p>
        )}
      </Bloc>

      {e.emprunt && (
        <Bloc titre={(SOURCES[e.emprunt.origine] || SOURCES.arabe).badge}>
          <p className="text-[12.5px] leading-relaxed text-ink">
            <b>Les deux sont justes.</b> {(SOURCES[e.emprunt.origine] || SOURCES.arabe).phrase}
          </p>
          {e.emprunt.classique && (
            <p className="mt-1 text-[12.5px] text-ink">
              Mot amazigh plus classique : <b>{e.emprunt.classique}</b>
              {e.emprunt.sensClassique ? ` — ${e.emprunt.sensClassique}` : ''}
            </p>
          )}
        </Bloc>
      )}

      {syn.length > 0 && (
        <Bloc titre={`Dans la même langue (${syn.length})`}>
          <div className="flex flex-wrap gap-1.5">
            {syn.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onMot(s)}
                className={`rounded-lg border border-line bg-sand px-2.5 py-1 text-[12.5px] font-extrabold ${s.tifinagh ? 'tifinagh' : ''}`}
              >
                {s.mot}
              </button>
            ))}
          </div>
        </Bloc>
      )}

      {cous.length > 0 && (
        <Bloc titre="Dans les autres langues amazighes">
          <div className="flex flex-col gap-1.5">
            {cous.map((c) => (
              <div key={c.lang} className="flex items-start gap-2">
                <span className="mt-1 w-[104px] flex-none text-[10.5px] font-extrabold uppercase tracking-wide text-ink-soft">
                  {c.nom}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.mots.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onMot(m)}
                      className={`rounded-lg border border-line bg-cream px-2.5 py-1 text-[12.5px] font-extrabold ${m.tifinagh ? 'tifinagh' : ''}`}
                    >
                      {m.mot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Bloc>
      )}

      {e.etymologie?.voir && (
        <Bloc titre="À rapprocher de">
          <span className="text-[13px] font-extrabold">{e.etymologie.voir}</span>
        </Bloc>
      )}

      <Bloc titre="Où on l’apprend">
        <p className="text-[12.5px] text-ink">
          {e.unite} — {e.uniteTitre}
          <span className="text-ink-soft"> · leçons {e.lecons.join(', ')}</span>
        </p>
      </Bloc>
    </>
  )
}

/** Le mur : ce que l'abonnement ouvre, dit sans pression ni compte à rebours. */
function Verrou({ e, onAbonnement }) {
  return (
    <>
      <h2 className={`text-[24px] font-extrabold leading-tight tracking-tight ${e.tifinagh ? 'tifinagh' : ''}`}>
        {e.mot}
      </h2>
      <div className="text-[13px] font-bold text-ink-soft">{e.sens.join(' · ') || '—'}</div>
      <div className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">{e.langue}</div>

      <div className="mt-4 rounded-2xl border-2 border-line bg-sand p-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex-none text-turquoise-deep">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <rect x="4" y="10.5" width="16" height="10" rx="2.4" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <div>
            <h3 className="text-[14px] font-extrabold">La fiche complète est dans l’abonnement</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
              L’origine du mot, sa racine, ses synonymes, et surtout ce qu’il devient dans les quatre
              autres langues amazighes.
            </p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
              Les mots de la première unité de chaque cours restent ouverts pour toujours — ceux que
              tu as appris gratuitement, tu peux toujours les chercher.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={onAbonnement}>Voir l’abonnement</Button>
        </div>
      </div>
    </>
  )
}

export function DictionnaireScreen({ abonnement, onAbonnement, onBack }) {
  const [q, setQ] = useState('')
  const [filtre, setFiltre] = useState('') // '' = toutes les langues
  const [selectionId, setSelectionId] = useState(null)

  const resultats = useMemo(() => chercher(q, { lang: filtre || undefined }), [q, filtre])
  const selection = selectionId ? entree(selectionId) : null
  const total = STATS.reduce((n, s) => n + s.total, 0)

  function ouvrir(e) {
    sfx.click()
    setSelectionId(e.id)
  }

  if (selection) {
    const ouverte = entreeDicoOuverte(selection, abonnement)
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
        <div className="flex items-center gap-2 px-4 pt-8 pb-2">
          <button
            type="button"
            onClick={() => setSelectionId(null)}
            aria-label="Revenir à la recherche"
            className="text-[17px] font-extrabold text-ink-soft"
          >
            ←
          </button>
          <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink-soft">Dictionnaire</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          {ouverte ? (
            <Fiche e={selection} onMot={ouvrir} />
          ) : (
            <Verrou e={selection} onAbonnement={onAbonnement} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-2 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-[17px] font-extrabold text-ink-soft">
          ←
        </button>
        <h1 className="text-[17px] font-extrabold tracking-tight">Dictionnaire</h1>
        <span className="ml-auto text-[11px] font-bold tabular-nums text-ink-soft">{total} mots</span>
      </div>

      <div className="px-4 pt-2">
        <input
          type="search"
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Un mot amazigh, ou un mot français…"
          aria-label="Chercher un mot"
          className="w-full rounded-xl border-2 border-line bg-sand px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-turquoise"
        />
        <p className="mt-1 text-[10.5px] leading-snug text-ink-soft">
          Le tifinagh se cherche aussi en lettres latines — tape « azul » pour trouver ⴰⵣⵓⵍ.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 pt-2.5 pb-1">
        {[{ lang: '', nom: 'Toutes' }, ...STATS].map((s) => (
          <button
            key={s.lang || 'all'}
            type="button"
            onClick={() => setFiltre(s.lang)}
            className={`flex-none rounded-full px-3 py-1.5 text-[11.5px] font-extrabold transition ${
              filtre === s.lang ? 'bg-turquoise text-white' : 'border border-line bg-cream text-ink-soft'
            }`}
          >
            {s.nom}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-1.5 pb-6">
        {!q && !filtre && (
          <div className="mb-3 rounded-2xl border border-line bg-sand p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex-none" aria-hidden="true">
                <Akermus height={52} state="curious" />
              </div>
              <p className="text-[12px] leading-relaxed text-ink-soft">
                Cherche un mot et vois ce qu’il devient d’une langue à l’autre. Certains ne bougent pas
                du Rif au Souss — d’autres changent à chaque massif.
              </p>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {VEDETTES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => ouvrir(v)}
                  className="rounded-lg border border-line bg-cream px-2.5 py-1 text-[12.5px] font-extrabold"
                >
                  {v.mot}
                </button>
              ))}
            </div>
          </div>
        )}

        {resultats.length === 0 ? (
          <p className="mt-6 text-center text-[12.5px] text-ink-soft">
            Rien pour « {q} ».
            <br />
            Le dictionnaire ne contient que les mots enseignés dans l’app — il grandit avec les cours.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {resultats.map((e) => (
              <Resultat key={e.id} e={e} ouverte={entreeDicoOuverte(e, abonnement)} onOuvrir={ouvrir} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
