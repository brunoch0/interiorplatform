import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Gate the entire /admin area behind the ops key (?key= once, then cookie)
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const adminKey = process.env.LEADS_ADMIN_KEY;
  const provided = searchParams.get("key") ?? request.cookies.get("ops_key")?.value;

  if (adminKey && provided === adminKey) {
    const res = NextResponse.next();
    res.cookies.set("ops_key", adminKey, {
      httpOnly: true,
      path: "/admin",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    return res;
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = { matcher: "/admin/:path*" };
