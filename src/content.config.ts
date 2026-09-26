import { defineCollection, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { site } from './data/site';
import { fetchRepos } from './lib/github';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Frontmatter dates are plain "YYYY-MM-DD" strings; coerced so posts can be sorted.
		date: z.coerce.date(),
	}),
});

/** GitHub's homepage field is free text: blank means none, and a bare domain gets a scheme. */
const normalizeHomepage = (homepage: string | null): string | null => {
	const trimmed = homepage?.trim();
	if (!trimmed) return null;
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

/**
 * Public repos tagged with `site.projectsTopic` on GitHub, fetched at build time.
 * If GitHub can't be reached the build carries on: the previous data is kept
 * (or the page shows its empty state on a fresh build).
 */
const githubProjects: Loader = {
	name: 'github-projects',
	async load({ store, logger, parseData }) {
		let repos;
		try {
			repos = await fetchRepos(site.githubUser);
		} catch (error) {
			logger.warn(`Skipping GitHub projects: ${error instanceof Error ? error.message : error}`);
			return;
		}

		const tagged = repos.filter((repo) => repo.topics.includes(site.projectsTopic));
		store.clear();
		for (const repo of tagged) {
			try {
				const data = await parseData({
					id: repo.name,
					data: {
						name: repo.name,
						description: repo.description,
						url: repo.html_url,
						homepage: normalizeHomepage(repo.homepage),
						language: repo.language,
						stars: repo.stargazers_count,
						topics: repo.topics,
						createdAt: repo.created_at,
						pushedAt: repo.pushed_at,
					},
				});
				store.set({ id: repo.name, data });
			} catch (error) {
				logger.warn(
					`Skipping repo ${repo.name}: ${error instanceof Error ? error.message : error}`,
				);
			}
		}
		logger.info(`Loaded ${tagged.length} of ${repos.length} repos tagged "${site.projectsTopic}"`);
	},
};

const projects = defineCollection({
	loader: githubProjects,
	schema: z.object({
		name: z.string(),
		description: z.string().nullable(),
		url: z.string().url(),
		homepage: z.string().url().nullable(),
		language: z.string().nullable(),
		stars: z.number(),
		topics: z.array(z.string()),
		createdAt: z.coerce.date(),
		pushedAt: z.coerce.date(),
	}),
});

/**
 * Optional notes that enrich a GitHub project: `src/content/projects/<repo-name>.md`.
 * The Markdown body is a longer write-up; frontmatter can mark it `featured`,
 * override the display `title`, or add extra `links` ({ label, href }).
 */
const projectNotes = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/projects' }),
	schema: z.object({
		featured: z.boolean().default(false),
		title: z.string().optional(),
		links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
	}),
});

export const collections = { blog, projects, projectNotes };
