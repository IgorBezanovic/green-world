import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@green-world': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    watch: {
      ignored: ['**/coverage/**']
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ]
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-quill-new') || id.includes('/quill/')) {
            return 'vendor-quill';
          }

          if (
            id.includes('@paypal/react-paypal-js') ||
            id.includes('braintree-web')
          ) {
            return 'vendor-payments';
          }

          if (id.includes('lucide-react')) {
            return 'vendor-lucide';
          }

          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'vendor-i18n';
          }

          if (id.includes('socket.io-client')) {
            return 'vendor-socket';
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('react-router')
          ) {
            return 'vendor-react';
          }
        }
      }
    }
  }
});
