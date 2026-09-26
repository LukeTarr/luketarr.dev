/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	trailingComma: 'all',
	singleQuote: true,
	tabWidth: 2,
	printWidth: 100,
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	// Tailwind v4 has no JS config; the plugin reads the theme from here to sort classes.
	tailwindStylesheet: './src/styles/main.css',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
