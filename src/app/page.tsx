import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { BookingForm } from "@/components/BookingForm";
import { InstagramIcon } from "@/components/InstagramIcon";
import { ListenPlayer } from "@/components/ListenPlayer";
import { PhotoFlip } from "@/components/PhotoFlip";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import {
  ICONS,
  INSTAGRAM,
  LOGO,
  MEMBERS,
  PHOTOS,
  REPERTOIRE,
  SITE,
  THEMES,
  TRACKS,
  showDate,
  type PhotoKey,
} from "@/lib/nebula";
import { getShows } from "@/lib/shows";
import { bandJsonLd } from "@/lib/structured-data";

export const ensureStatic = "navigation";

export default async function Home() {
  const { heroPhoto, heroTone, flipStyle } = SITE;
  const { upcoming } = await getShows();
  const hero = PHOTOS[heroPhoto];
  const mono = heroTone === "mono";
  const nextShows = upcoming.slice(0, 3);

  const others = (["living-room", "drum-kit", "cosmic"] as PhotoKey[]).filter(
    (k) => k !== heroPhoto,
  );
  const galleryKeys: PhotoKey[] = [heroPhoto, ...others].slice(0, 3);

  return (
    <div className='min-w-0 bg-void text-bone antialiased'>
      <script
        type='application/ld+json'
        // JSON-LD lets search engines show the band and its upcoming shows.
        dangerouslySetInnerHTML={{ __html: bandJsonLd(upcoming) }}
      />
      {/* HERO */}
      <header className='relative h-160 overflow-hidden md:h-205'>
        <Image
          src={hero.src}
          alt='Nebul4, the band'
          fill
          priority
          sizes='100vw'
          placeholder='blur'
          className='object-cover'
          style={{
            objectPosition: hero.position,
            filter: mono
              ? "grayscale(1) contrast(1.15) brightness(0.8)"
              : "brightness(0.8)",
          }}
        />
        <div className='pointer-events-none absolute inset-0 bg-void/30' />

        <SiteNav current='home' />

        <div className='absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-5 pb-10 sm:px-8 md:pb-14'>
          <p className='mb-3 text-sm text-bone/80 sm:text-base'>
            Rock en español tribute · Santa Maria, California
          </p>
          <h1 className='font-wide text-[4.2rem] font-black leading-[0.82] tracking-[-0.04em] sm:text-[8rem] lg:text-[11.5rem]'>
            NEBUL4
          </h1>
          <div className='mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
            <p className='max-w-md text-xl font-medium leading-snug sm:text-2xl'>
              Música para volar.{" "}
              <span className='text-bone/60'>
                Soda Stereo, Cerati and Caifanes, played like they mean it.
              </span>
            </p>
            <div className='flex shrink-0 items-center gap-3'>
              <a
                href='#booking'
                className='whitespace-nowrap rounded-full bg-bone px-5 py-3 text-sm font-semibold text-void transition-transform duration-150 active:scale-[0.97]'
              >
                Check availability
              </a>
              <a
                href={INSTAGRAM}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-1.5 whitespace-nowrap rounded-full border border-bone/30 px-5 py-3 text-sm font-medium transition-colors duration-150 hover:border-bone'
              >
                @nebul4_band <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          {nextShows.length > 0 && (
            <div className='mt-10 border-t border-bone/20 pt-5'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10'>
                <p className='shrink-0 text-sm font-semibold text-flare'>
                  Próximos shows
                </p>
                <ul
                  aria-label='Próximos shows'
                  className='grid min-w-0 flex-1 gap-3 sm:grid-cols-3 sm:gap-6'
                >
                  {nextShows.map((s, i) => {
                    const d = showDate(s.date);
                    return (
                      <li
                        key={`${s.date}-${s.venue}`}
                        className={`min-w-0 items-baseline gap-3 ${i > 0 ? "hidden sm:flex" : "flex"}`}
                      >
                        <span className='shrink-0 font-wide text-lg font-black tracking-[-0.03em]'>
                          {d.month} {d.day}
                        </span>
                        <span className='truncate text-sm text-bone/75'>
                          {s.venue}, {s.city.replace(", CA", "")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href='/shows'
                  className='flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-bone underline decoration-bone/30 underline-offset-4 transition-colors duration-150 hover:decoration-flare'
                >
                  All shows <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ABOUT */}
        <section
          id='sobre'
          className='mx-auto grid max-w-7xl scroll-mt-4 gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:gap-10 md:py-32'
        >
          <div className='md:col-span-5'>
            <Image
              src={LOGO}
              alt='Nebul4 logo'
              sizes='(min-width: 768px) 420px, 100vw'
              className='mx-auto h-auto w-full max-w-105'
              style={{ clipPath: "circle(43% at 50% 47%)" }}
            />
          </div>
          <div className='md:col-span-7 md:pt-6'>
            <h2 className='font-wide text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-6xl'>
              Un tributo a nuestros iconos.
            </h2>
            <div className='mt-8 grid gap-5 text-base leading-relaxed text-bone/75 sm:text-lg lg:grid-cols-2 lg:gap-8'>
              <p>
                Nebul4 emerged in 2024 from Santa Maria, California — a tribute
                to the legacy of rock en español and the icons who built it:
                Soda Stereo, Gustavo Cerati and Caifanes.
              </p>
              <p>
                Cosmic lyrics over new wave, post punk, goth, British and
                alternative rock. A set that invites the room into an expansive
                journey, where emotion, space and sound collide.
              </p>
            </div>
            <ul className='mt-10 flex flex-wrap gap-x-3 gap-y-2 border-t border-line pt-6 text-sm text-ash'>
              {THEMES.map((t, i) => (
                <li key={t} className='flex items-center gap-3'>
                  {i > 0 && (
                    <span aria-hidden='true' className='text-flare'>
                      ✦
                    </span>
                  )}
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BAND */}
        <section id='banda' className='border-t border-line'>
          <div className='mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28'>
            <div className='md:col-span-4'>
              <h2 className='font-wide text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl'>
                La banda
              </h2>
              <p className='mt-4 max-w-xs text-ash'>
                Four musicians from the Central Coast, raised on the same
                cassettes.
              </p>
            </div>
            <ul className='grid gap-x-10 sm:grid-cols-2 md:col-span-8'>
              {MEMBERS.map((m) => (
                <li
                  key={m.name}
                  className='flex flex-col border-t border-line py-7'
                >
                  <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
                    <h3 className='font-wide text-3xl font-black tracking-[-0.035em]'>
                      {m.name}
                    </h3>
                    <span className='text-sm text-flare'>{m.role}</span>
                  </div>
                  <p className='mt-4 leading-relaxed text-bone/75'>{m.bio}</p>
                  <p className='mt-auto pt-5 text-sm text-ash'>
                    Can’t skip: <span className='text-bone'>“{m.song}”</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* REPERTOIRE */}
        <section id='repertorio' className='border-y border-line bg-ink'>
          <div className='mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28'>
            <div className='md:col-span-4'>
              <h2 className='font-wide text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl'>
                Repertorio
              </h2>
              <p className='mt-4 max-w-xs text-ash'>
                Three icons at the heart of the set, and the artists who share
                the stage with them.
              </p>
            </div>
            <div className='md:col-span-8'>
              <ul className='space-y-1'>
                {ICONS.map((name) => (
                  <li
                    key={name}
                    className='font-wide text-4xl font-black leading-[1.05] tracking-[-0.035em] text-flare sm:text-6xl'
                  >
                    {name}
                  </li>
                ))}
              </ul>
              <p className='mt-8 text-xl leading-relaxed text-bone/80 sm:text-2xl'>
                {/* Each name stays on one line; lines break only between names. */}
                {REPERTOIRE.map((name, i) => (
                  <Fragment key={name}>
                    <span className='whitespace-nowrap'>
                      {name}
                      {i < REPERTOIRE.length - 1 && (
                        <span aria-hidden='true' className='ml-2 text-line'>
                          /
                        </span>
                      )}
                    </span>{" "}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
        </section>

        {/* LISTEN */}
        <section id='escucha' className='scroll-mt-4'>
          <div className='mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28'>
            <div className='md:col-span-4'>
              <h2 className='font-wide text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl'>
                Escucha
              </h2>
              <p className='mt-4 max-w-xs text-ash'>
                Hear how Nebul4 plays the songs that made us. Turn it up.
              </p>
            </div>
            <div className='md:col-span-8'>
              <ListenPlayer tracks={TRACKS} />
            </div>
          </div>
        </section>

        {/* PHOTOS */}
        <section
          id='fotos'
          className='mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28'
        >
          <div className='mb-10 flex flex-wrap items-end justify-between gap-4'>
            <h2 className='font-wide text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl'>
              Fotos
            </h2>
            <p className='text-sm text-ash'>
              Hover or tap a photo to flip it to color.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-[1.6fr_1fr]'>
            <PhotoFlip
              photo={PHOTOS[galleryKeys[0]]}
              mode={flipStyle}
              sizes='(min-width: 768px) 62vw, 100vw'
              className='h-110 md:h-170'
            />
            <div className='grid gap-4'>
              <PhotoFlip
                photo={PHOTOS[galleryKeys[1]]}
                mode={flipStyle}
                sizes='(min-width: 768px) 38vw, 100vw'
                className='h-110 md:h-83'
              />
              <PhotoFlip
                photo={PHOTOS[galleryKeys[2]]}
                mode={flipStyle}
                sizes='(min-width: 768px) 38vw, 100vw'
                className='h-110 md:h-83'
              />
            </div>
          </div>
        </section>

        {/* BOOKING */}
        <section id='booking' className='border-t border-line'>
          <div className='mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28'>
            <div>
              <h2 className='font-wide text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-7xl'>
                Book
                <br />
                Nebul4
              </h2>
              <p className='mt-6 max-w-sm text-lg text-bone/75'>
                Venues, festivals, private events across the Central Coast and
                beyond. Tell us the date and we&apos;ll get back to you.
              </p>
              <a
                href={INSTAGRAM}
                target='_blank'
                rel='noreferrer'
                className='mt-8 inline-flex items-center gap-2 text-bone underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-flare'
              >
                <InstagramIcon size={18} /> Or DM @nebul4_band
              </a>
            </div>
            <BookingForm />
          </div>
        </section>
      </main>

      <SiteFooter>
        <span>Somos Nebul4 · Santa Maria, California · Since 2024</span>
      </SiteFooter>
    </div>
  );
}
