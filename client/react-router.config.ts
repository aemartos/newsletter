import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  serverModuleFormat: 'esm',
  serverBuildFile: 'index.js',
  buildDirectory: 'build',
  async prerender() {
    return ['/', '/post/new', '/subscribe', '/unsubscribe'];
  },
} satisfies Config;
