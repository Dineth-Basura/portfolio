import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import settings from './src/data/site.json' with { type: 'json' };

const site = process.env.SITE_URL || settings.url || undefined;
export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [react(), ...(site ? [sitemap()] : [])],
  vite: { plugins: [tailwind()] },
});
