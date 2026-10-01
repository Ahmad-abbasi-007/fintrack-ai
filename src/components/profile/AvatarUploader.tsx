"use client";

import { useState, useRef } from "react";
import { uploadAvatar } from "@/app/profile/actions";

export default function AvatarUploader({
  name,
  email,
  currentUrl,
}: {
  name: string;
  email: string;
  currentUrl?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = (name?.[0] || email?.[0] || "U").toUpperCase();

  async function handleFile(file: File) {
    setError("");
    setSuccess("");

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    // Show local preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("avatar", file);
      await uploadAvatar(fd);
      setSuccess("Avatar updated ✅");
      setTimeout(() => setSuccess(""), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setPreview(currentUrl || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-3xl">
            {initial}
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Change Photo"}
        </button>
        <p className="text-xs text-gray-500 mt-1.5">
          JPG, PNG or WEBP. Max 2MB.
        </p>

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        {success && <p className="text-emerald-400 text-xs mt-2">{success}</p>}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}