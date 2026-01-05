"use client";

import { useState } from "react";
import Link from "next/link";

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
    return <p className="text-center text-green-300">No events available.</p>;

  const today = new Date();

  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= today
  );

  const pastEvents = events.filter(
    (e) => new Date(e.date) < today
  );

  const renderCard = (event: Event, isPast: boolean) => (
    <div
      key={event._id}
      className={`rounded-xl border border-green-700 bg-[#0a0a0a] p-5 shadow-md transition
        ${isPast ? "opacity-60 grayscale" : "hover:shadow-green-600/40"}`}
    >
      <h3 className="text-xl font-semibold text-emerald-500 mb-2">
        {event.name}
      </h3>

      <p className="text-sm text-white mb-1">
        Venue: <span className="text-gray-400">{event.venue}</span>
      </p>

      <p className="text-sm text-white mb-3">
        Date: <span className="text-gray-300">{event.date}</span>
      </p>

      <div className="flex items-center justify-between mt-4">
        {!isPast ? (
          <Link
            href={`/register/${event._id}`}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition"
          >
            Register
          </Link>
        ) : (
          <span className="text-xs text-gray-400 italic">
            Registration Closed
          </span>
        )}

        <button
          onClick={() =>
            setOpenCard(openCard === event._id ? null : event._id)
          }
          className="text-sm text-green-400 hover:text-green-300 underline"
        >
          {openCard === event._id ? "Hide Details" : "View Details"}
        </button>
      </div>

      {openCard === event._id && (
        <p className="mt-3 text-sm text-green-300/90 border-t border-green-800 pt-3">
          {event.description}
        </p>
      )}
    </div>
  );

  return (
    <section className="bg-black py-12 text-green-400">
      <div className="mx-auto max-w-7xl px-4">

        {/* UPCOMING */}
        <h1 className="mb-6 text-center text-4xl font-bold text-orange-500 uppercase">
          Upcoming Events
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.length === 0 ? (
            <p className="text-center col-span-full text-green-300">
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((e) => renderCard(e, false))
          )}
        </div>

        {/* PAST */}
        <h2 className="mt-14 mb-6 text-center text-3xl font-bold text-gray-400 uppercase">
          Past Events
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No past events
            </p>
          ) : (
            pastEvents.map((e) => renderCard(e, true))
          )}
        </div>

      </div>
    </section>
  );
}
