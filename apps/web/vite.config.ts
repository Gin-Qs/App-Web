import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// We alias @ginqs/core straight to its TypeScript source so the shared package
// needs no build step. A future Expo app does the same via its Metro config.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ginqs/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks: app deploys don't bust the (rarely-changing)
        // framework/client caches in visitors' browsers.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
