import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try session first
  let accessToken = (session as any).accessToken as string | undefined;

  // Fallback to DB if needed
  if (!accessToken) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        accounts: {
          where: { provider: "google" },
          select: { access_token: true },
        },
      },
    });

    if (dbUser?.accounts[0]?.access_token) {
      accessToken = dbUser.accounts[0].access_token ?? undefined;
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Google access token missing. Please sign in again." },
      { status: 401 }
    );
  }

  return NextResponse.json({ data: { accessToken } });
}

