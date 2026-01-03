"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Event {
  id: number;
  name: string;
  venue: string;
  date: string;
  description: string;
  isPaid: boolean;
  amount?: number;
}

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // ensure string
  const [event, setEvent] = useState<Event | null>(null);



  if (!event)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-green-400">
        Event not found.
      </div>
    );

  return (
    <section className="min-h-screen bg-black text-green-400 py-12 px-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-green-700 bg-[#0a0a0a] p-8 shadow-lg shadow-green-900/40">
        <h1 className="text-3xl font-bold text-green-500 mb-3">{event.name}</h1>

        <div className="space-y-2 text-green-300/90 mb-6">
          <p>
            📍 <span className="font-medium">{event.venue}</span>
          </p>
          <p>
            🗓️ <span className="font-medium">{event.date}</span>
          </p>
          <p>
            💰{" "}
            {event.isPaid ? (
              <span className="text-green-400 font-semibold">
                Paid — ₹{event.amount}
              </span>
            ) : (
              <span className="text-green-400 font-semibold">Free Event</span>
            )}
          </p>
        </div>

        <p className="text-green-300 leading-relaxed border-t border-green-800 pt-4">
          {event.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-black hover:bg-green-400 transition">
            Register Now
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-green-500 px-5 py-2 text-sm text-green-400 hover:bg-green-500 hover:text-black transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}
