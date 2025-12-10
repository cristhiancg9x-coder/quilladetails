import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
// CORRECCIÓN AQUÍ: Importamos directamente desde '@astrojs/vercel'
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    react()
  ],
  output: 'server', // Necesario para el Login y SSR
  adapter: vercel(),
});