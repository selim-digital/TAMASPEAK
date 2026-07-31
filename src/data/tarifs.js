/**
 * Les tarifs — SOURCE DE VÉRITÉ UNIQUE, lue par l'app ET par le serveur
 * (api/billing.js importe ce fichier). Un prix ne doit jamais exister à deux
 * endroits : l'écart entre ce qui est affiché et ce qui est débité est la
 * faute la plus coûteuse en confiance qu'une app payante puisse commettre.
 *
 * Deux zones, décision produit :
 *
 *   • NORD — Europe & Amériques : 4,99 €/mois, 14,99 €/mois en famille ;
 *   • SUD  — Afrique & Asie     : 1,99 €/mois,  5,99 €/mois en famille.
 *
 * Ce n'est pas une remise commerciale, c'est le cœur du projet : une app qui
 * enseigne les langues amazighes et resterait inaccessible en Afrique du Nord
 * aurait manqué son sujet. Le prix suit le pouvoir d'achat, pas l'inverse.
 *
 * Les MONTANTS ne vivent pas ici — ils vivent chez Stripe (Prices), et
 * seul Stripe débite. Ce fichier porte l'AFFICHAGE et la zone ; les
 * identifiants de Price sont des variables d'environnement (voir
 * .env.example). Toucher un prix se fait donc en deux gestes volontaires :
 * un nouveau Price chez Stripe, la chaîne affichée ici.
 */

export const ZONES = Object.freeze({ NORD: 'nord', SUD: 'sud' })

/** Le pack famille couvre QUATRE personnes : le titulaire + 3 proches. */
export const FAMILLE_TAILLE = 4
export const FAMILLE_INVITES = FAMILLE_TAILLE - 1

/** Essai gratuit à l'ouverture d'un abonnement (jours, appliqué par Stripe). */
export const ESSAI_JOURS = 7

/**
 * Ce qui reste gratuit POUR TOUJOURS, sans compte et sans carte : la
 * première unité de chaque cours. On ne demande pas à quelqu'un de payer
 * pour découvrir une langue qu'il n'a peut-être jamais entendue.
 * Les jeux, le tifinagh, l'histoire, le cercle et les défis restent libres :
 * ce sont eux qui font venir la famille.
 */
export const UNITES_LIBRES = 1

export const TARIFS = Object.freeze({
  nord: {
    id: 'nord',
    libelle: 'Europe & Amériques',
    solo: { prix: '4,99 €', parMois: '4,99 €/mois' },
    famille: { prix: '14,99 €', parMois: '14,99 €/mois' },
  },
  sud: {
    id: 'sud',
    libelle: 'Afrique & Asie',
    solo: { prix: '1,99 €', parMois: '1,99 €/mois' },
    famille: { prix: '5,99 €', parMois: '5,99 €/mois' },
  },
})

export const PLANS = Object.freeze({
  solo: {
    id: 'solo',
    nom: 'Une personne',
    detail: 'Tous les cours, toutes les unités, sur tous tes appareils.',
  },
  famille: {
    id: 'famille',
    nom: `Famille — ${FAMILLE_TAILLE} personnes`,
    detail: `Toi et ${FAMILLE_INVITES} proches, chacun sa progression, une seule facture.`,
  },
})

/**
 * Les pays de la zone SUD (Afrique + Asie), en ISO 3166-1 alpha-2.
 *
 * Tout ce qui n'est pas listé ici tombe en zone NORD — y compris l'Océanie et
 * les pays inconnus. C'est le sens du défaut : mieux vaut proposer le tarif
 * haut à quelqu'un qui pourra demander l'autre que débiter trop peu par
 * mégarde. La zone est décidée SUR LE SERVEUR (en-tête géo de Vercel), jamais
 * par le navigateur : sinon n'importe qui choisirait son prix.
 */
const AFRIQUE = [
  'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CD', 'CG',
  'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE',
  'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG',
  'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG',
  'ZM', 'ZW', 'EH', 'YT', 'RE', 'SH',
]

const ASIE = [
  'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'HK', 'IN',
  'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MO', 'MY',
  'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR',
  'LK', 'SY', 'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE',
]

/**
 * L'EXCEPTION QUI PRIME SUR LA GÉOGRAPHIE : les pays à revenu élevé d'Afrique
 * et d'Asie paient le tarif du Nord.
 *
 * Le tarif bas existe pour le pouvoir d'achat, pas pour le continent. Le
 * Japon, la Corée, Singapour ou les monarchies du Golfe sont en Asie sur une
 * carte, mais quelqu'un qui s'abonne depuis Tokyo ou Doha n'a pas besoin
 * qu'on lui fasse 60 % de remise — et cette remise-là est financée par les
 * abonnés d'Europe. La Réunion et Mayotte sont des départements français
 * (euro, salaires français) : rien ne justifiait qu'ils soient au tarif
 * d'Alger.
 *
 * Le critère retenu, pour qu'il soit vérifiable et pas arbitraire : la
 * catégorie « revenu élevé » (high income) de la Banque mondiale. Les pays à
 * revenu intermédiaire — Turquie, Malaisie, Chine, Kazakhstan, Maurice… —
 * restent volontairement au tarif du Sud.
 */
const REVENU_ELEVE = [
  // Asie de l'Est et du Sud-Est
  'JP', 'KR', 'SG', 'HK', 'MO', 'TW', 'BN',
  // Golfe et Proche-Orient
  'AE', 'QA', 'KW', 'BH', 'OM', 'SA', 'IL', 'CY',
  // Afrique et océan Indien
  'SC', 'RE', 'YT',
]

const PAYS_SUD = new Set([...AFRIQUE, ...ASIE])
const PAYS_RICHES = new Set(REVENU_ELEVE)

/** La zone tarifaire d'un code pays ISO (insensible à la casse). */
export function zoneDuPays(code) {
  const c = String(code || '').trim().toUpperCase()
  // L'exception d'abord : elle est faite pour l'emporter sur la géographie.
  if (PAYS_RICHES.has(c)) return ZONES.NORD
  return PAYS_SUD.has(c) ? ZONES.SUD : ZONES.NORD
}

/** Les tarifs d'une zone, avec repli sur le nord si la zone est inconnue. */
export function tarifsDe(zone) {
  return TARIFS[zone] || TARIFS[ZONES.NORD]
}
