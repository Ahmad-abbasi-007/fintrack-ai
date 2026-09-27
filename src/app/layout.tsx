import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinTrack AI — Smart Personal Finance Manager",
  description:
    "AI-powered personal finance platform for expense tracking, budgeting, and smart spending insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}