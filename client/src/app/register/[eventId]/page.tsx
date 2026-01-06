"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
interface EventInfo {
  _id: string;
  name: string;
  isPaid: boolean;
  amount?: number;
}

const departments = [
  "BSc IT",
  "BSc Chemistry",
  "BSc Physics",
  "BSc Maths",
  "Mechanical",
  "PEI",
  "ETC",
  "Civil",
];

export default function RegisterPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: "",
    department: "",
    semester: "",
  });
  useEffect(() => {
    console.log("EVENT ID", eventId);
  }, [eventId]);

  // Fetch event data (admin-controlled)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
        );
        const data = await res.json();
        setEventInfo(data);
      } catch (err) {
        alert("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("Please login first");
      router.push("/login");
      return;
    }
    if (!eventInfo) return;

    // PAID EVENT → PAYMENT FLOW
    if (eventInfo.isPaid) {
      localStorage.setItem("name", form.name);
      localStorage.setItem("department", form.department);
      localStorage.setItem("semester", form.semester);
      localStorage.setItem("userEmail", session.user.email);

      router.push(`/payment/${eventInfo._id}`);
      return;
    }

    // FREE EVENT → DIRECT REGISTER
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        eventId: eventInfo._id,
        userEmail: session.user.email,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }
    setQrToken(data.qrToken);

    alert("Registration successful!");
    setForm({ name: "", department: "", semester: "" });
    // router.push("/");
  }

  if (loading || !eventInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-orange-400">
        Loading event info...
      </div>
    );
  }

return (
  <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50 py-16 text-slate-700">
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto max-w-lg rounded-3xl
        border border-slate-200
        bg-white/80 p-8
        shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]
        backdrop-blur-xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-2 text-center text-3xl font-extrabold tracking-widest text-slate-800"
      >
        {eventInfo.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-8 text-center text-sm text-slate-500"
      >
        Event Registration
      </motion.p>

      {qrToken ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          className="text-center"
        >
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">
            Registration Successful
          </h2>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block rounded-2xl bg-white p-4 shadow-lg"
          >
            <QRCodeCanvas value={qrToken} size={220} />
          </motion.div>

          <p className="mt-4 text-sm text-slate-600">
            Show this QR code at the event entry
          </p>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="space-y-6"
        >
          {/* Name */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
          </motion.div>

          {/* Department */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Semester */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">
              Semester
            </label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  {sem} Semester
                </option>
              ))}
            </select>
          </motion.div>

          {eventInfo.isPaid && (
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              className="text-sm font-medium text-amber-600"
            >
              Registration Fee: ₹{eventInfo.amount}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full rounded-xl
              bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
              py-3 text-sm font-bold tracking-widest text-white
              shadow-lg"
          >
            {eventInfo.isPaid ? "PROCEED TO PAYMENT" : "REGISTER NOW"}
          </motion.button>
        </motion.form>
      )}
    </motion.div>
  </section>
);

}