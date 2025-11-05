// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">EventManager</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Plan, manage, and enjoy your events with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Quick Links</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/" className="hover:text-blue-500">Home</Link></li>
              <li><Link href="/events" className="hover:text-blue-500">Events</Link></li>
              <li><Link href="/create" className="hover:text-blue-500">Create Event</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-500">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Support</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/faq" className="hover:text-blue-500">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-500">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-900 dark:text-gray-100">Newsletter</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Subscribe to get updates about new events.
            </p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} EventManager. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
