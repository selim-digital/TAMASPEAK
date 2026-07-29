/**
 * Défi entre amis — SANS SERVEUR.
 *
 * L'astuce : le défi ne transporte pas les questions, seulement une GRAINE.
 * Les deux joueurs tirent leurs questions du même cours avec la même graine,
 * et obtiennent donc exactement les mêmes exercices dans le même ordre. Le
 * lien reste court et l'app fonctionne hors-ligne.
 *
 * Format du lien :  …/#d=<base64url({l,s,n,c,t,f,v,g,j})>
 *   l = langue · s = graine · n = nombre de questions
 *   c = score de celui qui défie · t = total · f = son pseudo
 *   v = empreinte du contenu · g = garde du score
 *   j = jeu ('memory' : duel de Mémory — c devient le nombre de COUPS,
 *       t le nombre de paires, et c'est le plus petit score qui gagne ;
 *       absent = défi de questions historique)
 *
 * DEUX FAILLES CORRIGÉES, dont une seule peut l'être vraiment sans serveur.
 *
 * 1. L'empreinte du contenu (`v`). La graine ne suffit pas : elle ne fixe que
 *    le TIRAGE, pas la banque dans laquelle on tire. Si le cours change entre
 *    le moment où le lien est créé et celui où il est ouvert, les deux joueurs
 *    ne répondent plus aux mêmes questions — sans que rien ne le signale. On
 *    transporte donc une empreinte de la banque, et l'app prévient au lieu de
 *    fausser silencieusement.
 *
 * 2. La garde du score (`g`). Les scores étaient modifiables à la main dans
 *    l'URL. La garde est un condensé du score, de la graine et du pseudo.
 *    ⚠️ CE N'EST PAS DE LA SÉCURITÉ : le code de l'app est public, quiconque
 *    veut fabriquer une garde valide le peut. Ça rend la triche VOLONTAIRE au
 *    lieu d'accidentelle, rien de plus — et l'app le dit à l'utilisateur
 *    plutôt que d'afficher un score truqué comme un score vérifié. Un score
 *    infalsifiable exige un serveur (chantier A).
 */

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hache une graine textuelle en entier 32 bits (FNV-1a). */
function hashSeed(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Nouvelle graine courte et lisible. */
export const makeSeed = () => Math.random().toString(36).slice(2, 8)

/**
 * Tire `n` éléments de `pool` de façon DÉTERMINISTE pour une graine donnée.
 * Mélange de Fisher-Yates piloté par le générateur à graine.
 */
export function seededPick(pool, n, seed) {
  const a = [...pool]
  const rnd = mulberry32(hashSeed(String(seed)))
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, Math.min(n, a.length))
}

/* ---------------- empreinte du contenu et garde ---------------- */

/**
 * Empreinte courte de la banque de questions d'un cours.
 *
 * On hache ce qui détermine réellement une question — son énoncé et sa
 * réponse — et non l'objet entier : reformuler un choix erroné ne doit pas
 * invalider les liens en circulation, alors que changer une réponse le doit.
 */
export function contentDigest(pool) {
  const canon = pool.map((ex) => `${ex.type}|${ex.prompt}|${ex.answer}`).join('')
  return hashSeed(`${pool.length}:${canon}`).toString(36)
}

/**
 * Garde du score — voir l'avertissement en tête de fichier : ce n'est PAS de
 * la sécurité, seulement de quoi rendre une modification à la main visible.
 */
function guard({ seed, correct, total, from }) {
  if (correct == null || total == null) return ''
  return hashSeed(`${seed}|${correct}|${total}|${from || ''}|tama`).toString(36)
}

/* ---------------- encodage du lien ---------------- */

const toB64Url = (s) =>
  btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const fromB64Url = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(escape(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))))
}

export function encodeDuel({ lang, seed, size, correct, total, from, version, jeu }) {
  return toB64Url(
    JSON.stringify({
      l: lang,
      s: seed,
      n: size,
      c: correct,
      t: total,
      f: from || '',
      v: version || '',
      ...(jeu && jeu !== 'quiz' ? { j: jeu } : {}),
      g: guard({ seed, correct, total, from }),
    }),
  )
}

export function decodeDuel(str) {
  try {
    const d = JSON.parse(fromB64Url(str))
    if (!d?.l || !d?.s) return null
    const duel = {
      lang: d.l,
      seed: d.s,
      size: d.n || 5,
      correct: d.c ?? null,
      total: d.t ?? null,
      from: d.f || '',
      version: d.v || '',
      jeu: d.j || 'quiz',
    }
    // Un lien d'avant cette version n'a pas de garde : on ne le déclare pas
    // truqué pour autant, seulement « non vérifiable ».
    duel.scoreVerifie = d.g ? d.g === guard(duel) : null
    return duel
  } catch {
    return null
  }
}

/** Le contenu a-t-il changé depuis la création du lien ? */
export const memeContenu = (duel, pool) =>
  !duel?.version || duel.version === contentDigest(pool)

/** Lien complet à envoyer à un ami (le hash survit à l'hébergement statique). */
export function duelUrl(duel) {
  const base = typeof location !== 'undefined' ? location.href.split('#')[0] : ''
  return `${base}#d=${encodeDuel(duel)}`
}

/** Lit un défi présent dans l'URL courante, s'il y en a un. */
export function readDuelFromUrl() {
  if (typeof location === 'undefined') return null
  const m = location.hash.match(/[#&]d=([A-Za-z0-9\-_]+)/)
  return m ? decodeDuel(m[1]) : null
}

/** Efface le défi de l'URL (sans recharger la page). */
export function clearDuelFromUrl() {
  if (typeof history === 'undefined') return
  history.replaceState(null, '', location.href.split('#')[0])
}
