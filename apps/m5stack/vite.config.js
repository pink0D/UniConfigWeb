import path from 'path';
import { createConfig } from '../../scripts/vite-preset.mjs';

export default createConfig({
  alias: {
    // Reuse the shared source tree from the webconfig app so that every
    // app in this monorepo only maintains its own index.html + public/.
    '@shared': path.resolve(__dirname, '../webconfig/src'),
  },
  port: 3002,
});
