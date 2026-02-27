import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true
      },
      '/health': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true
      },
      '/analytics': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true
      },
      '/model': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true
      },
      '/metrics': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true
      }
    }
  }
})
