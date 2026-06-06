import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE } from '../consts'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', (p) => !p.data.draft)).sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime(),
  )

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.published,
      link: `/posts/${post.id}`,
    })),
  })
}
