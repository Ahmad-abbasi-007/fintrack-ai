import Link from "next/link";
import Navbar from "@/components/Navbar";
import LandingFAQ from "@/components/LandingFAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Day 19/21 — Live Demo
          </span>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto tracking-tight">
            Manage your money with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI intelligence
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg md:text-xl">
            FinTrack AI helps you track expenses, set budgets, scan receipts,
            and get personalized AI insights — so you can spend smarter and
            save more.
          </p>

          <div className="flex gap-4 mt-10 justify-center flex-wrap">
            <Link
              href="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-7 py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Start Free — No Card Needed
            </Link>
            <Link
              href="/features"
              className="border border-gray-700 hover:border-gray-500 px-7 py-3.5 rounded-xl text-gray-300 transition"
            >
              See All Features →
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            ⭐️ Built for Pakistani wallets — PKR, Urdu-friendly, bank-ready.
          </p>
        </div>

        {/* Mockup */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-2 shadow-2xl shadow-emerald-500/5">
            {/* fake browser bar */}
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-gray-500 bg-gray-950 px-3 py-1 rounded">
                fintrack-ai.vercel.app/dashboard
              </span>
            </div>

            {/* fake dashboard preview */}
            <div className="bg-gray-950 rounded-lg p-6 grid grid-cols-3 gap-4">
              <div className="col-span-3 grid grid-cols-3 gap-3 mb-2">
                <MiniCard label="Balance" value="Rs. 84,500" color="text-emerald-400" />
                <MiniCard label="Income" value="Rs. 120,000" color="text-emerald-400" />
                <MiniCard label="Expenses" value="Rs. 35,500" color="text-red-400" />
              </div>

              <div className="col-span-2 h-40 bg-gray-900 border border-gray-800 rounded-lg flex items-end justify-around p-3">
                {[60, 40, 80, 55, 70, 90, 65].map((h, i) => (
                  <div
                    key={i}
                    className="w-6 bg-gradient-to-t from-emerald-500/40 to-emerald-500 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="h-40 bg-gray-900 border border-gray-800 rounded-lg p-3 flex flex-col justify-center items-center">
                <div className="w-20 h-20 rounded-full border-[10px] border-emerald-500 border-r-blue-500 border-t-violet-500" />
                <p className="text-xs text-gray-500 mt-2">Spending</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need in one app
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From expense tracking to AI-powered insights — FinTrack AI
              replaces five separate apps with one clean tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-gray-900/80 transition group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Three steps. Zero confusion.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-3">
              Loved by users
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              What people are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <p className="text-gray-300 leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-black font-bold flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Questions? Answered.
            </h2>
          </div>

          <LandingFAQ />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border border-emerald-500/20 rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to take control?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Join FinTrack AI today. Free forever for personal use.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-4 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            Create Free Account
          </Link>
          <p className="text-xs text-gray-500 mt-4">
            No credit card. No ads. Your data stays yours.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-bold text-emerald-400 mb-3">
                FinTrack AI
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered personal finance for the modern world.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Product</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#how" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Account</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Built By</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="https://github.com/Ahmad-abbasi-007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ahmad-raza-8b23a7264/?isSelfProfile=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 FinTrack AI — Built by Ahmad Abbasi</p>
            <p>Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <p className="text-[10px] text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

const features = [
  {
    icon: "💰",
    title: "Smart Expense Tracking",
    desc: "Log income and expenses with categories, accounts, and notes in seconds.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    desc: "Get personalized spending advice and savings tips based on your real data.",
  },
  {
    icon: "📸",
    title: "Receipt Scanner",
    desc: "Snap a receipt — AI extracts amount, merchant, and date automatically.",
  },
  {
    icon: "🎯",
    title: "Budgets & Alerts",
    desc: "Set monthly limits per category and get notified before you overspend.",
  },
  {
    icon: "🔄",
    title: "Recurring Transactions",
    desc: "Automate subscriptions, rent, and salary — they post themselves.",
  },
  {
    icon: "📊",
    title: "Reports & Charts",
    desc: "Beautiful dashboards with pie charts, bar charts, and category breakdowns.",
  },
  {
    icon: "💳",
    title: "Multi-Account Support",
    desc: "Track cash, bank, card, and wallet balances with transfers between them.",
  },
  {
    icon: "📅",
    title: "Calendar View",
    desc: "See every transaction and bill in a monthly calendar grid.",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    desc: "Row Level Security ensures you only ever see your own data.",
  },
];

const steps = [
  {
    n: "1",
    title: "Create your account",
    desc: "Sign up with email in under 30 seconds. No credit card required.",
  },
  {
    n: "2",
    title: "Add your finances",
    desc: "Log transactions manually, scan receipts, or import from your bank.",
  },
  {
    n: "3",
    title: "Get AI insights",
    desc: "Watch your dashboard come alive with charts, alerts, and smart tips.",
  },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Freelance Designer",
    quote:
      "FinTrack AI finally made me aware of where my money goes. The AI insights are scary accurate.",
  },
  {
    name: "Bilal Khan",
    role: "Software Engineer",
    quote:
      "The receipt scanner is magic. Snap a photo and the transaction is logged. Saves me 5 minutes a day.",
  },
  {
    name: "Ayesha Malik",
    role: "Small Business Owner",
    quote:
      "Multi-account support lets me track business and personal finances in one place. Game changer.",
  },
];