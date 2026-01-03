"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: "",
    department: "",
    semester: "",
  });
  useEffect(() => {
    console.log("EVENT ID 👉", eventId);
  }, [eventId]);

  // 🔹 Fetch event data (admin-controlled)
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
      router.push(`/payment/${eventInfo._id}`);
      return;
    }

    // FREE EVENT → DIRECT REGISTER
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        eventId: eventInfo._id,
        userEmail : session.user.email,
      }),
    });

    alert("Registration successful!");
    setForm({ name: "", department: "", semester: "" });
    router.push("/");
  }

  if (loading || !eventInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-orange-400">
        Loading event info...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-orange-400 py-12">
      <div className="mx-auto max-w-lg rounded-xl border border-orange-400 bg-[#0a0a0a] p-8 shadow-lg shadow-orange-400/40">
        <h1 className="mb-6 text-center text-3xl font-bold text-orange-400">
          {eventInfo.name} Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm mb-1">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  {sem} Semester
                </option>
              ))}
            </select>
          </div>

          {/* Paid info */}
          {eventInfo.isPaid && (
            <p className="text-yellow-400 text-sm">
              Registration Fee: ₹{eventInfo.amount}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-400 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            {eventInfo.isPaid ? "Proceed to Payment" : "Register Now"}
          </button>
        </form>
      </div>
    </section>
  );
}
