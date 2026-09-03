import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function quizClubBackendPlugin(): Plugin {
  return {
    name: 'quizclub-backend-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const { handleApiRequest } = await import('./server/api.js');
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          } catch (e) {
            console.error('[Vite Backend Plugin] Error handling API request:', e);
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const { handleApiRequest } = await import('./server/api.js');
            const handled = await handleApiRequest(req, res);
            if (handled) return;
          } catch (e) {
            console.error('[Vite Backend Plugin] Error handling API request:', e);
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), quizClubBackendPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});

