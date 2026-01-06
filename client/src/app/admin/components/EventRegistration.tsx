"use client";

import { useEffect, useState } from "react";
import { fetchRegistrationsByEvent } from "@/lib/api";
import {motion} from "framer-motion"
interface Props {
  eventId: string;
  eventName: string;
}

export default function EventRegistrations({ eventId, eventName }: Props) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    fetchRegistrationsByEvent(eventId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <p className="text-green-400">Loading registrations…</p>;
  if (!data) return null;

 return (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="
      mt-8 rounded-3xl
      border border-sky-200
      bg-white/80 p-6
      shadow-[0_25px_70px_-30px_rgba(56,189,248,0.35)]
      backdrop-blur-xl
      relative overflow-hidden
    "
  >
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-xl font-bold tracking-wide text-sky-800">
        Registrations —{" "}
        <span className="text-indigo-600">{eventName}</span>
      </h3>

      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
        {data.count}
      </span>
    </div>

    {data.registrations.length === 0 ? (
      <p className="text-slate-500">No registrations yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-sky-200 text-slate-500">
              <th className="py-3 text-left font-semibold">Name</th>
              <th className="py-3 text-left font-semibold">Dept</th>
              <th className="py-3 text-left font-semibold">Sem</th>
              <th className="py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.registrations.map((r: any, i: number) => (
              <motion.tr
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-sky-100 hover:bg-sky-50/70 transition"
              >
                <td className="py-3 font-medium text-slate-700">
                  {r.name}
                </td>
                <td className="py-3 text-slate-600">
                  {r.department}
                </td>
                <td className="py-3 text-slate-600">
                  {r.semester}
                </td>
                <td className="py-3">
                  {r.paymentStatus === "paid" ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Paid
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Free
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </motion.div>
);

}
