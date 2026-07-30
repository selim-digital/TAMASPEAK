/**
 * Partage — API Web Share quand elle existe (mobile : ouvre WhatsApp, SMS…),
 * repli sur le presse-papiers ailleurs. Aucun serveur, aucun pistage.
 */

/**
 * L'adresse de l'app, présente dans CHAQUE carte partagée : un partage sans
 * lien est une impasse — le destinataire ne peut rien en faire. Grâce aux
 * balises Open Graph d'index.html, ce lien arrive dans WhatsApp avec le
 * logo yaz et le titre.
 */
export const APP_URL = 'https://tamaspeak.com'

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
    APP_URL,
  ].join('\n')

/** Carte de fin d'unité (le médaillon tabzimt). */
export const unitShare = ({ courseName, unitLabel, unitTitle }) =>
  ['ⵣ Tama Speak', `${courseName} — ${unitLabel} terminée !`, `« ${unitTitle} »`, 'Médaillon gagné 🏅', APP_URL].join('\n')

/** Carte de profil : une ligne par langue commencée. */
export const profileShare = ({ name, lines, totalXp }) =>
  [
    'ⵣ Tama Speak',
    name ? `${name} apprend les langues amazighes :` : 'J’apprends les langues amazighes :',
    ...lines,
    `Total : ${totalXp} XP`,
    APP_URL,
  ].join('\n')

/** Invitation à un défi. */
export const duelInvite = ({ name, courseName, correct, total }) =>
  [
    'ⵣ Tama Speak — je te défie !',
    `${courseName} · ${scoreBar(correct, total)} ${correct}/${total}`,
    name ? `Feras-tu mieux que ${name} ?` : 'Feras-tu mieux ?',
  ].join('\n')

/** Invitation à un duel de Mémory (le moins de coups gagne). */
export const memoryInvite = ({ name, courseName, coups, paires }) =>
  [
    'ⵣ Tama Speak — duel de Mémory !',
    `${courseName} · ${paires} paires en ${coups} coups 🃏`,
    name ? `Feras-tu moins de coups que ${name} ?` : 'Feras-tu moins de coups ?',
  ].join('\n')

/** Réponse à un duel de Mémory relevé. */
export const memoryReply = ({ name, courseName, mine, theirs, paires }) => {
  const verdict = mine < theirs ? 'J’ai gagné ! 🎉' : mine === theirs ? 'Égalité ! 🤝' : 'Tu gardes l’avantage 💪'
  return [
    'ⵣ Tama Speak — duel de Mémory relevé',
    `${courseName} · ${paires} paires`,
    `moi : ${mine} coups · ${name || 'toi'} : ${theirs} coups`,
    verdict,
  ].join('\n')
}

/** Un temps de jeu lisible dans un message (« 1 min 23 s », « 47 s »). */
export const fmtTemps = (s) => (s >= 60 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s` : `${s} s`)

/** Invitation à un duel de mots croisés (la grille la plus vite remplie). */
export const motsInvite = ({ name, courseName, temps, mots }) =>
  [
    'ⵣ Tama Speak — duel de mots croisés !',
    `${courseName} · ${mots} mots en ${fmtTemps(temps)} ⏱️`,
    name ? `Rempliras-tu la grille plus vite que ${name} ?` : 'Rempliras-tu la grille plus vite ?',
  ].join('\n')

/** Réponse à un duel de mots croisés relevé. */
export const motsReply = ({ name, courseName, mine, theirs, mots }) => {
  const verdict = mine < theirs ? 'J’ai gagné ! 🎉' : mine === theirs ? 'Égalité ! 🤝' : 'Tu gardes l’avantage 💪'
  return [
    'ⵣ Tama Speak — duel de mots croisés relevé',
    `${courseName} · ${mots} mots`,
    `moi : ${fmtTemps(mine)} · ${name || 'toi'} : ${fmtTemps(theirs)}`,
    verdict,
  ].join('\n')
}

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
