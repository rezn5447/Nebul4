import type { Show } from '@/lib/nebula'

/** Shows are dated in the band's local time, not the server's. */
export const BAND_TIME_ZONE = 'America/Los_Angeles'

/** Today's date as yyyy-mm-dd in the given time zone. */
export function todayIn(timeZone: string, now = new Date()) {
  // en-CA formats dates as yyyy-mm-dd.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

/**
 * Splits shows into upcoming (soonest first) and past (most recent first).
 * A show stays upcoming through the whole of its day.
 */
export function splitShows(shows: Show[], today: string) {
  const sorted = [...shows].sort((a, b) => a.date.localeCompare(b.date))
  return {
    upcoming: sorted.filter((s) => s.date >= today),
    past: sorted.filter((s) => s.date < today).reverse(),
  }
}
