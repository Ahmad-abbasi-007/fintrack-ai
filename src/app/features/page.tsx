import Link from "next/link";
import Navbar from "@/components/Navbar";

const FEATURE_SECTIONS = [
  {
    category: "Tracking & Organization",
    items: [
      {
        icon: "💰",
        title: "Income & Expense Tracking",
        desc: "Log every transaction with categories, descriptions, notes, and account linkage. Full CRUD with edit and delete.",
      },
      {
        icon: "💳",
        title: "Multi-Account Support",
        desc: "Track balances across cash, bank accounts, cards, and wallets. Transfer money between accounts with a single entry.",
      },
      {
        icon: "🏷️",
        title: "Custom Categories",
        desc: "Create your own income and expense categories. Rename or delete anytime — the app adapts to you.",
      },
      {
        icon: "🔁",
        title: "Recurring Transactions",
        desc: "Set transactions to repeat weekly, monthly, or yearly. They auto-generate on schedule.",
      },
    ],
  },
  {
    category: "Planning & Control",
    items: [
      {
        icon: "🎯",
        title: "Budget Goals",
        desc: "Set monthly limits per category with color-coded progress bars (safe / warning / exceeded).",
      },
      {
        icon: "💎",
        title: "Savings Goals",
        desc: "Create goals with target amounts and deadlines. Track contributions and see days remaining.",
      },
      {
        icon: "📆",
        title: "Bills Tracker",
        desc: "Never miss a payment. Add bills with due dates, mark them paid, get auto-recurring next-month bills.",
      },
      {
        icon: "📅",
        title: "Calendar View",
        desc: "See every transaction and bill in a monthly calendar. Click any day for a detailed breakdown.",
      },
    ],
  },
  {
    category: "AI & Automation",
    items: [
      {
        icon: "🤖",
        title: "AI Spending Insights",
        desc: "Gemini analyzes your transactions and generates 4 personalized tips with real numbers.",
      },
      {
        icon: "📸",
        title: "AI Receipt Scanner",
        desc: "Upload a photo of any receipt. AI reads the amount, merchant, category, and date automatically.",
      },
      {
        icon: "🧠",
        title: "AI Budget Suggestions",
        desc: "AI analyzes 3 months of spending and suggests realistic monthly limits per category.",
      },
      {
        icon: "🏷️",
        title: "Auto-Categorization",
        desc: "Type 'Netflix subscription' and AI picks the best category from your list automatically.",
      },
    ],
  },
  {
    category: "Reporting & Analysis",
    items: [
      {
        icon: "📊",
        title: "Visual Dashboards",
        desc: "Pie charts, bar charts, and category breakdowns updated in real-time.",
      },
      {
        icon: "📄",
        title: "Reports & Filters",
        desc: "Filter by date range, type, category, or search. Export any view as CSV.",
      },
      {
        icon: "📈",
        title: "Month-over-Month",
        desc: "Compare this month's income, expenses, and net against last month.",
      },
      {
        icon: "🔔",
        title: "Smart Notifications",
        desc: "Get alerted when budgets approach limits, bills are due, or recurring payments come up.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <section className="px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm mb-6">
          All Features
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Everything in one app
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          FinTrack AI combines 16 powerful features into one clean, free
          personal finance platform.
        </p>

        <div className="flex gap-4 justify-center mt-10">
          <Link
            href="/signup"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-7 py-3 rounded-xl transition"
          >
            Try it Free
          </Link>
          <Link
            href="/"
            className="border border-gray-700 hover:border-gray-500 px-7 py-3 rounded-xl text-gray-300 transition"
          >
            ← Back Home
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto space-y-20">
        {FEATURE_SECTIONS.map((section) => (
          <div key={section.category}>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              {section.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/50 transition"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8">
            Free forever. No credit card. Your data stays yours.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-4 rounded-xl transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}