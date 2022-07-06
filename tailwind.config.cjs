/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			gridTemplateRows: {
				'[auto,auto,1fr]': 'auto auto 1fr',
			},
			colors: {
				primary: {
					DEFAULT: 'rgb(var(--color-primary) / <alpha-value>',
					light: 'rgb(var(--color-primary-light)/ <alpha-value>',
				},
				dark: {
					DEFAULT: 'rgb(var(--color-dark) / <alpha-value>',
				},
			},
			maxWidth: {
				site: 'var(--site-width)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
};
