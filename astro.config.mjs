import {defineConfig} from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://emerald-mtb.com',
	sitemap: true,
	trailingSlash: 'always',
	format: 'directory',
	integrations: [svelte(), tailwind()],
});
