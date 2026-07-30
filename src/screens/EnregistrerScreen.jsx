import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { canRecord, startRecording } from '../lib/speakerVoice.js'
import { repondreDemande, declinerDemande } from '../lib/distance.js'
import { sfx } from '../lib/sfx.js'

/**
 * Répondre à une demande d'enregistrement — l'écran du LOCUTEUR.
 *
 * Un proche a demandé « ce mot, avec ta voix ». Ici on enregistre (même
 * plomberie micro que les contributions locales : négociation du format,
 * tampon anti-iOS), on se réécoute, on recommence si on veut, on envoie.
 *
 * Aucune notation, aucun juge : la voix part telle qu'elle est. C'est
 * exactement ce que l'autre attend — la voix de SA famille, pas une norme.
 */
export function EnregistrerScreen({ demande, onDone, onBack }) {
  const [etat, setEtat] = useState('pret') // pret | enregistre | ecoute | envoi | envoye | erreur
  const [blob, setBlob] = useState(null)
  const recRef = useRef(null)
  const audioRef = useRef(null)
  const urlRef = useRef(null)

  useEffect(
    () => () => {
      recRef.current?.cancel?.()
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  async function demarrer() {
    sfx.click()
    try {
      recRef.current = await startRecording()
      setEtat('enregistre')
    } catch {
      setEtat('erreur')
    }
  }

  async function arreter() {
    sfx.click()
    const b = await recRef.current.stop()
    recRef.current = null
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = URL.createObjectURL(b)
    setBlob(b)
    setEtat('pret')
  }

  function reecouter() {
    sfx.click()
    if (!urlRef.current) return
    if (!audioRef.current || audioRef.current.src !== urlRef.current) {
      audioRef.current = new Audio(urlRef.current)
    }
    setEtat('ecoute')
    audioRef.current.onended = () => setEtat('pret')
    audioRef.current.play().catch(() => setEtat('pret'))
  }

  async function envoyer() {
    if (!blob) return
    sfx.click()
    setEtat('envoi')
    const res = await repondreDemande(demande.id, blob)
    if (res === 'ok') {
      sfx.correct()
      setEtat('envoye')
      setTimeout(onDone, 1800)
    } else {
      setEtat('erreur')
    }
  }

  async function passer() {
    sfx.click()
    await declinerDemande(demande.id)
    onDone()
  }

  const enCours = etat === 'enregistre'

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-8 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(16,196,168,0.15),var(--color-cream)_62%)]">
      <div className="mb-1 flex w-full items-center gap-3 text-left">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Ta voix pour {demande.de}</h2>
      </div>

      <Akermus height={96} state={etat === 'envoye' ? 'celebrate' : 'curious'} />

      <p className="mt-2 text-[12.5px] leading-snug text-ink-soft">
        {demande.de} aimerait entendre, avec ta voix :
      </p>
      <div className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-4">
        <div className="text-[22px] font-extrabold leading-tight">« {demande.texte} »</div>
        {demande.sens && <div className="mt-1 text-[12px] text-ink-soft">{demande.sens}</div>}
      </div>

      {!canRecord() && (
        <p className="mt-3 w-full rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] leading-snug text-ink">
          Ce navigateur ne donne pas accès au micro — essaie depuis Chrome ou Safari.
        </p>
      )}

      {etat === 'erreur' && (
        <p className="mt-3 w-full rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] leading-snug text-ink">
          Ça n’a pas marché — vérifie que le micro est autorisé, puis réessaie.
        </p>
      )}

      {etat === 'envoye' && (
        <p className="animate-rise mt-3 w-full rounded-xl border border-turquoise/40 bg-turquoise/10 px-3 py-2 text-[12px] font-bold text-turquoise-deep">
          C’est parti ! Ta voix est en route vers {demande.de}. Tanemmirt ✨
        </p>
      )}

      <div className="min-h-4 flex-1" />

      {etat !== 'envoye' && (
        <div className="flex w-full flex-col gap-2">
          {/* Le bouton micro — gros, évident, un seul geste. */}
          <button
            type="button"
            onClick={enCours ? arreter : demarrer}
            disabled={!canRecord() || etat === 'envoi'}
            className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-[26px] text-white shadow-lg transition-transform active:scale-90 disabled:opacity-40 ${
              enCours ? 'animate-pulse bg-coral shadow-coral/40' : 'bg-turquoise shadow-turquoise/40'
            }`}
            aria-label={enCours ? 'Arrêter l’enregistrement' : 'Enregistrer'}
          >
            {enCours ? '◼' : '🎙'}
          </button>
          <p className="text-[10.5px] font-bold text-ink-soft">
            {enCours ? 'Je t’écoute… touche pour arrêter.' : blob ? 'Réécoute, ou recommence autant que tu veux.' : 'Touche, puis dis le mot.'}
          </p>

          {blob && !enCours && (
            <>
              <Button variant="neutral" onClick={reecouter} disabled={etat === 'ecoute' || etat === 'envoi'}>
                {etat === 'ecoute' ? 'Écoute…' : 'Réécouter'}
              </Button>
              <Button variant="primary" onClick={envoyer} disabled={etat === 'envoi'}>
                {etat === 'envoi' ? 'Envoi…' : `Envoyer à ${demande.de}`}
              </Button>
            </>
          )}

          <button type="button" onClick={passer} className="mt-1 text-[11px] font-bold text-ink-soft underline">
            Je ne peux pas cette fois
          </button>
        </div>
      )}
    </div>
  )
}
