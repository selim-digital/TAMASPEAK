import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { VitePWA } from 'vite-plugin-pwa'

// SINGLEFILE=1 npm run build  → produit un seul fichier HTML autonome
// (tout le JS/CSS inliné) pour partage/démo hors-ligne.
// Build normal → PWA installable (manifest + service worker, leçons et
// audio pré-cachés pour un usage hors-ligne).
const singleFile = process.env.SINGLEFILE === '1'

// NB maintenance : registerType 'autoUpdate' (skipWaiting + clientsClaim)
// convient tant que le bundle est monolithique — si du code-splitting
// apparaît, passer à 'prompt' ; si un jour la PWA est remplacée sur la même
// origine, livrer une dernière version avec `selfDestroying: true`.
const pwa = VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'script-defer',
  includeManifestIcons: false,
  manifest: {
    name: 'Tama Speak — Apprends le kabyle',
    short_name: 'Tama Speak',
    description: 'Apprends le kabyle, un mot après l’autre.',
    lang: 'fr',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#10C4A8',
    background_color: '#FFFAF1',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    // Shell pré-caché. L'audio passe par une route runtime CacheFirst avec
    // rangeRequests — Safari/iOS sonde les médias en `Range:` et exige un
    // 206, que la route precache ne sait pas produire. Le cache est
    // réchauffé côté page (warmAudioCache) pour garder le hors-ligne.
    globPatterns: ['**/*.{js,css,html,svg,png}'],
    runtimeCaching: [
      {
        urlPattern: /\/audio\/.*\.(mp3|json)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'tama-audio',
          rangeRequests: true,
          expiration: { maxEntries: 400 },
        },
      },
    ],
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: singleFile ? './' : '/',
  plugins: [react(), tailwindcss(), ...(singleFile ? [viteSingleFile()] : [pwa])],
})
