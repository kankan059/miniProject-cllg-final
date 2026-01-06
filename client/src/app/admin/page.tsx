"use client";
import { useEffect, useState } from "react";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "@/lib/api";
import Link from "next/link";
import ScanButton from "./components/ScanButton";
import {motion} from "framer-motion"
interface Event {
  _id?: string;
  name: string;
  venue: string;
  date: string;
  description: string;
  isPaid: boolean;
  amount?: number;
}

export default function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    venue: "",
    date: "",
    description: "",
    isPaid: false,
    amount: "",
  });

  //Load events from Mongo
  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () =>
    setForm({ name: "", venue: "", date: "", description: "", isPaid: false, amount: "" });

  // Add or update event in DB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        venue: form.venue,
        date: form.date,
        description: form.description,
        isPaid: form.isPaid,
        amount: form.isPaid ? Number(form.amount) : undefined,
      };

      if (editingId) {
        await updateEvent(editingId, payload);
        setEditingId(null);
      } else {
        await addEvent(payload);
      }

      const data = await fetchEvents();
      setEvents(data);
      resetForm();
    } catch (err) {
      console.error(" Submit failed:", err);
      alert("Error saving event");
    }
  };

  const handleEdit = (id: string) => {
    const ev = events.find((e) => e._id === id);
    if (!ev) return;
    setForm({
      name: ev.name,
      venue: ev.venue,
      date: ev.date,
      description: ev.description,
      isPaid: ev.isPaid,
      amount: ev.amount?.toString() || "",
    });
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    setEvents(events.filter((e) => e._id !== id));
  };

 return (
  <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50 py-14 text-slate-700">
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-200/40 blur-3xl" />

    <div className="relative mx-auto max-w-5xl px-4">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center text-4xl font-extrabold tracking-widest text-slate-800"
      >
        Admin Panel
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-10 flex justify-center"
      >
        <ScanButton />
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          mb-12 rounded-3xl
          border border-slate-200
          bg-white/80 p-8
          shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]
          backdrop-blur-xl
        "
      >
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Event Name"
            required
            className="input bg-white border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />

          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue"
            required
            className="input bg-white border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="input bg-white border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
              className="accent-sky-500"
            />
            <label>Paid Event</label>
          </div>

          {form.isPaid && (
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount ₹"
              required
              className="input bg-white border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          )}

          <div className="sm:col-span-2">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="input h-28 bg-white border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="sm:col-span-2 mt-4 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex-1 rounded-xl
                bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
                py-3 font-bold tracking-wide text-white shadow-lg"
            >
              {editingId ? "Update" : "Add"}
            </motion.button>

            {editingId && (
              <button
                onClick={resetForm}
                type="button"
                className="flex-1 rounded-xl border border-slate-300 py-3 text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Event List */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          rounded-3xl
          border border-slate-200
          bg-white/80 p-8
          shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]
          backdrop-blur-xl
        "
      >
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">
          All Events
        </h2>

        {events.length === 0 ? (
          <p className="text-slate-500">No events yet.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Venue</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr
                  key={e._id}
                  className="border-b border-slate-100 hover:bg-sky-50/60 transition"
                >
                  <td className="py-3">{e.name}</td>
                  <td className="py-3">{e.venue}</td>
                  <td className="py-3">{e.date}</td>
                  <td className="py-3">
                    {e.isPaid ? (
                      <span className="text-amber-600 font-medium">
                        Paid ₹{e.amount}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="py-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(e._id!)}
                      className="rounded-md border border-amber-400 px-3 py-1 text-xs text-amber-600 hover:bg-amber-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(e._id!)}
                      className="rounded-md border border-red-400 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                    <Link
                      href={`admin/viewRegistration/${e._id}`}
                      className="rounded-md border border-sky-400 px-3 py-1 text-xs text-sky-600 hover:bg-sky-50"
                    >
                      View Registrations
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  </section>
);

}
