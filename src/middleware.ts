import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const secret = process.env.ADMIN_SECRET || "";

  // /admin always returns 404
  if (pathname === "/admin") {
    return new NextResponse(null, { status: 404 });
  }

  // If no secret route is set, block all dynamic admin slugs
  if (!secret) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
