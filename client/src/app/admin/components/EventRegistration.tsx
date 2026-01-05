"use client";

import { useEffect, useState } from "react";
import { fetchRegistrationsByEvent } from "@/lib/api";

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
    <div className="mt-6 border border-green-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        Registrations — {eventName} ({data.count})
      </h3>

      {data.registrations.length === 0 ? (
        <p className="text-green-300/70">No registrations yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-700">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Dept</th>
              <th className="text-left py-2">Sem</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.registrations.map((r: any) => (
              <tr key={r._id} className="border-b border-green-900/50">
                <td className="py-2">{r.name}</td>
                <td className="py-2">{r.department}</td>
                <td className="py-2">{r.semester}</td>
                <td className="py-2">
                  {r.paymentStatus === "paid" ? "Paid" : "Free"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
