'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { InstagramIcon } from '@/components/InstagramIcon'

type Item = { href: string; label: string; current?: boolean }

/** Phone-width navigation: a disclosure that drops the section links below the bar. */
export function MobileMenu({ items, instagram }: { items: Item[]; instagram: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
        className="-mr-2 flex size-10 items-center justify-center text-bone"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-line bg-void/95 px-5 py-4 backdrop-blur sm:px-8"
      >
        <ul className="grid">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                aria-current={item.current ? 'page' : undefined}
                className={`block py-3 font-wide text-2xl font-extrabold tracking-[-0.02em] ${item.current ? 'text-flare' : 'text-bone'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-line pt-4">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="flex items-center gap-2 py-2 text-bone/80"
            >
              <InstagramIcon size={18} /> @nebul4_band
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
