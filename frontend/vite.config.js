import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Read Vite-specific env vars (VITE_*) from the project's .env files.
// This returns an object with keys like VITE_API_URL if present.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // Allow either VITE_API_URL or VITE_API_PROXY for flexibility.
  const API_URL = env.VITE_API_URL || env.VITE_API_PROXY || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
