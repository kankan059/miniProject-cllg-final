"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
  <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-slate-50 to-sky-50 overflow-hidden">
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-sm rounded-3xl
        border border-slate-200
        bg-white/80 p-8
        shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]
        backdrop-blur-xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center text-3xl font-extrabold tracking-widest text-slate-800 mb-2"
      >
        Login
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center text-sm text-slate-500 mb-8"
      >
        Access your account
      </motion.p>

      {/* Email / Password Login */}
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-5"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full rounded-xl border border-slate-400
              bg-white px-4 py-3 text-sm
              focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-black
              transition placeholder:text-slate-300"
            placeholder="user@email.com"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full rounded-xl border border-slate-300
              bg-white px-4 py-3 text-sm
              focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-black
              transition placeholder:text-slate-300"
            placeholder="••••••••"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full rounded-xl
            bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
            py-3 text-sm font-bold tracking-widest text-white
            shadow-lg disabled:opacity-50"
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </motion.button>
      </motion.form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] uppercase tracking-widest text-slate-400">
          or
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google Login */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-3
          rounded-xl border border-slate-300
          bg-white px-4 py-3 text-sm font-medium text-slate-600
          hover:bg-slate-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-4 h-4"
        />
        Sign in with Google
      </motion.button>

      {/* Signup Link */}
      <p className="text-center text-xs text-slate-500 mt-8">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-medium text-sky-600 hover:underline"
        >
          Sign Up
        </a>
      </p>
    </motion.div>
  </div>
);
}