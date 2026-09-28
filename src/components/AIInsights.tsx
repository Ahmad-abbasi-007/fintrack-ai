"use client";

import { useState } from "react";
import { generateInsights, type Insight } from "@/app/dashboard/ai-actions";

const STYLE: Record<
  Insight["type"],
  { bg: string; border: string; icon: string; color: string }
> = {
  warning: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "⚠️",
    color: "text-red-400",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "✅",
    color: "text-emerald-400",
  },
  tip: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "💡",
    color: "text-blue-400",
  },
};

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generateInsights();
      setInsights(result);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to generate insights";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold">AI Spending Insights</h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading
            ? "Analyzing..."
            : insights.length > 0
            ? "Regenerate"
            : "Generate Insights"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          {error}
        </p>
      )}

      {insights.length === 0 && !loading && !error && (
        <p className="text-gray-400 text-sm">
          Click <strong className="text-emerald-400">Generate Insights</strong>{" "}
          to let AI analyze your transactions and give you personalized advice.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
          <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          AI is analyzing your transactions...
        </div>
      )}

      {!loading && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins, i) => {
            const s = STYLE[ins.type] ?? STYLE.tip;
            return (
              <div
                key={i}
                className={`${s.bg} ${s.border} border rounded-xl p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{s.icon}</span>
                  <div>
                    <p className={`font-semibold mb-1 ${s.color}`}>
                      {ins.title}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {ins.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}