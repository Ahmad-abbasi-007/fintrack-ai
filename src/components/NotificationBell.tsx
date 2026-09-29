"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/lib/types";
import {
  markAllRead,
  markNotificationRead,
  deleteNotification,
} from "@/app/dashboard/notification-actions";

const TYPE_STYLE: Record<
  AppNotification["type"],
  { icon: string; color: string; bg: string }
> = {
  info: { icon: "ℹ️", color: "text-blue-400", bg: "bg-blue-500/10" },
  warning: { icon: "⚠️", color: "text-amber-400", bg: "bg-amber-500/10" },
  danger: { icon: "🚨", color: "text-red-400", bg: "bg-red-500/10" },
  success: { icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function NotificationBell() {
  const [supabase] = useState(() => createClient());
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (!user) return null;

        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        return data;
      })
      .then((data) => {
        if (!active) return;
        startTransition(() => {
          setItems((data ?? []) as AppNotification[]);
          setLoading(false);
        });
      })
      .catch(() => {
        if (!active) return;
        startTransition(() => setLoading(false));
      });

    return () => {
      active = false;
    };
  }, [supabase]);

  const unreadCount = items.filter((n) => !n.is_read).length;

  async function handleMarkAll() {
    await markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  async function handleClick(n: AppNotification) {
    if (!n.is_read) {
      const fd = new FormData();
      fd.set("id", n.id);
      await markNotificationRead(fd);
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      );
    }
    setOpen(false);
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const fd = new FormData();
    fd.set("id", id);
    await deleteNotification(fd);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-full hover:bg-gray-800 flex items-center justify-center transition"
        title="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <p className="p-6 text-center text-gray-500 text-sm">
                  Loading...
                </p>
              )}

              {!loading && items.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-3xl mb-2">🔕</p>
                  <p className="text-sm text-gray-400">
                    No notifications yet
                  </p>
                </div>
              )}

              {!loading &&
                items.map((n) => {
                  const style = TYPE_STYLE[n.type];
                  const content = (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full ${style.bg} ${style.color} flex items-center justify-center shrink-0 text-sm`}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            !n.is_read ? "text-white" : "text-gray-300"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      )}
                    </>
                  );

                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-950/60 ${
                        !n.is_read ? "bg-gray-950/30" : ""
                      }`}
                    >
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => void handleClick(n)}
                          className="flex flex-1 items-start gap-3 min-w-0"
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleClick(n)}
                          className="flex flex-1 items-start gap-3 min-w-0 text-left"
                        >
                          {content}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(event) => void handleDelete(n.id, event)}
                        className="text-gray-600 hover:text-red-400 text-xs shrink-0"
                        aria-label={`Delete notification: ${n.title}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}