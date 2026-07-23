import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLEFILE=1 npm run build  → produit un seul fichier HTML autonome
// (tout le JS/CSS inliné) pour partage/démo hors-ligne.
const singleFile = process.env.SINGLEFILE === '1'

// https://vite.dev/config/
export default defineConfig({
  base: singleFile ? './' : '/',
  plugins: [react(), tailwindcss(), ...(singleFile ? [viteSingleFile()] : [])],
})
