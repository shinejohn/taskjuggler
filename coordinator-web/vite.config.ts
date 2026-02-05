import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@taskjuggler/ui': path.resolve(__dirname, '../shared-ui/src'),
    },
  },
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for faster builds (terser requires additional dependency)
    // Note: To remove console.log in production, use esbuild's drop option or a plugin
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['lucide-vue-next'],
          'utils-vendor': ['axios'],
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(gif|jpe?g|png|svg)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `${ext}/[name]-[hash][extname]`;
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lucide-vue-next'],
  },
  preview: {
    allowedHosts: [
      '4calls-production.up.railway.app'
    ]
  },
})

