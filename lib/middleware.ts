import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/config";

export function assignAnonCookie(response: NextResponse, value?: string) {
  response.cookies.set(COOKIE_NAME, value ?? crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function checkBasicAuth(request: NextRequest): NextResponse | null {
  const username = process.env.BASE_AUTH_USERNAME;
  const password = process.env.BASE_AUTH_PASSWORD;

  if (!username || !password) return null;

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");
      if (user === username && pass === password) return null;
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
  });
}
