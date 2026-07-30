import { useEffect } from 'react'
import { YazMark } from './Logo.jsx'

/**
 * La respiration — une carte « Le savais-tu ? » qui se pose en bas de
 * l'écran pendant la navigation, environ une fois par minute.
 *
 * Règles de douceur :
 *   • jamais pendant un exercice — seulement sur les écrans calmes
 *     (c'est App qui décide quand appeler) ;
 *   • elle s'efface seule au bout de vingt secondes, ou d'un geste ;
 *   • elle dit où retrouver ce savoir : au quiz du coin jeux.
 */
export function FaitCard({ fait, onClose, onQuiz }) {
  useEffect(() => {
    if (!fait) return undefined
    const t = setTimeout(onClose, 20000)
    return () => clearTimeout(t)
  }, [fait, onClose])

  if (!fait) return null

  const CATS = { langue: 'Langue', histoire: 'Histoire', culture: 'Culture' }

  return (
    <div className="animate-rise pointer-events-auto absolute inset-x-3 bottom-3 z-40">
      <div className="rounded-2xl border border-turquoise/40 bg-white/95 p-3 shadow-[0_10px_28px_-12px_rgba(10,122,105,.5)] backdrop-blur-sm">
        <div className="flex items-start gap-2.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white">
            <YazMark size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-turquoise-deep">
                Le savais-tu ? · {CATS[fait.cat] || 'Culture'}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="ml-auto grid h-6 w-6 flex-none place-items-center rounded-full text-[13px] text-ink-soft"
              >
                ×
              </button>
            </div>
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink">{fait.texte}</p>
            <button
              type="button"
              onClick={onQuiz}
              className="mt-1.5 text-[10.5px] font-extrabold text-turquoise-deep underline"
            >
              Retrouve-le au quiz ⵣ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
