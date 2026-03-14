import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user;
    const credits = (user as any)?.credits ?? 0;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <DashboardHeader user={user} credits={credits} />

                {/* Page content - scrollable area so header can stick above it */}
                <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
