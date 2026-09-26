/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
	/** Optional; raises the GitHub API rate limit for the projects loader. */
	readonly GITHUB_TOKEN?: string;
}
