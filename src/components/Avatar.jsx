import { FAMILY } from './mascots/Family.jsx'
import { Akermus } from './mascots/Akermus.jsx'

/**
 * Avatars disponibles : la mascotte Akermus et les six membres de la famille.
 * (Aucune photo — l'app ne demande jamais d'image personnelle.)
 */
export const AVATARS = [
  { id: 'akermus', name: 'Akermus', Comp: ({ height }) => <Akermus height={height} /> },
  ...FAMILY.map(({ id, name, Comp }) => ({ id, name, Comp })),
]

export const findAvatar = (id) => AVATARS.find((a) => a.id === id) || AVATARS[0]

/** Avatar dans une pastille ronde, taille libre. */
export function Avatar({ id, size = 56, className = '' }) {
  const { Comp } = findAvatar(id)
  return (
    <span
      className={`grid flex-none place-items-center overflow-hidden rounded-full border border-line bg-cream ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Le personnage est cadré sur sa moitié haute pour tenir dans le rond. */}
      <span style={{ marginTop: size * 0.28 }}>
        <Comp height={Math.round(size * 1.15)} />
      </span>
    </span>
  )
}
