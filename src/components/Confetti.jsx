import { useEffect, useRef } from 'react'

const COLORS = ['#10C4A8', '#FF6F61', '#04A88F', '#E0A83E', '#ffffff']

/**
 * A one-shot confetti burst (brand colors). Renders inside a relatively
 * positioned parent and cleans itself up. Respects reduced-motion.
 */
export function Confetti({ count = 30 }) {
  const ref = useRef(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const pieces = []
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div')
      piece.style.cssText = `position:absolute;top:-16px;left:${6 + Math.random() * 88}%;width:9px;height:14px;border-radius:2px;background:${COLORS[i % COLORS.length]};will-change:transform,opacity;`
      piece.style.transform = `rotate(${Math.random() * 360}deg)`
      host.appendChild(piece)
      pieces.push(piece)

      const duration = 1200 + Math.random() * 1000
      const delay = Math.random() * 400
      const anim = piece.animate(
        [
          { transform: 'translateY(-12px) rotate(0deg)', opacity: 1 },
          {
            transform: `translateY(${360 + Math.random() * 180}px) rotate(${360 + Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        { duration, delay, easing: 'cubic-bezier(0.25,0.7,0.4,1)' },
      )
      anim.onfinish = () => piece.remove()
    }

    return () => pieces.forEach((p) => p.remove())
  }, [count])

  return <div ref={ref} className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true" />
}
