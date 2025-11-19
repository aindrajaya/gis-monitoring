import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const proxyPort = env.PROXY_PORT || '3001';
    const isProduction = mode === 'production';
    
    return {
      // vite.config.ts
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Only use proxy in development mode
        proxy: !isProduction ? {
          '/api': {
            target: `http://localhost:${proxyPort}`,
            changeOrigin: true,
            rewrite: (path) => path // Keep /api prefix for Express proxy
          }
        } : undefined
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
