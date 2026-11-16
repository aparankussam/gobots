import type { MetadataRoute } from 'next'
import { LAUNCH } from '@/content/site'

const SITE = 'https://gobotsai.com'
const PATHS = [
  '/',
  '/sprint',
  '/capabilities',
  '/revxl/mortgage',
  '/demo',
  '/verify',
  '/spec',
  '/evidence-gap',
  '/walkthrough',
  ...(LAUNCH.guarantee ? ['/guarantee'] : []),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({ url: `${SITE}${p === '/' ? '' : p}` }))
}
