import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // base: '/resimanager', // Removido para evitar problemas de MIME en Vercel
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      strictPort: true,
      host: true,
    },
  };
});
