"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950 text-white">
      <div className="md:hidden text-xl font-bold text-emerald-400">
        FinTrack AI
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <ThemeToggle />
            <NotificationBell />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center"
            >
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U")
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
            <ThemeToggle />
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}