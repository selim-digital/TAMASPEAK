import { useEffect } from 'react'
import { YazMark } from '../components/Logo.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { notificationsPour, toutMarquerLu } from '../lib/notifications.js'
import { marquerNotifsServeurLues } from '../lib/distance.js'

/** Pastille du genre de notification, à côté du logo. */
const KINDS = {
  serie: { icone: '🔥', teinte: 'var(--color-coral)' },
  objectif: { icone: '⭐', teinte: 'var(--color-gold, #F0B429)' },
  nouveaute: { icone: 'ⵣ', teinte: 'var(--color-turquoise)' },
  'demande-audio': { icone: '🎙', teinte: 'var(--color-turquoise)' },
  'audio-recu': { icone: '🎁', teinte: 'var(--color-turquoise)' },
  cercle: { icone: '🤝', teinte: 'var(--color-turquoise)' },
  defi: { icone: '⚔', teinte: 'var(--color-coral)' },
  'defi-fini': { icone: '⚔', teinte: 'var(--color-coral)' },
  info: { icone: 'ⵣ', teinte: 'var(--color-turquoise)' },
}

/** Les genres sur lesquels on peut AGIR en touchant la carte. */
const ACTIONS = {
  'demande-audio': 'Enregistrer →',
  'audio-recu': 'Écouter →',
  defi: 'Jouer →',
  'defi-fini': 'Voir →',
  cercle: 'Voir →',
}

/**
 * Centre de notifications — chaque carte porte le logo yaz : c'est la
 * demande explicite du propriétaire, et c'est juste : une notification
 * est une prise de parole de la marque.
 *
 * Deux sources, fondues dans la même liste :
 *   • locales (série, objectif, nouveautés) — décidées sur le téléphone ;
 *   • serveur (cercle : défis, demandes de voix) — de vraies personnes qui
 *     t'écrivent, jamais un automate qui te relance.
 * L'ouverture de l'écran marque tout comme lu, des deux côtés.
 */
export function NotificationsScreen({ store, course, progress, serveur = [], onAction, onSave, onBack }) {
  const locales = notificationsPour(store, course, progress)
  const lues = new Set(store.notifsLues || [])

  // Ouvrir le centre, c'est lire : le badge tombe à zéro en repartant.
  useEffect(() => {
    onSave(toutMarquerLu(store, course, progress))
    if (serveur.some((n) => !n.lue)) marquerNotifsServeurLues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Serveur d'abord (des personnes), locales ensuite (des rappels).
  const cartes = [
    ...serveur.map((n) => ({ ...n, nonLue: !n.lue, action: ACTIONS[n.kind] || null })),
    ...locales.map((n) => ({ ...n, nonLue: !lues.has(n.id), action: null })),
  ]

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Notifications</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {cartes.length === 0 ? (
          <div className="mt-8 text-center">
            <Akermus height={90} state="idle" className="mx-auto" />
            <p className="mt-3 text-[12.5px] font-bold">Rien pour l’instant.</p>
            <p className="mt-1 text-[11px] text-ink-soft">
              Les nouveautés, tes rappels d’objectif et les messages de ton cercle arriveront ici.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {cartes.map((n) => {
              const k = KINDS[n.kind] || KINDS.nouveaute
              const Carte = n.action ? 'button' : 'div'
              return (
                <Carte
                  key={n.id}
                  {...(n.action ? { type: 'button', onClick: () => onAction?.(n) } : {})}
                  className={`flex w-full items-start gap-2.5 rounded-2xl border px-3 py-3 text-left ${
                    n.nonLue ? 'border-turquoise/40 bg-white' : 'border-line bg-cream'
                  } ${n.action ? 'transition-transform active:scale-[0.98]' : ''}`}
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
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-extrabold leading-tight">{n.title}</span>
                      {n.nonLue && <span className="h-2 w-2 flex-none rounded-full bg-coral" aria-label="non lue" />}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft">{n.body}</span>
                    {n.action && (
                      <span className="mt-1 block text-[11px] font-extrabold text-turquoise-deep">{n.action}</span>
                    )}
                  </span>
                </Carte>
              )
            })}
          </div>
        )}

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Les rappels sont décidés sur ton téléphone ; le reste vient de ton cercle — de vraies
          personnes, jamais un automate.
        </p>
      </div>
    </div>
  )
}
