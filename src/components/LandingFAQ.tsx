"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Is FinTrack AI really free?",
    a: "Yes. The core features — expense tracking, budgets, reports, and AI insights — are free forever for personal use.",
  },
  {
    q: "Is my financial data safe?",
    a: "Absolutely. Every record is protected with Postgres Row Level Security. Only you can see your own data — not even we can access it.",
  },
  {
    q: "Do I need a credit card?",
    a: "No. Sign up with just an email. We never ask for payment information.",
  },
  {
    q: "Can I use it with Pakistani Rupees?",
    a: "Yes. PKR is the default currency, and you can switch to USD, EUR, GBP, INR, AED, and SAR anytime in Settings.",
  },
  {
    q: "How does the AI work?",
    a: "We use Google Gemini and Groq to analyze your spending patterns. Your data is only sent when you request an insight.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Deleting your account removes all your transactions, budgets, and settings permanently.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${
              isOpen ? "border-emerald-500/40" : "border-gray-800"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-900/50 transition"
            >
              <span className="font-medium pr-4">{item.q}</span>
              <span
                className={`text-emerald-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                ＋
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}