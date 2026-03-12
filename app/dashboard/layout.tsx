import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Zap } from "lucide-react";
import Image from "next/image";

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

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div />

                    <div className="flex items-center gap-4">
                        {/* Credits badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">
                                {credits} credits
                            </span>
                            <span className="text-xs text-blue-400">remaining</span>
                        </div>

                        {/* User avatar */}
                        <div className="flex items-center gap-2.5">
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name ?? "User"}
                                    width={32}
                                    height={32}
                                    className="rounded-full ring-2 ring-white shadow"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    {user?.name?.[0] ?? "U"}
                                </div>
                            )}
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-slate-900 leading-tight">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
