import { useEffect, useMemo, useRef, useState } from 'react'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { sfx } from '../lib/sfx.js'
import { playWord } from '../lib/audio.js'
import { shareText } from '../lib/share.js'
import {
  canRecord,
  startRecording,
  saveVoice,
  deleteVoice,
  listVoices,
  voiceKey,
  voiceUrl,
  exportVoices,
  importVoices,
} from '../lib/speakerVoice.js'

const DUREE_MAX = 8000 // un mot, pas un discours

export function MicIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="9" y="2.5" width="6" height="11" rx="3" fill={color} />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Rond micro/stop — l'unique bouton d'action pendant l'enregistrement. */
function MicButton({ recording, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={recording ? 'Arrêter l’enregistrement' : 'Enregistrer'}
      className={`grid h-16 w-16 flex-none place-items-center rounded-full transition ${
        recording
          ? 'animate-pulse bg-coral shadow-[0_4px_0_var(--color-coral-dark)]'
          : 'bg-turquoise shadow-[0_4px_0_var(--color-turquoise-dark)]'
      } disabled:opacity-40`}
    >
      {recording ? <span className="block h-5 w-5 rounded-[4px] bg-white" /> : <MicIcon size={26} color="#fff" />}
    </button>
  )
}

/**
 * « Faire parler le cours » — un locuteur enregistre les mots, et la langue
 * cesse d'être muette. Quatre cours sur cinq n'ont aujourd'hui aucun son, et
 * la synthèse vocale amazighe disponible est sous licence non commerciale.
 *
 * Ce que cet écran n'est PAS, et ne doit jamais devenir :
 *  • il ne fabrique aucune voix. On enregistre un locuteur, on rejoue son
 *    fichier tel quel, attribué et effaçable. Aucune IA n'intervient.
 *  • il ne note personne. On enregistre quelqu'un qui sait parler la langue,
 *    pas quelqu'un qu'on évalue.
 *
 * Tout reste sur l'appareil. Quand le locuteur n'est pas celui qui apprend,
 * l'audio circule par un fichier que l'on s'envoie — le même chemin que la
 * note vocale WhatsApp dont viennent les 24 mp3 kabyles déjà dans l'app.
 */
export function ContributeVoiceScreen({ course, onBack }) {
  const vocab = useMemo(() => course.vocabulary(), [course])
  const [voices, setVoices] = useState(null) // Map clé → { speaker }
  const [speaker, setSpeaker] = useState('')
  const [actif, setActif] = useState(null) // mot en cours d'enregistrement
  const [apercu, setApercu] = useState(null) // { mot, blob, url }
  const [message, setMessage] = useState(null)
  const [ouvert, setOuvert] = useState(() => new Set(vocab.slice(0, 1).map((u) => u.id)))
  const ctrl = useRef(null)
  const minuteur = useRef(null)
  const fichier = useRef(null)

  const dispo = canRecord()

  useEffect(() => {
    listVoices()
      .then((all) => {
        const dansLaLangue = all.filter((v) => v.lang === course.id)
        setVoices(new Map(dansLaLangue.map((v) => [v.id, v])))
        const dernier = dansLaLangue[dansLaLangue.length - 1]
        if (dernier?.speaker) setSpeaker(dernier.speaker)
      })
      .catch(() => setVoices(new Map()))
  }, [course.id])

  // Un enregistrement en cours ne doit pas survivre à la sortie de l'écran.
  useEffect(
    () => () => {
      clearTimeout(minuteur.current)
      ctrl.current?.cancel()
    },
    [],
  )

  const total = vocab.reduce((n, u) => n + u.mots.length, 0)
  const faits = voices?.size ?? 0

  function flash(texte) {
    setMessage(texte)
    setTimeout(() => setMessage(null), 3200)
  }

  async function commencer(mot) {
    setApercu(null)
    try {
      ctrl.current = await startRecording()
      setActif(mot)
      sfx.click()
      minuteur.current = setTimeout(() => arreter(mot), DUREE_MAX)
    } catch {
      flash('Le micro n’est pas accessible. Autorise-le dans les réglages de ton navigateur.')
    }
  }

  async function arreter(mot) {
    clearTimeout(minuteur.current)
    const c = ctrl.current
    ctrl.current = null
    setActif(null)
    if (!c) return
    const blob = await c.stop()
    if (!blob?.size) {
      flash('Rien n’a été enregistré — réessaie.')
      return
    }
    setApercu({ mot, blob, url: URL.createObjectURL(blob) })
    sfx.pop(0.3)
  }

  function ecouterApercu() {
    if (apercu) new Audio(apercu.url).play().catch(() => {})
  }

  async function garder() {
    if (!apercu) return
    await saveVoice({ lang: course.id, word: apercu.mot.mot, blob: apercu.blob, speaker: speaker.trim() })
    const id = voiceKey(course.id, apercu.mot.mot)
    setVoices((m) => new Map(m).set(id, { id, speaker: speaker.trim() }))
    URL.revokeObjectURL(apercu.url)
    setApercu(null)
    sfx.correct()
  }

  function jeter() {
    if (apercu) URL.revokeObjectURL(apercu.url)
    setApercu(null)
  }

  async function effacer(mot) {
    await deleteVoice(course.id, mot.mot)
    setVoices((m) => {
      const n = new Map(m)
      n.delete(voiceKey(course.id, mot.mot))
      return n
    })
  }

  async function ecouter(mot) {
    const url = await voiceUrl(course.id, mot.mot)
    if (url) new Audio(url).play().catch(() => {})
    else playWord(mot.mot, course.id)
  }

  /** Le locuteur récupère un fichier et l'envoie à qui apprend. */
  async function envoyer() {
    const paquet = await exportVoices(course.id)
    if (!paquet) return flash('Enregistre au moins un mot avant d’envoyer.')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(paquet.blob)
    a.download = paquet.name
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 10000)
    const s = paquet.count > 1 ? 's' : ''
    flash(`${paquet.count} mot${s} enregistré${s} — envoie le fichier par message.`)
  }

  async function importer(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try {
      const { ajoutes } = await importVoices(f)
      const all = (await listVoices()).filter((v) => v.lang === course.id)
      setVoices(new Map(all.map((v) => [v.id, v])))
      flash(`${ajoutes} enregistrement${ajoutes > 1 ? 's' : ''} ajouté${ajoutes > 1 ? 's' : ''}.`)
      sfx.complete()
    } catch {
      flash('Ce fichier n’a pas pu être lu.')
    }
  }

  /** Invite un locuteur à contribuer — le lien ouvre simplement l'app. */
  async function inviter() {
    const res = await shareText(
      `Tu parles ${course.name} ? Aide-moi : enregistre-moi quelques mots dans Tama Speak, ça prend 5 minutes.\n${location.origin}`,
    )
    if (res === 'copied') flash('Message copié — colle-le dans ta conversation.')
    else if (res === 'failed') flash('Partage indisponible sur cet appareil.')
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Faire parler le cours</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
          <Akermus height={64} state="curious" className="flex-none" />
          <p className="text-[11.5px] leading-snug text-ink">
            Si tu parles {course.name} — ou si tu connais quelqu’un qui le parle —{' '}
            <strong>enregistre les mots</strong> et ils s’ajouteront aux leçons.
            <span className="mt-1 block text-ink-soft">
              Aucune voix n’est fabriquée : on rejoue l’enregistrement tel quel, avec le nom de qui
              l’a dit, et tu peux l’effacer quand tu veux. Tout reste sur cet appareil.
            </span>
          </p>
        </div>

        {!dispo && (
          <p className="mt-3 rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11.5px] leading-snug">
            Ce navigateur ne sait pas enregistrer le micro. Essaie depuis Safari (iPhone) ou Chrome.
          </p>
        )}
        {message && (
          <p className="animate-rise mt-3 rounded-xl border border-turquoise/40 bg-turquoise/10 px-3 py-2 text-[11.5px] leading-snug">
            {message}
          </p>
        )}

        <div className="mt-3">
          <label htmlFor="qui" className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
            Qui enregistre ?
          </label>
          <input
            id="qui"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value.slice(0, 24))}
            placeholder="Le prénom du locuteur"
            className="mt-0.5 w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-[13.5px] font-bold outline-none focus:border-turquoise"
          />
          <p className="mt-1 text-[10px] leading-snug text-ink-soft">
            Le nom apparaît à côté de chaque mot : on sait toujours qui a prêté sa voix.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-2">
            <div
              className="h-full rounded-full bg-turquoise transition-all duration-700"
              style={{ width: `${total ? Math.round((faits / total) * 100) : 0}%` }}
            />
          </div>
          <span className="flex-none text-[11px] font-extrabold tabular-nums text-ink-soft">
            {faits} / {total}
          </span>
        </div>

        {apercu && (
          <div className="animate-rise mt-4 rounded-2xl border-2 border-turquoise bg-white px-3 py-3">
            <div className="text-[13px] font-extrabold">« {apercu.mot.mot} »</div>
            <div className="mt-0.5 text-[11px] text-ink-soft">Écoute avant de garder.</div>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={ecouterApercu}
                className="flex-1 rounded-xl border-2 border-line bg-cream py-2 text-[12px] font-extrabold"
              >
                ▶ Réécouter
              </button>
              <button
                type="button"
                onClick={jeter}
                className="flex-1 rounded-xl border-2 border-line bg-cream py-2 text-[12px] font-extrabold text-ink-soft"
              >
                Refaire
              </button>
              <button
                type="button"
                onClick={garder}
                className="flex-1 rounded-xl bg-turquoise py-2 text-[12px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
              >
                Garder
              </button>
            </div>
          </div>
        )}

        {vocab.map((unite) => {
          const deplie = ouvert.has(unite.id)
          const n = unite.mots.filter((m) => voices?.has(voiceKey(course.id, m.mot))).length
          return (
            <div key={unite.id} className="mt-4">
              <button
                type="button"
                onClick={() =>
                  setOuvert((s) => {
                    const suivant = new Set(s)
                    if (suivant.has(unite.id)) suivant.delete(unite.id)
                    else suivant.add(unite.id)
                    return suivant
                  })
                }
                className="flex w-full items-center gap-2 text-left"
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                  {unite.label}
                </span>
                <span className="text-[10px] font-extrabold tabular-nums text-ink-soft">
                  {n}/{unite.mots.length}
                </span>
                <span className="ml-auto text-ink-soft">{deplie ? '▾' : '▸'}</span>
              </button>

              {deplie && (
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {unite.mots.map((mot) => {
                    const enreg = voices?.get(voiceKey(course.id, mot.mot))
                    const enCours = actif?.mot === mot.mot
                    return (
                      <div
                        key={mot.mot}
                        className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2 ${
                          enreg ? 'border-turquoise/40 bg-turquoise/5' : 'border-line bg-cream'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-extrabold">{mot.mot}</div>
                          <div className="truncate text-[10.5px] text-ink-soft">
                            {enreg ? `Enregistré par ${enreg.speaker || 'un locuteur'}` : mot.sens}
                          </div>
                        </div>

                        {enreg && (
                          <>
                            <button
                              type="button"
                              onClick={() => ecouter(mot)}
                              aria-label={`Écouter ${mot.mot}`}
                              className="grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-turquoise/40 text-turquoise-deep"
                            >
                              ▶
                            </button>
                            <button
                              type="button"
                              onClick={() => effacer(mot)}
                              aria-label={`Effacer l’enregistrement de ${mot.mot}`}
                              className="flex-none text-[16px] text-ink-soft"
                            >
                              ×
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          disabled={!dispo || (actif && !enCours)}
                          onClick={() => (enCours ? arreter(mot) : commencer(mot))}
                          aria-label={enCours ? 'Arrêter' : `Enregistrer ${mot.mot}`}
                          className={`grid h-9 w-9 flex-none place-items-center rounded-full transition disabled:opacity-30 ${
                            enCours ? 'animate-pulse bg-coral text-white' : 'bg-sand-2 text-ink-soft'
                          }`}
                        >
                          {enCours ? <span className="block h-3 w-3 rounded-[3px] bg-white" /> : <MicIcon />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Le locuteur n'est pas toujours celui qui apprend : sans serveur,
            l'audio circule par un fichier qu'on s'envoie. */}
        <div className="mt-6 rounded-2xl border border-line bg-sand px-3 py-3">
          <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
            Tu ne parles pas la langue ?
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            Demande à quelqu’un qui la parle d’enregistrer depuis son téléphone, puis de t’envoyer
            son fichier — tu l’importes ici.
          </p>
          <div className="mt-2.5 flex flex-col gap-2">
            <button
              type="button"
              onClick={inviter}
              className="rounded-xl bg-turquoise px-3 py-2 text-[12px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)]"
            >
              Inviter un locuteur
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={envoyer}
                className="flex-1 rounded-xl border-2 border-line bg-cream px-3 py-2 text-[12px] font-extrabold"
              >
                Envoyer mes enregistrements
              </button>
              <button
                type="button"
                onClick={() => fichier.current?.click()}
                className="flex-1 rounded-xl border-2 border-line bg-cream px-3 py-2 text-[12px] font-extrabold"
              >
                Importer un fichier reçu
              </button>
            </div>
          </div>
          <input ref={fichier} type="file" accept=".json,application/json" onChange={importer} className="hidden" />
        </div>

        {/* Pendant l'enregistrement, la cible ne doit pas être un rond de
            36 px qu'on cherche du doigt. */}
        {actif && (
          <div className="animate-rise sticky bottom-2 mt-4 flex items-center gap-3 rounded-2xl border-2 border-coral bg-white px-3 py-3 shadow-lg">
            <MicButton recording onClick={() => arreter(actif)} />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-extrabold">« {actif.mot} »</div>
              <div className="text-[11px] text-ink-soft">Ça enregistre… appuie pour arrêter.</div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Personne n’est noté ici. On enregistre quelqu’un qui sait parler, pas quelqu’un qu’on corrige.
        </p>
      </div>
    </div>
  )
}
