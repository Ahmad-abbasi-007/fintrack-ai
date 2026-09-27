export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-emerald-400">FinTrack AI</h1>
        <div className="hidden md:flex gap-6 text-gray-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it Works</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-sm mb-6">
          🚀 Day 1/21 — Currently Building
        </span>
        <h2 className="text-5xl md:text-6xl font-bold max-w-3xl leading-tight">
          Manage Your Money with <span className="text-emerald-400">AI Intelligence</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mt-6 text-lg">
          FinTrack AI helps you track expenses, set budgets, and get smart
          AI-powered insights so you can spend smarter and save more.
        </p>
        <div className="flex gap-4 mt-10">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-lg">
            Start Free
          </button>
          <button className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg text-gray-300">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500 transition"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-10 border-t border-gray-800 text-sm">
        © 2025 FinTrack AI — Built by Abbasi | Day 1 of 21
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "💰",
    title: "Expense Tracking",
    desc: "Log income and expenses easily with categories and filters.",
  },
  {
    icon: "📊",
    title: "Smart Dashboard",
    desc: "Visualize your spending with beautiful charts and reports.",
  },
  {
    icon: "🤖",
    title: "AI Insights",
    desc: "Get AI-powered suggestions to reduce spending and save more.",
  },
  {
    icon: "🎯",
    title: "Budget Goals",
    desc: "Set monthly budgets and get alerts before you overspend.",
  },
  {
    icon: "🧾",
    title: "Receipt Scanner",
    desc: "Scan receipts with AI OCR and auto-add transactions.",
  },
  {
    icon: "🔐",
    title: "Secure Auth",
    desc: "Your financial data protected with secure authentication.",
  },
];