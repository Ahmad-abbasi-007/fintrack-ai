"use client";

import { useState, useRef } from "react";
import { scanReceipt, type ReceiptData } from "@/app/dashboard/receipt-actions";

export default function ReceiptScanner({
  onExtract,
}: {
  onExtract: (data: ReceiptData) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);

      const base64 = dataUrl.split(",")[1];
      const mimeType = file.type;

      setLoading(true);
      try {
        const data = await scanReceipt(base64, mimeType);
        onExtract(data);
        setSuccess(
          `Receipt scanned: $${data.amount.toFixed(2)} — ${data.description}`
        );
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to scan receipt";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setPreview(null);
    setError("");
    setSuccess("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-emerald-500/5 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📸</span>
        <h3 className="text-lg font-semibold">Scan Receipt with AI</h3>
      </div>

      {!preview && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-xl p-8 text-center cursor-pointer transition"
        >
          <p className="text-4xl mb-3">🧾</p>
          <p className="font-medium mb-1">
            Drop a receipt image here
          </p>
          <p className="text-gray-400 text-sm">
            or click to browse (JPG, PNG, WEBP — max 5MB)
          </p>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Receipt preview"
            className="rounded-xl max-h-64 mx-auto border border-gray-800"
          />

          {loading && (
            <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
              <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              AI is reading your receipt...
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              ✅ {success}
            </p>
          )}

          <button
            onClick={reset}
            className="w-full text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-lg"
          >
            Scan Another Receipt
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}