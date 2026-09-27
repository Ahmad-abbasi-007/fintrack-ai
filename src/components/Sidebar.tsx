"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-60 min-h-screen border-r border-gray-800 bg-gray-950 p-6">
      <Link href="/" className="text-2xl font-bold text-emerald-400 mb-10">
        FinTrack AI
      </Link>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
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
  );
}