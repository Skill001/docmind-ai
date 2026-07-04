import { NextResponse } from "next/server";
import { getSessionToken, verifyJwt } from "@/lib/authServer";

export async function GET(request: Request) {
  try {
    const token = getSessionToken(request as any);
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await verifyJwt(token);
    return NextResponse.json({ user }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
