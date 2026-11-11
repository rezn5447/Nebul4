'use client'

import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { formatTime, spokenTime } from '@/lib/format-time'
import type { Track } from '@/lib/nebula'

/**
 * The band's recordings. One shared <audio> element plays whichever track is current,
 * so starting one track stops the other.
 */
export function ListenPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(tracks[0]?.durationSeconds ?? 0)
  const [failed, setFailed] = useState(false)

  // Pause if the player leaves the page (client-side navigation).
  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  if (tracks.length === 0) return null

  const select = (index: number) => {
    const audio = audioRef.current
    if (!audio || index === current) return audio
    audio.pause()
    audio.src = tracks[index].src
    setCurrent(index)
    setTime(0)
    setDuration(tracks[index].durationSeconds)
    setFailed(false)
    return audio
  }

  const toggle = async (index: number) => {
    const audio = select(index)
    if (!audio) return
    if (index === current && !audio.paused) {
      audio.pause()
      return
    }
    try {
      await audio.play()
    } catch (err) {
      // AbortError means a pause or track switch interrupted the start; that is not a failure.
      if (!(err instanceof DOMException && err.name === 'AbortError')) setFailed(true)
    }
  }

  const seek = (index: number, seconds: number) => {
    const audio = select(index)
    if (!audio) return
    audio.currentTime = seconds
    setTime(seconds)
  }

  return (
    <div>
      <audio
        ref={audioRef}
        src={tracks[0].src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setTime(0)
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration)
        }}
        onError={() => setFailed(true)}
      />

      <ul aria-label="Recordings">
        {tracks.map((track, i) => {
          const active = i === current
          const isPlaying = active && playing
          const position = active ? time : 0
          const length = active ? duration : track.durationSeconds
          const percent = length > 0 ? Math.min(100, (position / length) * 100) : 0

          return (
            <li key={track.src} className="flex items-center gap-5 border-t border-line py-7 sm:gap-7">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-label={`${isPlaying ? 'Pause' : 'Play'} ${track.title}`}
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-flare text-void transition-transform duration-150 active:scale-[0.95] sm:size-16"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={24} fill="currentColor" strokeWidth={0} className="translate-x-0.5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-wide text-3xl font-black tracking-[-0.035em] sm:text-4xl">{track.title}</h3>
                  <span className="text-sm text-ash">{track.originalArtist} cover</span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  {/* A transparent range input sits on the drawn bar, so seeking works by mouse, touch and keyboard. */}
                  <div className="relative h-6 flex-1">
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line">
                      <div className="h-full rounded-full bg-flare" style={{ width: `${percent}%` }} />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(1, Math.floor(length))}
                      step={1}
                      value={Math.floor(position)}
                      onChange={(e) => seek(i, Number(e.currentTarget.value))}
                      aria-label={`Seek ${track.title}`}
                      aria-valuetext={`${spokenTime(position)} of ${spokenTime(length)}`}
                      className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="pointer-events-none absolute -inset-1 rounded-md ring-flare peer-focus-visible:ring-2" />
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-ash">
                    {formatTime(position)} / {formatTime(length)}
                  </span>
                </div>

                {active && failed && (
                  <p role="alert" className="mt-3 text-sm text-flare">
                    This recording couldn&apos;t load. Please try again in a moment.
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <noscript>
        {tracks.map((track) => (
          <p key={track.src} className="mt-4">
            {track.title}: <audio controls preload="none" src={track.src} className="mt-2 w-full" />
          </p>
        ))}
      </noscript>
    </div>
  )
}
