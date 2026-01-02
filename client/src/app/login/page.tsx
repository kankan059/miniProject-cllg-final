"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-green-700 bg-[#0a0a0a] p-6 shadow-lg shadow-green-900/40">
        
        <h1 className="text-center text-3xl font-bold text-green-500 mb-2">
          Login
        </h1>
        <p className="text-center text-sm text-green-300 mb-6">
          Access your account
        </p>

        {/* Email / Password Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-green-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 focus:border-green-500 focus:outline-none"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-green-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 focus:border-green-500 focus:outline-none"
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

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="h-px flex-1 bg-green-800" />
          <span className="text-[11px] text-green-500 uppercase">or</span>
          <div className="h-px flex-1 bg-green-800" />
        </div>

        {/* Google Login */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500 hover:text-black transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Sign in with Google
        </button>

        {/* Signup Link */}
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
