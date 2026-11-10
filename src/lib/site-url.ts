/**
 * The public origin of the site, used for canonical URLs, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL once the domain is known. On Vercel it falls back to the
 * project's production domain, and locally to localhost.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return new URL(explicit)
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return new URL(`https://${vercel}`)
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`)
}
