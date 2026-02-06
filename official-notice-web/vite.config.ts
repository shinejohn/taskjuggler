import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@taskjuggler/ui': path.resolve(__dirname, '../shared-ui/src'),
    },
  },
  server: {
    port: 5175, // Unique port for Official Notice
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: [
      'official-notice-production.up.railway.app',
      'official-notice-production-7eb8.up.railway.app',
      /^official-notice.*\.up\.railway\.app$/,
      '.up.railway.app',  // Allow all Railway subdomains
      'all'  // Fallback to allow all hosts
    ]
  },
})
