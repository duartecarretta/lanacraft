import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE } from "@/lib/i18n";

/**
 * Detects the visitor's preferred language from the Accept-Language header
 * on their very first visit and stores it in a cookie, so every page (and
 * the admin-free public site) can render in that language right away. A
 * manual choice made later via the language switcher overwrites this cookie
 * and is never touched again by this middleware.
 */
export function proxy(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing && (LOCALES as string[]).includes(existing)) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language") || "";
  let detected: string = DEFAULT_LOCALE;
  for (const part of acceptLanguage.split(",")) {
    const lang = part.trim().split(";")[0].slice(0, 2).toLowerCase();
    if ((LOCALES as string[]).includes(lang)) {
      detected = lang;
      break;
    }
  }

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, detected, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
};
