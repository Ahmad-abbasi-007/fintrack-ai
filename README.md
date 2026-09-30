# FinTrack AI 💰🤖

> AI-powered personal finance platform for expense tracking, budgeting, receipt scanning, and smart spending insights.

## 🌐 Live Demo
**[https://fintrack-ai.vercel.app](https://fintrack-ai.vercel.app)**

## ✨ Features

### 💰 Tracking
- Income & expense tracking
- Multi-account support (cash, bank, card, wallet)
- Transfers between accounts
- Custom categories (add/rename/delete)
- Recurring transactions (weekly/monthly/yearly)

### 📊 Planning
- Budget goals with color-coded alerts
- Savings goals with progress tracking
- Bills tracker with recurrence
- Monthly calendar view

### 🤖 AI
- AI spending insights (Gemini + Groq)
- Receipt scanner (image → transaction)
- AI budget suggestions
- Auto-categorization

### 📈 Analytics
- Charts (pie, bar, month comparison)
- Filterable reports
- CSV export

### ⚙️ Core
- Supabase authentication
- Row Level Security
- Dark / light / system theme
- Multi-currency (PKR, USD, EUR, GBP, INR, AED, SAR)
- Installable PWA
- In-app notifications

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **AI:** Google Gemini (vision) + Groq (text)
- **Charts:** Recharts
- **Deployment:** Vercel
- **Version Control:** Git & GitHub

## 📦 Getting Started

```bash
# Clone
git clone https://github.com/Ahmad-abbasi-007/fintrack-ai.git
cd fintrack-ai

# Install
npm install

# Set up env (create .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

# Run
npm run dev