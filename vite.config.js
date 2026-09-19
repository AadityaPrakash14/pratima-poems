import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deployment: repository is 'pratima-poems'
  // Deployed URL: https://AadityaPrakash14.github.io/pratima-poems/
  base: '/pratima-poems/',
})
