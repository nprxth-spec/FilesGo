import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getSpreadsheetTabs } from "@/lib/google";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sheetId = searchParams.get("sheetId");

    if (!sheetId) {
        return NextResponse.json({ error: "Missing sheetId parameter" }, { status: 400 });
    }

    // Try to get access token from session
    let accessToken = (session as any).accessToken as string | undefined;

    // If missing, try DB
    if (!accessToken) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                accounts: {
                    where: { provider: "google" },
                    select: { access_token: true }
                }
            }
        });

        if (dbUser?.accounts[0]?.access_token) {
            accessToken = dbUser.accounts[0].access_token;
        }
    }

    if (!accessToken) {
        return NextResponse.json(
            { error: "Google access token missing. Please sign in again." },
            { status: 401 }
        );
    }

    try {
        const tabs = await getSpreadsheetTabs(sheetId, accessToken);
        return NextResponse.json({ data: tabs });
    } catch (err: any) {
        console.error("Failed to fetch spreadsheet tabs:", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to fetch spreadsheet tabs" },
            { status: 500 }
        );
    }
}
