import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Inline assets under 10kb — fewer network requests on mobile
    assetsInlineLimit: 10240,
    // Single chunk for this small app — no splitting overhead
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    // Allow testing on iPhone over local network
    host: true,
    port: 5173,
  }
})
