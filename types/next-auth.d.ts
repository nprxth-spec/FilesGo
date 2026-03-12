import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      credits?: number;
      sheetId?: string | null;
      sheetName?: string | null;
      sheetMapping?: any | null;
      filenameMapping?: any | null;
      sheetProfiles?: any | null;
      activeSheetProfileId?: string | null;
      driveFolderId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    credits?: number;
    sheetId?: string | null;
    sheetName?: string | null;
    sheetMapping?: any | null;
    filenameMapping?: any | null;
    sheetProfiles?: any | null;
    activeSheetProfileId?: string | null;
    driveFolderId?: string | null;
  }
}
