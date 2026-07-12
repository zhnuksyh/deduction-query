import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fully static, client-side SPA. `base` is relative so the build works
// on GitHub Pages project sites, Netlify, and Vercel alike.
export default defineConfig({
  base: './',
  plugins: [react()],
  // sql.js ships a wasm binary; keep it out of dep pre-bundling.
  optimizeDeps: {
    exclude: ['sql.js'],
  },
})
