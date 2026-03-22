import { authkit, handleAuthkitHeaders } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, isCloudMode } from "@/config";

function assignAnonCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export default async function middleware(request: NextRequest) {
  if (isCloudMode) {
    const { session, headers } = await authkit(request);

    // Authenticated via WorkOS — pass through
    if (session.user) {
      return handleAuthkitHeaders(request, headers);
    }

    // Not authenticated — still allow access (optional auth)
    // but ensure anonymous cookie exists
    if (!request.cookies.has(COOKIE_NAME)) {
      const response = NextResponse.next({ headers });
      return assignAnonCookie(response);
    }

    return handleAuthkitHeaders(request, headers);
  }

  // Non-cloud mode: anonymous cookie only
  if (request.cookies.has(COOKIE_NAME)) {
    return NextResponse.next();
  }

  return assignAnonCookie(NextResponse.next());
}

export const config = {
  matcher: ["/chat/:path*", "/api/:path*"],
};
