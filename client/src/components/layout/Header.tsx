"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserCircle } from "lucide-react";
import {motion} from "framer-motion"
export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

return (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="
      sticky top-0 z-50 w-full
      border-b border-sky-200
      bg-white/80
      backdrop-blur-xl
      text-slate-700
    "
  >
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

      {/* Logo */}
      <Link
        href="/"
        className="
          text-2xl font-extrabold tracking-wide
          text-sky-600
          hover:text-indigo-600
          transition
        "
      >
        Event
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {!session ? (
          <>
            <Link
              href="/login"
              className="
                rounded-xl border border-sky-400
                px-4 py-2 text-sm font-semibold
                text-sky-600
                hover:bg-sky-500 hover:text-white
                transition
              "
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="
                rounded-xl
                bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
                px-4 py-2 text-sm font-semibold
                text-white
                shadow-lg
                hover:opacity-95
                transition
              "
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/profile"
                title={session.user?.name || "Profile"}
                className="
                  flex items-center justify-center
                  rounded-full border border-sky-400
                  p-1 text-sky-600
                  hover:bg-sky-500 hover:text-white
                  hover:shadow-[0_0_14px_rgba(56,189,248,0.7)]
                  transition-all duration-300
                "
              >
                <UserCircle size={28} strokeWidth={1.5} />
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/" })}
              className="
                rounded-xl
                bg-sky-500
                px-3 py-1 text-sm font-semibold
                text-white
                hover:bg-sky-600
                transition
              "
            >
              Logout
            </motion.button>
          </>
        )}
      </div>
    </div>
  </motion.header>
);
}
