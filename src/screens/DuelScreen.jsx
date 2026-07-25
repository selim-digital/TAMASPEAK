import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { scoreBar, shareText, duelInvite, duelReply } from '../lib/share.js'
import { duelUrl } from '../lib/challenge.js'
import { sfx } from '../lib/sfx.js'

/**
 * Défi entre amis. Les deux joueurs répondent EXACTEMENT aux mêmes questions
 * (tirées d'une graine commune transportée par le lien), donc la comparaison
 * est honnête — sans qu'aucun serveur n'entre en jeu.
 */

/** Écran d'annonce : soit on lance un défi, soit on en reçoit un. */
export function DuelIntroScreen({ duel, course, avatar, onStart, onCancel }) {
  const incoming = duel?.correct != null

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(255,111,97,0.16),var(--color-cream)_62%)]">
      <Akermus height={120} state="curious" />

      {incoming ? (
        <>
          <h2 className="mt-3 text-[21px] font-extrabold leading-tight">
            {duel.from ? `${duel.from} te défie !` : 'Tu as reçu un défi !'}
          </h2>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">
            {duel.size} questions en <b className="text-ink">{course.name}</b> — exactement les mêmes que
            {duel.from ? ` ${duel.from}` : ' ton ami'}.
          </p>
          <div className="mt-4 w-full rounded-2xl border border-line bg-cream px-4 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">Score à battre</div>
            <div className="mt-1 text-[15px] font-extrabold tabular-nums">
              {scoreBar(duel.correct, duel.total)} {duel.correct}/{duel.total}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-3 text-[21px] font-extrabold leading-tight">Défier un ami</h2>
          <p className="mt-1.5 max-w-[290px] text-[13px] leading-snug text-ink-soft">
            Tu réponds d’abord à <b className="text-ink">5 questions</b> en{' '}
            <b className="text-ink">{course.name}</b>, puis tu envoies le lien. Ton ami aura
            exactement les mêmes.
          </p>
        </>
      )}

      <div className="min-h-4 flex-1" />

      <div className="flex w-full flex-col gap-2">
        <Button variant="primary" onClick={onStart}>
          {incoming ? 'Relever le défi' : 'C’est parti'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Plus tard
        </Button>
      </div>

      <p className="mt-3 text-[10px] leading-snug text-ink-soft">
        Le défi voyage entièrement dans le lien — aucun compte, aucun serveur.
      </p>
    </div>
  )
}

/** Écran de résultat : score seul (défi lancé) ou comparaison (défi relevé). */
export function DuelResultScreen({ duel, course, result, name, avatar, onDone }) {
  const [flash, setFlash] = useState(null)
  const replying = duel?.correct != null
  const theirs = duel?.correct ?? 0
  const mine = result.correct
  const won = replying && mine > theirs
  const tie = replying && mine === theirs

  async function send() {
    sfx.click()
    if (replying) {
      const res = await shareText(
        duelReply({ name: duel.from, courseName: course.name, mine, theirs, total: result.total }),
        duelUrl({ lang: course.id, seed: duel.seed, size: duel.size, correct: mine, total: result.total, from: name }),
      )
      setFlash(res === 'copied' ? 'Réponse copiée — colle-la à ton ami' : res === 'failed' ? 'Partage indisponible' : null)
    } else {
      const url = duelUrl({
        lang: course.id,
        seed: duel.seed,
        size: duel.size,
        correct: mine,
        total: result.total,
        from: name,
      })
      const res = await shareText(duelInvite({ name, courseName: course.name, correct: mine, total: result.total }), url)
      setFlash(res === 'copied' ? 'Lien copié — envoie-le à ton ami' : res === 'failed' ? 'Partage indisponible' : null)
    }
    setTimeout(() => setFlash(null), 2600)
  }

  return (
    <div className="animate-enter relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(255,111,97,0.16),var(--color-cream)_62%)]">
      {(won || tie || !replying) && <Confetti count={30} />}

      <Akermus height={128} state={replying && !won && !tie ? 'console' : 'celebrate'} />

      <h2 className="mt-3 text-[21px] font-extrabold leading-tight">
        {replying ? (won ? 'Tu as gagné ! 🎉' : tie ? 'Égalité ! 🤝' : 'Presque !') : 'Ton défi est prêt'}
      </h2>

      <div className="mt-4 w-full rounded-2xl border border-line bg-cream px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar id={avatar} size={34} />
          <span className="flex-1 text-left text-[12.5px] font-extrabold">{name || 'Toi'}</span>
          <span className="text-[13px] font-extrabold tabular-nums">
            {scoreBar(mine, result.total)} {mine}/{result.total}
          </span>
        </div>
        {replying && (
          <div className="mt-2 flex items-center gap-2.5 border-t border-line pt-2">
            <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full border border-line bg-sand text-[13px] font-extrabold text-ink-soft">
              {(duel.from || '?').slice(0, 1).toUpperCase()}
            </span>
            <span className="flex-1 text-left text-[12.5px] font-extrabold">{duel.from || 'Ton ami'}</span>
            <span className="text-[13px] font-extrabold tabular-nums text-ink-soft">
              {scoreBar(theirs, duel.total)} {theirs}/{duel.total}
            </span>
          </div>
        )}
      </div>

      <div className="min-h-4 flex-1" />

      <div className="flex w-full flex-col gap-2">
        <Button variant="primary" onClick={send}>
          {replying ? 'Renvoyer mon score' : 'Envoyer le défi'}
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Retour au chemin
        </Button>
      </div>

      {flash && <p className="animate-rise mt-3 text-[11.5px] font-bold text-turquoise-deep">{flash}</p>}
    </div>
  )
}
