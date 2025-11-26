"use client";
import { useEffect, useState } from "react";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "@/lib/api";

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

  // ✅ Load events from Mongo
  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () =>
    setForm({ name: "", venue: "", date: "", description: "", isPaid: false, amount: "" });

  // ✅ Add or update event in DB
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
      console.error("❌ Submit failed:", err);
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
    <section className="min-h-screen bg-black text-green-400 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-center text-3xl font-bold text-green-500 mb-8">Admin Panel</h1>

        {/* Form */}
        <div className="mb-10 rounded-xl border border-green-700 bg-[#0a0a0a] p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            {editingId ? "Edit Event" : "Add New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" required className="input" />
            <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" required className="input" />
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="input" />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isPaid" checked={form.isPaid} onChange={handleChange} />
              <label>Paid Event</label>
            </div>
            {form.isPaid && (
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount ₹" className="input" required />
            )}
            <div className="sm:col-span-2">
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input h-24" required />
            </div>
            <div className="sm:col-span-2 flex gap-3 mt-3">
              <button type="submit" className="flex-1 bg-green-500 text-black rounded-lg py-2 font-semibold">
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button onClick={resetForm} type="button" className="flex-1 border border-green-500 rounded-lg py-2 text-green-400">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Event List */}
        <div className="rounded-xl border border-green-700 bg-[#0a0a0a] p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">All Events</h2>
          {events.length === 0 ? (
            <p className="text-green-300/80">No events yet.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-green-700 text-green-400">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Venue</th>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e._id} className="border-b border-green-900/60 hover:bg-green-900/10">
                    <td className="py-2">{e.name}</td>
                    <td className="py-2">{e.venue}</td>
                    <td className="py-2">{e.date}</td>
                    <td className="py-2">{e.isPaid ? `Paid ₹${e.amount}` : "Free"}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => handleEdit(e._id!)} className="border border-yellow-400 text-yellow-400 px-3 py-1 rounded-md text-xs">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(e._id!)} className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
