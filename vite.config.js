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

const pwa = VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'script-defer',
  includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
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
    // Pré-cache tout, audio compris : les leçons fonctionnent hors-ligne.
    globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}', 'audio/**/*.{mp3,json}'],
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: singleFile ? './' : '/',
  plugins: [react(), tailwindcss(), ...(singleFile ? [viteSingleFile()] : [pwa])],
})
