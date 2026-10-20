import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieValue } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD todavía no está configurada en Vercel. Añádela en Settings → Environment Variables.",
      },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = body?.password || "";
  } catch {
    // ignore, handled below
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, adminCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });
  return res;
}
