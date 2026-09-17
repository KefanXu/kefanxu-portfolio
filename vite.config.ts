import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// GitHub Pages serves projects from `/<repo>/`, so we set `base` at build time.
// - Local dev: defaults to `/`
// - CI: GitHub Actions sets BASE_PATH (e.g. `/website2026/`)
//
// The site has two modes, each with its own HTML entry so their global styles
// never meet: the academic site at `/` (index.html) and the designer portfolio
// at `/design/` (design/index.html).
export default defineConfig(() => {
  const base = process.env.BASE_PATH ?? '/'

  return {
    base,
    cacheDir: '.vite',
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          design: fileURLToPath(new URL('./design/index.html', import.meta.url)),
        },
      },
    },
  }
})
