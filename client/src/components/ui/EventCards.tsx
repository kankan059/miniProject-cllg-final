"use client";

import { useState } from "react";
import Link from "next/link";
import AuthSection from "@/components/layout/AuthSection"

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

  return (
    <section className="bg-black py-12 text-green-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-orange-500 uppercase">
          Upcoming Events
        </h1>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="rounded-xl border border-green-700 bg-[#0a0a0a] p-5 shadow-md shadow-green-900/30 transition hover:shadow-green-600/40"
            >
              <h3 className="text-xl font-semibold text-emerald-500 mb-2">
                {event.name}
              </h3>
              <p className="text-sm text-white mb-1">
                venue:- <span className="font-medium text-gray-400">{event.venue}</span>
              </p>
              <p className="text-sm text-white mb-3">
                Date:- <span className="font-medium text-gray-300">{event.date}</span>
              </p>

              <div className="flex items-center justify-between mt-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition"
                >
                  Register
                </Link>

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
                <p className="mt-3 text-sm text-green-300/90 leading-relaxed border-t border-green-800 pt-3">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
