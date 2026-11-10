import { INSTAGRAM, type Show } from '@/lib/nebula'
import { siteUrl } from '@/lib/site-url'

/**
 * schema.org JSON-LD for the band and its upcoming shows, so search engines can
 * list the events. Returned as a string ready for a <script type="application/ld+json">.
 */
export function bandJsonLd(upcoming: Show[]) {
  const url = siteUrl().href
  const band = {
    '@type': 'MusicGroup',
    name: 'Nebul4',
    url,
    genre: ['Rock en español', 'Tribute'],
    foundingDate: '2024',
    foundingLocation: { '@type': 'Place', name: 'Santa Maria, California' },
    sameAs: [INSTAGRAM],
  }

  const events = upcoming
    .filter((s) => s.ticket !== 'private')
    .map((s) => ({
      '@type': 'MusicEvent',
      name: `Nebul4 at ${s.venue}`,
      startDate: s.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: s.venue,
        address: { '@type': 'PostalAddress', addressLocality: s.city.replace(/, CA$/, ''), addressRegion: 'CA', addressCountry: 'US' },
      },
      performer: { '@type': 'MusicGroup', name: 'Nebul4' },
      ...(s.note ? { description: s.note } : {}),
      ...(s.ticketUrl ? { offers: { '@type': 'Offer', url: s.ticketUrl, availability: 'https://schema.org/InStock' } } : {}),
      ...(s.ticket === 'free' ? { isAccessibleForFree: true } : {}),
    }))

  const data = { '@context': 'https://schema.org', '@graph': [band, ...events] }
  // Escape "<" so venue text can never close the surrounding <script> tag.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
