import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

type Repo = CollectionEntry<'projects'>['data'];
type Note = CollectionEntry<'projectNotes'>;

export interface Project {
	id: string;
	title: string;
	repo: Repo;
	featured: boolean;
	links: { label: string; href: string }[];
	/** Optional write-up from src/content/projects/<repo-name>.md. */
	note?: Note;
}

// Glob ids are slugified (lowercased, dots dropped), so match notes to repos by file name.
const noteKey = (note: Note): string =>
	(note.filePath ?? note.id).split('/').pop()!.replace(/\.md$/, '').toLowerCase();

/** GitHub projects merged with their notes: featured first, then most recently pushed. */
export async function getProjects(): Promise<Project[]> {
	const [repos, notes] = await Promise.all([
		getCollection('projects'),
		getCollection('projectNotes'),
	]);
	const notesByRepo = new Map(notes.map((note) => [noteKey(note), note]));

	const projects = repos.map(({ id, data }): Project => {
		const note = notesByRepo.get(id.toLowerCase());
		notesByRepo.delete(id.toLowerCase());
		return {
			id,
			title: note?.data.title ?? data.name,
			repo: data,
			featured: note?.data.featured ?? false,
			links: note?.data.links ?? [],
			note,
		};
	});

	for (const [name] of notesByRepo) {
		console.warn(
			`[projects] src/content/projects/${name}.md has no matching repo tagged "${site.projectsTopic}" on GitHub`,
		);
	}

	return projects.sort(
		(a, b) =>
			Number(b.featured) - Number(a.featured) ||
			b.repo.pushedAt.valueOf() - a.repo.pushedAt.valueOf(),
	);
}

/** Active years, e.g. "2024–2026" (created → last push), or a single year. */
export function projectYears(project: Project): string {
	const start = project.repo.createdAt.getUTCFullYear();
	const end = project.repo.pushedAt.getUTCFullYear();
	return end > start ? `${start}–${end}` : String(start);
}
