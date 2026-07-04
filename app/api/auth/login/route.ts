import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { createJwt } from "@/lib/authServer";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password." }, { status: 400 });
    }

    const result = await query<{
      id: string;
      email: string;
      full_name: string;
      password_hash: string;
      role: string;
    }>(
      `SELECT id, email, full_name, password_hash, role FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = await createJwt({
      sub: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("docmind_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login API error", error);
    return NextResponse.json({ message: "Unable to log in." }, { status: 500 });
  }
}
