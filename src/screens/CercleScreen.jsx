import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { shareText } from '../lib/share.js'
import { saveVoice } from '../lib/speakerVoice.js'
import { sfx } from '../lib/sfx.js'
import {
  monCercle,
  creerInvitation,
  invitationUrl,
  retirerDuCercle,
  mesDemandes,
  demanderMot,
  audioDemande,
  mesDefis,
} from '../lib/distance.js'

/**
 * Mon cercle — la famille et les amis, chacun sur SON téléphone.
 *
 * Trois choses s'y font :
 *   • relier deux comptes par un code d'invitation (partagé par WhatsApp) ;
 *   • demander un mot à un proche — il reçoit une notification, enregistre
 *     sa voix, et elle revient ici, installable dans les leçons ;
 *   • défier un proche — même graine, mêmes questions, chacun chez soi.
 *
 * L'écran suppose l'utilisateur connecté (le compte est obligatoire) ; si
 * le serveur est muet, il le dit avec calme et n'affiche rien de cassé.
 */

/** Pastille-initiale d'un proche (jamais de photo : sobriété voulue). */
function Initiale({ name, size = 38 }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full border border-line bg-sand font-extrabold text-ink-soft"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(name || '?').slice(0, 1).toUpperCase()}
    </span>
  )
}

/** Une demande envoyée et exaucée : écouter, puis garder dans ses leçons. */
function AudioRecu({ demande, onGarde }) {
  const [etat, setEtat] = useState('idle') // idle | charge | joue | garde
  const audioRef = useRef(null)
  const blobRef = useRef(null)

  async function charger() {
    if (blobRef.current) return blobRef.current
    setEtat('charge')
    const blob = await audioDemande(demande.id)
    blobRef.current = blob
    return blob
  }

  async function ecouter() {
    sfx.click()
    const blob = await charger()
    if (!blob) return setEtat('idle')
    if (!audioRef.current) audioRef.current = new Audio(URL.createObjectURL(blob))
    setEtat('joue')
    audioRef.current.onended = () => setEtat('idle')
    audioRef.current.play().catch(() => setEtat('idle'))
  }

  async function garder() {
    const blob = await charger()
    if (!blob) return setEtat('idle')
    await saveVoice({ lang: demande.lang || 'kab', word: demande.texte, blob, speaker: demande.pour })
    sfx.correct()
    setEtat('garde')
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={ecouter}
        aria-label={`Écouter ${demande.texte}`}
        className="grid h-8 w-8 flex-none place-items-center rounded-full bg-turquoise text-[12px] text-white transition-transform active:scale-90"
      >
        {etat === 'charge' ? '…' : etat === 'joue' ? '◼' : '▶'}
      </button>
      {etat === 'garde' ? (
        <span className="text-[10px] font-extrabold text-turquoise-deep">Dans tes leçons ✓</span>
      ) : (
        <button type="button" onClick={garder} className="text-[10px] font-bold text-ink-soft underline">
          Garder dans mes leçons
        </button>
      )}
    </div>
  )
}

export function CercleScreen({ course, onDefier, onEnregistrer, onJouerDefi, onBack }) {
  // null = chargement ; false = serveur muet ; objet = données.
  const [cercle, setCercle] = useState(null)
  const [demandes, setDemandes] = useState({ recues: [], envoyees: [] })
  const [defis, setDefis] = useState([])
  const [formPour, setFormPour] = useState(null) // membre auquel on demande un mot
  const [mot, setMot] = useState('')
  const [sens, setSens] = useState('')
  const [flash, setFlash] = useState(null)
  const [retraitEnCours, setRetraitEnCours] = useState(null)

  async function recharger() {
    const [c, d, f] = await Promise.all([monCercle(), mesDemandes(), mesDefis()])
    setCercle(c || false)
    if (d) setDemandes(d)
    if (f) setDefis(f.defis || [])
  }

  useEffect(() => {
    recharger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dire = (msg) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2600)
  }

  async function inviter() {
    sfx.click()
    const code = await creerInvitation()
    if (!code) return dire('Le serveur ne répond pas — réessaie un peu plus tard.')
    const res = await shareText(
      `Azul ! Rejoins mon cercle sur Tama Speak — on apprend la langue ensemble, chacun sur son téléphone : ${invitationUrl(code)}`,
    )
    dire(res === 'copied' ? 'Lien copié — envoie-le à ton proche.' : 'Invitation prête à partager.')
  }

  async function envoyerDemande() {
    if (!mot.trim() || !formPour) return
    sfx.click()
    const ok = await demanderMot({ pour: formPour.userId, texte: mot.trim(), sens: sens.trim(), lang: course.id })
    if (ok) {
      dire(`Demande envoyée à ${formPour.name} — tu seras prévenu·e dès que sa voix arrive.`)
      setFormPour(null)
      setMot('')
      setSens('')
      recharger()
    } else {
      dire('L’envoi n’a pas abouti — réessaie.')
    }
  }

  async function retirer(m) {
    await retirerDuCercle(m.lienId)
    setRetraitEnCours(null)
    recharger()
  }

  const membres = cercle && cercle !== false ? cercle.membres : []

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col bg-cream">
      <div className="flex items-center gap-3 px-4 pt-8 pb-1">
        <button type="button" onClick={onBack} aria-label="Retour" className="text-xl font-extrabold text-ink-soft">
          ←
        </button>
        <h2 className="text-lg font-extrabold">Mon cercle</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <div className="mt-2 flex items-start gap-2.5 rounded-2xl border border-line bg-sand px-3 py-3">
          <Akermus height={64} state="curious" className="flex-none" />
          <p className="text-[11.5px] leading-snug text-ink">
            Ta famille et tes amis, <strong>chacun sur son téléphone</strong>. Défie-les, ou
            demande-leur d’enregistrer un mot avec leur voix — elle arrivera dans tes leçons.
          </p>
        </div>

        {flash && (
          <p className="animate-rise mt-3 rounded-xl border border-turquoise/40 bg-turquoise/10 px-3 py-2 text-center text-[11.5px] font-bold text-turquoise-deep">
            {flash}
          </p>
        )}

        {cercle === false && (
          <p className="mt-3 rounded-xl border border-line bg-sand px-3 py-2 text-[11px] leading-snug text-ink-soft">
            Le cercle a besoin d’internet — reviens quand tu seras en ligne, rien n’est perdu.
          </p>
        )}

        {/* ------------- les proches ------------- */}
        <div className="mt-5 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          Mes proches {membres.length > 0 && <span className="tabular-nums">({membres.length})</span>}
        </div>

        {cercle !== false && membres.length === 0 && (
          <p className="text-[12px] leading-snug text-ink-soft">
            Personne pour l’instant. Invite un proche : dès qu’il aura ouvert ton lien et créé son
            compte, vous serez reliés.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {membres.map((m) => (
            <div key={m.lienId} className="rounded-2xl border border-line bg-white px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Initiale name={m.name} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-extrabold">{m.name}</span>
                {retraitEnCours === m.lienId ? (
                  <span className="flex flex-none gap-1">
                    <button
                      type="button"
                      onClick={() => setRetraitEnCours(null)}
                      className="rounded-lg border border-line bg-cream px-1.5 py-1 text-[9.5px] font-extrabold text-ink-soft"
                    >
                      Garder
                    </button>
                    <button
                      type="button"
                      onClick={() => retirer(m)}
                      className="rounded-lg bg-coral px-1.5 py-1 text-[9.5px] font-extrabold text-white"
                    >
                      Retirer
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRetraitEnCours(m.lienId)}
                    aria-label={`Retirer ${m.name} du cercle`}
                    className="flex-none text-[15px] text-ink-soft"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sfx.click()
                    setFormPour(formPour?.userId === m.userId ? null : m)
                  }}
                  className="flex-1 rounded-xl border border-line bg-cream py-2 text-[11.5px] font-extrabold text-ink transition-transform active:scale-95"
                >
                  🎙 Demander un mot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.click()
                    onDefier(m)
                  }}
                  className="flex-1 rounded-xl border border-coral/40 bg-coral/10 py-2 text-[11.5px] font-extrabold text-coral-dark transition-transform active:scale-95"
                >
                  ⚔ Défier
                </button>
              </div>

              {formPour?.userId === m.userId && (
                <div className="animate-rise mt-2 flex flex-col gap-2 rounded-xl bg-sand p-2.5">
                  <input
                    value={mot}
                    onChange={(e) => setMot(e.target.value.slice(0, 120))}
                    placeholder={`Le mot à demander à ${m.name}`}
                    className="rounded-xl border-2 border-line bg-white px-3 py-2 text-[13.5px] font-bold outline-none focus:border-turquoise"
                  />
                  <input
                    value={sens}
                    onChange={(e) => setSens(e.target.value.slice(0, 120))}
                    placeholder="Ce que ça veut dire (facultatif)"
                    className="rounded-xl border-2 border-line bg-white px-3 py-2 text-[12.5px] outline-none focus:border-turquoise"
                  />
                  <button
                    type="button"
                    onClick={envoyerDemande}
                    disabled={!mot.trim()}
                    className="rounded-xl bg-turquoise py-2 text-[12.5px] font-extrabold text-white shadow-[0_3px_0_var(--color-turquoise-dark)] disabled:opacity-40 disabled:shadow-none"
                  >
                    Envoyer la demande
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {cercle !== false && (
          <div className="mt-3">
            <Button variant="primary" onClick={inviter}>
              Inviter un proche
            </Button>
          </div>
        )}

        {/* ------------- demandes reçues (à enregistrer) ------------- */}
        {demandes.recues.length > 0 && (
          <>
            <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
              On attend ta voix 🎙
            </div>
            <div className="flex flex-col gap-2">
              {demandes.recues.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onEnregistrer(d)}
                  className="flex items-center gap-2.5 rounded-2xl border-2 border-turquoise/40 bg-turquoise/5 px-3 py-2.5 text-left transition-transform active:scale-[0.98]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-extrabold">« {d.texte} »</div>
                    <div className="truncate text-[10.5px] text-ink-soft">
                      {d.de} aimerait l’entendre avec ta voix
                    </div>
                  </div>
                  <span className="flex-none text-[13px] font-extrabold text-turquoise-deep">Enregistrer →</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ------------- demandes envoyées ------------- */}
        {demandes.envoyees.length > 0 && (
          <>
            <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
              Mes demandes
            </div>
            <div className="flex flex-col gap-2">
              {demandes.envoyees.map((d) => (
                <div key={d.id} className="rounded-2xl border border-line bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-extrabold">« {d.texte} »</div>
                      <div className="truncate text-[10.5px] text-ink-soft">
                        demandé à {d.pour}
                        {d.status === 'attente' && ' · en attente'}
                        {d.status === 'decline' && ' · pas pu cette fois'}
                      </div>
                    </div>
                    {d.status === 'fait' && <AudioRecu demande={d} />}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------- défis ------------- */}
        {defis.length > 0 && (
          <>
            <div className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
              Défis
            </div>
            <div className="flex flex-col gap-1.5">
              {defis.map((d) => {
                const moi = d.jeDefie ? d.scoreCreateur : d.scoreAdversaire
                const lui = d.jeDefie ? d.scoreAdversaire : d.scoreCreateur
                const aJouer = !d.jeDefie && d.status === 'ouvert'
                const Ligne = aJouer ? 'button' : 'div'
                return (
                  <Ligne
                    key={d.code}
                    {...(aJouer ? { type: 'button', onClick: () => onJouerDefi?.(d.code) } : {})}
                    className={`flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left ${
                      aJouer
                        ? 'border-coral/40 bg-coral/5 transition-transform active:scale-[0.98]'
                        : 'border-line bg-white'
                    }`}
                  >
                    <Initiale name={d.avec} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-extrabold">{d.avec || 'En attente'}</div>
                      <div className="text-[10px] text-ink-soft">
                        {d.status === 'fini'
                          ? moi > lui
                            ? `Gagné ${moi}–${lui} 🎉`
                            : moi < lui
                              ? `Perdu ${moi}–${lui} — la revanche t’attend`
                              : `Égalité ${moi}–${lui} 🤝`
                          : d.jeDefie
                            ? 'Pas encore joué en face'
                            : 'À toi de jouer !'}
                      </div>
                    </div>
                    <span className={`flex-none text-[11px] font-extrabold tabular-nums ${aJouer ? 'text-coral-dark' : 'text-ink-soft'}`}>
                      {aJouer ? 'Jouer →' : `${d.size} q.`}
                    </span>
                  </Ligne>
                )
              })}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-[10px] leading-snug text-ink-soft">
          Les voix enregistrées sont partagées uniquement entre vous deux, jamais corrigées,
          et supprimables à tout moment.
        </p>
      </div>
    </div>
  )
}
