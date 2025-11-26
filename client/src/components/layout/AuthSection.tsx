"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { loginUser, registerUser } from "@/lib/api";

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password });
        if (res.token) alert("Login successful!");
        else alert(res.message || "Invalid credentials");
      } else {
        const res = await registerUser(form);
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-green-700 rounded-xl p-6 shadow-md shadow-green-900/30 mb-12 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 focus:border-green-500 focus:outline-none"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 focus:border-green-500 focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="rounded-lg border border-green-700 bg-black px-3 py-2 text-sm text-green-300 focus:border-green-500 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-green-500 py-2 text-sm font-semibold text-black hover:bg-green-400 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* Toggle */}
      <p className="mt-4 text-center text-sm text-green-300">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-green-400 hover:underline ml-1"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>

      {/* Divider */}
      <div className="flex items-center justify-center mt-4">
        <span className="h-px w-16 bg-green-700" />
        <span className="mx-2 text-green-400 text-sm">or</span>
        <span className="h-px w-16 bg-green-700" />
      </div>

      {/* Google Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-sm text-green-400 hover:bg-green-500 hover:text-black transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
