"use client";

import { useState } from "react";

export default function EditableField({
  label,
  type = "text",
  name = type,
  initialValue,
  onSave,
  helpText,
}: {
  label: string;
  name?: string;
  initialValue: string;
  onSave: (formData: FormData) => Promise<void>;
  type?: "text" | "email" | "password";
  helpText?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await onSave(formData);
      const savedValue = formData.get(name);
      if (type !== "password" && typeof savedValue === "string") {
        setValue(savedValue.trim());
      }
      setSuccess("Saved ✅");
      setEditing(false);
      setTimeout(() => setSuccess(""), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-emerald-400 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <p className="text-sm break-all">{value || "—"}</p>
      ) : (
        <form action={handleSubmit} className="space-y-2">
          <input
            type={type}
            name={name}
            defaultValue={value}
            required
            autoFocus
            className="w-full bg-gray-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
          {type === "password" && (
            <input
              type="password"
              name="confirm"
              placeholder="Confirm password"
              required
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          )}
          {helpText && (
            <p className="text-xs text-gray-500">{helpText}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-emerald-400 text-xs">{success}</p>}
        </form>
      )}
    </div>
  );
}