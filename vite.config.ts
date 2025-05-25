import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // base: "/",
  base: '/icons-viewer/',
  // publicDir: "assets",
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
});
