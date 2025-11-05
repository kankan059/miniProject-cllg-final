// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left - Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Event
        </Link>

        {/* Right - Buttons (Desktop) */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden rounded-lg border border-white p-2 text-white hover:bg-white hover:text-black transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white bg-black px-4 py-3">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-white px-3 py-2 text-center text-sm hover:bg-white hover:text-black"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-black hover:bg-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
