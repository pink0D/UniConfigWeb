import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';

/**
 * Shared Vite build preset for every app in this monorepo.
 *
 * Each app keeps its own index.html + public/ and reuses the shared source
 * tree via the `@shared` alias. The only per-app differences are the resolve
 * alias (if any) and the dev-server port — everything else lives here.
 */

// Strip example config JSONs from production build output
export function removeExampleConfigs() {
  let root;
  return {
    name: 'remove-example-configs',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      root = config.root;
    },
    closeBundle() {
      const configDir = path.resolve(root, 'dist/config');
      if (fs.existsSync(configDir)) {
        fs.rmSync(configDir, { recursive: true, force: true });
      }
      const rootConfig = path.resolve(root, 'dist/config.json');
      if (fs.existsSync(rootConfig)) {
        fs.rmSync(rootConfig, { force: true });
      }
    },
  };
}

// Gzip index.html and remove the uncompressed original
export function gzipOutput() {
  let root;
  return {
    name: 'gzip-output',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      root = config.root;
    },
    closeBundle() {
      const filePath = path.resolve(root, 'dist/index.html');
      const gzipPath = path.resolve(root, 'dist/index.html.gz');
      if (fs.existsSync(filePath)) {
        const input = fs.createReadStream(filePath);
        const output = fs.createWriteStream(gzipPath);
        output.on('finish', () => fs.rmSync(filePath));
        input.pipe(zlib.createGzip()).pipe(output);
      }
    },
  };
}

// Shared defineConfig wrapper. Only the resolve alias and dev port vary per app.
export function createConfig({ alias = {}, port = 3000 } = {}) {
  return defineConfig(({ mode }) => ({
    resolve: {
      alias,
    },
    plugins: [
      react(),
      mode === 'production' ? viteSingleFile() : undefined,
      mode === 'production' ? gzipOutput() : undefined,
      mode === 'production' ? removeExampleConfigs() : undefined,
    ].filter(Boolean),
    base: mode === 'production' ? './' : '/',
    server: {
      host: true,
      port,
    },
    build: {
      outDir: 'dist',
    },
  }));
}
