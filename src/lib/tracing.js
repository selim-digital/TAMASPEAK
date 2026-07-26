/**
 * Correction du tracé manuscrit — sans IA, et sans gabarit dessiné à la main.
 *
 * Le gabarit, c'est la police elle-même. « Noto Sans Tifinagh » est déjà
 * embarquée dans l'app (src/fonts/tifinagh.css) : on rend le caractère dans un
 * canvas hors écran et on compare pixel à pixel avec ce que l'élève a tracé.
 * Aucune forme n'est donc inventée ni approximée — la référence est la vraie
 * lettre, telle que l'IRCAM la normalise.
 *
 * Deux mesures, parce qu'une seule se triche :
 *   • précision — la part du tracé de l'élève qui tombe SUR la lettre ;
 *     sans elle, gribouiller toute la case donnerait un sans-faute.
 *   • rappel — la part de la lettre effectivement couverte ; sans lui, un seul
 *     petit trait bien placé suffirait.
 *
 * La tolérance est volontairement large. On apprend à écrire une écriture que
 * la plupart des apprenants n'ont jamais tracée de leur vie : le but est
 * qu'ils reconnaissent le geste, pas qu'ils calligraphient.
 */

const FAMILLE = '"Noto Sans Tifinagh", Ebrima, "Segoe UI", sans-serif'

/** La police est chargée à la demande : sans elle, le gabarit serait faux. */
export async function policePrete(px = 64) {
  if (typeof document === 'undefined' || !document.fonts) return false
  try {
    await document.fonts.load(`${px}px ${FAMILLE}`)
    await document.fonts.ready
    return true
  } catch {
    return false
  }
}

function contexte(l, h) {
  const c = document.createElement('canvas')
  c.width = l
  c.height = h
  return c.getContext('2d', { willReadFrequently: true })
}

/**
 * Pose le texte ajusté à la boîte. `dilatation` > 0 l'épaissit — c'est ainsi
 * qu'on fabrique la zone de tolérance, sans coûteuse morphologie.
 */
export function dessinerModele(ctx, texte, l, h, { couleur = '#000', dilatation = 0 } = {}) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let px = h * 0.62
  ctx.font = `${px}px ${FAMILLE}`
  const largeurMax = l * 0.84
  const mesure = ctx.measureText(texte).width
  if (mesure > largeurMax && mesure > 0) {
    px = Math.max(8, px * (largeurMax / mesure))
    ctx.font = `${px}px ${FAMILLE}`
  }
  ctx.fillStyle = couleur
  ctx.fillText(texte, l / 2, h / 2)
  if (dilatation > 0) {
    ctx.lineWidth = dilatation * 2
    ctx.lineJoin = 'round'
    ctx.strokeStyle = couleur
    ctx.strokeText(texte, l / 2, h / 2)
  }
  ctx.restore()
  return px
}

/** Pose les traits de l'élève. Un point isolé compte comme un point d'encre. */
export function dessinerTraces(ctx, traces, { plume = 14, couleur = '#000' } = {}) {
  ctx.save()
  ctx.strokeStyle = couleur
  ctx.lineWidth = plume
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const trait of traces) {
    // Un trait absent ne doit jamais faire tomber le rendu : c'est un canvas,
    // pas une source de vérité.
    if (!trait?.length) continue
    ctx.beginPath()
    ctx.moveTo(trait[0].x, trait[0].y)
    if (trait.length === 1) ctx.lineTo(trait[0].x + 0.01, trait[0].y)
    else for (let i = 1; i < trait.length; i++) ctx.lineTo(trait[i].x, trait[i].y)
    ctx.stroke()
  }
  ctx.restore()
}

function masque(ctx, l, h) {
  const d = ctx.getImageData(0, 0, l, h).data
  const m = new Uint8Array(l * h)
  let n = 0
  for (let i = 0, p = 0; p < m.length; i += 4, p++) {
    if (d[i + 3] > 40) {
      m[p] = 1
      n++
    }
  }
  return { m, n }
}

const intersection = (a, b) => {
  let n = 0
  for (let i = 0; i < a.length; i++) if (a[i] && b[i]) n++
  return n
}

/**
 * Compare le tracé au caractère.
 * @returns {{precision:number, rappel:number, note:number}} note sur 100
 */
export function evaluerTrace({ texte, traces, largeur, hauteur, plume = 14, tolerance = 20 }) {
  const vide = { precision: 0, rappel: 0, note: 0 }
  if (!traces?.some((t) => t?.length)) return vide

  const cible = contexte(largeur, hauteur)
  dessinerModele(cible, texte, largeur, hauteur)
  const zone = contexte(largeur, hauteur)
  dessinerModele(zone, texte, largeur, hauteur, { dilatation: tolerance })
  const trace = contexte(largeur, hauteur)
  dessinerTraces(trace, traces, { plume })
  // Le tracé élargi sert à mesurer la couverture : un trait un peu à côté
  // doit quand même compter comme « cette partie de la lettre est faite ».
  const traceLarge = contexte(largeur, hauteur)
  dessinerTraces(traceLarge, traces, { plume: plume + tolerance * 2 })

  const C = masque(cible, largeur, hauteur)
  const Z = masque(zone, largeur, hauteur)
  const T = masque(trace, largeur, hauteur)
  const L = masque(traceLarge, largeur, hauteur)
  if (!T.n || !C.n) return vide

  const precision = intersection(T.m, Z.m) / T.n
  const rappel = intersection(C.m, L.m) / C.n
  // Moyenne harmonique : il faut les deux, l'une ne rachète pas l'autre.
  const note = precision + rappel > 0 ? Math.round((200 * precision * rappel) / (precision + rappel)) : 0
  return { precision, rappel, note }
}

/** Seuil volontairement bas : on encourage, on ne sanctionne pas. */
export const REUSSI = 55
