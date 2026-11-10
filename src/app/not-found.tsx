import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <div className="flex min-h-svh min-w-0 flex-col bg-void text-bone antialiased">
      <SiteNav current="none" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-12 sm:px-8 md:pt-20">
        <p className="text-sm text-flare">404</p>
        <h1 className="mt-3 font-wide text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-7xl">
          Perdidos en el espacio.
        </h1>
        <p className="mt-6 max-w-md text-lg text-bone/75">This page drifted out of orbit. Try the home page or the show calendar.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full bg-bone px-5 py-3 text-sm font-semibold text-void transition-transform duration-150 active:scale-[0.97]"
          >
            Back home
          </Link>
          <Link
            href="/shows"
            className="whitespace-nowrap rounded-full border border-bone/30 px-5 py-3 text-sm font-medium transition-colors duration-150 hover:border-bone"
          >
            See shows
          </Link>
        </div>
      </main>
      <SiteFooter>
        <span>Somos Nebul4 · Santa Maria, California</span>
      </SiteFooter>
    </div>
  )
}
