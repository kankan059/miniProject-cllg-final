"use client";

import { useState } from "react";
import QrScanner from "@/components/Qrscanner";

export default function ScanPage() {
  const [status, setStatus] = useState("");

  async function handleScan(qrToken: string) {
    setStatus("Verifying...");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/scan`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setStatus(" Attendance marked");
    } else {
      setStatus(data.message || " Invalid QR");
    }
  }

 return (
  <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6">
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

    <div className="relative mx-auto max-w-xl">
      {/* Title */}
      <h1 className="mb-6 text-center text-3xl font-extrabold tracking-widest text-slate-800">
        Scan QR
      </h1>

      {/* Camera Preview Card */}
      <div
        className="
          rounded-3xl
          border border-sky-200
          bg-white/80 p-5
          shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)]
          backdrop-blur-xl
        "
      >
        {/* Camera label */}
        <p className="mb-3 text-center text-xs uppercase tracking-wider text-slate-500">
          Camera Preview
        </p>

        {/* Camera frame */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
          <QrScanner onScan={handleScan} />
        </div>

        {/* Status */}
        {status && (
          <p
            className={`mt-4 text-center text-sm font-semibold ${
              status.includes("marked")
                ? "text-emerald-600"
                : status.includes("Verifying")
                ? "text-sky-600"
                : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  </section>
);

}
