import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Akermus } from '../components/mascots/Akermus.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { Confetti } from '../components/Confetti.jsx'
import { scoreBar, shareText, duelInvite, duelReply, memoryInvite, memoryReply } from '../lib/share.js'
import { duelUrl, contentDigest, memeContenu } from '../lib/challenge.js'
import { sfx } from '../lib/sfx.js'

/**
 * Défi entre amis. Les deux joueurs répondent EXACTEMENT aux mêmes questions
 * (tirées d'une graine commune transportée par le lien), donc la comparaison
 * est honnête — sans qu'aucun serveur n'entre en jeu.
 *
 * Deux réserves sont désormais affichées au lieu d'être tues : le contenu du
 * cours peut avoir changé depuis la création du lien, et le score annoncé
 * n'est pas vérifiable sans serveur. Mieux vaut une comparaison qu'on sait
 * imparfaite qu'une comparaison faussée qui se présente comme exacte.
 */

/** Bandeau d'avertissement, discret mais lisible. */
function Reserve({ children }) {
  return (
    <p className="mt-3 w-full rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-[11px] leading-snug text-ink">
      {children}
    </p>
  )
}

/** Écran d'annonce : soit on lance un défi, soit on en reçoit un. */
export function DuelIntroScreen({ duel, course, avatar, onStart, onCancel }) {
  const incoming = duel?.correct != null
  const memory = duel?.jeu === 'memory'
  const contenuIdentique = memeContenu(duel, course.challengePool())
  const scoreDouteux = incoming && duel.scoreVerifie === false

  return (
    <div className="animate-enter flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-6 pt-10 text-center bg-[radial-gradient(120%_70%_at_50%_10%,rgba(255,111,97,0.16),var(--color-cream)_62%)]">
      <Akermus height={120} state="curious" />

      {incoming ? (
        <>
          <h2 className="mt-3 text-[21px] font-extrabold leading-tight">
            {duel.from ? `${duel.from} te défie${memory ? ' au Mémory' : ''} !` : `Tu as reçu un défi${memory ? ' de Mémory' : ''} !`}
          </h2>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">
            {memory ? (
              <>
                {duel.total} paires en <b className="text-ink">{course.name}</b> — exactement le même
                tapis de cartes que {duel.from ? ` ${duel.from}` : ' ton ami'}, et le moins de coups gagne.
              </>
            ) : (
              <>
                {duel.size} questions en <b className="text-ink">{course.name}</b> — exactement les mêmes que
                {duel.from ? ` ${duel.from}` : ' ton ami'}.
              </>
            )}
          </p>
          <div className="mt-4 w-full rounded-2xl border border-line bg-cream px-4 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
              Score {scoreDouteux ? 'annoncé' : 'à battre'}
            </div>
            <div className="mt-1 text-[15px] font-extrabold tabular-nums">
              {memory ? `${duel.correct} coups pour ${duel.total} paires` : (
                <>
                  {scoreBar(duel.correct, duel.total)} {duel.correct}/{duel.total}
                </>
              )}
            </div>
          </div>
          {scoreDouteux && (
            <Reserve>
              Ce score a été <b>modifié dans le lien</b>. Tu peux jouer quand même, mais la
              comparaison ne veut plus rien dire.
            </Reserve>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-3 text-[21px] font-extrabold leading-tight">
            {memory ? 'Défier un ami au Mémory' : 'Défier un ami'}
          </h2>
          <p className="mt-1.5 max-w-[290px] text-[13px] leading-snug text-ink-soft">
            {memory ? (
              <>
                Tu joues d’abord un tapis de <b className="text-ink">{duel.size} paires</b> en{' '}
                <b className="text-ink">{course.name}</b>, puis tu envoies le lien. Ton ami aura
                exactement les mêmes cartes — le moins de coups gagne.
              </>
            ) : (
              <>
                Tu réponds d’abord à <b className="text-ink">5 questions</b> en{' '}
                <b className="text-ink">{course.name}</b>, puis tu envoies le lien. Ton ami aura
                exactement les mêmes.
              </>
            )}
          </p>
        </>
      )}

      {incoming && !contenuIdentique && (
        <Reserve>
          Le cours de {course.name} a été <b>enrichi depuis</b> l’envoi de ce défi : tes questions ne
          seront pas exactement les mêmes. À jouer pour le plaisir, pas pour départager.
        </Reserve>
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
  const memory = duel?.jeu === 'memory'
  const theirs = duel?.correct ?? 0
  // Au Mémory le « score » est un nombre de COUPS : c'est le plus petit qui
  // gagne — l'inverse exact du défi de questions.
  const mine = memory ? result.coups : result.correct
  const total = memory ? result.paires : result.total
  const won = replying && (memory ? mine < theirs : mine > theirs)
  const tie = replying && mine === theirs

  async function send() {
    sfx.click()
    // L'empreinte est calculée À L'ÉMISSION : c'est l'état du cours au moment
    // où le lien part qui fait foi, et que le destinataire pourra comparer.
    const lien = duelUrl({
      lang: course.id,
      seed: duel.seed,
      size: duel.size,
      correct: mine,
      total,
      from: name,
      version: contentDigest(course.challengePool()),
      jeu: duel.jeu,
    })
    const texte = memory
      ? replying
        ? memoryReply({ name: duel.from, courseName: course.name, mine, theirs, paires: total })
        : memoryInvite({ name, courseName: course.name, coups: mine, paires: total })
      : replying
        ? duelReply({ name: duel.from, courseName: course.name, mine, theirs, total: result.total })
        : duelInvite({ name, courseName: course.name, correct: mine, total: result.total })
    const res = await shareText(texte, lien)
    setFlash(
      res === 'copied'
        ? replying
          ? 'Réponse copiée — colle-la à ton ami'
          : 'Lien copié — envoie-le à ton ami'
        : res === 'failed'
          ? 'Partage indisponible'
          : null,
    )
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
            {memory ? `${mine} coups` : (
              <>
                {scoreBar(mine, result.total)} {mine}/{result.total}
              </>
            )}
          </span>
        </div>
        {replying && (
          <div className="mt-2 flex items-center gap-2.5 border-t border-line pt-2">
            <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full border border-line bg-sand text-[13px] font-extrabold text-ink-soft">
              {(duel.from || '?').slice(0, 1).toUpperCase()}
            </span>
            <span className="flex-1 text-left text-[12.5px] font-extrabold">
              {duel.from || 'Ton ami'}
              {duel.scoreVerifie === false && (
                <span className="ml-1 text-[10px] font-bold text-coral-dark">score annoncé</span>
              )}
            </span>
            <span className="text-[13px] font-extrabold tabular-nums text-ink-soft">
              {memory ? `${theirs} coups` : (
                <>
                  {scoreBar(theirs, duel.total)} {theirs}/{duel.total}
                </>
              )}
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
