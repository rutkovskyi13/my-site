import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built site works from any folder on the hosting.
// The build goes straight into the course site: landing/practice/ (opened by the "Practice" button).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../landing/practice',
    emptyOutDir: true,
  },
});
