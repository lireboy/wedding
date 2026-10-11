import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createGuestHandler } from './server/guest.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'local-guest-api',
      configureServer(server) {
        const handler = createGuestHandler({
          ...loadEnv(mode, process.cwd(), ''),
          NODE_ENV: 'development',
          VERCEL: '0',
        })
        server.middlewares.use((req, res, next) => {
          if (req.url?.split('?')[0] === '/api/guest') void handler(req, res)
          else next()
        })
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    fs: { deny: ['.env', '.env.*', '**/.git/**', '**/server/**', '**/api/**'] },
  },
}))
