import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'markdown': ['react-markdown', 'remark-math', 'rehype-katex'],
              'supabase': ['@supabase/supabase-js'],
              'icons': ['lucide-react']
            }
          }
        },
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild',
        target: 'es2015'
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
