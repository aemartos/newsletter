import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Ensure server build goes to build/index.js
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'server') {
            return 'index.js';
          }
          return '[name]-[hash].js';
        },
      },
    },
  },
});
