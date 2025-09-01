// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          title: 'Sponsor Modtoberfest',
          logo: {
              light: './src/assets/logo_light.png',
              dark: './src/assets/logo_dark.png',
          },
          favicon: './src/assets/logo_light.png',
          social: [
              { icon: 'external', label: 'Website', href: 'https://modtoberfest.com' },
              { icon: 'github', label: 'GitHub', href: 'https://github.com/Mycelium-Mod-Network/Modtoberfest-Site/tree/sponsor' },
              { icon: 'discord', label: 'Discord', href: 'https://discord.modtoberfest.com' }
          ],
          sidebar: [
              {
                  label: 'Sponsor Modtoberfest',
                  items: [
                      {
                          label: 'Stickers',
                          slug: 'sponsor-options/stickers'
                      },
                      {
                          label: 'Digital Rewards',
                          slug: 'sponsor-options/digital-rewards'
                      },
                      {
                          label: 'Modtober-forest',
                          slug: 'sponsor-options/modtober-forest'
                      }
                  ]
              }
          ],
          pagination: false,
          customCss: [
              './src/styles/global.css',
          ],
      }),
    ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});