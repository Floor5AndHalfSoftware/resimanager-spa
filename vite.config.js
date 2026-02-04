import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/daat', // Removido para evitar problemas de MIME en Vercel
  plugins: [react()],
})
