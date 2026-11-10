import type { StaticImageData } from 'next/image'

import cosmic from '@/assets/cosmic.jpg'
import drumKit from '@/assets/drum-kit.jpg'
import livingRoom from '@/assets/living-room.jpg'
import logo from '@/assets/logo.jpg'

export type Photo = {
  src: StaticImageData
  position: string
  caption: string
  detail: string
}

export const PHOTOS = {
  'living-room': {
    src: livingRoom,
    position: '50% 62%',
    caption: 'The living room session',
    detail: 'Santa Maria, CA',
  },
  'drum-kit': {
    src: drumKit,
    position: '50% 55%',
    caption: 'Rehearsal room, wood ceiling',
    detail: 'Before the first show',
  },
  cosmic: {
    src: cosmic,
    position: '50% 30%',
    caption: 'Promo, among the stars',
    detail: 'Poster shoot',
  },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof PHOTOS

/** Site-wide look settings, frozen from the design's defaults. */
export const SITE = {
  heroPhoto: 'drum-kit' as PhotoKey,
  heroTone: 'mono' as 'mono' | 'color',
  flipStyle: 'slats' as 'slats' | 'card',
}

export const LOGO = logo

export const INSTAGRAM = 'https://www.instagram.com/nebul4_band'

export const ICONS = ['Soda Stereo', 'Gustavo Cerati', 'Caifanes']

export const REPERTOIRE = [
  'The Cure',
  'Héroes del Silencio',
  'La Ley',
  'La Unión',
  'Zoé',
  'Aterciopelados',
  'Enanitos Verdes',
  'Bohemia Suburbana',
  'Café Tacvba',
  'Gloria Trevi',
  'Shakira',
  'The Cranberries',
  'Audioslave',
  'No Doubt',
  'Red Hot Chili Peppers',
  'Natalie Imbruglia',
  "Guns N' Roses",
  'Muse',
  'Hello Seahorse',
  'Lucybell',
]

/**
 * PLACEHOLDER: the band's EPK lists no members. Swap in real names, roles and bios.
 */
export const MEMBERS = [
  {
    name: 'Adrián',
    role: 'Voz y guitarra',
    bio: 'Grew up on his older brother’s Canción Animal cassette and never gave it back. Sings the Cerati catalogue in the original keys, which is either brave or reckless.',
    song: 'Persiana americana',
  },
  {
    name: 'Valeria',
    role: 'Guitarra',
    bio: 'Chorus pedal evangelist. Learned guitar by slowing down Héroes del Silencio records, and builds the delay-soaked textures that hold the set together.',
    song: 'Entre dos tierras',
  },
  {
    name: 'Marco',
    role: 'Bajo y sintes',
    bio: 'Came up through post-punk bands on the Central Coast. Covers both the bass lines and the synth parts, often in the same song, sometimes in the same bar.',
    song: 'Nada personal',
  },
  {
    name: 'Iván',
    role: 'Batería',
    bio: 'The rehearsal room in the photos is his garage. Plays Caifanes like it’s 1990 at the Palacio de los Deportes and owns more cowbells than he admits to.',
    song: 'La negra Tomasa',
  },
]

export type Show = {
  date: string // ISO yyyy-mm-dd
  venue: string
  city: string
  note?: string
  ticket?: 'tickets' | 'free' | 'private' | 'sold-out'
  /** Where the Tickets button goes. Without it, a "tickets" show shows a plain label. */
  ticketUrl?: string
}

/**
 * PLACEHOLDER: no dates were published on the EPK. Replace with the real calendar.
 * One list in any order: `getShows()` in shows.ts sorts it and splits it into
 * upcoming and past by today's date in the band's time zone.
 */
export const SHOWS: Show[] = [
  { date: '2026-11-22', venue: 'The Loft at Main Street', city: 'Santa Maria, CA', note: 'Full set · 21+', ticket: 'tickets' },
  { date: '2026-12-12', venue: 'Rancho Plaza Courtyard', city: 'Orcutt, CA', note: 'Posada rockera, with DJ set after', ticket: 'free' },
  { date: '2027-01-17', venue: 'Avalon Ballroom', city: 'San Luis Obispo, CA', note: 'Soda Stereo night', ticket: 'tickets' },
  { date: '2027-02-14', venue: 'Teatro del Mar', city: 'Lompoc, CA', note: 'Amor cósmico · Valentine’s show', ticket: 'tickets' },
  { date: '2026-10-31', venue: 'The Loft at Main Street', city: 'Santa Maria, CA', note: 'Día de Muertos special', ticket: 'sold-out' },
  { date: '2026-09-15', venue: 'Fiestas Patrias, Town Center', city: 'Santa Maria, CA', note: 'Outdoor stage' },
  { date: '2026-08-08', venue: 'Private event', city: 'Nipomo, CA', ticket: 'private' },
  { date: '2026-06-20', venue: 'Night Market at the Plaza', city: 'Guadalupe, CA' },
  { date: '2026-03-28', venue: 'Avalon Ballroom', city: 'San Luis Obispo, CA', note: 'Opening for Los Inmortales' },
  { date: '2025-12-13', venue: 'Rancho Plaza Courtyard', city: 'Orcutt, CA' },
  { date: '2025-09-06', venue: 'The Loft at Main Street', city: 'Santa Maria, CA', note: 'First show' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Parses yyyy-mm-dd without timezone drift. */
export function showDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const weekday = DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return { year: y, month: MONTHS[m - 1], day: d, weekday }
}

export const THEMES = [
  'El universo',
  'El tiempo',
  'Los sueños',
  'La libertad interior',
  'El amor cósmico',
  'Viajes mentales',
]
