import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/daat', // Comentado para Vercel deployment
  plugins: [react()],
})
