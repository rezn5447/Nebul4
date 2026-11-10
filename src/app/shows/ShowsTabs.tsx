"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { showDate, type Show } from "@/lib/nebula";

type Tab = "upcoming" | "past";

const showKey = (s: Show) => `${s.date}-${s.venue}`;

export function ShowsTabs({
  upcoming,
  past,
  initialTab = "upcoming",
}: {
  upcoming: Show[];
  past: Show[];
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const reduce = useReducedMotion();

  const [next, ...later] = upcoming;
  const years = Array.from(new Set(past.map((s) => showDate(s.date).year)));

  return (
    <>
      <header className='mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 md:pt-20'>
        <h1 className='font-wide text-[4.2rem] font-black leading-[0.85] tracking-[-0.04em] sm:text-[7rem] lg:text-[9rem]'>
          Shows
        </h1>
        <div
          role='tablist'
          aria-label='Shows'
          className='mt-10 flex gap-8 border-b border-line'
        >
          <TabButton
            id='upcoming'
            active={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
            count={upcoming.length}
          >
            Próximos
          </TabButton>
          <TabButton
            id='past'
            active={tab === "past"}
            onClick={() => setTab("past")}
            count={past.length}
          >
            Pasados
          </TabButton>
        </div>
      </header>

      <AnimatePresence mode='wait' initial={false}>
        <motion.main
          key={tab}
          id={`panel-${tab}`}
          role='tabpanel'
          aria-labelledby={`tab-${tab}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className='mx-auto max-w-7xl px-5 pb-24 sm:px-8 md:pb-32'
        >
          {tab === "upcoming" ? (
            next === undefined ? (
              <EmptyUpcoming />
            ) : (
              <>
                <NextShow show={next} />
                <ul className='mt-6'>
                  {later.map((s) => (
                    <ShowRow key={showKey(s)} show={s} />
                  ))}
                </ul>
              </>
            )
          ) : past.length === 0 ? (
            <p className='border-l-2 border-flare py-2 pl-6 font-wide text-2xl font-extrabold'>
              No past shows yet.
            </p>
          ) : (
            <div className='grid gap-12 md:gap-16'>
              {years.map((year) => (
                <section
                  key={year}
                  className='grid gap-4 md:grid-cols-12 md:gap-10'
                >
                  <h2 className='font-wide text-2xl font-extrabold tracking-[-0.03em] text-ash md:col-span-2 md:pt-5'>
                    {year}
                  </h2>
                  <ul className='md:col-span-10'>
                    {past
                      .filter((s) => showDate(s.date).year === year)
                      .map((s) => (
                        <ShowRow key={showKey(s)} show={s} past />
                      ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </>
  );
}

function TabButton({
  id,
  active,
  onClick,
  count,
  children,
}: {
  id: Tab;
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      role='tab'
      id={`tab-${id}`}
      aria-selected={active}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      className={`-mb-px flex items-baseline gap-2 whitespace-nowrap border-b-2 pb-3 font-wide text-lg font-extrabold tracking-[-0.02em] transition-colors duration-150 sm:text-xl ${
        active
          ? "border-flare text-bone"
          : "border-transparent text-ash hover:text-bone"
      }`}
    >
      {children}
      <span className='font-sans text-sm font-medium text-ash'>{count}</span>
    </button>
  );
}

/** The soonest show gets the room: it's the one most visitors came to find. */
function NextShow({ show }: { show: Show }) {
  const d = showDate(show.date);
  return (
    <article className='grid gap-6 bg-ink p-6 sm:p-10 md:grid-cols-12 md:items-end md:gap-10'>
      <div className='md:col-span-4'>
        <p className='text-sm text-flare'>Next show</p>
        <p className='mt-3 font-wide text-7xl font-black leading-[0.85] tracking-tighter sm:text-8xl'>
          {d.day}
          <span className='ml-3 align-top text-3xl tracking-[-0.03em] sm:text-4xl'>
            {d.month}
          </span>
        </p>
        <p className='mt-2 text-ash'>
          {d.weekday} · {d.year}
        </p>
      </div>
      <div className='min-w-0 md:col-span-5'>
        <h2 className='font-wide text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl'>
          {show.venue}
        </h2>
        <p className='mt-2 text-lg text-bone/75'>{show.city}</p>
        {show.note && <p className='mt-1 text-ash'>{show.note}</p>}
      </div>
      <div className='md:col-span-3 md:justify-self-end'>
        <TicketAction show={show} large />
      </div>
    </article>
  );
}

function ShowRow({ show, past = false }: { show: Show; past?: boolean }) {
  const d = showDate(show.date);
  return (
    <li className='grid grid-cols-[4.5rem_1fr] items-start gap-x-5 gap-y-3 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:gap-x-8'>
      <div className='leading-none'>
        <p
          className={`font-wide text-4xl font-black tracking-[-0.04em] ${past ? "text-bone/70" : ""}`}
        >
          {d.day}
        </p>
        <p className='mt-1 text-sm text-ash'>
          {d.month} · {d.weekday}
        </p>
      </div>
      <div className='min-w-0'>
        <p
          className={`text-lg font-semibold sm:text-xl ${past ? "text-bone/80" : ""}`}
        >
          {show.venue}
        </p>
        <p className='mt-0.5 text-ash'>
          {show.city}
          {show.note && <span className='text-ash/80'> · {show.note}</span>}
        </p>
      </div>
      <div className='col-start-2 sm:col-start-auto'>
        {past ? (
          show.ticket === "sold-out" ? (
            <span className='text-sm text-flare'>Sold out</span>
          ) : null
        ) : (
          <TicketAction show={show} />
        )}
      </div>
    </li>
  );
}

const TICKET_LABELS: Record<NonNullable<Show["ticket"]>, string> = {
  tickets: "Tickets",
  free: "Free entry",
  "sold-out": "Sold out",
  private: "Private event",
};

function TicketAction({
  show,
  large = false,
}: {
  show: Show;
  large?: boolean;
}) {
  if (show.ticket === "tickets" && show.ticketUrl) {
    return (
      <a
        href={show.ticketUrl}
        target='_blank'
        rel='noreferrer'
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-[transform,border-color] duration-150 active:scale-[0.97] ${
          large
            ? "bg-flare px-6 py-3.5 text-void"
            : "border border-bone/30 px-4 py-2 text-sm text-bone hover:border-bone"
        }`}
      >
        Tickets <ArrowUpRight size={16} />
      </a>
    );
  }
  const label = show.ticket ? TICKET_LABELS[show.ticket] : "Door";
  return (
    <span
      className={`whitespace-nowrap ${large ? "text-lg" : "text-sm"} text-ash`}
    >
      {label}
    </span>
  );
}

function EmptyUpcoming() {
  return (
    <div className='border-l-2 border-flare py-2 pl-6'>
      <p className='font-wide text-2xl font-extrabold'>
        Nothing on the calendar yet.
      </p>
      <p className='mt-2 text-ash'>
        New dates go up on Instagram first — or book us for yours.
      </p>
    </div>
  );
}
