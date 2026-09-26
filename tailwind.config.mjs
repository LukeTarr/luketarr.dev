import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

/** Colors are CSS variables (see src/styles/main.css) so light/dark share one palette. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const tint = (name, alpha = 1) => `rgb(var(--${name}) / ${alpha})`;

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				paper: token('paper'),
				ink: token('ink'),
				muted: token('muted'),
				accent: token('accent'),
				mist: token('mist'),
			},
			fontFamily: {
				display: ['"Fraunces Variable"', ...defaultTheme.fontFamily.serif],
				sans: ['"Instrument Sans Variable"', ...defaultTheme.fontFamily.sans],
				mono: ['"JetBrains Mono Variable"', ...defaultTheme.fontFamily.mono],
			},
			borderRadius: {
				blob: '62% 38% 46% 54% / 55% 44% 56% 45%',
			},
			keyframes: {
				morph: {
					'0%, 100%': { borderRadius: '62% 38% 46% 54% / 55% 44% 56% 45%' },
					'33%': { borderRadius: '41% 59% 58% 42% / 45% 58% 42% 55%' },
					'66%': { borderRadius: '55% 45% 36% 64% / 62% 38% 60% 40%' },
				},
				rise: {
					from: { opacity: '0', transform: 'translateY(14px)', filter: 'blur(6px)' },
					to: { opacity: '1', transform: 'none', filter: 'none' },
				},
				draw: {
					from: { strokeDashoffset: '1' },
					to: { strokeDashoffset: '0' },
				},
				sway: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
			},
			animation: {
				morph: 'morph 18s ease-in-out infinite',
				rise: 'rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards',
				draw: 'draw 1.6s cubic-bezier(0.65, 0, 0.35, 1) both',
				sway: 'sway 6s ease-in-out infinite',
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': tint('ink', 0.85),
						'--tw-prose-headings': tint('ink'),
						'--tw-prose-lead': tint('muted'),
						'--tw-prose-links': tint('accent'),
						'--tw-prose-bold': tint('ink'),
						'--tw-prose-counters': tint('muted'),
						'--tw-prose-bullets': tint('accent', 0.6),
						'--tw-prose-hr': tint('ink', 0.12),
						'--tw-prose-quotes': tint('ink'),
						'--tw-prose-quote-borders': tint('accent', 0.5),
						'--tw-prose-captions': tint('muted'),
						'--tw-prose-code': tint('ink'),
						'--tw-prose-pre-code': tint('paper'),
						'--tw-prose-pre-bg': tint('ink'),
						'--tw-prose-th-borders': tint('ink', 0.2),
						'--tw-prose-td-borders': tint('ink', 0.1),
						'h1, h2, h3, h4': {
							fontFamily: theme('fontFamily.display').join(', '),
							fontWeight: '500',
							letterSpacing: '-0.01em',
						},
						a: {
							textDecorationColor: tint('accent', 0.35),
							textUnderlineOffset: '0.2em',
							textDecorationThickness: '1.5px',
							transition: 'text-decoration-color 200ms',
						},
						'a:hover': { textDecorationColor: tint('accent') },
						code: { fontWeight: '500' },
						'code::before': { content: 'none' },
						'code::after': { content: 'none' },
					},
				},
			}),
		},
	},
	plugins: [typography],
};
