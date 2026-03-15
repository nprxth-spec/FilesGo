"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScrollText, Users, LogOut, ClipboardList } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/logs", label: "ประมวลผลใบแจ้งหนี้", icon: ScrollText },
  { href: "/admin/audit-logs", label: "การล็อกอิน / Config", icon: ClipboardList },
  { href: "/admin/users", label: "Users & Credits", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-slate-800 text-white flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-slate-700">
        <p className="font-bold text-slate-100">Files Go Admin</p>
        <p className="text-xs text-slate-400 mt-0.5">Admin panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/70"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
