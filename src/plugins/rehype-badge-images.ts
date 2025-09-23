import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

/**
 * Plugin to enhance badge images (like shields.io badges) with proper styling and attributes
 */
const rehypeBadgeImages: Plugin<[], Root> = () => {
  return function transformer(tree) {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img') {
        const src = node.properties?.src
        const alt = node.properties?.alt
        
        if (typeof src === 'string' && typeof alt === 'string') {
          // Check if this is a badge image (shields.io, badges.fyi, etc.)
          const isBadge = 
            src.includes('shields.io') ||
            src.includes('badges.fyi') ||
            src.includes('img.shields.io') ||
            alt.toLowerCase().includes('badge') ||
            alt.toLowerCase().includes('shield')
          
          if (isBadge) {
            // Add badge-specific classes and attributes
            node.properties = {
              ...node.properties,
              class: 'badge-image',
              loading: 'lazy',
              // Ensure external images are allowed
              referrerpolicy: 'no-referrer',
              // Add data attribute for styling
              'data-badge': 'true'
            }
          }
        }
      }
    })
  }
}

export default rehypeBadgeImages
