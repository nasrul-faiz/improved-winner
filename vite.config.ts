import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;
const isBuild = process.argv.includes('build');

// Use a sensible default for local development, but allow Vite to fall back to a
// free port if the requested one is already in use.
const port = rawPort ? Number(rawPort) : 3000;

if (!isBuild && rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('lightgallery') || id.includes('lg-')) {
            return 'gallery-vendor';
          }

          if (
            id.includes('leaflet') ||
            id.includes('react-leaflet') ||
            id.includes('@react-google-maps/api')
          ) {
            return 'map-vendor';
          }

          if (id.includes('qr-scanner') || id.includes('qrcode')) {
            return 'qr-vendor';
          }

          if (
            id.includes('jszip') ||
            id.includes('jspdf') ||
            id.includes('html2canvas')
          ) {
            return 'document-vendor';
          }

          if (
            id.includes('framer-motion') ||
            id.includes('recharts') ||
            id.includes('primereact') ||
            id.includes('embla-carousel-react') ||
            id.includes('react-day-picker')
          ) {
            return 'ui-vendor';
          }

          if (
            id.includes('lucide-react') ||
            id.includes('@radix-ui') ||
            id.includes('class-variance-authority') ||
            id.includes('tailwind-merge') ||
            id.includes('sonner') ||
            id.includes('cmdk')
          ) {
            return 'ui-core';
          }

          if (
            id.includes('/react/') ||
            id.includes('react-dom') ||
            id.includes('scheduler') ||
            id.includes('/react-is/') ||
            id.includes('use-sync-external-store')
          ) {
            return 'react-vendor';
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port,
    strictPort: false,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    strictPort: false,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
