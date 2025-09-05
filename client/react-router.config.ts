import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  serverModuleFormat: 'esm',
  serverBuildFile: 'index.js',
  async prerender() {
    return ['_index'];
  },
} satisfies Config;
