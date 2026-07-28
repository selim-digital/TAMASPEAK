import { useState } from 'react'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { sfx } from '../lib/sfx.js'
import { sendFeedback } from '../lib/api.js'

/**
 * Feedback — le canal le plus court possible entre l'utilisateur et nous.
 *
 * Conçu pour un public dont une partie n'est pas à l'aise à l'écrit en
 * français : L'EMOJI SEUL SUFFIT À ENVOYER. La catégorie et le texte sont
 * des bonus, jamais des conditions. Pas de compte requis (le serveur
 * accepte l'anonyme), et hors-ligne le retour part à la file d'attente —
 * l'utilisateur n'a pas à savoir ce qu'est le réseau.
 */
/**
 * L'échelle d'humeur est un dégradé MÉTÉO — règle maison : aucun visage,
 * aucun œil, aucun être. Le ciel dit l'humeur aussi bien qu'une figure,
 * et se lit dans toutes les langues.
 */
const HUMEURS = [
  { id: 'love', emoji: '☀️', label: 'J’adore' },
  { id: 'good', emoji: '🌤️', label: 'Ça va' },
  { id: 'meh', emoji: '🌧️', label: 'Bof' },
  { id: 'bad', emoji: '⛈️', label: 'Ça coince' },
]

const CATEGORIES = [
  { id: 'idee', label: '💡 Une idée' },
  { id: 'bug', label: '🔧 Un problème' },
  { id: 'contenu', label: '📚 Le contenu' },
  { id: 'autre', label: '💬 Autre chose' },
]

export function FeedbackScreen({ lang, onBack }) {
  const [mood, setMood] = useState(null)
  const [category, setCategory] = useState(null)
  const [message, setMessage] = useState('')
  const [statut, setStatut] = useState(null) // null | 'envoi' | 'sent' | 'queued' | 'unavailable'

  async function envoyer() {
    if (!mood || statut === 'envoi') return
    setStatut('envoi')
    sfx.click()
    const r = await sendFeedback({ mood, category, message: message.trim() || undefined, lang })
    setStatut(r)
    if (r === 'sent' || r === 'queued') sfx.correct()
  }

  // Après envoi : un merci, pas un formulaire vide qui invite à douter.
  if (statut === 'sent' || statut === 'queued') {
    return (
      <div className="animate-enter flex min-h-0 flex-1 flex-col items-center justify-center bg-cream px-8 text-center">
        <Akermus height={110} state="celebrate" float />
        <h2 className="mt-4 text-[20px] font-extrabold">Tanemmirt ! 🌿</h2>
        <p className="mt-2 text-[12.5px] leading-snug text-ink-soft">
          {statut === 'sent'
            ? 'Ton retour est bien arrivé. On lit tout — vraiment.'
            : 'Ton retour est gardé au chaud : il partira tout seul au retour du réseau.'}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full rounded-2xl bg-turquoise py-3 text-[15px] font-extrabold text-white shadow-[0_4px_0_var(--color-turquoise-dark)] transition-transform duration-75 active:translate-y-[2px]"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Ton avis</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">
          Un emoji suffit. Le reste, c’est si tu as envie d’en dire plus.
        </p>

        {/* L'humeur — la seule chose requise */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {HUMEURS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                setMood(h.id)
                sfx.click()
              }}
              aria-pressed={mood === h.id}
              className={`flex flex-col items-center rounded-2xl border-2 py-3 transition-transform duration-75 active:translate-y-[2px] ${
                mood === h.id ? 'border-turquoise bg-turquoise/10' : 'border-line bg-white'
              }`}
            >
              <span className="text-[26px]" aria-hidden="true">{h.emoji}</span>
              <span className="mt-1 text-[9.5px] font-extrabold text-ink-soft">{h.label}</span>
            </button>
          ))}
        </div>

        {/* La catégorie — facultative */}
        <div className="mt-5 mb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
          Ça parle de quoi ? <span className="font-bold normal-case">(facultatif)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategory(category === c.id ? null : c.id)
                sfx.click()
              }}
              aria-pressed={category === c.id}
              className={`rounded-xl border-2 py-2 text-[12px] font-extrabold transition-transform duration-75 active:translate-y-[1px] ${
                category === c.id ? 'border-turquoise bg-turquoise/10 text-turquoise-deep' : 'border-line bg-white text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Le texte — facultatif */}
        <div className="mt-5 mb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
          Raconte <span className="font-bold normal-case">(facultatif — français, amazigh, comme tu veux)</span>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
          rows={4}
          placeholder="Dis-nous ce qui t’a plu, manqué, ou étonné…"
          className="w-full resize-none rounded-xl border-2 border-line bg-white px-3 py-2.5 text-[13px] leading-snug outline-none focus:border-turquoise"
        />

        {statut === 'unavailable' && (
          <p className="mt-2 rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] leading-snug">
            Le serveur de feedback n’est pas encore ouvert sur cette version — réessaie plus tard.
          </p>
        )}

        <button
          type="button"
          onClick={envoyer}
          disabled={!mood || statut === 'envoi'}
          className="mt-4 w-full rounded-2xl bg-turquoise py-3 text-[15px] font-extrabold text-white shadow-[0_4px_0_var(--color-turquoise-dark)] transition-[transform,box-shadow] duration-75 active:translate-y-[2px] active:shadow-none disabled:bg-sand-2 disabled:text-ink-soft disabled:shadow-none"
        >
          {statut === 'envoi' ? 'Envoi…' : 'Envoyer'}
        </button>

        <p className="mt-3 text-center text-[10px] leading-snug text-ink-soft">
          Ton retour part sans ton nom, sauf si tu es connecté. Hors-ligne, il attend le réseau
          tout seul.
        </p>
      </div>
    </div>
  )
}
