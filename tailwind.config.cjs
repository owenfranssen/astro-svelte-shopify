/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			gridTemplateRows: {
				'[auto,auto,1fr]': 'auto auto 1fr',
			},
			colors: {
				primary: {
					DEFAULT: 'rgb(0 100 150 / <alpha-value>)',
					300: 'rgb(46 163 242 / <alpha-value>)',
					100: 'rgb(100 130 150 / <alpha-value>)',
				},
				dark: {
					DEFAULT: 'rgb(34 34 34 / <alpha-value>)',
				},
				sale: {
					DEFAULT: 'rgb(150 51 15 / <alpha-value>)',
				},
				new: {
					DEFAULT: 'rgb(46 163 242 / <alpha-value>)',
				},
				green: {
					DEFAULT: 'rgb(8 150 121 / <alpha-value>)',
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
