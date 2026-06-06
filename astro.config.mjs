// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// https://astro.build/config
export default defineConfig({
  site: 'https://nitesh.is-a.dev',
  trailingSlash: 'never',
  prefetch: true,
  markdown: {
    // Slugged headings + a hover "#" anchor link on each heading.
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], ariaHidden: true, tabIndex: -1 },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
    // Built-in Shiki highlighting with paired light/dark themes.
    // The active theme is toggled via the `html.dark` class (see global.css).
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
  integrations: [sitemap()],
})
