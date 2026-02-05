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
    },
  },
  server: {
    port: 3002,
    host: true,
  },
  preview: {
    allowedHosts: [
      '4projects-production.up.railway.app'
    ]
  },
})
