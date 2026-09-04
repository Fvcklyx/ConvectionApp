import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Bundled animations do not use expressions; omit the player's eval engine.
    alias: [{ find: /^lottie-web$/, replacement: 'lottie-web/build/player/esm/lottie_light.min.js' }],
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/storage': 'http://127.0.0.1:8000',
    },
  },
})
