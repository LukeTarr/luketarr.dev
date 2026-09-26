/**
 * Seeded 3D simplex noise (after Stefan Gustavson's reference implementation).
 * Deterministic for a given seed, so every page renders the same landscape.
 */

export type Noise3D = (x: number, y: number, z: number) => number;

const F3 = 1 / 3;
const G3 = 1 / 6;

// Gradient directions: midpoints of the edges of a cube.
const GRAD3 = new Float32Array([
	1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1,
	0, 1, -1, 0, -1, -1,
]);

function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function createNoise3D(seed = 1): Noise3D {
	const random = mulberry32(seed);
	const p = new Uint8Array(256);
	for (let i = 0; i < 256; i++) p[i] = i;
	for (let i = 255; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[p[i], p[j]] = [p[j], p[i]];
	}

	const perm = new Uint8Array(512);
	const permMod12 = new Uint8Array(512);
	for (let i = 0; i < 512; i++) {
		perm[i] = p[i & 255];
		permMod12[i] = perm[i] % 12;
	}

	return (x, y, z) => {
		const s = (x + y + z) * F3;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const k = Math.floor(z + s);
		const t = (i + j + k) * G3;
		const x0 = x - (i - t);
		const y0 = y - (j - t);
		const z0 = z - (k - t);

		// Which of the six tetrahedra of the skewed cube are we in?
		// Plain assignments rather than array destructuring: this runs thousands of times a frame.
		let i1 = 0;
		let j1 = 0;
		let k1 = 0;
		let i2 = 1;
		let j2 = 1;
		let k2 = 1;
		if (x0 >= y0) {
			if (y0 >= z0) {
				i1 = 1;
				k2 = 0;
			} else if (x0 >= z0) {
				i1 = 1;
				j2 = 0;
			} else {
				k1 = 1;
				j2 = 0;
			}
		} else if (y0 < z0) {
			k1 = 1;
			i2 = 0;
		} else if (x0 < z0) {
			j1 = 1;
			i2 = 0;
		} else {
			j1 = 1;
			k2 = 0;
		}

		const x1 = x0 - i1 + G3;
		const y1 = y0 - j1 + G3;
		const z1 = z0 - k1 + G3;
		const x2 = x0 - i2 + 2 * G3;
		const y2 = y0 - j2 + 2 * G3;
		const z2 = z0 - k2 + 2 * G3;
		const x3 = x0 - 1 + 3 * G3;
		const y3 = y0 - 1 + 3 * G3;
		const z3 = z0 - 1 + 3 * G3;

		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;

		const corner = (g: number, cx: number, cy: number, cz: number): number => {
			let tt = 0.6 - cx * cx - cy * cy - cz * cz;
			if (tt < 0) return 0;
			tt *= tt;
			const gi = g * 3;
			return tt * tt * (GRAD3[gi] * cx + GRAD3[gi + 1] * cy + GRAD3[gi + 2] * cz);
		};

		const n0 = corner(permMod12[ii + perm[jj + perm[kk]]], x0, y0, z0);
		const n1 = corner(permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1);
		const n2 = corner(permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2);
		const n3 = corner(permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);

		// Scaled to roughly [-1, 1].
		return 32 * (n0 + n1 + n2 + n3);
	};
}
