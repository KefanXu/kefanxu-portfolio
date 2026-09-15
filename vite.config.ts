import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// GitHub Pages serves projects from `/<repo>/`, so we set `base` at build time.
// - Local dev: defaults to `/`
// - CI: GitHub Actions sets BASE_PATH (e.g. `/website2026/`)
export default defineConfig(() => {
  const base = process.env.BASE_PATH ?? '/'

  return {
    base,
    cacheDir: '.vite',
    plugins: [react()],
  }
})
