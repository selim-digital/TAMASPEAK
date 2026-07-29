import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { warmAudioCache } from './lib/audio.js'

// Installation PWA (Android/Chrome) : l'événement part TRÈS tôt, souvent
// avant que React ne soit monté — on le capture ici et l'app le rejouera
// quand elle voudra proposer « Installer l'app ». Sans cette capture, le
// navigateur ne re-propose jamais et l'utilisateur ne voit AUCUN moyen
// d'installer.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__installPrompt = e
  window.dispatchEvent(new CustomEvent('tama-installable'))
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA : réchauffe le cache audio quand le navigateur est au repos.
if (import.meta.env.PROD) {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2500))
  window.addEventListener('load', () => idle(() => warmAudioCache()), { once: true })
}
