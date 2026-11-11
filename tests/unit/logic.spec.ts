import { expect, test } from '@playwright/test'

import { formatTime, spokenTime } from '../../src/lib/format-time'
import { bookingEmailText, validateBooking, type BookingFields } from '../../src/lib/booking'
import type { Show } from '../../src/lib/nebula'
import { splitShows, todayIn } from '../../src/lib/show-dates'

const show = (date: string): Show => ({ date, venue: `Venue ${date}`, city: 'Santa Maria, CA' })

test.describe('splitShows', () => {
  test('keeps a show upcoming through its own day, then moves it to past', () => {
    const shows = [show('2026-11-22'), show('2026-10-31'), show('2027-01-17')]
    const onTheDay = splitShows(shows, '2026-11-22')
    expect(onTheDay.upcoming.map((s) => s.date)).toEqual(['2026-11-22', '2027-01-17'])
    expect(onTheDay.past.map((s) => s.date)).toEqual(['2026-10-31'])

    const dayAfter = splitShows(shows, '2026-11-23')
    expect(dayAfter.upcoming.map((s) => s.date)).toEqual(['2027-01-17'])
    expect(dayAfter.past.map((s) => s.date)).toEqual(['2026-11-22', '2026-10-31'])
  })
})

test.describe('todayIn', () => {
  test('uses the band’s time zone, not UTC', () => {
    // 2026-11-23 03:00 UTC is still the evening of Nov 22 in California.
    const lateEvening = new Date('2026-11-23T03:00:00Z')
    expect(todayIn('America/Los_Angeles', lateEvening)).toBe('2026-11-22')
    expect(todayIn('UTC', lateEvening)).toBe('2026-11-23')
  })
})

test.describe('validateBooking', () => {
  const ok: BookingFields = { name: 'Ana', email: 'ana@venue.com', date: '2026-12-01', venue: '', details: '' }

  test('accepts a minimal valid request', () => {
    expect(validateBooking(ok, '2026-11-10')).toBeNull()
  })

  test('rejects a missing name, a bad email and a past date', () => {
    const errors = validateBooking({ ...ok, name: '', email: 'nope', date: '2026-01-01' }, '2026-11-10')
    expect(Object.keys(errors ?? {}).sort()).toEqual(['date', 'email', 'name'])
  })

  test('rejects overlong details', () => {
    expect(validateBooking({ ...ok, details: 'x'.repeat(2001) }, '2026-11-10')?.details).toBeTruthy()
  })

  test('email body includes every field', () => {
    const body = bookingEmailText({ ...ok, venue: 'The Loft', details: 'Two sets' })
    for (const v of ['Ana', 'ana@venue.com', '2026-12-01', 'The Loft', 'Two sets']) expect(body).toContain(v)
  })
})

test.describe('formatTime', () => {
  test('shows m:ss, and h:mm:ss past an hour', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65.9)).toBe('1:05')
    expect(formatTime(318)).toBe('5:18')
    expect(formatTime(3725)).toBe('1:02:05')
  })

  test('treats missing or broken durations as zero', () => {
    expect(formatTime(Number.NaN)).toBe('0:00')
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00')
    expect(formatTime(-4)).toBe('0:00')
  })

  test('reads naturally to screen readers', () => {
    expect(spokenTime(1)).toBe('1 second')
    expect(spokenTime(65)).toBe('1 minute 5 seconds')
    expect(spokenTime(318)).toBe('5 minutes 18 seconds')
  })
})
