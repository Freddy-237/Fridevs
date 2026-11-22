// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://fridevs.com',
  // URLs sans slash final (/about), servies par Vercel via cleanUrls
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Three.js copié localement (src/lib/three) : les modules d'effets importent "three"
      alias: [
        { find: /^three$/, replacement: fileURLToPath(new URL("./src/lib/three/three.module.js", import.meta.url)) },
        { find: /^three\/addons\//, replacement: fileURLToPath(new URL("./src/lib/three/addons/", import.meta.url)) },
      ],
    },
  },
});