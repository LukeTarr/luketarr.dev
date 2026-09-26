/**
 * Light/dark switch. The initial theme is applied by an inline script in the layout
 * before first paint; this just flips it and remembers the choice. Icons swap via
 * `dark:` classes so server and client markup always agree.
 */
export default function ThemeToggle() {
	const toggle = () => {
		const root = document.documentElement;
		const next = root.classList.contains('dark') ? 'light' : 'dark';
		const apply = () => {
			root.classList.toggle('dark', next === 'dark');
			try {
				localStorage.setItem('theme', next);
			} catch {
				// Storage can be unavailable (private mode); the toggle still works for this page.
			}
		};

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (document.startViewTransition && !reducedMotion) document.startViewTransition(apply);
		else apply();
	};

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle dark mode"
			className="group grid h-9 w-9 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-accent"
		>
			{/* Moon, shown in light mode */}
			<svg
				viewBox="0 0 24 24"
				className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12 dark:hidden"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
			</svg>
			{/* Sun, shown in dark mode */}
			<svg
				viewBox="0 0 24 24"
				className="hidden h-[18px] w-[18px] transition-transform duration-700 group-hover:rotate-45 dark:block"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4.2" />
				<path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
			</svg>
		</button>
	);
}
