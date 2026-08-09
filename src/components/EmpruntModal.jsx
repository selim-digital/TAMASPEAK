import { useEffect } from 'react'
import { Button } from './Button.jsx'
import { YazMark } from './Logo.jsx'
import { SOURCES } from '../data/emprunts.js'

/**
 * « Ce mot vient d'ailleurs » — la modale qui s'ouvre après une bonne
 * réponse, sur les expressions empruntées (voir data/emprunts.js).
 *
 * LE TON EST LE FOND. Elle arrive juste après un succès : elle félicite
 * d'abord, elle raconte ensuite. Elle ne dit jamais « le vrai mot est… »,
 * jamais « attention » — l'élève vient de répondre juste, et l'emprunt qu'il
 * a appris est de l'amazigh tel qu'il se parle. Elle ajoute le mot du fonds
 * amazigh quand il en existe un, et s'arrête là où s'arrête ce qu'on sait :
 * pas de « mot classique » inventé pour faire joli.
 *
 * Elle est modale au sens strict (on ne peut pas répondre derrière) mais
 * jamais bloquante : Échap, le fond, la croix et le bouton la ferment tous.
 */
export function EmpruntModal({ emprunt, onClose }) {
  useEffect(() => {
    if (!emprunt) return undefined
    const auClavier = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', auClavier)
    return () => window.removeEventListener('keydown', auClavier)
  }, [emprunt, onClose])

  if (!emprunt) return null

  // L'arabe est le cas général, l'espagnol l'exception rifaine — mais la
  // phrase de fond change avec la provenance : « des siècles dans la culture
  // amazighe » ne décrit pas Melilla.
  const source = SOURCES[emprunt.origine] || SOURCES.arabe

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/45 px-3 pb-3 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="emprunt-titre"
        onClick={(e) => e.stopPropagation()}
        className="animate-rise max-h-[88%] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-3xl border-2 border-line bg-cream p-4 shadow-[0_18px_40px_-14px_rgba(30,37,48,.55)]"
      >
        <div className="flex items-start gap-2.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white">
            <YazMark size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <span
              id="emprunt-titre"
              className="block text-[10px] font-extrabold uppercase leading-tight tracking-[0.1em] text-turquoise-deep"
            >
              {source.badge}
            </span>
            <div className="mt-1 text-[17px] font-extrabold leading-tight">{emprunt.mot}</div>
            <div className="text-[12px] font-semibold text-ink-soft">{emprunt.sens}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-7 w-7 flex-none place-items-center rounded-full text-[15px] text-ink-soft"
          >
            ×
          </button>
        </div>

        {emprunt.classique && (
          <div className="mt-3 rounded-2xl bg-turquoise/12 px-3.5 py-3">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-turquoise-deep">
              Le mot amazigh, plus classique
            </div>
            <div className="mt-0.5 text-[16px] font-extrabold text-ink">{emprunt.classique}</div>
            {emprunt.sensClassique && (
              <div className="text-[12px] font-semibold text-ink-soft">{emprunt.sensClassique}</div>
            )}
          </div>
        )}

        <p className="mt-3 text-[12.5px] leading-relaxed text-ink">
          <b>Les deux sont justes.</b> {source.phrase}
        </p>

        {emprunt.usage && (
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{emprunt.usage}</p>
        )}

        <div className="mt-4">
          {/* autoFocus plutôt qu'une ref : `Button` est une fonction simple,
              elle ne transmet pas les refs — et `props` est déjà étalé sur le
              <button>, donc l'attribut arrive à destination. */}
          <Button autoFocus onClick={onClose}>
            J’ai compris
          </Button>
        </div>
      </div>
    </div>
  )
}
