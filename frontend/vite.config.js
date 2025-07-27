import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // Bunu ekle

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'),  // '@' alias'ını tanımla
    },
  },
  optimizeDeps: {
    include: ['@react-oauth/google'],
  },
})
