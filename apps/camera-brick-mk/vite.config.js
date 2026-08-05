import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/settings/' : '/',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      // Ensure shared-ui resolves to its source for HMR
      'shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
    },
  },
  optimizeDeps: {
    include: ['shared-ui'],
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
  },
}));
