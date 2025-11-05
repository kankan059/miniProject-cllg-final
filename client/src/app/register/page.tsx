"use client";

import { useEffect, useState } from "react";

interface EventInfo {
  name: string;
  isPaid: boolean;
  amount?: number;
}

const departments = ["bsc IT" , "bsc chemistry", "bsc physics" , "bsc maths" , "mecha" ,"pEI" , "ETC" , "civil"]

export default function RegisterPage() {
  // In real case: fetch from API (admin data)
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);

  // Mock admin event data (simulate fetching)
  useEffect(() => {
    const fetchEventData = async () => {
      // Simulate backend data
      const data: EventInfo = {
        name: "Tech Innovators Summit",
        isPaid: false, // controlled by admin
        amount: 499,  // admin-set price
      };
      setEventInfo(data);
    };
    fetchEventData();
  }, []);

  const [form, setForm] = useState({
    name: "",
    department: "",
    semester: "",
    paymentAmount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registration successful!");
  };

  if (!eventInfo)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-orange-400">
        Loading event info...
      </div>
    );

  return (
    <section className="min-h-screen bg-black text-orange-400 py-12">
      <div className="mx-auto max-w-lg rounded-xl border border-orange-400 bg-[#0a0a0a] p-8 shadow-lg shadow-orange-400/40">
        <h1 className="mb-6 text-center text-3xl font-bold text-orange-400">
          {eventInfo.name} Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-orange-400">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm text-orange-400 placeholder-orange-400/60 focus:border-orange-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm mb-1 text-orange-400">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm text-orange-400 focus:border-orange-400 focus:outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={`${dept}`}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm mb-1 text-orange-400">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm text-orange-400 focus:border-orange-400 focus:outline-none"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={`${sem}`}>
                  {sem} Semester
                </option>
              ))}
            </select>
          </div>

          {/* Show payment if admin set paid */}
          {eventInfo.isPaid && (
            <div>
              <label className="block text-sm mb-1 text-orange-400">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                name="paymentAmount"
                value={eventInfo.amount || form.paymentAmount}
                onChange={handleChange}
                className="w-full rounded-lg border border-orange-400 bg-black px-3 py-2 text-sm text-orange-400 placeholder-orange-400/60 focus:border-orange-400 focus:outline-none"
                placeholder="Enter payment amount"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-400 py-2 text-sm font-semibold text-black hover:bg-orange-400 transition"
          >
            Register Now
          </button>
        </form>
      </div>
    </section>
  );
}
