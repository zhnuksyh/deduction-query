import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Fully static, client-side SPA. `base` is relative so the build works
// on GitHub Pages project sites, Netlify, and Vercel alike.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      // Precache the app shell plus the big wasm binary so it works offline and
      // installs cleanly to a home screen.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,wasm}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Detective Query',
        short_name: 'Detective Query',
        description:
          'A browser-based murder mystery deduction game where you write raw SQL to crack forensic cases.',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  optimizeDeps: {
    // Pre-bundle the sql.js dist entry so Vite converts its CJS/UMD form into a
    // clean ESM module with a proper default export. Excluding it (the old
    // setup) left the default export unwired in dev, so initSqlJs was missing.
    include: ['sql.js/dist/sql-wasm.js'],
  },
})
