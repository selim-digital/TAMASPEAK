/**
 * La famille de Tama Speak (v3, style validé) — 6 silhouettes sans visage :
 * JAMAIS d'yeux ; émotion par posture, joues corail en ellipses larges et
 * basses SOUS la bouche, habits kabyles reconnaissables (fouta rayée,
 * amendil, burnous, agus). Akermus reste la mascotte-partenaire ; la famille
 * raconte le monde et encourage l'élève.
 */

export function AqcicFam({ height = 90 }) {
  const width = Math.round((height * 90) / 106)
  return (
    <svg width={width} height={height} viewBox="0 0 90 106" aria-hidden="true">
      <ellipse cx="45" cy="101" rx="19" ry="4" fill="rgba(0,0,0,.10)" />
      <rect x="20" y="52" width="8" height="23" rx="4" fill="#F1E4CE" />
      <rect x="62" y="52" width="8" height="23" rx="4" fill="#F1E4CE" />
      <path d="M45 46c11 0 17 7 17 17l3 25c1 7-9 10-20 10s-21-3-20-10l3-25c0-10 6-17 17-17z" fill="#FFF6E9" />
      <path d="M31 56c0-3.5 2-6 5-7v32c-3-1-5-3-5-6z" fill="#10C4A8" />
      <path d="M59 56c0-3.5-2-6-5-7v32c3-1 5-3 5-6z" fill="#10C4A8" />
      <rect x="29" y="74" width="32" height="5" rx="2.5" fill="#F0B429" />
      <line x1="29" y1="76.5" x2="61" y2="76.5" stroke="#D8442E" strokeWidth="1.4" />
      <circle cx="45" cy="32" r="15" fill="#F5DFC2" />
      <path d="M45 13c12 0 19 8 19 19l-4 2c-1-9-7-13-15-13s-14 4-15 13l-4-2c0-11 7-19 19-19z" fill="#2b2420" />
      <path d="M40 14q1-4 3-6M46 13q1-4 4-5" stroke="#2b2420" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M41 42q4 3.5 8 0" fill="none" stroke="#C77E5E" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="36" cy="45" rx="4.8" ry="2.5" fill="#FF6F61" opacity=".5" />
      <ellipse cx="54" cy="45" rx="4.8" ry="2.5" fill="#FF6F61" opacity=".5" />
      <ellipse cx="38" cy="98" rx="5.5" ry="3" fill="#2b2420" />
      <ellipse cx="52" cy="98" rx="5.5" ry="3" fill="#2b2420" />
    </svg>
  )
}

export function Taqcict({ height = 90 }) {
  const width = Math.round((height * 90) / 108)
  return (
    <svg width={width} height={height} viewBox="0 0 90 108" aria-hidden="true">
      <ellipse cx="45" cy="103" rx="20" ry="4" fill="rgba(0,0,0,.10)" />
      <rect x="18" y="34" width="8" height="27" rx="4" fill="#2b2420" />
      <circle cx="22" cy="63" r="3.4" fill="#D8442E" />
      <rect x="64" y="34" width="8" height="27" rx="4" fill="#2b2420" />
      <circle cx="68" cy="63" r="3.4" fill="#D8442E" />
      <path d="M45 20c14 0 20 9 20 22l6 42c1 8-12 12-26 12s-27-4-26-12l6-42c0-13 6-22 20-22z" fill="#FFF3E2" />
      <path d="M24 84h42" stroke="#F0B429" strokeWidth="5" />
      <path d="M23 90h44" stroke="#D8442E" strokeWidth="3" />
      <path d="M23 95h44" stroke="#1E2530" strokeWidth="1.6" />
      <circle cx="45" cy="34" r="15" fill="#F5DFC2" />
      <path d="M45 15c12 0 19 8 19 19l-4 2c-1-9-7-13-15-13s-14 4-15 13l-4-2c0-11 7-19 19-19z" fill="#2b2420" />
      <path d="M31 30q14-7 28 0" fill="none" stroke="#10C4A8" strokeWidth="4" strokeLinecap="round" />
      <path d="M41 44q4 3.5 8 0" fill="none" stroke="#C77E5E" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="36" cy="45.5" rx="5" ry="2.6" fill="#FF6F61" opacity=".5" />
      <ellipse cx="54" cy="45.5" rx="5" ry="2.6" fill="#FF6F61" opacity=".5" />
    </svg>
  )
}

export function YemmaFam({ height = 95 }) {
  const width = Math.round((height * 96) / 112)
  return (
    <svg width={width} height={height} viewBox="0 0 96 112" aria-hidden="true">
      <ellipse cx="48" cy="108" rx="21" ry="4" fill="rgba(0,0,0,.10)" />
      <rect x="15" y="58" width="9" height="25" rx="4.5" fill="#F1E4CE" />
      <rect x="72" y="58" width="9" height="25" rx="4.5" fill="#F1E4CE" />
      <path d="M48 34c15 0 22 9 22 22l5 34c1 8-12 12-27 12s-28-4-27-12l5-34c0-13 7-22 22-22z" fill="#FFF6E9" />
      <rect x="32" y="72" width="32" height="20" rx="4" fill="#F0B429" />
      <line x1="32" y1="78" x2="64" y2="78" stroke="#D8442E" strokeWidth="2.6" />
      <line x1="32" y1="84" x2="64" y2="84" stroke="#1E2530" strokeWidth="1.4" />
      <circle cx="48" cy="34" r="16" fill="#F5DFC2" />
      <path d="M48 14c13 0 21 8 21 20l-4 3c-2-9-8-14-17-14s-15 5-17 14l-4-3c0-12 8-20 21-20z" fill="#0a7a69" />
      <path d="M67 34l6-4M67 37l7-1" stroke="#0a7a69" strokeWidth="3" strokeLinecap="round" />
      <path d="M43 45q5 4 10 0" fill="none" stroke="#C77E5E" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="40" cy="46.5" rx="5" ry="2.7" fill="#FF6F61" opacity=".5" />
      <ellipse cx="56" cy="46.5" rx="5" ry="2.7" fill="#FF6F61" opacity=".5" />
      <path d="M41 56q7 7 14 0" fill="none" stroke="#BFC7CF" strokeWidth="1.3" />
      <circle cx="43" cy="58.8" r="1.9" fill="#BFC7CF" />
      <circle cx="53" cy="58.8" r="1.9" fill="#BFC7CF" />
      <path d="M48 59.6l2.6 2.6-2.6 2.6-2.6-2.6z" fill="#BFC7CF" />
    </svg>
  )
}

export function Baba({ height = 97 }) {
  const width = Math.round((height * 100) / 116)
  return (
    <svg width={width} height={height} viewBox="0 0 100 116" aria-hidden="true">
      <ellipse cx="50" cy="112" rx="23" ry="4" fill="rgba(0,0,0,.10)" />
      <path d="M50 22c16 0 24 10 24 24l4 42c1 9-13 13-28 13s-29-4-28-13l4-42c0-14 8-24 24-24z" fill="#F3E9D7" />
      <path d="M50 46v52" stroke="#0a7a69" strokeWidth="2.6" />
      <path d="M50 62l6 6-6 6-6-6z" fill="none" stroke="#0a7a69" strokeWidth="2.2" />
      <path d="M26 52c5-6 13-9 24-9s19 3 24 9" fill="none" stroke="#DFCFB2" strokeWidth="3" />
      <circle cx="50" cy="34" r="16" fill="#F5DFC2" />
      <path d="M50 15c12 0 20 7 21 18l-5 2c-1-8-7-12-16-12s-15 4-16 12l-5-2c1-11 9-18 21-18z" fill="#E7D9C0" />
      <path d="M50 42q-6-2-10 2M50 42q6-2 10 2" fill="none" stroke="#4a3f35" strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="37" cy="46" rx="4.6" ry="2.4" fill="#FF6F61" opacity=".38" />
      <ellipse cx="63" cy="46" rx="4.6" ry="2.4" fill="#FF6F61" opacity=".38" />
    </svg>
  )
}

export function Setti({ height = 93 }) {
  const width = Math.round((height * 96) / 112)
  return (
    <svg width={width} height={height} viewBox="0 0 96 112" aria-hidden="true">
      <ellipse cx="46" cy="108" rx="21" ry="4" fill="rgba(0,0,0,.10)" />
      <g transform="rotate(3 46 90)">
        <path d="M46 36c14 0 21 9 21 21l5 33c1 8-11 12-26 12s-27-4-26-12l5-33c0-12 7-21 21-21z" fill="#FFF6E9" />
        <path d="M28 62 L64 84" stroke="#2C7F4F" strokeWidth="7" strokeLinecap="round" opacity=".85" />
        <rect x="31" y="74" width="30" height="18" rx="4" fill="#F0B429" />
        <line x1="31" y1="80" x2="61" y2="80" stroke="#2C7F4F" strokeWidth="2.4" />
        <line x1="31" y1="85" x2="61" y2="85" stroke="#1E2530" strokeWidth="1.3" />
        <circle cx="46" cy="36" r="15" fill="#F5DFC2" />
        <path d="M46 17c12 0 20 7 20 19l-4 2c-1-8-7-12-16-12s-15 4-16 12l-4-2c0-12 8-19 20-19z" fill="#C9B18A" />
        <path d="M38 24q8-3 16 0" fill="none" stroke="#DDD7CC" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M41 46q5 3.5 10 0" fill="none" stroke="#C77E5E" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="38" cy="47" rx="4.6" ry="2.4" fill="#FF6F61" opacity=".45" />
        <ellipse cx="54" cy="47" rx="4.6" ry="2.4" fill="#FF6F61" opacity=".45" />
      </g>
      <path d="M78 58v40" stroke="#8a6d4a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M78 58q0-7-7-6" fill="none" stroke="#8a6d4a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function Jeddi({ height = 95 }) {
  const width = Math.round((height * 100) / 116)
  return (
    <svg width={width} height={height} viewBox="0 0 100 116" aria-hidden="true">
      <ellipse cx="52" cy="112" rx="22" ry="4" fill="rgba(0,0,0,.10)" />
      <g transform="rotate(-3 52 92)">
        <path d="M52 24c15 0 23 10 23 24l4 40c1 9-12 13-27 13s-28-4-27-13l4-40c0-14 8-24 23-24z" fill="#EFE3CF" />
        <path d="M52 8c11 0 19 7 20 18l-3 8H35l-3-8c1-11 9-18 20-18z" fill="#E0D0B2" />
        <path d="M52 8q2-5 0-8" fill="none" stroke="#E0D0B2" strokeWidth="3" strokeLinecap="round" />
        <circle cx="52" cy="36" r="14" fill="#F5DFC2" />
        <path d="M38 40c0 11 6 17 14 17s14-6 14-17q-7 4-14 4t-14-4z" fill="#E8E4DC" />
      </g>
      <path d="M22 60v38" stroke="#8a6d4a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 60q0-7 7-6" fill="none" stroke="#8a6d4a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * La famille au complet, avec les termes de parenté kabyles (vocabulaire de
 * l'app pour baba/yemma) et les messages d'encouragement de chacun.
 */
export const FAMILY = [
  {
    id: 'aqcic',
    name: 'Aqcic',
    role: 'le garçon',
    bio: 'Curieux et rapide, il connaît tous les raccourcis du village. Son gilet turquoise et sa ceinture agus ne tiennent jamais en place.',
    Comp: AqcicFam,
    cheers: ['On fait la course jusqu’à la leçon suivante ?', 'Encore une ! Tu vas y arriver.', 'Moi aussi j’apprends avec toi !'],
  },
  {
    id: 'taqcict',
    name: 'Taqcict',
    role: 'la fille',
    bio: 'Ses nattes aux perles corail dansent quand elle récite les mots. C’est elle qui gagne à tous les jeux de mémoire.',
    Comp: Taqcict,
    cheers: ['Yelha ! Tu apprends vite.', 'J’adore t’entendre prononcer les mots.', 'Continue, tu m’impressionnes !'],
  },
  {
    id: 'yemma',
    name: 'Yemma',
    role: 'la maman',
    bio: 'Amendil noué, fouta safran, collier d’argent : le cœur de la maison. « Yemma », c’est aussi un mot que tu apprends dans tes leçons.',
    Comp: YemmaFam,
    cheers: ['Igerrez ! On est fiers de toi.', 'Chaque mot te rapproche de nous.', 'Reviens demain, je t’attends ici.'],
  },
  {
    id: 'baba',
    name: 'Baba',
    role: 'le papa',
    bio: 'Son burnous sur les épaules, il pèse chaque mot comme un artisan pèse l’argent. « Baba » aussi est dans tes leçons !',
    Comp: Baba,
    cheers: ['Pas à pas, tu construis ta langue.', 'La régularité, c’est le secret.', 'Encore une leçon et tu me dépasses !'],
  },
  {
    id: 'setti',
    name: 'Setti',
    role: 'la grand-mère',
    bio: 'Gardienne des histoires, elle tisse les mots comme un tapis d’Aït Hichem — châle vert, fouta, et une canne qui connaît tout le monde.',
    Comp: Setti,
    cheers: ['Chaque mot que tu apprends me fait plaisir.', 'Tanemmirt d’apprendre notre langue.', 'Assieds-toi près de moi, on révise ?'],
  },
  {
    id: 'jeddi',
    name: 'Jeddi',
    role: 'le grand-père',
    bio: 'Capuche de burnous relevée, barbe blanche : sa canne connaît tous les sentiers du Djurdjura, et lui toutes les bonnes réponses.',
    Comp: Jeddi,
    cheers: ['À mon époque, on n’avait pas d’app pareille !', 'Ta série grandit, comme un olivier.', 'Azul ! Prêt pour la suite ?'],
  },
]

/** Membre et message du moment (rotation stable par compteur de leçons). */
export function cheerFor(count = 0) {
  const member = FAMILY[count % FAMILY.length]
  return { member, message: member.cheers[Math.floor(count / FAMILY.length) % member.cheers.length] }
}

/**
 * Le personnage qui porte un énoncé (champ `qui` des exercices).
 *
 * Rend `null` sur un identifiant inconnu plutôt que de lever : une faute de
 * frappe dans une donnée de cours doit retirer la bulle, jamais casser la
 * leçon en cours.
 */
export const findMember = (id) => (id ? FAMILY.find((m) => m.id === id) || null : null)

/**
 * Ce que chacun dit quand l'élève se trompe SUR SA phrase.
 *
 * Règle : le personnage REFORMULE, il ne juge pas. Aucune de ces répliques ne
 * dit « faux », « raté » ni « attention » — l'exercice a déjà signalé
 * l'erreur, le personnage est là pour qu'on réessaie sans honte.
 */
export const REFORMULE = {
  aqcic: 'Aqcic repose la question, moins vite.',
  taqcict: 'Taqcict recommence depuis le début.',
  yemma: 'Yemma le redit, en articulant.',
  baba: 'Baba l’explique autrement.',
  setti: 'Setti le répète comme on le disait chez elle.',
  jeddi: 'Jeddi le redit plus lentement.',
}
