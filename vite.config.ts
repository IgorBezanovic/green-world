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
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false
  }
});
