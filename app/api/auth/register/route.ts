import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { createJwt } from "@/lib/authServer";

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
    };

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: "Missing required registration fields." }, { status: 400 });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await query<{ id: string }>(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if ((existing.rowCount ?? 0) > 0) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await query<{
      id: string;
      email: string;
      full_name: string;
      role: string;
    }>(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [fullName, email, passwordHash, "user"]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ message: "Unable to create user." }, { status: 500 });
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
    console.error("Register API error", error);
    return NextResponse.json({ message: "Unable to register account." }, { status: 500 });
  }
}
