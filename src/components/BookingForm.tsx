'use client'

import { useState } from 'react'

/**
 * Booking request form.
 * NOTE: submissions are not sent anywhere yet. Wire this to a Server Action or an
 * email provider before launch; until then it only shows the confirmation state.
 */
export function BookingForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div role="status" className="flex flex-col justify-center border-l-2 border-flare pl-6">
        <p className="font-wide text-2xl font-extrabold">Gracias — mensaje recibido.</p>
        <p className="mt-2 text-ash">We&apos;ll reply within a couple of days with availability and rates.</p>
      </div>
    )
  }

  return (
    <form
      aria-label="Booking request"
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <Field label="Name" name="name" placeholder="Your name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" placeholder="you@venue.com" required autoComplete="email" />
      <Field label="Event date" name="date" type="date" />
      <Field label="City / venue" name="venue" placeholder="Santa Maria, CA" />
      <label className="grid gap-2 sm:col-span-2">
        <span className="text-sm text-ash">Details</span>
        <textarea
          name="details"
          rows={4}
          placeholder="Type of event, set length, expected crowd…"
          className="resize-none rounded-lg border border-line bg-ink px-4 py-3 text-bone placeholder:text-bone/30 focus:border-flare focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-flare px-6 py-3.5 font-semibold text-void transition-transform duration-150 active:scale-[0.97] sm:col-span-2 sm:justify-self-start"
      >
        Send booking request
      </button>
    </form>
  )
}

function Field({
  label,
  type = 'text',
  ...input
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-ash">{label}</span>
      <input
        type={type}
        {...input}
        className="rounded-lg border border-line bg-ink px-4 py-3 text-bone placeholder:text-bone/30 focus:border-flare focus:outline-none"
      />
    </label>
  )
}
