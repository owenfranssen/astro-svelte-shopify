import {defineConfig} from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://emerald-mtb.com',
	trailingSlash: 'always',
	format: 'directory',
	integrations: [svelte(), tailwind()],
});
