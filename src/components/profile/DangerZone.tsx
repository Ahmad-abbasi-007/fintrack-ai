"use client";

import { useState } from "react";
import { deleteMyAccount } from "@/app/profile/actions";

export default function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (confirmText !== "DELETE") {
      setError("Type DELETE to confirm.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await deleteMyAccount();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
      setLoading(false);
    }
  }

  return (
    <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        ⚠️ Danger Zone
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Deleting your account removes all your data permanently. This
        cannot be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-4 py-2 rounded-lg"
        >
          Delete My Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-red-400">
            Type <strong>DELETE</strong> to confirm:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full bg-gray-950 border border-red-500/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Yes, Delete Everything"}
            </button>
            <button
              onClick={() => {
                setConfirming(false);
                setConfirmText("");
                setError("");
              }}
              className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}