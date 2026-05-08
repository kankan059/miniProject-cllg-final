// components/Footer.tsx
"use client";
import Link from "next/link";
import { Instagram, Github, Users, Mail } from "lucide-react";
import {motion } from "framer-motion"
export default function Footer() {
return (
  <footer className="relative overflow-hidden border-t border-sky-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 text-slate-700">
    {/* subtle noise */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

    {/* soft blobs */}
    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
      >
        {/* Brand */}
        <div>
          <h2 className="text-lg font-extrabold tracking-wide text-slate-800">
            Event Management System
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Plan, manage, and enjoy your events with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-sky-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-sky-600 transition">
                Events
              </Link>
            </li>
          
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Support
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-sky-600 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-sky-600 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-sky-600 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  </footer>
);

}
