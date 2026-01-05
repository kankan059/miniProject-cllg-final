"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="min-h-screen bg-black text-orange-400 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-8">My Registrations</h1>

        {registrations.length === 0 && (
          <p>You haven’t registered for any event yet.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {registrations.map(reg => (
            <div
              key={reg._id}
              className="rounded-xl border border-orange-400 p-5 bg-[#0a0a0a]"
            >
              <h2 className="text-xl font-semibold">
                {reg.eventId?.name}
              </h2>

              <p className="text-sm">Venue: {reg.eventId?.venue}</p>
              <p className="text-sm">Date: {reg.eventId?.date}</p>

              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="text-yellow-400">
                  {reg.paymentStatus}
                </span>
              </p>

            
              {reg.qrToken && (
                <div className="mt-4 flex justify-center">
                  <QRCodeCanvas value={reg.qrToken} size={160} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
