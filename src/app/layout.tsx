import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FinTrack AI — Smart Personal Finance Manager",
    template: "%s | FinTrack AI",
  },
  description:
    "AI-powered personal finance platform for expense tracking, budgeting, smart spending insights, and receipt scanning.",
  keywords: [
    "personal finance",
    "expense tracker",
    "budget app",
    "AI finance",
    "receipt scanner",
    "PKR",
    "Pakistan",
  ],
  authors: [{ name: "Ahmad Abbasi" }],
  openGraph: {
    title: "FinTrack AI — Smart Personal Finance Manager",
    description:
      "Track expenses, set budgets, and get AI-powered insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}