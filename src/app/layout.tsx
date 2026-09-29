import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "@/components/ThemeProvider";
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinTrack AI",
  },
  openGraph: {
    title: "FinTrack AI — Smart Personal Finance Manager",
    description:
      "Track expenses, set budgets, and get AI-powered insights.",
    type: "website",
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