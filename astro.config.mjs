// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          title: 'Sponsor Modtoberfest',
          logo: {
              light: './src/assets/logo_light.png',
              dark: './src/assets/logo_dark.png',
          },
          social: [
              { icon: 'external', label: 'Website', href: 'https://modtoberfest.com' },
              { icon: 'github', label: 'GitHub', href: 'https://github.com/Mycelium-Mod-Network/Modtoberfest-Site/tree/sponsor' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.modtoberfest.com' }
          ],
          pagination: false,
          customCss: [
              // Path to your Tailwind base styles:
              './src/styles/global.css',
          ],
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});