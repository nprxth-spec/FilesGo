import { prisma } from "@/lib/prisma";
import AdminAddCreditsForm from "./AdminAddCreditsForm";
import AdminUserScopesCell from "./AdminUserScopesCell";
import AdminDeleteUserButton from "./AdminDeleteUserButton";

/** Next credits reset = 1st of next month after last reset. For free only. */
function getNextResetAndDays(
  plan: string,
  lastCreditsReset: Date | null
): { nextReset: Date | null; daysLeft: number | null } {
  if (plan !== "free") return { nextReset: null, daysLeft: null };
  const now = new Date();
  const base = lastCreditsReset ?? now;
  const nextReset = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 1));
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((nextReset.getTime() - nowUTC) / msPerDay));
  return { nextReset, daysLeft };
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      credits: true,
      plan: true,
      lastCreditsReset: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Users & Credits</h1>
      <p className="text-sm text-slate-500">
        Add credits for users to test. Changes apply immediately.
      </p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-2 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Plan</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Credits</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Last reset</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Next reset</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Days left</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">สิทธิ์ Google</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const { nextReset, daysLeft } = getNextResetAndDays(
                  user.plan,
                  user.lastCreditsReset
                );
                return (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-4 py-2 text-slate-700">{user.email ?? "—"}</td>
                    <td className="px-4 py-2 text-slate-600">{user.name ?? "—"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          user.plan === "pro"
                            ? "text-emerald-600 font-medium"
                            : "text-slate-600"
                        }
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-700">{user.credits}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {user.lastCreditsReset
                        ? new Date(user.lastCreditsReset).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-slate-500">
                      {nextReset ? nextReset.toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2 text-slate-500">
                      {daysLeft !== null ? `${daysLeft} days` : "—"}
                    </td>
                    <td className="px-4 py-2">
                      <AdminUserScopesCell userId={user.id} />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <AdminAddCreditsForm userId={user.id} userEmail={user.email ?? user.id} />
                        <AdminDeleteUserButton
                          userId={user.id}
                          userLabel={user.email ?? user.name ?? user.id}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
