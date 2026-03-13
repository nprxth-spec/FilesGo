"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Upload,
    History,
    Settings,
    CreditCard,
    Zap,
    FileText,
    Wrench,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
    { href: "/dashboard", label: "Upload", icon: Upload },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/integrations", label: "Integrations", icon: Wrench },
    { href: "/dashboard/naming", label: "Filename Rules", icon: FileText },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Restore collapsed state from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("sidebar-collapsed");
        if (stored === "true") {
            setCollapsed(true);
        }
    }, []);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            if (typeof window !== "undefined") {
                window.localStorage.setItem("sidebar-collapsed", String(next));
            }
            return next;
        });
    };

    return (
        <aside
            className={`${
                collapsed ? "w-16" : "w-64"
            } h-screen bg-slate-900 text-white flex flex-col shrink-0 sticky top-0`}
        >
            {/* Logo */}
            <div className="px-4 py-4 border-b border-slate-800 flex items-center">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="whitespace-nowrap">
                            <p className="font-bold text-base">Files Go</p>
                            <p className="text-xs text-slate-400">Invoices to Google Sheets</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center ${
                                collapsed ? "justify-center" : "gap-3"
                            } px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate">{label}</span>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle collapse */}
            <div className="border-t border-slate-800">
                <div className="p-3">
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        className={`w-full flex items-center ${
                            collapsed ? "justify-center" : "gap-3"
                        } px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer`}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="w-5 h-5" />
                        ) : (
                            <PanelLeftClose className="w-5 h-5" />
                        )}
                        {!collapsed && <span>Collapse sidebar</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
