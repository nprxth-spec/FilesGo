import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        prisma.processingLog.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.processingLog.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({ logs, total, page, limit });
}
