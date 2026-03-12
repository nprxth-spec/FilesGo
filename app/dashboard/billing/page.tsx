"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";

export default function BillingPage() {
    const { data: session } = useSession();
    const credits = (session?.user as any)?.credits ?? 0;
    const isPro = credits > 100; // simple heuristic placeholder

    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const handleUpgrade = async () => {
        setCheckoutError(null);
        setLoadingCheckout(true);
        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "pro" }),
            });
            const data = await res.json();
            if (!res.ok || !data?.url) {
                throw new Error(data?.error ?? "Unable to start checkout.");
            }
            window.location.href = data.url as string;
        } catch (err: any) {
            setCheckoutError(err.message ?? "Unexpected error while starting checkout.");
        } finally {
            setLoadingCheckout(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Billing</h1>
                <p className="text-slate-500">Manage your plan and credits.</p>
            </div>

            {/* Credits card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <p className="text-sm font-semibold text-slate-600 mb-1">Remaining credits</p>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-slate-900">{credits}</span>
                    <span className="text-slate-400 mb-1">/ this month</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                        style={{ width: `${Math.min(100, (credits / 10) * 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    1 credit = 1 invoice processed
                </p>
            </div>

            {checkoutError && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {checkoutError}
                </div>
            )}

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-slate-900">Free</p>
                        {!isPro && (
                            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                                Current
                            </span>
                        )}
                    </div>
                    <div className="flex items-end gap-1 mb-6">
                        <span className="text-3xl font-bold text-slate-900">$0</span>
                        <span className="text-slate-400 text-sm mb-0.5">/mo</span>
                    </div>
                    <ul className="space-y-2.5">
                        {["10 invoices/month", "Google Drive upload", "Google Sheets sync", "History log"].map(
                            (f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    {f}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Pro */}
                <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <p className="font-bold">Pro</p>
                        </div>
                        {isPro && (
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                                Current
                            </span>
                        )}
                    </div>
                    <div className="flex items-end gap-1 mb-6">
                        <span className="text-3xl font-bold">$19</span>
                        <span className="text-blue-200 text-sm mb-0.5">/mo</span>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                        {[
                            "Unlimited invoices",
                            "Priority AI processing",
                            "Google Drive & Sheets",
                            "Full history",
                            "Priority support",
                        ].map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                                <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    {!isPro && (
                        <button
                            onClick={handleUpgrade}
                            disabled={loadingCheckout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                        >
                            {loadingCheckout ? "Redirecting to Stripe..." : "Upgrade to Pro"}
                            {!loadingCheckout && <ArrowRight className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
