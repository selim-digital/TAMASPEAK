/**
 * Génère les icônes PWA (PNG) du logo yaz — sans aucune dépendance.
 * Rasterizer maison : formes du logo échantillonnées sur un buffer RGBA
 * rendu en 2x puis réduit (anti-aliasing par supersampling), encodé PNG
 * via zlib (natif Node).
 *
 *   node scripts/gen-icons.mjs   →  public/icons/icon-192.png,
 *                                   icon-512.png, icon-maskable-512.png
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// ---------- encodeur PNG minimal (RGBA 8 bits) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // profondeur
  ihdr[9] = 6 // couleur RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filtre "None"
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- rasterizer ----------
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const TURQUOISE = hex('#10C4A8')
const CORAL = hex('#FF6F61')
const WHITE = [255, 255, 255]

function makeCanvas(size) {
  const px = Buffer.alloc(size * size * 4)
  const set = (x, y, [r, g, b]) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 4
    px[i] = r
    px[i + 1] = g
    px[i + 2] = b
    px[i + 3] = 255
  }
  const fillRoundedRect = (x0, y0, w, h, rad, col) => {
    for (let y = Math.floor(y0); y < y0 + h; y++)
      for (let x = Math.floor(x0); x < x0 + w; x++) {
        const dx = Math.max(x0 + rad - x, x - (x0 + w - 1 - rad), 0)
        const dy = Math.max(y0 + rad - y, y - (y0 + h - 1 - rad), 0)
        if (dx * dx + dy * dy <= rad * rad) set(x, y, col)
      }
  }
  const fillCircle = (cx, cy, r, col) => {
    for (let y = Math.ceil(cy - r); y <= cy + r; y++)
      for (let x = Math.ceil(cx - r); x <= cx + r; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, col)
      }
  }
  /** Trait à bouts ronds : cercles estampés le long de points échantillonnés. */
  const stroke = (points, widthPx, col) => {
    const r = widthPx / 2
    for (const [x, y] of points) fillCircle(x, y, r, col)
  }
  return { px, fillRoundedRect, fillCircle, stroke }
}

const lerp = (a, b, t) => a + (b - a) * t
const cubic = (p0, p1, p2, p3, t) => {
  const q = (a, b, c, d) =>
    lerp(lerp(lerp(a, b, t), lerp(b, c, t), t), lerp(lerp(b, c, t), lerp(c, d, t), t), t)
  return [q(p0[0], p1[0], p2[0], p3[0]), q(p0[1], p1[1], p2[1], p3[1])]
}
const linePts = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => [lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)])
const cubicPts = (p0, p1, p2, p3, n) => Array.from({ length: n + 1 }, (_, i) => cubic(p0, p1, p2, p3, i / n))

/** Dessine le logo (viewBox 42x46 du favicon) dans un carré `size`, glyphes à
 *  l'échelle `inner`. `rad` = arrondi du fond (0 = plein cadre, requis pour
 *  les icônes maskable/apple qui doivent être opaques bord à bord). */
function drawIcon(size, inner, rad = (size * 9) / 42) {
  const c = makeCanvas(size)
  c.fillRoundedRect(0, 0, size, size, rad, TURQUOISE)
  // repère : viewBox 42x46 centré, mis à l'échelle `inner`
  const s = (size / 46) * inner
  const ox = (size - 42 * s) / 2
  const oy = (size - 46 * s) / 2
  const P = (x, y) => [ox + x * s, oy + y * s]
  const sw = 5 * s
  c.stroke(linePts(P(21, 14), P(21, 40), Math.ceil(30 * s)), sw, WHITE) // fût
  c.stroke(cubicPts(P(9, 9), P(9, 18), P(33, 18), P(33, 9), Math.ceil(60 * s)), sw, WHITE) // bras
  c.stroke(linePts(P(13, 40), P(29, 40), Math.ceil(20 * s)), sw, WHITE) // base
  c.fillCircle(...P(21, 9), 4 * s, CORAL) // point de tête corail
  return c.px
}

/** Réduction 2x par moyenne en alpha PRÉMULTIPLIÉ (évite le liseré sombre
 *  le long des bords transparents). */
function downsample(px, size) {
  const out = Buffer.alloc((size / 2) * (size / 2) * 4)
  const at = (x, y, ch) => px[(y * size + x) * 4 + ch]
  for (let y = 0; y < size / 2; y++)
    for (let x = 0; x < size / 2; x++) {
      const xs = [2 * x, 2 * x + 1]
      const ys = [2 * y, 2 * y + 1]
      let aSum = 0
      const rgb = [0, 0, 0]
      for (const yy of ys)
        for (const xx of xs) {
          const a = at(xx, yy, 3)
          aSum += a
          for (let ch = 0; ch < 3; ch++) rgb[ch] += at(xx, yy, ch) * a
        }
      const o = (y * (size / 2) + x) * 4
      out[o + 3] = aSum >> 2
      for (let ch = 0; ch < 3; ch++) out[o + ch] = aSum ? Math.round(rgb[ch] / aSum) : 0
    }
  return out
}

const OUT = join(ROOT, 'public', 'icons')
mkdirSync(OUT, { recursive: true })
const make = (name, finalSize, inner, rad) => {
  const big = drawIcon(finalSize * 2, inner, rad === undefined ? undefined : rad)
  writeFileSync(join(OUT, name), encodePng(finalSize, downsample(big, finalSize * 2)))
  console.log('✓', name)
}
make('icon-192.png', 192, 0.92)
make('icon-512.png', 512, 0.92)
// maskable/apple : fond PLEIN CADRE (opaque bord à bord, le lanceur applique
// son propre masque) ; glyphes dans la zone sûre (80 % central).
make('icon-maskable-512.png', 512, 0.62, 0)
make('apple-touch-icon.png', 180, 0.8, 0)
