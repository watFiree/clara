import { authkit, handleAuthkitHeaders } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, isCloudMode } from "@/config";
import { assignAnonCookie, checkBasicAuth } from "@/lib/middleware";

export default async function middleware(request: NextRequest) {
  const basicAuthResponse = checkBasicAuth(request);
  if (basicAuthResponse) return basicAuthResponse;

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
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     * _next, static files (images, fonts, etc.) are excluded.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
