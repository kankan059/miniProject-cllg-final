"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Auto redirect based on role after login
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userEmail = session.user.email || "";

      // Define admin list or condition
      const adminEmails = ["admin@gmail.com", "kongkonitgdgjist@gmail.com"];
      const isAdmin = adminEmails.includes(userEmail);

      if (isAdmin) router.push("/admin");
      else router.push("/");
    }
  }, [session, status, router]);

  return (
    <div className="flex gap-3 items-center">
      {session ? (
        <>
          <span className="text-green-400 text-sm">
            {session.user?.name}
          </span>

          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-green-500 text-black rounded-md hover:bg-green-400 transition"
          >
            Logout
          </button>

          {/* Optional admin link for UI */}
          {session.user?.email &&
            ["admin@gmail.com", "kongkon@admin.com"].includes(session.user.email) && (
              <Link
                href="/admin"
                className="px-3 py-1 border border-green-500 rounded-md text-green-400 hover:bg-green-500 hover:text-black transition"
              >
                Admin Panel
              </Link>
            )}
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black rounded-md text-sm font-medium hover:bg-green-400 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Sign in with Google
        </button>
      )}
    </div>
  );
}
