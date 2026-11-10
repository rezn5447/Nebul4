'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Photo } from '@/lib/nebula'

/**
 * A photo that flips from black & white to color.
 * "slats" splits it into vertical blinds that turn one after another;
 * "card" turns the whole photo over in one piece.
 */
export function PhotoFlip({
  photo,
  mode,
  className = '',
  sizes,
}: {
  photo: Photo
  mode: 'slats' | 'card'
  className?: string
  sizes: string
}) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const flipped = hovered || pinned
  const count = mode === 'card' ? 1 : 7

  return (
    <figure className="min-w-0">
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`${photo.caption}, show in ${flipped ? 'black and white' : 'color'}`}
        onClick={() => setPinned((p) => !p)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
        className={`relative block w-full cursor-pointer overflow-hidden rounded-sm bg-ink ${className}`}
        style={{ perspective: 1400 }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-y-0 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{
              left: `${(i / count) * 100}%`,
              width: `calc(${100 / count}% + 1px)`,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${flipped ? 180 : 0}deg)`,
              transitionDelay: `${(flipped ? i : count - 1 - i) * 40}ms`,
            }}
          >
            <Face photo={photo} index={i} count={count} color={false} sizes={sizes} />
            <Face photo={photo} index={i} count={count} color sizes={sizes} />
          </div>
        ))}
      </button>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
        <span className="truncate text-bone">{photo.caption}</span>
        <span className="shrink-0 text-ash">{photo.detail}</span>
      </figcaption>
    </figure>
  )
}

function Face({
  photo,
  index,
  count,
  color,
  sizes,
}: {
  photo: Photo
  index: number
  count: number
  color: boolean
  sizes: string
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: color ? 'rotateY(180deg)' : undefined,
      }}
    >
      {/* Each slat shows its own slice of one full-width image, offset by its index. */}
      <Image
        src={photo.src}
        alt=""
        sizes={sizes}
        draggable={false}
        placeholder="blur"
        className="absolute top-0 h-full max-w-none object-cover"
        style={{
          width: `${count * 100}%`,
          left: `-${index * 100}%`,
          objectPosition: photo.position,
          filter: color ? 'saturate(1.1)' : 'grayscale(1) contrast(1.15) brightness(0.85)',
        }}
      />
    </div>
  )
}
