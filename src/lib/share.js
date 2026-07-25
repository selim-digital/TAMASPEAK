/**
 * Partage — API Web Share quand elle existe (mobile : ouvre WhatsApp, SMS…),
 * repli sur le presse-papiers ailleurs. Aucun serveur, aucun pistage.
 */

/** Barre de score en carrés, façon Wordle — lisible même en texte brut. */
export function scoreBar(correct, total) {
  const c = Math.max(0, Math.min(correct, total))
  return '🟩'.repeat(c) + '⬜'.repeat(Math.max(0, total - c))
}

/**
 * Partage un texte (+ lien facultatif).
 * @returns {Promise<'shared'|'copied'|'failed'>}
 */
export async function shareText(text, url) {
  const full = url ? `${text}\n${url}` : text
  try {
    if (navigator.share) {
      await navigator.share(url ? { text, url } : { text })
      return 'shared'
    }
  } catch (e) {
    // L'utilisateur a annulé la feuille de partage : ce n'est pas un échec.
    if (e?.name === 'AbortError') return 'shared'
  }
  try {
    await navigator.clipboard.writeText(full)
    return 'copied'
  } catch {
    return 'failed'
  }
}

/** Carte de résultat d'une leçon. */
export const lessonShare = ({ courseName, correct, total, streak }) =>
  [
    'ⵣ Tama Speak',
    `${courseName} — leçon terminée`,
    `${scoreBar(correct, total)} ${correct}/${total}`,
    `Série : ${streak} jour${streak > 1 ? 's' : ''} 🔥`,
  ].join('\n')

/** Carte de fin d'unité (le médaillon tabzimt). */
export const unitShare = ({ courseName, unitLabel, unitTitle }) =>
  ['ⵣ Tama Speak', `${courseName} — ${unitLabel} terminée !`, `« ${unitTitle} »`, 'Médaillon gagné 🏅'].join('\n')

/** Carte de profil : une ligne par langue commencée. */
export const profileShare = ({ name, lines, totalXp }) =>
  ['ⵣ Tama Speak', name ? `${name} apprend les langues amazighes :` : 'J’apprends les langues amazighes :', ...lines, `Total : ${totalXp} XP`].join('\n')

/** Invitation à un défi. */
export const duelInvite = ({ name, courseName, correct, total }) =>
  [
    'ⵣ Tama Speak — je te défie !',
    `${courseName} · ${scoreBar(correct, total)} ${correct}/${total}`,
    name ? `Feras-tu mieux que ${name} ?` : 'Feras-tu mieux ?',
  ].join('\n')

/** Réponse à un défi relevé. */
export const duelReply = ({ name, courseName, mine, theirs, total }) => {
  const verdict = mine > theirs ? 'J’ai gagné ! 🎉' : mine === theirs ? 'Égalité ! 🤝' : 'Tu gardes l’avantage 💪'
  return [
    'ⵣ Tama Speak — défi relevé',
    `${courseName} · moi ${scoreBar(mine, total)} ${mine}/${total}`,
    `${name || 'Toi'} ${scoreBar(theirs, total)} ${theirs}/${total}`,
    verdict,
  ].join('\n')
}
