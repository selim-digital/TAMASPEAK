/**
 * Gabarits d'email — HTML de table, comme en 1999, parce que c'est ce que
 * les clients mail comprennent. Pas de SVG (Gmail/Outlook l'ignorent) : le
 * logo est le PNG déjà déployé avec la PWA (public/icon-192.png).
 *
 * Le ton suit la règle du produit : ON N'ACCUSE JAMAIS. La recherche sur ce
 * public (anxiété de la langue d'héritage) comme l'exemple de Duolingo
 * (notifications culpabilisantes devenues un mème) interdisent le
 * « tu nous manques 😢 » : chaque relance donne une RAISON de revenir,
 * jamais un reproche.
 */

const APP_URL = process.env.APP_URL || 'https://tamaspeak.vercel.app'
const LOGO = `${APP_URL}/icon-192.png`

/* Palette de la marque (index.css) en dur : les emails n'ont pas nos CSS. */
const C = {
  turquoise: '#10C4A8',
  turquoiseDeep: '#0a7a69',
  coral: '#FF6F61',
  cream: '#FDF8EF',
  ink: '#1E2530',
  inkSoft: '#5C6672',
  line: '#E8E0D2',
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Enveloppe commune : logo en tête, pied sobre, désabonnement si fourni. */
function shell({ body, unsubscribe }) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:${C.cream};font-family:'Segoe UI',system-ui,-apple-system,Roboto,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="440" cellpadding="0" cellspacing="0" style="max-width:440px;width:100%;">
        <tr><td align="center" style="padding-bottom:16px;">
          <img src="${LOGO}" width="56" height="56" alt="Tama Speak" style="border-radius:14px;display:block;">
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;padding:28px 24px;">
          ${body}
        </td></tr>
        <tr><td align="center" style="padding:16px 8px 0;font-size:11px;line-height:1.5;color:${C.inkSoft};">
          Tama Speak — apprends les langues amazighes, en famille.<br>
          ${
            unsubscribe
              ? `<a href="${esc(unsubscribe)}" style="color:${C.inkSoft};">Ne plus recevoir ces emails</a> — un clic suffit, sans se connecter.`
              : `Cet email t’a été envoyé parce que tu l’as demandé dans l’app.`
          }
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

const bouton = (url, texte) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 4px;"><tr>
     <td style="background:${C.turquoise};border-radius:12px;">
       <a href="${esc(url)}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;">${esc(texte)}</a>
     </td></tr></table>`

const h1 = (t) => `<h1 style="margin:0 0 8px;font-size:19px;line-height:1.3;">${t}</h1>`
const p = (t) => `<p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:${C.ink};">${t}</p>`
const petit = (t) => `<p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:${C.inkSoft};">${t}</p>`

/* ------------------------------------------------------------------ */
/* Les gabarits                                                        */
/* ------------------------------------------------------------------ */

const TEMPLATES = {
  /** Transactionnel — le lien magique de connexion. */
  'magic-link': ({ url }) =>
    shell({
      body:
        h1('Ta connexion à Tama Speak') +
        p('Appuie sur le bouton pour te connecter. Le lien est valable <b>10 minutes</b>.') +
        bouton(url, 'Me connecter') +
        petit('Si tu n’as pas demandé cette connexion, ignore simplement cet email — rien ne se passera.'),
    }),

  /** Transactionnel — après la création du compte. */
  bienvenue: ({ name }) =>
    shell({
      body:
        h1(`Ansuf${name ? ` ${esc(name)}` : ''} ! 🌿`) +
        p('Ton compte est prêt. Ta progression est maintenant <b>sauvegardée</b> : tu peux changer de téléphone, elle te suivra.') +
        p('L’app continue de fonctionner entièrement hors-ligne — le compte n’est qu’un filet de sécurité.') +
        bouton(APP_URL, 'Continuer ma langue'),
    }),

  /** Relance J+2 — donne une raison de revenir. Jamais de reproche. */
  'relance-j2': ({ name, langue, unsubscribe }) =>
    shell({
      unsubscribe,
      body:
        h1(`Une nouvelle chose à découvrir en ${esc(langue || 'amazigh')}`) +
        p(`${name ? esc(name) + ', ta' : 'Ta'} prochaine leçon t’attend — cinq minutes suffisent, et tu peux la faire <b>à deux</b> avec quelqu’un de la famille.`) +
        p('Tu peux aussi tenter une <b>mission</b> : poser une seule question à quelqu’un qui parle, et rapporter le mot dans ton lexique.') +
        bouton(APP_URL, 'Ouvrir Tama Speak') +
        petit('Chacun avance à son rythme. Cet email est le seul rappel de la semaine.'),
    }),

  /** Bilan J+7 — que du positif, on célèbre ce qui a été fait. */
  'bilan-j7': ({ name, xp = 0, lecons = 0, langue, unsubscribe }) =>
    shell({
      unsubscribe,
      body:
        h1('Ta première semaine 🎉') +
        p(
          lecons > 0
            ? `${name ? esc(name) + ', tu' : 'Tu'} as terminé <b>${lecons} leçon${lecons > 1 ? 's' : ''}</b> et gagné <b>${xp} XP</b> en ${esc(langue || 'amazigh')}. C’est ${lecons > 1 ? 'exactement comme ça' : 'comme ça'} qu’une langue revient : un peu, souvent.`
            : `Ta place t’attend — la première leçon de ${esc(langue || 'ta langue')} prend cinq minutes, et personne n’y est noté.`,
        ) +
        bouton(APP_URL, 'Continuer') +
        petit('Astuce : l’écran « À deux » se joue sur un seul téléphone, avec un parent ou un enfant.'),
    }),

  /** Résumé hebdomadaire — uniquement pour qui est actif ET l'a demandé. */
  'resume-hebdo': ({ name, xp = 0, lecons = 0, serie = 0, unsubscribe }) =>
    shell({
      unsubscribe,
      body:
        h1('Ta semaine en amazigh') +
        p(`${name ? esc(name) + ' : ' : ''}<b>${xp} XP</b>, <b>${lecons} leçon${lecons > 1 ? 's' : ''}</b>${serie > 1 ? `, série de <b>${serie} jours</b> 🔥` : ''}.`) +
        bouton(APP_URL, 'Reprendre'),
    }),
}

export function renderTemplate(name, data = {}) {
  const t = TEMPLATES[name]
  if (!t) throw new Error(`gabarit inconnu : ${name}`)
  return t(data)
}

export const templateNames = Object.keys(TEMPLATES)
