import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold">Files Go Admin</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/logs" className="hover:underline">
              Logs
            </Link>
            <Link href="/admin/users" className="hover:underline">
              Users & Credits
            </Link>
          </nav>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-slate-300 hover:text-white"
          >
            Log out
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
