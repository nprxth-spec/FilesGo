import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminSidebar from "./AdminSidebar";

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
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 overflow-auto">{children}</main>
    </div>
  );
}
