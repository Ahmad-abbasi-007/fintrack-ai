import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FinTrack AI — AI-Powered Personal Finance Manager",
    template: "%s | FinTrack AI",
  },
  description:
    "Free AI-powered personal finance app for tracking expenses, setting budgets, scanning receipts, managing goals, and getting smart spending insights. Built for Pakistan and beyond.",
  keywords: [
    "personal finance",
    "expense tracker",
    "budget app",
    "AI finance",
    "receipt scanner",
    "savings goals",
    "PKR",
    "Pakistan finance app",
    "free finance tracker",
    "fintech",
  ],
  authors: [{ name: "Ahmad Abbasi" }],
  creator: "Ahmad Abbasi",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinTrack AI",
  },
  openGraph: {
    title: "FinTrack AI — AI-Powered Personal Finance Manager",
    description:
      "Track expenses, set budgets, scan receipts, and get AI-powered insights. Free forever.",
    type: "website",
    siteName: "FinTrack AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinTrack AI — AI-Powered Personal Finance",
    description:
      "Track expenses, set budgets, scan receipts, and get AI-powered insights.",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}