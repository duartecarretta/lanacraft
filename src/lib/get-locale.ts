import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "./i18n";

/**
 * Reads the visitor's active locale from the NEXT_LOCALE cookie (set by
 * middleware on first visit, or by the LanguageSwitcher when the visitor
 * picks one manually). Falls back to Spanish when there's no cookie yet.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value && (LOCALES as string[]).includes(value)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
}
