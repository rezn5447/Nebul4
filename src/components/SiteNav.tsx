import Link from 'next/link'

import { InstagramIcon } from '@/components/InstagramIcon'
import { INSTAGRAM } from '@/lib/nebula'

const SECTIONS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'banda', label: 'Banda' },
  { id: 'repertorio', label: 'Repertorio' },
  { id: 'fotos', label: 'Fotos' },
]

/** The site's top bar, shared by Home and Shows. */
export function SiteNav({ current }: { current: 'home' | 'shows' }) {
  return (
    <nav aria-label="Main" className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <Link href="/" className="font-wide text-lg font-black tracking-tight">
        NEBUL4
      </Link>
      <div className="flex items-center gap-5 md:gap-8">
        <div className="hidden items-center gap-8 text-sm text-bone/80 md:flex">
          {SECTIONS.map((s) => (
            <Link key={s.id} href={`/#${s.id}`} className="transition-colors duration-150 hover:text-bone">
              {s.label}
            </Link>
          ))}
        </div>
        <Link
          href="/shows"
          aria-current={current === 'shows' ? 'page' : undefined}
          className={`text-sm transition-colors duration-150 hover:text-bone ${current === 'shows' ? 'text-flare' : 'text-bone/80'}`}
        >
          Shows
        </Link>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="hidden text-bone/80 transition-colors duration-150 hover:text-bone md:block"
        >
          <InstagramIcon size={18} />
        </a>
        <Link
          href="/#booking"
          className="whitespace-nowrap rounded-full bg-flare px-4 py-2 text-sm font-semibold text-void transition-transform duration-150 active:scale-[0.97]"
        >
          Book the band
        </Link>
      </div>
    </nav>
  )
}
