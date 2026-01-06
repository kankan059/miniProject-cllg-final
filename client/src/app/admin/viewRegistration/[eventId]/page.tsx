"use client";

import { useParams } from "next/navigation";
import EventRegistrations from "@/app/admin/components/EventRegistration";
import Attendes from "@/app/admin/components/Attendes";
import { useEffect, useState } from "react";
import {motion} from "framer-motion"
export default function ViewRegistrationPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEventName(data.name));
  }, [eventId]);
 return (
  <section className="relative min-h-screen bg-gradient-to-br from-white via-slate-50 to-sky-50 py-12 overflow-hidden">
    {/* subtle background noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-3xl" />

    <div className="relative mx-auto max-w-6xl px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EventRegistrations
          eventId={eventId}
          eventName={eventName}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Attendes
          eventId={eventId}
          eventName={eventName}
        />
      </motion.div>
    </div>
  </section>
);

}
