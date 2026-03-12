// middleware.ts — runs in Edge Runtime, MUST NOT import Prisma
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard) {
        return isLoggedIn; // true = allow, false = redirect to /login
      }
      return true;
    },
  },
});

export { auth as middleware };

export const config = {
  matcher: ["/dashboard/:path*"],
};
