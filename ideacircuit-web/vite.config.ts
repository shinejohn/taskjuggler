import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@taskjuggler/ui': fileURLToPath(new URL('../../taskjuggler/Code/shared-ui/src', import.meta.url)),
    },
    conditions: ['import', 'module', 'browser', 'default'],
  },
})
