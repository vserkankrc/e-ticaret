/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

export default defineConfig({
  base: '/',  // Burası önemli
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@react-oauth/google'],
  },
})
