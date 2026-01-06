"use client";"use client";
import { useEffect, useState } from "react";
import { fetchAttendanceSummary } from "@/lib/api";
import {motion} from "framer-motion"
interface Attendee {
    name: string;
    department: string;
    semester: string;
    userEmail: string;
    checkInAt: string;
}

export default function Attendee({eventId,eventName}: {eventId: string, eventName: string;}) {
    const [data, setData] = useState<{count: number; attendees: Attendee[];} | null>(null);
    
    useEffect(() => {
        fetchAttendanceSummary(eventId)
        .then(setData)
        .catch(console.error);
    }, [eventId]);
    
    return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="
      mt-10 rounded-3xl
      border border-sky-200
      bg-white/80 p-8
      shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)]
      backdrop-blur-xl
      relative overflow-hidden
    "
  >
    {/* subtle card noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* header */}
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-2xl font-bold tracking-wide text-sky-800">
        Attendees — <span className="text-indigo-600">{eventName}</span>
      </h3>

      {data && (
        <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
          Total: {data.attendees.length}
        </span>
      )}
    </div>

    {!data ? (
      <p className="text-slate-500">Loading attendees...</p>
    ) : data.attendees.length === 0 ? (
      <p className="text-slate-500">No one has attended yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-sky-200 text-slate-500">
              <th className="py-3 text-left font-semibold">Name</th>
              <th className="py-3 text-left font-semibold">Department</th>
              <th className="py-3 text-left font-semibold">Semester</th>
              <th className="py-3 text-left font-semibold">Email</th>
              <th className="py-3 text-left font-semibold">Check-in Time</th>
            </tr>
          </thead>

          <tbody>
            {data.attendees.map((a, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-sky-100 hover:bg-sky-50/70 transition"
              >
                <td className="py-3 font-medium text-slate-700">
                  {a.name}
                </td>
                <td className="py-3 text-slate-600">
                  {a.department}
                </td>
                <td className="py-3 text-slate-600">
                  {a.semester}
                </td>
                <td className="py-3 text-slate-600">
                  {a.userEmail}
                </td>
                <td className="py-3 text-slate-500">
                  {new Date(a.checkInAt).toLocaleString()}
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
