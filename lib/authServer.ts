import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("Missing JWT_SECRET environment variable.");
}

const jwtSecret = new TextEncoder().encode(secret);

export interface SessionPayload {
  sub: string;
  email: string;
  fullName: string;
  role: string;
  iat: number;
  exp: number;
}

export async function createJwt(payload: Omit<SessionPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret);
}

export async function verifyJwt(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, jwtSecret);
  return payload as unknown as SessionPayload;
}

export function getSessionToken(request: Request | NextRequest) {
  if ("cookies" in request) {
    const token = request.cookies.get("docmind_session")?.value;
    if (token) {
      return token;
    }
  }

  const cookieHeader = (request as Request).headers?.get?.("cookie");
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(/(?:^|; )docmind_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
