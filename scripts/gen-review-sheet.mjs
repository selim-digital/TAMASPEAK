/**
 * Génère la fiche HTML de validation & d'enregistrement à partir de
 * public/audio/manifest.json (donc toujours en phase avec le contenu).
 *
 * Usage : node scripts/gen-review-sheet.mjs [chemin/sortie.html]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const out = process.argv[2] || join(root, 'fiche-validation.html')

const rows = JSON.parse(readFileSync(join(root, 'public', 'audio', 'manifest.json'), 'utf8'))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const isPhrase = (r) => r.kab.trim().includes(' ')
const words = rows.filter((r) => !isPhrase(r))
const phrases = rows.filter(isPhrase)

const tbody = (list, start) =>
  list
    .map(
      (r, i) => `        <tr><td class="num">${start + i}</td><td class="kab">${esc(r.kab)}</td><td>${esc(r.fr) || '<span class="todo">à préciser</span>'}</td><td><span class="file">${esc(r.file)}</span></td><td class="fix"></td><td class="ok">☐</td></tr>`,
    )
    .join('\n')

const html = `<title>Tama Speak — Fiche de validation &amp; enregistrement</title>
<style>
  :root{--bg:#f3ead9;--fg:#1E2530;--muted:#5a6470;--card:#fffaf1;--border:#e6dcc9;--sand:#F6EEE0;--sand2:#efe3cf;--turq:#10C4A8;--turq-d:#04A88F;--turq-dd:#0a7a69;--coral:#FF6F61;--font:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif;}
  @media (prefers-color-scheme:dark){:root{--bg:#13171d;--fg:#f1e9da;--muted:#a4abb6;--card:#1b212a;--border:#2a323d;--sand:#232b34;--sand2:#1a2027;--turq-dd:#3fd3bd;}}
  :root[data-theme="dark"]{--bg:#13171d;--fg:#f1e9da;--muted:#a4abb6;--card:#1b212a;--border:#2a323d;--sand:#232b34;--sand2:#1a2027;--turq-dd:#3fd3bd;}
  :root[data-theme="light"]{--bg:#f3ead9;--fg:#1E2530;--muted:#5a6470;--card:#fffaf1;--border:#e6dcc9;--sand:#F6EEE0;--sand2:#efe3cf;--turq-dd:#0a7a69;}
  *{box-sizing:border-box;} body{margin:0;}
  .wrap{font-family:var(--font);background:var(--bg);color:var(--fg);min-height:100vh;padding:44px 22px 70px;-webkit-font-smoothing:antialiased;}
  .container{max-width:960px;margin:0 auto;}
  .head{display:flex;align-items:center;gap:16px;}
  .mark{width:52px;height:52px;border-radius:15px;background:linear-gradient(145deg,var(--turq),var(--turq-d));display:grid;place-items:center;flex:none;}
  .head h1{font-size:clamp(21px,3.4vw,29px);margin:0;letter-spacing:-.02em;}
  .head .sub{font-size:12.5px;color:var(--muted);margin-top:3px;font-weight:600;}
  .lead{margin:18px 0 0;font-size:14px;line-height:1.65;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 18px;}
  .lead b{color:var(--turq-dd);}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;}
  @media (max-width:640px){.steps{grid-template-columns:1fr;}}
  .step{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 16px;}
  .step .n{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--coral);}
  .step h3{margin:5px 0 4px;font-size:14px;} .step p{margin:0;font-size:12px;color:var(--muted);line-height:1.5;}
  .seclabel{display:flex;align-items:center;gap:12px;margin:32px 0 12px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);}
  .seclabel::after{content:"";flex:1;height:1px;background:var(--border);}
  .tablewrap{overflow-x:auto;border:1px solid var(--border);border-radius:16px;background:var(--card);}
  table{border-collapse:collapse;width:100%;min-width:660px;font-size:13.5px;}
  thead th{background:var(--sand2);text-align:left;font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:11px 12px;border-bottom:1px solid var(--border);}
  tbody td{padding:11px 12px;border-bottom:1px solid var(--border);vertical-align:middle;}
  tbody tr:last-child td{border-bottom:none;}
  .kab{font-weight:800;font-size:15px;}
  .file{font-family:ui-monospace,Consolas,monospace;font-size:11.5px;color:var(--turq-dd);background:var(--sand);padding:3px 7px;border-radius:6px;white-space:nowrap;}
  .fix{width:150px;} .ok{width:44px;text-align:center;color:var(--muted);font-size:16px;}
  .num{color:var(--muted);width:30px;text-align:right;font-variant-numeric:tabular-nums;}
  .todo{color:var(--coral);font-style:italic;font-size:12px;}
  .tips{margin-top:24px;background:linear-gradient(150deg,rgba(16,196,168,.1),var(--card));border:1px solid var(--border);border-radius:16px;padding:18px 20px;}
  .tips h3{margin:0 0 10px;font-size:14px;}
  .tips ul{margin:0;padding-left:18px;font-size:13px;line-height:1.7;}
  code{font-family:ui-monospace,Consolas,monospace;background:var(--sand);padding:1px 5px;border-radius:5px;font-size:12px;}
  .foot{margin-top:24px;font-size:12.5px;color:var(--muted);line-height:1.6;text-align:center;}
  .foot b{color:var(--fg);}
  @media print{.wrap{padding:0;background:#fff;color:#000;}}
</style>

<div class="wrap"><div class="container">
  <div class="head">
    <div class="mark"><svg width="28" height="31" viewBox="0 0 42 46"><g stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M21 12V40"/><path d="M8 6 C8 16,34 16,34 6"/><path d="M12 40H30"/></g><circle cx="21" cy="7" r="4.6" fill="#FF6F61"/></svg></div>
    <div>
      <h1>Fiche de validation &amp; enregistrement</h1>
      <div class="sub">Tama Speak · Kabyle (taqbaylit) · ${rows.length} entrées — Unités 1 à 4</div>
    </div>
  </div>

  <div class="lead">
    Assalamu alaykum, et merci de nous aider bi-idniLlah 🙏 — Nous développons <b>Tama Speak</b>, une application pour apprendre le kabyle.
    Nous cherchons un <b>locuteur natif</b> pour deux choses simples : <b>(1) valider</b> l'orthographe et la traduction,
    et <b>(2) enregistrer</b> la prononciation (un court fichier audio par entrée).
  </div>

  <div class="steps">
    <div class="step"><div class="n">Étape 1</div><h3>Vérifier</h3><p>L'orthographe kabyle et la traduction sont-elles correctes ? Sinon, écris la correction dans la colonne prévue.</p></div>
    <div class="step"><div class="n">Étape 2</div><h3>Enregistrer</h3><p>Dis chaque mot / phrase à voix claire (un vocal de téléphone convient). Nomme le fichier comme indiqué.</p></div>
    <div class="step"><div class="n">Étape 3</div><h3>Renvoyer</h3><p>Renvoie les fichiers + cette fiche annotée. L'app jouera ta voix automatiquement.</p></div>
  </div>

  <div class="seclabel">Mots (${words.length})</div>
  <div class="tablewrap"><table>
    <thead><tr><th class="num">#</th><th>Kabyle (à valider)</th><th>Français</th><th>Fichier audio</th><th>✏️ Correction</th><th class="ok">✓</th></tr></thead>
    <tbody>
${tbody(words, 1)}
    </tbody>
  </table></div>

  <div class="seclabel">Phrases (${phrases.length})</div>
  <div class="tablewrap"><table>
    <thead><tr><th class="num">#</th><th>Kabyle (à valider)</th><th>Français</th><th>Fichier audio</th><th>✏️ Correction</th><th class="ok">✓</th></tr></thead>
    <tbody>
${tbody(phrases, words.length + 1)}
    </tbody>
  </table></div>

  <div class="tips">
    <h3>Conseils d'enregistrement</h3>
    <ul>
      <li>Un fichier <b>par entrée</b>, format <code>.mp3</code> (ou vocal WhatsApp, on convertira).</li>
      <li>Voix claire, débit posé, <b>une seule prise</b> ; petit silence au début et à la fin.</li>
      <li>Endroit calme, sans bruit de fond.</li>
      <li>Respecte le <b>nom de fichier</b> exact indiqué (ex. <code>azul-fell-ak.mp3</code>).</li>
      <li>Si un mot a des variantes régionales, signale-le nous.</li>
    </ul>
  </div>

  <div class="foot">
    <b>Note :</b> fiche <b>générée automatiquement</b> depuis le contenu de l'app (<code>npm run gen:audio</code> puis <code>node scripts/gen-review-sheet.mjs</code>).<br>
    En attendant tes enregistrements, l'app utilise une voix de synthèse clairement marquée « voix provisoire ». BarakaLlahu fikum.
  </div>
</div></div>
`

writeFileSync(out, html)
console.log(`Fiche générée : ${out} (${rows.length} entrées — ${words.length} mots, ${phrases.length} phrases)`)
