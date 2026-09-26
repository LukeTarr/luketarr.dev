/** The subset of GitHub's repository payload the site uses. */
export interface GitHubRepo {
	name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	stargazers_count: number;
	topics: string[];
	fork: boolean;
	archived: boolean;
	created_at: string;
	pushed_at: string;
}

const PER_PAGE = 100;

/**
 * All public repos owned by `user`. Runs at build time only.
 * Unauthenticated requests get 60/hour per IP, which is plenty for a build;
 * set GITHUB_TOKEN to raise that if needed.
 */
export async function fetchRepos(user: string): Promise<GitHubRepo[]> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'User-Agent': 'luketarr.dev',
	};
	const token = import.meta.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const repos: GitHubRepo[] = [];
	for (let page = 1; ; page++) {
		const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?type=owner&per_page=${PER_PAGE}&page=${page}`;
		const res = await fetch(url, { headers });
		if (!res.ok) {
			const remaining = res.headers.get('x-ratelimit-remaining');
			throw new Error(
				`GitHub API ${[res.status, res.statusText].filter(Boolean).join(' ')} for ${url}` +
					(remaining === '0' ? ' (rate limit exhausted; set GITHUB_TOKEN)' : ''),
			);
		}
		const batch = (await res.json()) as GitHubRepo[];
		repos.push(...batch);
		if (batch.length < PER_PAGE) return repos;
	}
}
