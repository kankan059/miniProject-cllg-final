"use client"

import Link from 'next/link'
import { useState } from "react";

interface Event {
  id: number;
  name: string;
  venue: string;
  date: string;
  description: string;
}

const events: Event[] = [
  {
    id: 1,
    name: "Tech Innovators Summit",
    venue: "Delhi Convention Center",
    date: "2025-11-25",
    description:
      "A gathering of the brightest minds in tech innovation. Join us for talks, workshops, and networking opportunities.",
  },
  {
    id: 2,
    name: "Music & Beats Fest",
    venue: "Mumbai Arena",
    date: "2025-12-02",
    description:
      "Feel the rhythm at India’s biggest electronic and live music festival featuring top DJs and artists.",
  },
  {
    id: 3,
    name: "Startup Pitch Battle",
    venue: "Bangalore Tech Park",
    date: "2025-12-10",
    description:
      "Pitch your startup to top investors and mentors. Win funding and mentorship opportunities!",
  },
];

export default function EventCards() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <section className="bg-black py-12 text-green-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-orange-500 uppercase">
          Upcoming Events
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
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

              {/* Buttons */}
              <div className="flex items-center justify-between mt-4">
                <Link
                href='/register'
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition">
                  Register
                </Link>


                <button
                  onClick={() =>
                    setOpenCard(openCard === event.id ? null : event.id)
                  }
                  className="text-sm text-green-400 hover:text-green-300 underline"
                >
                  {openCard === event.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {/* Description */}
              {openCard === event.id && (
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
