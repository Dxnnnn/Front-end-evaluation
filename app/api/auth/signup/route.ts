import { NextResponse } from "next/server";

import { createUser, usernameExists } from "@/lib/auth/users";
import type { SignupRequest } from "@/lib/types/auth";

export async function POST(request: Request) {
  let body: SignupRequest;

  try {
    body = (await request.json()) as SignupRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!name || !username || !password) {
    return NextResponse.json(
      { error: "Name, username, and password are required." },
      { status: 400 },
    );
  }

  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  if (usernameExists(username)) {
    return NextResponse.json(
      { error: "This username is already taken." },
      { status: 409 },
    );
  }

  const user = createUser({ name, username, password });
  const response = NextResponse.json({ user }, { status: 201 });

  response.cookies.set("eval_session", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
