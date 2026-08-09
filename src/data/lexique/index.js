/**
 * LE DICTIONNAIRE ÉTENDU — les mots que l'app connaît sans (encore) les
 * enseigner.
 *
 * POURQUOI CETTE COUCHE EXISTE. Jusqu'ici, le dictionnaire ne contenait que
 * le vocabulaire des leçons : 269 formes, 141 notions. C'est honnête, mais
 * ce n'est pas un dictionnaire — et c'était vendu comme tel. Le parcours ne
 * peut pas grossir jusqu'à trois mille mots ; le dictionnaire, si.
 *
 * CE QUE ÇA NE CASSE PAS. La garantie d'origine tient toujours : chaque
 * entrée dit d'où elle vient. Un mot des leçons porte son unité et ses
 * leçons ; un mot d'ici porte « pas encore dans les leçons », affiché tel
 * quel dans la fiche. Le danger d'une seconde liste, c'était qu'elle mente
 * sur ce que l'app enseigne — impossible tant que l'entrée le dit.
 *
 * DEUX CONSÉQUENCES VOULUES :
 *
 *   1. LA FICHE D'ENREGISTREMENT NE GROSSIT PAS. lexique.csv et le manifeste
 *      audio restent la liste de ce que les leçons font dire : c'est elle
 *      qu'un locuteur enregistre. Trois mille mots à lire décourageraient
 *      quiconque, et l'app n'en jouerait que 269.
 *   2. CES MOTS SONT DERRIÈRE L'ABONNEMENT. Ils ne sont dans aucune unité,
 *      donc dans aucune unité libre — voir entreeDicoOuverte. La recherche,
 *      elle, les montre à tout le monde, comme le reste.
 *
 * ET ILS NOURRISSENT LES LEÇONS. C'est le deuxième temps du plan : quand on
 * écrit une unité, on pioche ici plutôt que d'inventer. `npm run gen:lexique`
 * sort la liste des candidats — les mots du dictionnaire qu'aucune leçon
 * n'enseigne encore.
 */
import { KAB } from './kab.js'

/** Les grands domaines, pour ranger et pour filtrer. */
export const THEMES = Object.freeze({
  corps: 'Le corps',
  famille: 'La famille',
  gens: 'Les gens',
  maison: 'La maison',
  village: 'Le village & la ville',
  manger: 'Manger & boire',
  animaux: 'Les animaux',
  nature: 'La nature',
  meteo: 'Le temps qu’il fait',
  temps: 'Le temps qui passe',
  nombres: 'Les nombres',
  couleurs: 'Les couleurs',
  travail: 'Le travail',
  objets: 'Les objets',
  verbes: 'Les verbes',
  qualites: 'Les qualités',
  outils: 'Les mots-outils',
  paroles: 'Les paroles',
})

/** Ce qu'est le mot — utile dans une fiche, et sûr à déterminer. */
export const TYPES = Object.freeze({
  nom: 'nom',
  verbe: 'verbe',
  adj: 'adjectif',
  outil: 'mot-outil',
  expr: 'expression',
})

/**
 * Le genre d'un nom, déduit de sa forme.
 *
 * Le nom amazigh porte son genre à l'œil nu : le féminin est encadré d'un t
 * (ta—t, ti—in), le masculin commence par une voyelle nue (a-, i-, u-). La
 * règle est assez régulière pour être appliquée mécaniquement — et quand la
 * forme ne dit rien, on ne dit rien non plus plutôt que de trancher.
 *
 * Elle ne s'applique QU'AUX NOMS : un impératif comme « azzel » commence
 * bien par a-, il n'a pas de genre pour autant.
 */
export function genreDe(mot, type) {
  if (type !== 'nom') return null
  const m = String(mot || '').toLowerCase()
  if (m.startsWith('ta') || m.startsWith('ti') || m.startsWith('tu')) return 'f'
  if (/^[aiu]/.test(m)) return 'm'
  return null
}

/**
 * Une entrée du lot, mise à la forme que le dictionnaire attend.
 * `enseigne: false` est ce qui la distingue partout ailleurs.
 */
function normaliser(lang, e) {
  return {
    lang,
    mot: e.mot,
    sens: [e.fr],
    type: e.type || 'nom',
    genre: genreDe(e.mot, e.type || 'nom'),
    theme: e.theme || null,
    note: e.note || null,
    enseigne: false,
  }
}

const LOTS = { kab: KAB }

/** Le lot d'une langue, ou un tableau vide si elle n'en a pas encore. */
export const lexiqueEtendu = (lang) => (LOTS[lang] || []).map((e) => normaliser(lang, e))

/** Toutes langues confondues. */
export const TOUS_LES_LOTS = Object.keys(LOTS).flatMap(lexiqueEtendu)
