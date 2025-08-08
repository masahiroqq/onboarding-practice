import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "session";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 公開パスは素通し
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    /\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt|webp|woff2?)$/.test(pathname);

  if (isPublic) return NextResponse.next();

  // セッションクッキー有無で判定（デモ：存在チェックのみ）
  const hasSession = req.cookies.get(SESSION_COOKIE)?.value;
  if (!hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// UIのみ保護（APIは除外）。必要に応じて調整してください
export const config = {
  matcher: ["/((?!_next/|api/|login|favicon.ico|robots.txt|sitemap.xml).*)"],
};