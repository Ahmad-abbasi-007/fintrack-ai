"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "💳" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "📅" },
  { href: "/dashboard/goals", label: "Goals", icon: "🎯" },
  { href: "/dashboard/budgets", label: "Budgets", icon: "💰" },
  { href: "/dashboard/bills", label: "Bills", icon: "📆" },
  { href: "/dashboard/recurring", label: "Recurring", icon: "🔄" },
  { href: "/dashboard/reports", label: "Reports", icon: "📄" },
  { href: "/dashboard/categories", label: "Categories", icon: "🏷️" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-white"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="main-sidebar"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        aria-label="Main navigation"
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 md:w-60 min-h-screen
          bg-gray-950 border-r border-gray-800 p-6
          transform transition-transform duration-300
          flex flex-col shrink-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          ✕
        </button>

        <Link
          href="/"
          className="text-2xl font-bold text-emerald-400 mb-10 hidden md:block"
          onClick={() => setOpen(false)}
        >
          FinTrack AI
        </Link>

        <nav className="flex flex-col gap-1.5 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                onClick={() => setOpen(false)}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-emerald-500 text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}