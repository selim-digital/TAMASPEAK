import { useEffect } from 'react'
import { YazMark } from '../components/Logo.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { notificationsPour, toutMarquerLu } from '../lib/notifications.js'

/** Pastille du genre de notification, à côté du logo. */
const KINDS = {
  serie: { icone: '🔥', teinte: 'var(--color-coral)' },
  objectif: { icone: '⭐', teinte: 'var(--color-gold, #F0B429)' },
  nouveaute: { icone: 'ⵣ', teinte: 'var(--color-turquoise)' },
}

/**
 * Centre de notifications — chaque carte porte le logo yaz : c'est la
 * demande explicite du propriétaire, et c'est juste : une notification
 * est une prise de parole de la marque.
 *
 * Tout est généré localement (série, objectif, nouveautés) : aucun serveur
 * ne décide de te déranger. L'ouverture de l'écran marque tout comme lu.
 */
export function NotificationsScreen({ store, course, progress, onSave, onBack }) {
  const notifs = notificationsPour(store, course, progress)
  const lues = new Set(store.notifsLues || [])

  // Ouvrir le centre, c'est lire : le badge tombe à zéro en repartant.
  useEffect(() => {
    onSave(toutMarquerLu(store, course, progress))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Notifications</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {notifs.length === 0 ? (
          <div className="mt-8 text-center">
            <Akermus height={90} state="idle" className="mx-auto" />
            <p className="mt-3 text-[12.5px] font-bold">Rien pour l’instant.</p>
            <p className="mt-1 text-[11px] text-ink-soft">
              Les nouveautés et tes rappels d’objectif arriveront ici.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {notifs.map((n) => {
              const k = KINDS[n.kind] || KINDS.nouveaute
              const nonLue = !lues.has(n.id)
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 rounded-2xl border px-3 py-3 ${
                    nonLue ? 'border-turquoise/40 bg-white' : 'border-line bg-cream'
                  }`}
                >
                  {/* Le logo de la marque, comme sur une vraie notification
                      système — avec la pastille du genre par-dessus. */}
                  <span className="relative flex-none">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white">
                      <YazMark size={22} />
                    </span>
                    <span
                      className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-cream text-[10px]"
                      style={{ background: k.teinte, color: '#fff' }}
                      aria-hidden="true"
                    >
                      {k.icone}
                    </span>
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-extrabold leading-tight">{n.title}</span>
                      {nonLue && <span className="h-2 w-2 flex-none rounded-full bg-coral" aria-label="non lue" />}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft">{n.body}</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Tout est décidé sur ton téléphone — aucun serveur ne choisit quand te déranger.
        </p>
      </div>
    </div>
  )
}
