export const site = {
	name: 'Luke Tarr',
	domain: 'luketarr.dev',
	url: 'https://luketarr.dev',
	description: 'The personal site for Luke Tarr, a software developer: luketarr.dev',
	githubUser: 'LukeTarr',
	/** Repos tagged with this GitHub topic are shown on /projects. */
	projectsTopic: 'portfolio',
};

export interface NavLink {
	label: string;
	href: string;
}

export const nav: NavLink[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Blog', href: '/blog' },
];

export interface SocialLink {
	label: string;
	href: string;
	ariaLabel: string;
	viewBox: string;
	path: string;
}

export const socials: SocialLink[] = [
	{
		label: 'GitHub',
		href: `https://github.com/${site.githubUser}`,
		ariaLabel: "Luke Tarr's GitHub profile",
		viewBox: '0 0 16 16',
		path: 'M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8',
	},
	{
		label: 'LinkedIn',
		href: 'https://linkedin.com/in/luke-tarr',
		ariaLabel: "Luke Tarr's LinkedIn profile",
		viewBox: '4 4 42 42',
		path: 'M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z',
	},
	{
		label: 'X',
		href: 'https://x.com/lukertarr',
		ariaLabel: "Luke Tarr's X.com profile",
		viewBox: '0 0 24 24',
		path: 'M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z',
	},
];
