import { useEffect, useRef, useState } from 'react'
import { FAMILY } from './Family.jsx'
import { sfx } from '../../lib/sfx.js'

/**
 * Présentation de la famille un par un : swipe (tactile), flèches, ou clic
 * sur un avatar. Le personnage affiché est animé (fam-hello).
 */
export function FamilyCarousel({ start = 0 }) {
  const [index, setIndex] = useState(start)
  const [dir, setDir] = useState(0)
  const touchX = useRef(null)

  const member = FAMILY[index]
  const { Comp } = member

  // Petit « salut » sonore quand le personnage entre en scène.
  useEffect(() => {
    sfx.hello()
  }, [index])

  function go(next) {
    const n = (next + FAMILY.length) % FAMILY.length
    setDir(n > index || (index === FAMILY.length - 1 && n === 0) ? 1 : -1)
    setIndex(n)
    sfx.swish()
  }

  /* Sur tactile, on gère le toucher DIRECTEMENT sur les flèches : sinon le
     détecteur de swipe de la carte avale le geste et le clic n'arrive jamais. */
  const arrowTouchProps = (target) => ({
    onTouchStart: (e) => e.stopPropagation(),
    onTouchEnd: (e) => {
      e.stopPropagation()
      e.preventDefault()
      go(target())
    },
    onClick: () => go(target()),
  })

  return (
    <div className="flex flex-col">
      {/* Carte du personnage — swipe gauche/droite */}
      <div
        className="relative rounded-3xl border border-line bg-cream px-4 pb-4 pt-5 text-center"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return
          const delta = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (delta > 30) go(index - 1)
          else if (delta < -30) go(index + 1)
        }}
      >
        <button
          type="button"
          {...arrowTouchProps(() => index - 1)}
          aria-label="Personnage précédent"
          className="absolute left-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-cream text-xl font-extrabold text-ink-soft shadow-sm active:scale-95"
        >
          ‹
        </button>
        <button
          type="button"
          {...arrowTouchProps(() => index + 1)}
          aria-label="Personnage suivant"
          className="absolute right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-cream text-xl font-extrabold text-ink-soft shadow-sm active:scale-95"
        >
          ›
        </button>

        <div key={member.id} className={dir >= 0 ? 'animate-pop-in' : 'animate-pop-in'}>
          <div className="fam-hello mx-auto w-fit">
            <Comp height={132} />
          </div>
          <div className="mt-2 text-[17px] font-extrabold">
            {member.name} <span className="text-[12px] font-bold text-ink-soft">· {member.role}</span>
          </div>
          <p className="mx-auto mt-1 max-w-[250px] text-[12px] leading-snug text-ink-soft">{member.bio}</p>
          <p className="mx-auto mt-2 max-w-[250px] rounded-xl bg-turquoise/10 px-3 py-1.5 text-[11.5px] font-bold text-turquoise-deep">
            « {member.cheers[0]} »
          </p>
        </div>
      </div>

      {/* Avatars cliquables + points */}
      <div className="mt-3 flex items-end justify-center gap-1.5">
        {FAMILY.map(({ id, Comp: Mini, name }, i) => (
          <button
            key={id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Voir ${name}`}
            className={`rounded-xl border px-1 pb-0.5 pt-1 transition ${
              i === index ? 'border-turquoise bg-turquoise/10' : 'border-transparent opacity-55'
            }`}
          >
            <Mini height={34} />
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-center gap-1" aria-hidden="true">
        {FAMILY.map((m, i) => (
          <span key={m.id} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-turquoise' : 'w-1.5 bg-sand-2'}`} />
        ))}
      </div>
    </div>
  )
}
