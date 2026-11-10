import { cacheLife } from 'next/cache'

import { SHOWS } from '@/lib/nebula'
import { BAND_TIME_ZONE, splitShows, todayIn } from '@/lib/show-dates'

/**
 * Upcoming and past shows as of today. Cached so pages stay prerendered, and
 * refreshed hourly so shows move to "past" on their own without a redeploy.
 */
export async function getShows() {
  'use cache'
  cacheLife('hours')
  return splitShows(SHOWS, todayIn(BAND_TIME_ZONE))
}
