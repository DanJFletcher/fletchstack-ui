import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'tests/browser-harness',
  plugins: [react(), {
    name: 'navigation-consumer-fallback',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url?.split('?')[0]?.match(/^\/navigation-demo(?:\/|$)/)) { request.url = '/navigation.html'; }
        next();
      });
    },
  }],
  server: {
    host: '127.0.0.1', port: 6008, strictPort: true,
    fs: { allow: [process.cwd()] },
    watch: { ignored: ['**/.verification/**', '**/test-results/**', '**/playwright-report/**', '**/coverage/**'] },
  },
});
