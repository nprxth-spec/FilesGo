"use client";

import { signIn } from "next-auth/react";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Sheet,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Files Go</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-blue-50 to-violet-50 blur-3xl opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by GPT-4o
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6 animate-fade-in-up">
            Automate Facebook Ads Invoices
            <br />
            <span className="gradient-text">to Google Sheets in Seconds</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-1">
            Upload your PDF invoices and let AI extract the data — invoice date,
            card, and amount — then sync everything to Google Drive and Sheets
            automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-2">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google — It&apos;s Free
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-base hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              See how it works <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-400 animate-fade-in-up-delay-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              10 free invoices/month
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Setup in 60 seconds
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Three simple steps to automate your entire invoice workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-violet-200" />

            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload Invoice PDF",
                desc: "Drag and drop your Facebook Ads invoice PDF. We accept any PDF format.",
                color: "blue",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "AI Extracts Data",
                desc: "GPT-4o reads the invoice and extracts date, card last 4 digits, and amount.",
                color: "violet",
              },
              {
                step: "03",
                icon: Sheet,
                title: "Syncs to Google",
                desc: "File is saved to Google Drive and a row is appended to your Google Sheet.",
                color: "green",
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div
                key={step}
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 left-8 text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                  {step}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    color === "blue"
                      ? "bg-blue-50"
                      : color === "violet"
                      ? "bg-violet-50"
                      : "bg-green-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      color === "blue"
                        ? "text-blue-600"
                        : color === "violet"
                        ? "text-violet-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Built for media buyers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Extraction",
                desc: "GPT-4o processes invoices in under 10 seconds, no matter the format.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Files are uploaded directly to your own Google Drive. We never store your PDFs.",
              },
              {
                icon: Clock,
                title: "Full Audit Trail",
                desc: "Every processed invoice is logged with timestamp, amount, and Drive link.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Simple pricing
            </h2>
            <p className="text-slate-500 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-500 mb-1">Free</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400 mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "10 invoices per month",
                  "Google Drive upload",
                  "Google Sheets sync",
                  "Processing history",
                  "Email support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer"
              >
                Get started free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 rounded-2xl p-8 border border-blue-700 shadow-xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                POPULAR
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-blue-200 mb-1">Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-blue-300 mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited invoices",
                  "Priority AI processing",
                  "Google Drive upload",
                  "Google Sheets sync",
                  "Full processing history",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-blue-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-brand flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900">Files Go</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Files Go. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

