import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Files Go – Automate Facebook Ads Invoices",
  description:
    "Upload Facebook Ads PDF invoices. AI extracts the data and syncs it to your Google Sheets automatically.",
  keywords: ["Facebook Ads", "Invoice", "Google Sheets", "Automation", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
