import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths(), vuetify({ autoImport: true })],
  build: {
    outDir: '../../../dist',
  },
  root: 'src/main/webapp',
  server: {
    port: 9000,
  },
});
