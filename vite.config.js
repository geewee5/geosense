import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the production build works both at a domain root
  // and under a GitHub Pages project subpath (e.g. /geosense/).
  base: './',
  server: {
    port: 5173,
    open: true,
  },
})
