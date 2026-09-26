import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All blog posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Frontmatter dates have no time component, so format in UTC to avoid off-by-one days.
const longDate = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'UTC',
});
const shortDate = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	timeZone: 'UTC',
});

export const formatDate = (date: Date): string => longDate.format(date);
export const formatShortDate = (date: Date): string => shortDate.format(date);
