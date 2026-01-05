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
    <div className="min-h-screen bg-black text-green-400 p-6">
      <h1 className="text-2xl mb-4">Scan QR</h1>
      <QrScanner onScan={handleScan} />
      <p className="mt-4">{status}</p>
    </div>
  );
}
