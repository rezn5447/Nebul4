import type { Metadata } from 'next'

import { InstagramIcon } from '@/components/InstagramIcon'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { INSTAGRAM } from '@/lib/nebula'

import { ShowsTabs } from './ShowsTabs'

export const ensureStatic = 'navigation'

export const metadata: Metadata = {
  title: 'Shows',
  description: 'Upcoming and past Nebul4 shows across the Central Coast of California.',
}

export default function ShowsPage() {
  return (
    <div className="min-w-0 bg-void text-bone antialiased">
      <SiteNav current="shows" />
      <ShowsTabs />
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
