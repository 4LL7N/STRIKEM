import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginInspect from 'vite-plugin-inspect';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),VitePluginInspect()],
  server: {
    hmr: true
  },
  optimizeDeps: {
    include: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/timegrid',
      '@fullcalendar/daygrid'
    ],
  },
  resolve: {
    alias: {
      '@fullcalendar/core/internal.js': path.resolve('node_modules/@fullcalendar/core/internal.js'),
      '@fullcalendar/core/preact.js': path.resolve('node_modules/@fullcalendar/core/preact.js'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
