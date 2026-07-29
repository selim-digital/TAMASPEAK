/**
 * Logique des deux jeux d'entraînement — Mémory et Mots croisés.
 *
 * Tout le contenu est DÉRIVÉ du vocabulaire des cours (course.vocabulary()) :
 * aucune seconde liste de mots à maintenir, et les cinq langues amazighes
 * sont servies d'office. Le jour où un locuteur corrige un mot du cours,
 * les jeux suivent sans changement de code.
 *
 * Contrainte assumée pour le Mémory : pas de visages ni d'êtres vivants —
 * les cartes portent du TEXTE (mot amazigh ↔ sens français) et le dos des
 * cartes un motif géométrique de losanges, comme le filigrane du chemin.
 */

/** Normalise un mot (NFC : « ḍ » composé et décomposé doivent se confondre). */
const propre = (mot) => (mot || '').normalize('NFC').trim()

/** Découpe un mot en lettres — Array.from respecte ɣ, ḍ, ẓ, ṭ, ɛ… */
export const lettresDe = (mot) => Array.from(propre(mot).toLowerCase())

/**
 * Un mot « jouable » aux mots croisés : un seul token de lettres, sans
 * espace, tiret ni ponctuation (« Azul fell-ak » et « Labas ? » restent
 * dans les leçons, pas dans la grille).
 */
const jouable = (mot) => {
  const m = propre(mot)
  if (!/^\p{L}+$/u.test(m)) return false
  const n = lettresDe(m).length
  return n >= 2 && n <= 10
}

/** Mélange de Fisher-Yates (copie). */
export function melanger(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------------------------------------------------------------ */
/* Tifinagh                                                            */
/* ------------------------------------------------------------------ */

/**
 * Latin usuel → tifinaghe-IRCAM, lettre à lettre. Les valeurs reprennent
 * la table des 33 lettres de data/tifinagh.js (bloc Unicode U+2D30–2D7F),
 * complétée des graphies propres aux cours : č/ǧ du kabyle, š du tamazight
 * de l'Atlas (= c), ř du rifain (roulement du r).
 */
const LATIN_VERS_TIFINAGH = {
  a: 'ⴰ', b: 'ⴱ', c: 'ⵛ', č: 'ⵞ', d: 'ⴷ', ḍ: 'ⴹ', e: 'ⴻ', ɛ: 'ⵄ',
  f: 'ⴼ', g: 'ⴳ', ǧ: 'ⴵ', ɣ: 'ⵖ', h: 'ⵀ', ḥ: 'ⵃ', i: 'ⵉ', j: 'ⵊ',
  k: 'ⴽ', l: 'ⵍ', m: 'ⵎ', n: 'ⵏ', o: 'ⵓ', p: 'ⵒ', q: 'ⵇ', r: 'ⵔ',
  ř: 'ⵔ', ṛ: 'ⵕ', s: 'ⵙ', ṣ: 'ⵚ', š: 'ⵛ', t: 'ⵜ', ṭ: 'ⵟ', u: 'ⵓ',
  v: 'ⵠ', w: 'ⵡ', x: 'ⵅ', y: 'ⵢ', z: 'ⵣ', ẓ: 'ⵥ',
}

/** Le mot contient-il déjà du tifinagh (cours d'amazighe standard) ? */
export const estTifinagh = (mot) => /[ⴰ-⵿]/.test(mot || '')

/**
 * Écrit un mot du cours en tifinagh. Un mot déjà en tifinagh passe tel
 * quel ; les caractères inconnus (espace, tiret) restent en place.
 */
export function enTifinagh(mot) {
  return Array.from(propre(mot).toLowerCase())
    .map((l) => (l >= 'ⴰ' && l <= '⵿' ? l : LATIN_VERS_TIFINAGH[l] ?? l))
    .join('')
}

/* ------------------------------------------------------------------ */
/* Mémory                                                              */
/* ------------------------------------------------------------------ */

/**
 * Illustrations disponibles pour un cours : mot → identifiant de scène,
 * dérivé des exercices « image » (Scenes.jsx, style maison : formes
 * simples, silhouettes, AUCUN œil). Là encore, rien à maintenir en double.
 */
function scenesParMot(course) {
  const scenes = new Map()
  for (const ex of course.challengePool()) {
    if (ex.type === 'image' && ex.scene && ex.answer) {
      scenes.set(ex.answer.toLowerCase(), ex.scene)
    }
  }
  return scenes
}

/**
 * Tire `n` paires dans le vocabulaire du cours : le mot amazigh d'un côté,
 * son ILLUSTRATION de l'autre quand elle existe (priorité aux mots
 * illustrés), le sens français sinon. Ni mot ni sens ne se répètent dans
 * une même partie : deux paires au sens identique rendraient l'association
 * ambiguë, donc injuste. Les phrases longues sont écartées — une carte
 * doit se lire d'un coup d'œil.
 */
export function pairesMemoire(course, n = 6) {
  const scenes = scenesParMot(course)
  const vusMots = new Set()
  const vusSens = new Set()
  const candidats = []
  for (const unite of course.vocabulary()) {
    for (const { mot, sens } of unite.mots) {
      const m = propre(mot)
      // Certains sens du cours standard s'écrivent « azul — salut » : la
      // carte ne doit porter que le sens, pas la réponse.
      let s = (sens || '').trim()
      if (s.includes('—')) s = s.split('—').pop().trim()
      if (!m || !s) continue
      // Un mot de carte : des lettres (espace et tiret admis), pas de
      // ponctuation — « Labas ? » reste aux leçons. Et deux lettres au
      // moins : le cours standard enseigne des lettres seules (ⴹ, ⵏ…)
      // qui ne sont pas des mots à retenir.
      if (!/^[\p{L}\s-]+$/u.test(m)) continue
      if (Array.from(m.replace(/[\s-]/g, '')).length < 2) continue
      if (m.length > 14 || s.length > 16) continue
      const km = m.toLowerCase()
      const ks = s.toLowerCase()
      // Sens identique au mot (donnée incomplète du cours) : inassociable.
      if (km === ks) continue
      if (vusMots.has(km) || vusSens.has(ks)) continue
      vusMots.add(km)
      vusSens.add(ks)
      candidats.push({ mot: m, sens: s, scene: scenes.get(km) || null })
    }
  }
  const illustres = melanger(candidats.filter((c) => c.scene))
  const autres = melanger(candidats.filter((c) => !c.scene))
  return [...illustres, ...autres].slice(0, n)
}

/**
 * Le paquet de cartes d'une partie : deux cartes par paire — la face
 * « mot » (tifinagh + latin) et sa jumelle « scene » (illustration) ou
 * « sens » (texte français) — mélangées. `paire` relie les deux.
 */
export function cartesMemoire(paires) {
  return melanger(
    paires.flatMap((p, i) => [
      { id: `m${i}`, paire: i, face: 'mot', texte: p.mot, mot: p.mot },
      p.scene
        ? { id: `s${i}`, paire: i, face: 'scene', scene: p.scene, texte: p.sens, mot: p.mot }
        : { id: `s${i}`, paire: i, face: 'sens', texte: p.sens, mot: p.mot },
    ]),
  )
}

/* ------------------------------------------------------------------ */
/* Mots croisés — sélection des mots d'un niveau                       */
/* ------------------------------------------------------------------ */

const compteLettres = (mot) => {
  const c = {}
  for (const l of lettresDe(mot)) c[l] = (c[l] || 0) + 1
  return c
}

const tailleRoue = (roue) => Object.values(roue).reduce((s, n) => s + n, 0)

/**
 * Choisit les mots d'un niveau sous contrainte de roue : chaque mot doit
 * pouvoir s'épeler avec les lettres de la roue (multiplicité comprise),
 * et la roue reste petite pour tenir sous le pouce. Glouton : on ajoute
 * à chaque tour le mot qui coûte le moins de lettres nouvelles — à coût
 * égal, le plus long (plus intéressant à croiser).
 */
function choisirMots(candidats, { maxRoue = 8, maxMots = 5 } = {}) {
  const roue = {}
  const pris = []
  const reste = [...candidats]
  while (pris.length < maxMots && reste.length) {
    let meilleur = -1
    let meilleurCout = Infinity
    reste.forEach((c, i) => {
      const besoin = compteLettres(c.mot)
      let cout = 0
      for (const [l, n] of Object.entries(besoin)) cout += Math.max(0, n - (roue[l] || 0))
      if (tailleRoue(roue) + cout > maxRoue) return
      const long = lettresDe(c.mot).length
      const longMeilleur = meilleur >= 0 ? lettresDe(reste[meilleur].mot).length : -1
      if (cout < meilleurCout || (cout === meilleurCout && long > longMeilleur)) {
        meilleur = i
        meilleurCout = cout
      }
    })
    if (meilleur < 0) break
    const [choisi] = reste.splice(meilleur, 1)
    // La roue doit couvrir chaque mot individuellement : max par lettre.
    for (const [l, n] of Object.entries(compteLettres(choisi.mot))) {
      roue[l] = Math.max(roue[l] || 0, n)
    }
    pris.push(choisi)
  }
  const lettres = Object.entries(roue).flatMap(([l, n]) => Array(n).fill(l))
  return { mots: pris, lettres }
}

/* ------------------------------------------------------------------ */
/* Mots croisés — pose de la grille                                    */
/* ------------------------------------------------------------------ */

const cle = (x, y) => `${x},${y}`

/**
 * Pose les mots en grille croisée, façon mots croisés : le plus long
 * d'abord, à l'horizontale, puis chaque mot suivant vient CROISER une
 * lettre déjà posée quand c'est possible (perpendiculaire, sans créer de
 * mots parasites côte à côte). Déterministe — un même niveau garde la
 * même grille d'une partie à l'autre.
 */
export function poserGrille(mots) {
  const cellules = new Map() // "x,y" -> lettre
  const poses = []

  const emplacementValide = (lettres, x, y, dir) => {
    const dx = dir === 'h' ? 1 : 0
    const dy = dir === 'v' ? 1 : 0
    // Case avant le début et après la fin : vides, sinon deux mots se collent.
    if (cellules.has(cle(x - dx, y - dy))) return -1
    if (cellules.has(cle(x + dx * lettres.length, y + dy * lettres.length))) return -1
    let croisements = 0
    for (let i = 0; i < lettres.length; i++) {
      const cx = x + dx * i
      const cy = y + dy * i
      const existante = cellules.get(cle(cx, cy))
      if (existante !== undefined) {
        if (existante !== lettres[i]) return -1
        croisements++
      } else {
        // Une case neuve ne doit pas toucher latéralement un autre mot.
        if (cellules.has(cle(cx + dy, cy + dx)) || cellules.has(cle(cx - dy, cy - dx))) return -1
      }
    }
    return croisements
  }

  const poser = (m, x, y, dir) => {
    const lettres = lettresDe(m.mot)
    lettres.forEach((l, i) => {
      cellules.set(cle(x + (dir === 'h' ? i : 0), y + (dir === 'v' ? i : 0)), l)
    })
    poses.push({ ...m, x, y, dir, lettres })
  }

  const tries = [...mots].sort((a, b) => lettresDe(b.mot).length - lettresDe(a.mot).length)
  if (!tries.length) return { mots: [], w: 0, h: 0 }
  poser(tries[0], 0, 0, 'h')

  for (const m of tries.slice(1)) {
    const lettres = lettresDe(m.mot)
    let meilleur = null
    for (const pose of poses) {
      pose.lettres.forEach((l, j) => {
        const ix = pose.x + (pose.dir === 'h' ? j : 0)
        const iy = pose.y + (pose.dir === 'v' ? j : 0)
        const dir = pose.dir === 'h' ? 'v' : 'h'
        lettres.forEach((lm, i) => {
          if (lm !== l) return
          const x = dir === 'h' ? ix - i : ix
          const y = dir === 'v' ? iy - i : iy
          const score = emplacementValide(lettres, x, y, dir)
          if (score > 0 && (!meilleur || score > meilleur.score)) {
            meilleur = { x, y, dir, score }
          }
        })
      })
    }
    if (meilleur) {
      poser(m, meilleur.x, meilleur.y, meilleur.dir)
    } else {
      // Aucun croisement possible : le mot se pose seul, sous la grille.
      const maxY = Math.max(...poses.map((p) => p.y + (p.dir === 'v' ? p.lettres.length - 1 : 0)))
      poser(m, 0, maxY + 2, 'h')
    }
  }

  // Recale la grille en (0,0) et mesure son emprise.
  const minX = Math.min(...poses.map((p) => p.x))
  const minY = Math.min(...poses.map((p) => p.y))
  const decales = poses.map((p) => ({ ...p, x: p.x - minX, y: p.y - minY }))
  const w = Math.max(...decales.map((p) => p.x + (p.dir === 'h' ? p.lettres.length : 1)))
  const h = Math.max(...decales.map((p) => p.y + (p.dir === 'v' ? p.lettres.length : 1)))
  return { mots: decales, w, h }
}

/* ------------------------------------------------------------------ */
/* Mots croisés — les niveaux d'un cours                               */
/* ------------------------------------------------------------------ */

/**
 * Un niveau par unité du cours (3 à 5 mots qui se croisent). Les unités
 * trop pauvres en mots jouables (culture, histoire) sont sautées. La roue
 * est d'abord tenue à 8 lettres ; si l'unité ne fournit pas 3 mots sous
 * cette contrainte (les nombres, par exemple), on l'élargit à 10.
 */
export function niveauxMots(course) {
  const niveaux = []
  for (const unite of course.vocabulary()) {
    const vus = new Set()
    const candidats = []
    for (const { mot, sens } of unite.mots) {
      const m = propre(mot)
      if (!jouable(m) || !sens) continue
      const k = m.toLowerCase()
      if (vus.has(k)) continue
      vus.add(k)
      candidats.push({ mot: m, sens: sens.trim() })
    }
    if (candidats.length < 2) continue
    let choix = choisirMots(candidats, { maxRoue: 8 })
    if (choix.mots.length < 3) choix = choisirMots(candidats, { maxRoue: 10 })
    if (choix.mots.length < 2) continue
    const grille = poserGrille(choix.mots)
    niveaux.push({
      id: `${course.id}-${unite.id}`,
      titre: unite.label,
      lettres: melangerStable(choix.lettres, niveaux.length + 1),
      grille,
    })
  }
  return niveaux
}

/**
 * Mélange DÉTERMINISTE des lettres de la roue (petit générateur congruentiel) :
 * l'ordre ne doit pas épeler le mot, mais doit rester le même d'une
 * ouverture à l'autre — un niveau est un lieu, pas un tirage.
 */
function melangerStable(arr, graine) {
  const a = [...arr]
  let s = graine * 2654435761 % 4294967296
  const alea = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
