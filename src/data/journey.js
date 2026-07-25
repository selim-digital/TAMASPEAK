import kmont from '../assets/landscapes/kmont.svg'
import kcote from '../assets/landscapes/kcote.svg'
import rif from '../assets/landscapes/rif.svg'
import atlas from '../assets/landscapes/atlas.svg'
import aures from '../assets/landscapes/aures.svg'
import mzab from '../assets/landscapes/mzab.svg'
import ksar from '../assets/landscapes/ksar.svg'
import oasis from '../assets/landscapes/oasis.svg'
import dunes from '../assets/landscapes/dunes.svg'
import hoggar from '../assets/landscapes/hoggar.svg'
import tassili from '../assets/landscapes/tassili.svg'

/**
 * Le voyage de Tamazgha (validé v3) : chaque unité se joue dans un paysage
 * berbère — du village kabyle jusqu'au désert. Le Tassili (nuit étoilée)
 * attend les unités suivantes.
 */
export const JOURNEY = [
  { id: 'kmont', img: kmont, region: 'Kabylie — Djurdjura' },
  { id: 'kcote', img: kcote, region: 'Kabylie — la côte' },
  { id: 'rif', img: rif, region: 'Le Rif' },
  { id: 'atlas', img: atlas, region: 'Haut Atlas' },
  { id: 'aures', img: aures, region: 'Aurès — Ghoufi' },
  { id: 'mzab', img: mzab, region: 'Vallée du M’zab' },
  { id: 'ksar', img: ksar, region: 'Ksar du Sud' },
  { id: 'oasis', img: oasis, region: 'L’oasis' },
  { id: 'dunes', img: dunes, region: 'Grand Erg' },
  { id: 'hoggar', img: hoggar, region: 'Hoggar' },
  { id: 'tassili', img: tassili, region: 'Tassili n’Ajjer' },
]

/**
 * Voyage d'une langue : il commence TOUJOURS chez elle (le Rif pour le
 * tarifit, le Djurdjura pour le kabyle…), puis parcourt le reste de
 * Tamazgha.
 */
export function journeyFor(homeLandId) {
  const i = JOURNEY.findIndex((j) => j.id === homeLandId)
  if (i <= 0) return JOURNEY
  return [JOURNEY[i], ...JOURNEY.filter((_, k) => k !== i)]
}

/** Paysage de l'unité d'index donné (les unités au-delà restent au bout). */
export const landOf = (unitIndex, homeLandId) => {
  const route = homeLandId ? journeyFor(homeLandId) : JOURNEY
  return route[Math.min(unitIndex, route.length - 1)]
}

/** Paysages adressables par nom — chaque langue a le sien (voir languages.js). */
export const LAND_BY_ID = { kmont, kcote, dunes, tassili, hoggar, ksar, aures, atlas, rif, mzab, oasis }
