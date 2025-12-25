import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  build: {
    outDir: '../../../target/classes/static',
  },
  root: 'src/main/webapp',
  server: {
    port: 9000,
    proxy: {
      '/style': {
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace('/style', ''),
        target: 'http://localhost:9005',
      },
    },
  },
});
