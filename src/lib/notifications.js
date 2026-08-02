/**
 * Notifications in-app — calculées à la volée, jamais stockées.
 *
 * Le store ne retient que les identifiants LUS (`notifsLues`) : les
 * notifications elles-mêmes sont dérivées de l'état du moment, donc jamais
 * périmées, jamais en double, et rien à purger.
 *
 * Règle d'écriture, héritée de la recherche (l'anxiété est le premier
 * blocage de ce public, et Duolingo a documenté l'échec de ses rappels
 * culpabilisants) : CHAQUE message donne une raison de revenir ou célèbre
 * un acquis. Jamais de reproche, jamais de « tu nous manques ».
 */
import { xpToday } from './progress.js'
import { ECRANS } from '../data/screens.js'

const aujourdhui = () => new Date().toISOString().slice(0, 10)
const hier = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10)

/**
 * Les nouveautés de l'app — une entrée par fonctionnalité livrée, id stable.
 * On n'en montre que les TROIS plus récentes : un centre de notifications
 * n'est pas un journal des versions.
 */
const NOUVEAUTES = [
  {
    id: 'nv-tifinagh',
    kind: 'nouveaute',
    title: 'Écrire le tifinagh ⵣ',
    body: 'Trace les 33 lettres au doigt — puis des mots entiers.',
    ecran: ECRANS.TIFINAGH,
    action: 'Essayer →',
  },
  {
    id: 'nv-adeux',
    kind: 'nouveaute',
    title: 'Apprendre à deux',
    body: 'Un seul téléphone, deux joueurs qui alternent. Parfait entre parent et enfant.',
    ecran: ECRANS.DUO,
    action: 'Jouer →',
  },
  {
    id: 'nv-missions',
    kind: 'nouveaute',
    title: 'Les missions',
    body: 'Va poser une question à quelqu’un qui parle, et rapporte le mot dans ton lexique.',
    ecran: ECRANS.MISSIONS,
    action: 'Voir les missions →',
  },
]

/**
 * Les notifications du moment pour cet état de l'app.
 * @returns {Array<{id, kind, title, body}>} les non-lues d'abord exclues ailleurs
 */
export function notificationsPour(store, course, progress) {
  const notifs = []
  const goal = store.profile?.dailyGoalXp
  const gagne = xpToday(progress)

  // La série d'hier attend sa suite — on célèbre l'acquis, on n'accuse pas.
  if (progress.lastDay === hier() && (progress.streak || 0) >= 2) {
    notifs.push({
      id: `serie-${aujourdhui()}`,
      kind: 'serie',
      title: `Ta série de ${progress.streak} jours t'attend 🔥`,
      body: `Une leçon de ${course.name} aujourd'hui, et elle continue.`,
      ecran: ECRANS.CHEMIN,
      action: 'Continuer ma leçon →',
    })
  }

  // Objectif du jour entamé mais pas atteint : encourager la dernière marche.
  if (goal && gagne > 0 && gagne < goal) {
    notifs.push({
      id: `objectif-${aujourdhui()}`,
      kind: 'objectif',
      title: `Plus que ${goal - gagne} XP aujourd'hui`,
      body: 'Une petite leçon et l’objectif du jour est à toi.',
      ecran: ECRANS.CHEMIN,
      action: 'Y aller →',
    })
  }

  return [...notifs, ...NOUVEAUTES.slice(0, 3)]
}

/** Celles que l'élève n'a pas encore ouvertes. */
export function nonLues(store, course, progress) {
  const lues = new Set(store.notifsLues || [])
  return notificationsPour(store, course, progress).filter((n) => !lues.has(n.id))
}

/**
 * Marque tout comme lu — en ne gardant que les ids ENCORE pertinents plus
 * les nouveaux : les ids datés d'hier sortent tout seuls de la liste, le
 * store ne grossit jamais.
 */
export function toutMarquerLu(store, course, progress) {
  const actuels = notificationsPour(store, course, progress).map((n) => n.id)
  return { ...store, notifsLues: actuels }
}
