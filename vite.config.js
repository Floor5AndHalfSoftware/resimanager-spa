import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/daat', // Removido para evitar problemas de MIME en Vercel
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT) || 5000,
    strictPort: true,
    host: true
  }
})
