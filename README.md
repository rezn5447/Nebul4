# Nebul4

Website for Nebul4, a rock en español tribute band from Santa Maria, California.

Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4 and Motion. The design
came from the Magic Patterns "Nebula Site" prototype. Hosted on Vercel as the `nebul4` project.

## Pages

- `/`: hero, about, band, repertoire, listen, photos and booking form
- `/shows`: upcoming and past shows
- Branded 404, `sitemap.xml`, `robots.txt`, and an Open Graph image for link previews

## Develop

```bash
npm install
vercel env pull     # writes .env.local with the Resend keys
npm run dev         # http://localhost:3000
```

## Check

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium   # first time only
npm run test:e2e                  # unit + end-to-end tests, against the production build
```

The end-to-end run sends one real booking email to Resend's test inbox
(`delivered@resend.dev`) when `RESEND_API_KEY` is set, and skips that test otherwise.

## Content

Band content lives in [`src/lib/nebula.ts`](src/lib/nebula.ts). The members and shows there are
**placeholders** and need replacing with real data.

- `SHOWS` is one list in any order. The site splits it into upcoming and past by today's date
  in California, refreshed hourly, so nothing needs moving after a show.
- Add a `ticketUrl` to a show to turn its label into a Tickets button.
- `TRACKS` lists the recordings in the Escucha (listen) section. Put the MP3 in
  [`public/audio/`](public/audio/) and add an entry with its title, original artist and length.

Photos and the logo are in [`src/assets/`](src/assets/).

## Booking form

Requests are emailed to the band by a Server Action
([`src/app/actions/booking.ts`](src/app/actions/booking.ts)) through Resend. Validation runs on the
server, a hidden honeypot field drops most bots, and the form works without JavaScript.

| Variable              | Set by                        | Purpose                                     |
| --------------------- | ----------------------------- | ------------------------------------------- |
| `RESEND_API_KEY`      | Vercel Resend integration     | Sends the email                             |
| `RESEND_EMAIL_DOMAIN` | Vercel Resend integration     | Sender domain (`bookings@<domain>`)         |
| `BOOKING_INBOX`       | You, in Vercel project env    | Who receives requests (comma-separate many) |
| `NEXT_PUBLIC_SITE_URL`| You, once there's a domain    | Canonical URLs, sitemap and link previews   |
