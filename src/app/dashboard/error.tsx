"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">💥</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-400 text-sm mb-6">
          We hit an unexpected error. Try again — if it keeps happening, go
          back home.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-5 py-2.5 rounded-lg text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}