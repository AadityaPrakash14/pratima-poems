import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

/**
 * Custom Vite plugin to copy index.html to 404.html for GitHub Pages SPA support
 * 
 * GitHub Pages serves 404.html for any route that doesn't match a real file.
 * By making 404.html identical to index.html, the SPA can handle all routes
 * client-side via React Router.
 */
function copyIndexTo404() {
  return {
    name: 'copy-index-to-404',
    closeBundle() {
      const indexPath = resolve('dist', 'index.html')
      const notFoundPath = resolve('dist', '404.html')
      copyFileSync(indexPath, notFoundPath)
      console.log('✓ Copied index.html to 404.html for GitHub Pages SPA support')
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyIndexTo404()],
  // GitHub Pages deployment: repository is 'pratima-poems'
  // Deployed URL: https://AadityaPrakash14.github.io/pratima-poems/
  base: '/pratima-poems/',
})
