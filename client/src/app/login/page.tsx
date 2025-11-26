"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // manual login via backend (Express)
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      if (res.token) {
        // store token for protected requests later (admin actions etc.)
        localStorage.setItem("token", res.token);
        localStorage.setItem("userRole", res.user?.role || "user");
        localStorage.setItem("userName", res.user?.name || "");

        alert("Login successful ✅");
        router.push("/");
      } else {
        alert(res.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-green-700 bg-[#0a0a0a] p-6 shadow-lg shadow-green-900/40">
        <h1 className="text-center text-3xl font-bold text-green-500 mb-2">
          Login
        </h1>
        <p className="text-center text-sm text-green-300 mb-6">
          Access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
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

        {/* --- Google login --- */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500 hover:text-black transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Sign in with Google</span>
        </button>

        {/* --- Sign up link --- */}
        <p className="text-center text-xs text-green-300 mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-green-400 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
