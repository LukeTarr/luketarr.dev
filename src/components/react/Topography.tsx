import { useEffect, useRef } from 'react';
import { createNoise3D } from '../../lib/noise';

/**
 * A slowly drifting topographic map drawn with marching squares over simplex noise.
 * The cursor raises a gentle hill that the contour lines bend around.
 *
 * Time is derived from the wall clock (not page load), so the landscape stays
 * continuous as you navigate between pages.
 */

const CELL = 16; // CSS px between field samples
const SCALE = 1 / 520; // noise units per CSS px — bigger shapes as this shrinks
const DRIFT = 0.018; // noise units per second along the time axis
const STEP = 0.14; // field distance between contour lines
const INDEX_LEVEL = 4; // lines at ±this level are accented "index contours", like on a real map
const FRAME_MS = 1000 / 30;
const HILL_HEIGHT = 0.6;
const HILL_RADIUS = 150; // CSS px

type Rgb = string; // "r g b" channels as stored in the CSS custom properties

function readColor(name: string): Rgb {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '0 0 0';
}

export default function Topography() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx) return;

		const noise = createNoise3D(20210313);
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

		let width = 0;
		let height = 0;
		let cols = 0;
		let rows = 0;
		let field = new Float32Array(0);

		let ink = readColor('--ink');
		let accent = readColor('--accent');
		let dark = document.documentElement.classList.contains('dark');

		// The hill follows the pointer with some lag; its height eases in and out.
		const hill = { x: 0, y: 0, targetX: 0, targetY: 0, height: 0, targetHeight: 0 };

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.ceil(width / CELL) + 1;
			rows = Math.ceil(height / CELL) + 1;
			field = new Float32Array(cols * rows);
		};

		const sample = (time: number) => {
			const z = time * DRIFT;
			const r2 = 2 * HILL_RADIUS * HILL_RADIUS;
			for (let j = 0; j < rows; j++) {
				const y = j * CELL;
				for (let i = 0; i < cols; i++) {
					const x = i * CELL;
					let v =
						noise(x * SCALE, y * SCALE, z) * 0.75 +
						noise(x * SCALE * 2.3, y * SCALE * 2.3, z * 1.6 + 40) * 0.25;
					if (hill.height > 0.001) {
						const dx = x - hill.x;
						const dy = y - hill.y;
						v += hill.height * HILL_HEIGHT * Math.exp(-(dx * dx + dy * dy) / r2);
					}
					field[j * cols + i] = v;
				}
			}
		};

		// Marching squares for one threshold; appends line segments to the current path.
		const trace = (threshold: number) => {
			for (let j = 0; j < rows - 1; j++) {
				for (let i = 0; i < cols - 1; i++) {
					const a = field[j * cols + i]; // top-left
					const b = field[j * cols + i + 1]; // top-right
					const c = field[(j + 1) * cols + i + 1]; // bottom-right
					const d = field[(j + 1) * cols + i]; // bottom-left
					const code =
						(a > threshold ? 8 : 0) |
						(b > threshold ? 4 : 0) |
						(c > threshold ? 2 : 0) |
						(d > threshold ? 1 : 0);
					if (code === 0 || code === 15) continue;

					const x = i * CELL;
					const y = j * CELL;
					// Where the contour crosses each edge, linearly interpolated.
					const top = () => x + CELL * ((threshold - a) / (b - a));
					const right = () => y + CELL * ((threshold - b) / (c - b));
					const bottom = () => x + CELL * ((threshold - d) / (c - d));
					const left = () => y + CELL * ((threshold - a) / (d - a));

					const seg = (x1: number, y1: number, x2: number, y2: number) => {
						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
					};

					switch (code) {
						case 1:
						case 14:
							seg(x, left(), bottom(), y + CELL);
							break;
						case 2:
						case 13:
							seg(bottom(), y + CELL, x + CELL, right());
							break;
						case 3:
						case 12:
							seg(x, left(), x + CELL, right());
							break;
						case 4:
						case 11:
							seg(top(), y, x + CELL, right());
							break;
						case 6:
						case 9:
							seg(top(), y, bottom(), y + CELL);
							break;
						case 7:
						case 8:
							seg(x, left(), top(), y);
							break;
						case 5:
							seg(x, left(), top(), y);
							seg(bottom(), y + CELL, x + CELL, right());
							break;
						case 10:
							seg(top(), y, x + CELL, right());
							seg(x, left(), bottom(), y + CELL);
							break;
					}
				}
			}
		};

		const draw = (time: number) => {
			sample(time);
			ctx.clearRect(0, 0, width, height);
			ctx.lineCap = 'round';

			const lineAlpha = dark ? 0.1 : 0.13;
			const indexAlpha = dark ? 0.32 : 0.38;

			for (let level = -6; level <= 6; level++) {
				const isIndex = Math.abs(level) === INDEX_LEVEL;
				ctx.beginPath();
				trace(level * STEP);
				ctx.lineWidth = isIndex ? 1.25 : 0.9;
				ctx.strokeStyle = isIndex ? `rgb(${accent} / ${indexAlpha})` : `rgb(${ink} / ${lineAlpha})`;
				ctx.stroke();
			}
		};

		const now = () => Date.now() / 1000;

		let frame = 0;
		let last = 0;
		const loop = (t: number) => {
			frame = requestAnimationFrame(loop);
			if (t - last < FRAME_MS) return;
			last = t;
			hill.x += (hill.targetX - hill.x) * 0.08;
			hill.y += (hill.targetY - hill.y) * 0.08;
			hill.height += (hill.targetHeight - hill.height) * 0.04;
			draw(now());
		};

		const start = () => {
			cancelAnimationFrame(frame);
			if (reducedMotion.matches) {
				hill.height = hill.targetHeight = 0;
				draw(now());
			} else {
				frame = requestAnimationFrame(loop);
			}
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType === 'touch') return;
			if (hill.targetHeight === 0) {
				// Rise from where the pointer is, rather than sliding in from the last spot.
				hill.x = e.clientX;
				hill.y = e.clientY;
			}
			hill.targetX = e.clientX;
			hill.targetY = e.clientY;
			hill.targetHeight = 1;
		};
		const onPointerLeave = () => {
			hill.targetHeight = 0;
		};

		const onResize = () => {
			resize();
			draw(now());
		};

		// Re-read the palette whenever the theme class on <html> changes.
		const themeObserver = new MutationObserver(() => {
			ink = readColor('--ink');
			accent = readColor('--accent');
			dark = document.documentElement.classList.contains('dark');
			draw(now());
		});
		themeObserver.observe(document.documentElement, { attributeFilter: ['class'] });

		resize();
		draw(now());
		start();

		window.addEventListener('resize', onResize);
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onPointerLeave);
		reducedMotion.addEventListener('change', start);

		return () => {
			cancelAnimationFrame(frame);
			themeObserver.disconnect();
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onPointerMove);
			document.documentElement.removeEventListener('pointerleave', onPointerLeave);
			reducedMotion.removeEventListener('change', start);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 h-full w-full [view-transition-name:topography]"
		/>
	);
}
