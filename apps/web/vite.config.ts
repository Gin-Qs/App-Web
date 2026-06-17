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
  server: {
    host: true,
    port: 5173,
  },
})
