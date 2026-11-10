import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return [
    { url: new URL('/', base).href, changeFrequency: 'monthly', priority: 1 },
    { url: new URL('/shows', base).href, changeFrequency: 'weekly', priority: 0.8 },
  ]
}
