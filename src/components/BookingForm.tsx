"use client";

import { useActionState } from "react";

import { sendBookingRequest } from "@/app/actions/booking";
import {
  HONEYPOT,
  LIMITS,
  type BookingFields,
  type BookingState,
} from "@/lib/booking";

const initial: BookingState = { status: "idle" };

/** Booking request form. Works without JavaScript; emails the band via a Server Action. */
export function BookingForm() {
  const [state, action, pending] = useActionState(sendBookingRequest, initial);

  if (state.status === "sent") {
    return (
      <div
        role='status'
        className='flex flex-col justify-center border-l-2 border-flare pl-6'
      >
        <p className='font-wide text-2xl font-extrabold'>
          Gracias — mensaje recibido.
        </p>
        <p className='mt-2 text-ash'>
          We&apos;ll reply within a couple of days with availability and rates.
        </p>
      </div>
    );
  }

  const values: Partial<BookingFields> =
    state.status === "idle" ? {} : state.values;
  const errors = state.status === "invalid" ? state.errors : {};

  return (
    <form
      action={action}
      aria-label='Booking request'
      className='grid gap-4 sm:grid-cols-2'
    >
      <Field
        label='Name'
        name='name'
        placeholder='Your name'
        required
        maxLength={LIMITS.name}
        autoComplete='name'
        defaultValue={values.name}
        error={errors.name}
      />
      <Field
        label='Email'
        name='email'
        type='email'
        placeholder='you@venue.com'
        required
        maxLength={LIMITS.email}
        autoComplete='email'
        defaultValue={values.email}
        error={errors.email}
      />
      <Field
        label='Event date'
        name='date'
        type='date'
        defaultValue={values.date}
        error={errors.date}
      />
      <Field
        label='City / venue'
        name='venue'
        placeholder='Santa Maria, CA'
        maxLength={LIMITS.venue}
        defaultValue={values.venue}
        error={errors.venue}
      />
      <label className='grid gap-2 sm:col-span-2'>
        <span className='text-sm text-ash'>Details</span>
        <textarea
          name='details'
          rows={4}
          maxLength={LIMITS.details}
          defaultValue={values.details}
          aria-invalid={errors.details ? true : undefined}
          aria-describedby={errors.details ? "details-error" : undefined}
          placeholder='Type of event, set length, expected crowd…'
          className='resize-none rounded-lg border border-line bg-ink px-4 py-3 text-bone placeholder:text-bone/30 focus:border-flare focus:outline-none aria-invalid:border-red-400'
        />
        {errors.details && (
          <FieldError id='details-error'>{errors.details}</FieldError>
        )}
      </label>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div
        aria-hidden='true'
        className='sr-only'
      >
        <label>
          Website
          <input type='text' name={HONEYPOT} tabIndex={-1} autoComplete='off' />
        </label>
      </div>

      {state.status === "failed" && (
        <p
          role='alert'
          className='border-l-2 border-red-400 pl-4 text-sm text-bone sm:col-span-2'
        >
          {state.message}
        </p>
      )}

      <button
        type='submit'
        disabled={pending}
        className='rounded-full bg-flare px-6 py-3.5 font-semibold text-void transition-transform duration-150 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-start'
      >
        {pending ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}

function Field({
  label,
  type = "text",
  error,
  ...input
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${input.name}-error`;
  return (
    <label className='grid content-start gap-2'>
      <span className='text-sm text-ash'>{label}</span>
      <input
        type={type}
        {...input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className='w-full min-w-0 rounded-lg border border-line bg-ink px-4 py-3 text-bone placeholder:text-bone/30 focus:border-flare focus:outline-none aria-invalid:border-red-400'
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function FieldError({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <span id={id} className='text-sm text-red-300'>
      {children}
    </span>
  );
}
