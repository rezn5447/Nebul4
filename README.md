# Nebul4

Website for Nebul4, a rock en español tribute band from Santa Maria, California.

Built with Next.js (App Router), Tailwind CSS v4 and Motion. The design came from the
Magic Patterns "Nebula Site" prototype.

## Pages

- `/`: hero, about, band, repertoire, photos and booking form
- `/shows`: upcoming and past shows

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

## Check

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium   # first time only
npm run test:e2e                  # runs against the production build
```

## Content

Band content lives in [`src/lib/nebula.ts`](src/lib/nebula.ts). The members and show dates
there are **placeholders** and need replacing with real data. Add a `ticketUrl` to a show to
turn its label into a Tickets button.

Photos and the logo are in [`src/assets/`](src/assets/).

## Known gaps

- The booking form does not send submissions anywhere yet. It shows a confirmation
  and drops the data. See [`src/components/BookingForm.tsx`](src/components/BookingForm.tsx).
