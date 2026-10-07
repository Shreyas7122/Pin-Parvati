import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pure client-side static app — no backend or auth required
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3001,
    open: false,
  }
});
