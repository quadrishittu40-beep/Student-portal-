import { defineConfig } from 'vite';

// The app's web source lives in ./www. Build output goes to ./dist,
// which is shared by Vercel hosting and Capacitor Android packaging.
export default defineConfig({
  root: 'www',
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.e2b.app', 'localhost']
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
