"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Cinzel, Inter } from "next/font/google";

/* 🔤 Fonts INSIDE component (guaranteed working) */
const disneyFont = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const hoverSound =
  typeof window !== "undefined"
    ? new Audio("/sounds/hover.mp3")
    : null;

const clickSound =
  typeof window !== "undefined"
    ? new Audio("/sounds/click.mp3")
    : null;
interface Event {
  _id: number;
  name: string;
  venue: string;
  date: string;
  description: string;
}


export default function EventCards({ events }: { events: Event[] }) {
  const [openCard, setOpenCard] = useState<number | null>(null);

  if (!events.length)
    return (
      <p className={`${bodyFont.className} text-center text-slate-600`}>
        No events available.
      </p>
    );

  const today = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);
  const pastEvents = events.filter((e) => new Date(e.date) < today);

  /* animation */
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -8,
      scale: 1.03,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  const renderCard = (event: Event, isPast: boolean) => (
    <motion.div
      key={event._id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isPast ? "hover" : undefined}
      className={`relative overflow-hidden rounded-3xl border
      border-slate-200
      bg-gradient-to-br from-white via-sky-50 to-indigo-50
      p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]
      ${isPast ? "opacity-60 grayscale" : ""}`}
    >
      {/* noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      {/* accent glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-sky-300/40 blur-3xl" />

      <h3
        className={`${disneyFont.className} relative mb-2 text-2xl tracking-widest text-sky-700`}
      >
        {event.name}
      </h3>

      <p
        className={`${bodyFont.className} relative mb-1 text-sm text-slate-700`}
      >
        Venue: <span className="text-slate-500">{event.venue}</span>
      </p>

      <p
        className={`${bodyFont.className} relative mb-4 text-sm text-slate-700`}
      >
        Date: <span className="text-slate-500">{event.date}</span>
      </p>

      <div className="relative mt-4 flex items-center justify-between">
        {!isPast ? (
          <Link
            href={`/register/${event._id}`}
            className={`${disneyFont.className} group relative overflow-hidden rounded-full
            bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
            px-6 py-2 text-sm tracking-widest text-white shadow-lg`}
          >
            <span className="relative z-10">REGISTER</span>
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        ) : (
          <span className="text-xs italic text-slate-400">
            Registration Closed
          </span>
        )}

        <button
          onClick={() =>
            setOpenCard(openCard === event._id ? null : event._id)
          }
          className={`${bodyFont.className} text-sm text-sky-600 underline-offset-4 hover:underline`}
        >
          {openCard === event._id ? "Hide Details" : "View Details"}
        </button>
      </div>

      <AnimatePresence>
        {openCard === event._id && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className={`${bodyFont.className} relative mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700`}
          >
            {event.description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50 py-24">
      {/* page noise */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${disneyFont.className} mb-14 text-center text-5xl tracking-[0.35em] text-sky-700`}
        >
          UPCOMING EVENTS
        </motion.h1>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((e) => renderCard(e, false))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${disneyFont.className} mt-28 mb-14 text-center text-4xl tracking-[0.3em] text-indigo-600`}
        >
          PAST EVENTS
        </motion.h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((e) => renderCard(e, true))}
        </div>
      </div>
    </section>
  );
}