import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken, verifyJwt } from "@/lib/authServer";

const authPaths = ["/login", "/register"];
const protectedPath = "/dashboard";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  const isAuthRoute = authPaths.includes(pathname);
  const isDashboardRoute = pathname === protectedPath || pathname.startsWith(`${protectedPath}/`);

  const token = getSessionToken(request);
  let session = null;

  console.log("middleware", { pathname, token: token ? "present" : "none" });

  if (token) {
    try {
      session = await verifyJwt(token);
      console.log("middleware session", { sub: session.sub, email: session.email });
    } catch (error) {
      console.log("middleware token invalid", error);
      session = null;
    }
  }

  if (!session && isDashboardRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
