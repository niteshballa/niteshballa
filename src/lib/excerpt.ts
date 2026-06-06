import type { CollectionEntry } from 'astro:content'

/**
 * Plain-text excerpt for a post: its frontmatter `description` if present,
 * otherwise a snippet derived from the body with markdown stripped.
 */
export function excerpt(post: CollectionEntry<'posts'>, words = 28): string {
  if (post.data.description) return post.data.description

  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/[*_~>#`|]/g, ' ') // stray md punctuation
    .replace(/\s+/g, ' ')
    .trim()

  const parts = text.split(' ')
  const snippet = parts.slice(0, words).join(' ')
  return parts.length > words ? `${snippet}…` : snippet
}
