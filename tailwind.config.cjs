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
					light: 'rgb(46 163 242 / <alpha-value>)',
				},
				dark: {
					DEFAULT: 'rgb(34 34 34 / <alpha-value>)',
				},
				sale: {
					DEFAULT: '#dc2626' //'rgb(var(--color-sale) / <alpha-value>)',
				},
				new: {
					DEFAULT: '#0284c7' //'rgb(var(--color-new) / <alpha-value>)',
				},
				green: {
					DEFAULT: '#059669'
				}
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
