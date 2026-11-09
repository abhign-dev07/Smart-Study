import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import profile from './api/leetcode-profile.js'

function mountProfile(server) {
  server.middlewares.use('/api/leetcode-profile', profile)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    { name: 'leetcode-profile', configureServer: mountProfile, configurePreviewServer: mountProfile }
  ],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api/leetcode': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leetcode/, ''),
        headers: {
          'Referer': 'https://leetcode.com',
          'Origin': 'https://leetcode.com'
        }
      }
    }
  }
})
