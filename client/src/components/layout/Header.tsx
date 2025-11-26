"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  console.log("Session inside Header 👉", session, status);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-700 bg-black text-green-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-bold text-green-500 hover:text-green-400 transition"
        >
          Event
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : !session ? (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500 hover:text-black transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-sm font-semibold">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold text-black hover:bg-green-400 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden rounded-lg border border-green-500 p-2 text-green-400 hover:bg-green-500 hover:text-black transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
