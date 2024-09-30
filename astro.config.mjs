// @ts-check
import {defineConfig} from 'astro/config';
import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
    output: "server",
    site: "https://modtoberfest.com",
    adapter: node({
        mode: "standalone"
    }),

    security: {
        checkOrigin: true
    },

    integrations: [tailwind(), icon(), solidJs()]
});