import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          'X-API-Key': process.env.VITE_NEXUS_API_KEY || 'nexus_dev_2026'
        }
      }
    }
  }
})
