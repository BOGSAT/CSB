import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Check for NextAuth session token
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check for your custom token
  const token = req.cookies.get("token")?.value;

  if (!session && !token && req.nextUrl.pathname.startsWith("/profile")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
