import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import AstroPWA from '@vite-pwa/astro'; 

export default defineConfig({
  // --- ESTA LÍNEA ES VITAL ---
  output: 'server', 
  // ---------------------------
  integrations: [
    tailwind(), 
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'QuillaDetails',
        short_name: 'QuillaDetails',
        theme_color: '#0f0c29',
        background_color: '#0f0c29',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  adapter: vercel(),
});