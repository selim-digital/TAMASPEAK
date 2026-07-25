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
  { img: kmont, region: 'Kabylie — Djurdjura' },
  { img: kcote, region: 'Kabylie — la côte' },
  { img: rif, region: 'Le Rif' },
  { img: atlas, region: 'Haut Atlas' },
  { img: aures, region: 'Aurès — Ghoufi' },
  { img: mzab, region: 'Vallée du M’zab' },
  { img: ksar, region: 'Ksar du Sud' },
  { img: oasis, region: 'L’oasis' },
  { img: dunes, region: 'Grand Erg' },
  { img: hoggar, region: 'Hoggar' },
  { img: tassili, region: 'Tassili n’Ajjer' },
]

/** Paysage de l'unité d'index donné (les unités au-delà restent au Tassili). */
export const landOf = (unitIndex) => JOURNEY[Math.min(unitIndex, JOURNEY.length - 1)]

/** Paysages adressables par nom — chaque langue a le sien (voir languages.js). */
export const LAND_BY_ID = { kmont, kcote, dunes, tassili, hoggar, ksar, aures, atlas, rif, mzab, oasis }
