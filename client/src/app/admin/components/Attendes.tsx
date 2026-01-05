"use client";"use client";
import { useEffect, useState } from "react";
import { fetchAttendanceSummary } from "@/lib/api";

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
        <div className="mt-8 rounded-xl border border-orange-600 bg-[#0a0a0a] p-6">
      <h3 className="text-lg font-semibold text-orange-400 mb-4">
        Attendees — {eventName}
      </h3>

      {!data ? (
          <p className="text-gray-400">Loading attendees...</p>
        ) : data.attendees.length === 0 ? (
            <p className="text-gray-400">No one has attended yet.</p>
        ) : (
            <>
          <p className="mb-3 text-sm text-orange-300">
            Total Attended: <b>{data.count}</b>
          </p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-orange-700 text-orange-400">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Department</th>
                <th className="py-2 text-left">Semester</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-left">Check-in Time</th>
              </tr>
            </thead>
            <tbody>
              {data.attendees.map((a, i) => (
                  <tr
                  key={i}
                  className="border-b border-orange-900/50 hover:bg-orange-900/10"
                  >
                  <td className="py-2">{a.name}</td>
                  <td className="py-2">{a.department}</td>
                  <td className="py-2">{a.semester}</td>
                  <td className="py-2">{a.userEmail}</td>
                  <td className="py-2">
                    {new Date(a.checkInAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
