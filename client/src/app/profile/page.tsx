"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/myRe?email=${session.user.email}`
    )
      .then(res => res.json())
      .then(data => setRegistrations(data))
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading)
    return <p className="text-center text-orange-400">Loading...</p>;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50 py-16 text-slate-700">
      {/* subtle noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      {/* soft background blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-4xl font-extrabold tracking-widest text-slate-800"
        >
          My Registrations
        </motion.h1>

        {registrations.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500"
          >
            You haven’t registered for any event yet.
          </motion.p>
        )}

        <div className="grid gap-6">
          {registrations.map((reg, index) => {
            const isOpen = activeId === reg._id;

            return (
              <motion.div
                key={reg._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="
          relative overflow-hidden rounded-2xl
          border border-sky-200
          bg-white/80 backdrop-blur-xl
          p-5
          shadow-lg
        "
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-sky-800 capitalize">
                      {reg.eventId?.name}
                    </h2>
                    <p className="text-xs text-slate-500 capitalize">
                      {reg.eventId?.venue} • {reg.eventId?.date}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActiveId(isOpen ? null : reg._id)
                    }
                    className="
              rounded-full border border-sky-300
              px-4 py-1 text-sm font-semibold
              text-sky-700
              hover:bg-sky-500 hover:text-white
              transition
            "
                  >
                    {isOpen ? "Close" : "View"}
                  </button>
                </div>

                {/* Status */}
                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${reg.paymentStatus === "paid"
                        ? "text-emerald-600"
                        : "text-amber-600"
                      }`}
                  >
                    {reg.paymentStatus}
                  </span>
                </p>

                {/* Expandable QR */}
                {isOpen && reg.qrToken && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="mt-6 flex justify-center"
                  >
                    <div className="rounded-2xl bg-white p-4 shadow-xl">
                      <QRCodeCanvas value={reg.qrToken} size={180} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );


}
