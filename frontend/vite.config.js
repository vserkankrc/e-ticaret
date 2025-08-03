import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

export default defineConfig({
  base: '/',  // Burası önemli
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@react-oauth/google'],
  },
  server: {
    // Yerel geliştirme için history fallback açılıyor
    historyApiFallback: true,
  },
})
