import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@taskjuggler/ui': fileURLToPath(new URL('../shared-ui/src', import.meta.url))
    }
  },
  server: {
    port: 3001,
  },
  preview: {
    allowedHosts: [
      '4process-production.up.railway.app',
      '.up.railway.app',
      'all'
    ]
  },
  // VITE_API_URL will be available via import.meta.env.VITE_API_URL at runtime
  // Set it in Railway environment variables for production
})
