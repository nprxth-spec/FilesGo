import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
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

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const resDrive = await drive.files.get({
      fileId: id,
      fields: "id, name",
      supportsAllDrives: true,
    });

    return NextResponse.json({
      data: {
        id: resDrive.data.id ?? id,
        name: resDrive.data.name ?? "",
      },
    });
  } catch (err: any) {
    console.error("Failed to fetch folder metadata:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch folder metadata" },
      { status: 500 }
    );
  }
}

