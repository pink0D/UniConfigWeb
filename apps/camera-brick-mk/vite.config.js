import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';

// Strip example config JSONs from production build output
function removeExampleConfigs() {
  return {
    name: 'remove-example-configs',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const dir = path.resolve(__dirname, 'dist/config');
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    },
  };
}

// Gzip index.html and remove the uncompressed original
function gzipOutput() {
  return {
    name: 'gzip-output',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const filePath = path.resolve(__dirname, 'dist/index.html');
      const gzipPath = path.resolve(__dirname, 'dist/index.html.gz');
      if (fs.existsSync(filePath)) {
        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(gzipPath);
        output.on('finish', () => fs.rmSync(filePath));
        input.pipe(zlib.createGzip()).pipe(output);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'production' ? viteSingleFile() : undefined,
    mode === 'production' ? gzipOutput() : undefined,
    removeExampleConfigs(),
  ].filter(Boolean),
  base: mode === 'production' ? '/settings/' : '/',
  server: {
    host: true,
    port: 3000,
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
    outDir: 'dist',
  },
}));