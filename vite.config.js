import { defineConfig } from 'vite';

// The app's web source lives in ./www. Build output goes to ./dist,
// which is shared by Vercel hosting and Capacitor Android packaging.
export default defineConfig({
  root: 'www',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
