import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // load .env values so proxy target can use VITE_API_URL_2 when present
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_API_URL_2 ?? env.VITE_API_URL ?? 'https://e-commerce-backend-8-vnyt.onrender.com'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Forward requests for product and review routes to the alternate backend
        // This avoids CORS during local development by keeping the browser same-origin.
        '/products': {
          target: backend,
          changeOrigin: true,
          secure: false,
        },
        '/reviews': {
          target: backend,
          changeOrigin: true,
          secure: false,
        },
        '/product-reviews': {
          target: backend,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
