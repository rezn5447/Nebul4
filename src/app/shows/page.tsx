import type { Metadata } from 'next'

import { InstagramIcon } from '@/components/InstagramIcon'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { INSTAGRAM } from '@/lib/nebula'
import { getShows } from '@/lib/shows'
import { bandJsonLd } from '@/lib/structured-data'

import { ShowsTabs } from './ShowsTabs'

export const ensureStatic = 'navigation'

export const metadata: Metadata = {
  title: 'Shows',
  description: 'Upcoming and past Nebul4 shows across the Central Coast of California.',
  alternates: { canonical: '/shows' },
}

export default async function ShowsPage() {
  const { upcoming, past } = await getShows()

  return (
    <div className="min-w-0 bg-void text-bone antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: bandJsonLd(upcoming) }} />
      <SiteNav current="shows" />
      <ShowsTabs upcoming={upcoming} past={past} />
      <SiteFooter>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors duration-150 hover:text-bone"
        >
          <InstagramIcon size={16} /> Dates are announced first on @nebul4_band
        </a>
      </SiteFooter>
    </div>
  )
}
