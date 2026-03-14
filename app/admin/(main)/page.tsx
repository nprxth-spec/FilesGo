import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, logCount] = await Promise.all([
    prisma.user.count(),
    prisma.processingLog.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/logs"
          className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300"
        >
          <p className="text-2xl font-bold text-slate-900">{logCount}</p>
          <p className="text-sm text-slate-500">Processing logs</p>
        </Link>
        <Link
          href="/admin/users"
          className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300"
        >
          <p className="text-2xl font-bold text-slate-900">{userCount}</p>
          <p className="text-sm text-slate-500">Users</p>
        </Link>
      </div>
      <div className="text-sm text-slate-500">
        Use the menu to view <strong>Logs</strong> or <strong>Users & Credits</strong> (add credits for testing).
      </div>
    </div>
  );
}
