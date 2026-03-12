import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { driveFolderId: true },
  });

  return NextResponse.json({ data: { driveFolderId: user?.driveFolderId ?? null } });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const driveFolderIdRaw = (body as any)?.driveFolderId as string | undefined;
  const driveFolderId =
    typeof driveFolderIdRaw === "string" && driveFolderIdRaw.trim().length > 0
      ? driveFolderIdRaw.trim()
      : null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database. Please sign out and sign in again." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { driveFolderId },
    });

    return NextResponse.json({ success: true, data: { driveFolderId } });
  } catch (err: any) {
    console.error("Failed to update driveFolderId:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to save Drive folder." },
      { status: 500 }
    );
  }
}

