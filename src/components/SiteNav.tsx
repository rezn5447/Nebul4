import Link from 'next/link'

import { InstagramIcon } from '@/components/InstagramIcon'
import { MobileMenu } from '@/components/MobileMenu'
import { INSTAGRAM } from '@/lib/nebula'

const SECTIONS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'banda', label: 'Banda' },
  { id: 'repertorio', label: 'Repertorio' },
  { id: 'escucha', label: 'Escucha' },
  { id: 'fotos', label: 'Fotos' },
]

/** The site's top bar, shared by every page. */
export function SiteNav({ current }: { current: 'home' | 'shows' | 'none' }) {
  const mobileItems = [
    ...SECTIONS.map((s) => ({ href: `/#${s.id}`, label: s.label })),
    { href: '/shows', label: 'Shows', current: current === 'shows' },
  ]

  return (
    <nav aria-label="Main" className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <Link href="/" className="font-wide text-lg font-black tracking-tight">
        NEBUL4
      </Link>
      <div className="flex items-center gap-4 md:gap-5 lg:gap-8">
        <div className="hidden items-center gap-5 text-sm text-bone/80 md:flex lg:gap-8">
          {SECTIONS.map((s) => (
            <Link key={s.id} href={`/#${s.id}`} className="transition-colors duration-150 hover:text-bone">
              {s.label}
            </Link>
          ))}
          <Link
            href="/shows"
            aria-current={current === 'shows' ? 'page' : undefined}
            className={`transition-colors duration-150 hover:text-bone ${current === 'shows' ? 'text-flare' : ''}`}
          >
            Shows
          </Link>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-bone/80 transition-colors duration-150 hover:text-bone"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
        <Link
          href="/#booking"
          className="whitespace-nowrap rounded-full bg-flare px-4 py-2 text-sm font-semibold text-void transition-transform duration-150 active:scale-[0.97]"
        >
          Book the band
        </Link>
        <MobileMenu items={mobileItems} instagram={INSTAGRAM} />
      </div>
    </nav>
  )
}
