/** Shared booking-request rules, used by the Server Action and its tests. */

export const LIMITS = { name: 100, email: 254, venue: 200, details: 2000 } as const

export type BookingFields = {
  name: string
  email: string
  date: string
  venue: string
  details: string
}

export type FieldErrors = Partial<Record<keyof BookingFields, string>>

export type BookingState =
  | { status: 'idle' }
  | { status: 'sent' }
  | { status: 'invalid'; errors: FieldErrors; values: BookingFields }
  | { status: 'failed'; message: string; values: BookingFields }

/** Name of the hidden field that only bots fill in. */
export const HONEYPOT = 'website'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function text(form: FormData, key: string) {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export function readBooking(form: FormData): BookingFields {
  return {
    name: text(form, 'name'),
    email: text(form, 'email'),
    date: text(form, 'date'),
    venue: text(form, 'venue'),
    details: text(form, 'details'),
  }
}

/** Returns field errors, or null when the request is valid. `today` is yyyy-mm-dd. */
export function validateBooking(f: BookingFields, today: string): FieldErrors | null {
  const errors: FieldErrors = {}
  if (!f.name) errors.name = 'Tell us your name.'
  else if (f.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`

  if (!f.email) errors.email = 'We need an email to reply to.'
  else if (f.email.length > LIMITS.email || !EMAIL.test(f.email)) errors.email = 'That email doesn’t look right.'

  if (f.date) {
    if (!ISO_DATE.test(f.date) || Number.isNaN(Date.parse(f.date))) errors.date = 'Pick a date from the calendar.'
    else if (f.date < today) errors.date = 'That date has already passed.'
  }

  if (f.venue.length > LIMITS.venue) errors.venue = `Keep it under ${LIMITS.venue} characters.`
  if (f.details.length > LIMITS.details) errors.details = `Keep it under ${LIMITS.details} characters.`

  return Object.keys(errors).length ? errors : null
}

/** Plain-text body of the email the band receives. */
export function bookingEmailText(f: BookingFields) {
  return [
    'New booking request from nebul4 website',
    '',
    `Name:   ${f.name}`,
    `Email:  ${f.email}`,
    `Date:   ${f.date || 'Not given'}`,
    `Where:  ${f.venue || 'Not given'}`,
    '',
    'Details:',
    f.details || 'None',
    '',
    'Reply to this email to answer them directly.',
  ].join('\n')
}
