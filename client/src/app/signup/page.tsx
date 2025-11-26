"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);

      if (res.message === "User registered successfully") {
        alert(" Signup successful! You can now log in.");
        router.push("/login");
      } else {
        alert(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-green-700 bg-[#0a0a0a] p-6 shadow-lg shadow-green-900/40">
        <h1 className="text-center text-3xl font-bold text-green-500 mb-2">
          Sign Up
        </h1>
        <p className="text-center text-sm text-green-300 mb-6">
          Create your event account
        </p>

        {/* --- Signup Form --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-green-400 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 placeholder-green-600/60 focus:border-green-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-green-400 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 placeholder-green-600/60 focus:border-green-500 focus:outline-none"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-green-400 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 placeholder-green-600/60 focus:border-green-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-2 text-sm font-semibold text-black hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* --- Or divider --- */}
        <div className="flex items-center gap-2 my-5">
          <div className="h-px flex-1 bg-green-800" />
          <div className="text-[11px] text-green-500 uppercase tracking-wide">
            or
          </div>
          <div className="h-px flex-1 bg-green-800" />
        </div>

        {/* --- Google SignUp --- */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500 hover:text-black transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Sign up with Google</span>
        </button>

        {/* --- Link to Login --- */}
        <p className="text-center text-xs text-green-300 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-400 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
