"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) return null;

  return (
    <nav className="w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-lg text-white sticky top-0 z-40">
      <div className="mx-auto max-w-7xl grid grid-cols-3 items-center px-6 py-4">
        {/* LEFT — Logo */}
        <Link href="/" className="text-2xl font-bold text-emerald-400">
          FinTrack AI
        </Link>

        {/* CENTER — Middle links */}
        <div className="flex items-center justify-center gap-8">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white hidden md:block"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/accounts"
                className="text-gray-300 hover:text-white hidden md:block"
              >
                Accounts
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-gray-300 hover:text-white hidden md:block"
              >
                Features
              </Link>
              <Link
                href="/features"
                className="text-gray-300 hover:text-white hidden md:block"
              >
                All Features
              </Link>
              <Link
                href="/#how"
                className="text-gray-300 hover:text-white hidden md:block"
              >
                How it Works
              </Link>
            </>
          )}
        </div>

        {/* RIGHT — Auth / User */}
        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center"
                >
                  {(
                    user.user_metadata?.full_name?.[0] ||
                    user.email?.[0] ||
                    "U"
                  )
                    .toString()
                    .toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-medium truncate">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white text-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}