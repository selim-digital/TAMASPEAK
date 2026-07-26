/**
 * Les missions — le seul contenu de l'app qui sort de l'app.
 *
 * L'apprenant va poser une question à quelqu'un qui parle la langue, puis
 * revient noter la réponse. Le mot recueilli entre dans son lexique
 * personnel, avec le nom de qui l'a dit.
 *
 * Pourquoi ce détour plutôt qu'une leçon de plus : les dispositifs de
 * revitalisation qui fonctionnent (master-apprentice, FirstVoices) outillent
 * la relation avec un aîné au lieu de s'y substituer. Une app ne remplacera
 * jamais une grand-mère ; elle peut donner le prétexte d'aller la voir.
 *
 * Et parce que chaque village dit les choses à sa façon, ce lexique est le
 * seul endroit de l'app où le parler d'une famille prime sur la norme —
 * ce que Duolingo écrase, et ce que la communauté galloise a précisément
 * reproché à Duolingo quand son cours a rejeté les variantes du nord.
 */

/**
 * `pour` cible la motivation déclarée à l'onboarding (`profile.reason`) :
 * 'racines' | 'proches' | 'culture' | 'defi'. Une mission sans `pour`
 * convient à tout le monde.
 */
export const MISSIONS = [
  {
    id: 'salut-maison',
    titre: 'La salutation de la maison',
    consigne:
      'Demande à quelqu’un de ta famille comment on se salue chez vous, le matin. Note sa réponse exactement comme il ou elle la prononce.',
    aide: 'Il y a souvent plusieurs façons : celle des voisins, celle des anciens, celle qu’on dit aux enfants.',
    exemple: 'Sbaḥ lxir',
  },
  {
    id: 'surnom',
    titre: 'Ton surnom d’enfance',
    consigne:
      'Demande comment on t’appelait petit — le mot tendre, celui qu’on ne dit qu’en famille. Note-le.',
    aide: 'Ce mot-là n’est dans aucun dictionnaire. C’est justement pour ça qu’il compte.',
    pour: 'racines',
  },
  {
    id: 'plat',
    titre: 'Le plat du vendredi',
    consigne:
      'Demande le nom, dans la langue, du plat qu’on prépare chez vous les jours de fête. Note-le avec ce qu’il désigne.',
    aide: 'Si deux personnes te donnent deux noms différents, garde celui de la plus âgée — et note l’autre aussi.',
    exemple: 'Seksu — le couscous',
  },
  {
    id: 'proverbe',
    titre: 'Un proverbe entier',
    consigne:
      'Demande un proverbe que ta famille répète. Note-le dans la langue, puis ce qu’il veut dire.',
    aide: 'Ne cherche pas à le traduire mot à mot. Demande plutôt : « on le dit quand ? »',
    pour: 'culture',
  },
  {
    id: 'village',
    titre: 'Le nom du lieu',
    consigne:
      'Demande le nom de ton village ou de ton quartier d’origine dans la langue, et ce que ce nom veut dire.',
    aide: 'Beaucoup de noms de lieux amazighs décrivent le terrain : la source, le col, le rocher.',
    pour: 'racines',
  },
  {
    id: 'compter-mains',
    titre: 'Compter sur les doigts',
    consigne:
      'Fais compter jusqu’à cinq à voix haute. Note les nombres tels que tu les entends.',
    aide: 'Dans plusieurs variétés, les nombres au-delà de deux sont empruntés à l’arabe — c’est normal, note ce qui est dit.',
  },
  {
    id: 'travail',
    titre: 'Le métier d’avant',
    consigne:
      'Demande comment se dit le métier qu’exerçait ton grand-père ou ta grand-mère. Note le mot.',
    aide: 'Certains de ces mots disparaissent avec le métier. C’est le moment de les prendre.',
    pour: 'racines',
  },
  {
    id: 'meteo',
    titre: 'Le temps qu’il fait',
    consigne: 'Demande comment on dit qu’il fait froid, puis qu’il fait chaud. Note les deux.',
    aide: 'Commence par celle-là si tu n’oses pas encore : c’est la question la plus facile à poser.',
    pour: 'defi',
  },
  {
    id: 'phrase-quotidienne',
    titre: 'La phrase de tous les jours',
    consigne:
      'Demande une phrase que ta mère ou ton père répétait souvent. Note-la entière, telle quelle.',
    aide: 'Une phrase entière vaut mieux que dix mots isolés : c’est la musique qui manque le plus.',
    pour: 'proches',
  },
  {
    id: 'oser',
    titre: 'Dire une phrase à voix haute',
    consigne:
      'Choisis une phrase déjà apprise, dis-la à quelqu’un qui parle la langue, et note ce qu’il ou elle t’a répondu.',
    aide: 'Le but n’est pas d’être corrigé — c’est d’avoir parlé une fois. Personne ne note personne.',
    pour: 'proches',
  },
]

/**
 * Missions à proposer : celles qui n'ont pas été faites, la motivation
 * déclarée d'abord. On ne cache jamais les autres — on les met après.
 */
export function missionsPour(reason, faites = []) {
  const restantes = MISSIONS.filter((m) => !faites.includes(m.id))
  const pertinentes = restantes.filter((m) => m.pour === reason)
  const communes = restantes.filter((m) => !m.pour)
  const autres = restantes.filter((m) => m.pour && m.pour !== reason)
  return [...pertinentes, ...communes, ...autres]
}

export const findMission = (id) => MISSIONS.find((m) => m.id === id)
