'use server'

import { Resend } from 'resend'

import {
  HONEYPOT,
  bookingEmailText,
  readBooking,
  validateBooking,
  type BookingState,
} from '@/lib/booking'
import { BAND_TIME_ZONE, todayIn } from '@/lib/show-dates'

/**
 * Emails a booking request to the band via Resend.
 * Needs RESEND_API_KEY and RESEND_EMAIL_DOMAIN (added by the Vercel Resend integration)
 * and BOOKING_INBOX, the address that receives requests.
 */
export async function sendBookingRequest(_prev: BookingState, form: FormData): Promise<BookingState> {
  const values = readBooking(form)

  // Bots fill every field; people never see this one. Pretend it worked.
  if (typeof form.get(HONEYPOT) === 'string' && form.get(HONEYPOT) !== '') return { status: 'sent' }

  const errors = validateBooking(values, todayIn(BAND_TIME_ZONE))
  if (errors) return { status: 'invalid', errors, values }

  const { RESEND_API_KEY, RESEND_EMAIL_DOMAIN, BOOKING_INBOX } = process.env
  if (!RESEND_API_KEY || !RESEND_EMAIL_DOMAIN || !BOOKING_INBOX) {
    console.error('[booking] Missing RESEND_API_KEY, RESEND_EMAIL_DOMAIN or BOOKING_INBOX')
    return { status: 'failed', message: unavailable, values }
  }

  const resend = new Resend(RESEND_API_KEY)
  try {
    const { error } = await resend.emails.send({
      from: `Nebul4 website <bookings@${RESEND_EMAIL_DOMAIN}>`,
      to: BOOKING_INBOX.split(',').map((s) => s.trim()),
      replyTo: values.email,
      subject: `Booking request: ${values.name}${values.date ? ` · ${values.date}` : ''}`,
      text: bookingEmailText(values),
    })
    if (error) {
      console.error('[booking] Resend rejected the email:', error.name, error.message)
      return { status: 'failed', message: unavailable, values }
    }
  } catch (err) {
    console.error('[booking] Could not reach Resend:', err)
    return { status: 'failed', message: unavailable, values }
  }

  return { status: 'sent' }
}

const unavailable =
  'Something went wrong sending your request. Please try again, or DM us on Instagram @nebul4_band.'
