import { useEffect, useState } from 'react';

const titles = [
	'Software Engineer',
	'Open Source Contributor',
	'Web Developer',
	'Tech Blogger',
	'Full Stack Developer',
	'AI Enthusiast',
];

const HOLD_MS = 2600;
const FADE_MS = 450;

export default function TitleCycler() {
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		let swap: ReturnType<typeof setTimeout> | undefined;
		const interval = setInterval(() => {
			setLeaving(true);
			swap = setTimeout(() => {
				setIndex((i) => (i + 1) % titles.length);
				setLeaving(false);
			}, FADE_MS);
		}, HOLD_MS);

		return () => {
			clearInterval(interval);
			clearTimeout(swap);
		};
	}, []);

	return (
		<p className="font-display text-2xl italic text-ink/80 md:text-3xl">
			<span className="sr-only">{titles.join(', ')}</span>
			<span aria-hidden="true" className="relative inline-block">
				<span
					key={index}
					className={`inline-block animate-rise transition-all ease-out ${
						leaving ? '-translate-y-2 opacity-0 blur-sm' : ''
					}`}
					style={{ transitionDuration: `${FADE_MS}ms` }}
				>
					{titles[index]}
				</span>
				<svg
					key={`line-${index}`}
					viewBox="0 0 200 12"
					preserveAspectRatio="none"
					className={`absolute -bottom-2 left-0 h-3 w-full text-accent transition-opacity ${
						leaving ? 'opacity-0' : ''
					}`}
					style={{ transitionDuration: `${FADE_MS}ms` }}
				>
					<path
						d="M2 8c20-5 38-5 56-1s36 5 56 0 38-6 56-2 22 3 28 2"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1"
						className="animate-draw"
					/>
				</svg>
			</span>
		</p>
	);
}
