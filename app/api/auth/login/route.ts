import { NextResponse } from "next/server";

import { findUserByCredentials } from "@/lib/auth/users";
import type { LoginRequest } from "@/lib/types/auth";

export async function POST(request: Request) {
  let body: LoginRequest;

  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const user = findUserByCredentials(username, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const sessionMaxAge = body.rememberMe
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 8;

  const response = NextResponse.json({ user });

  response.cookies.set("eval_session", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  });

  return response;
}
