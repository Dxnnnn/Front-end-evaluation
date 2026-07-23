import { NextResponse } from "next/server";

import { findUserByCredentials } from "@/lib/auth/users";
import {
  isRoleAllowedInPortal,
  type LoginRequest,
} from "@/lib/types/auth";

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
      { error: "ID# and password are required." },
      { status: 400 },
    );
  }

  const user = findUserByCredentials(username, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid ID# or password." },
      { status: 401 },
    );
  }

  if (
    body.expectedPortal &&
    !isRoleAllowedInPortal(user.role, body.expectedPortal)
  ) {
    const portalLabel =
      body.expectedPortal === "staff" ? "coordinator" : "student";

    return NextResponse.json(
      {
        error: `This account is not authorized for ${portalLabel} login.`,
      },
      { status: 403 },
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
