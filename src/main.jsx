import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { warmAudioCache } from './lib/audio.js'

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
