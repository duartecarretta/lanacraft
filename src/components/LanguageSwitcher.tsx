"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

const SHORT_LABEL: Record<Locale, string> = { es: "ES", en: "EN", pt: "PT" };

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function choose(next: Locale) {
    if (next === locale) return;
    // eslint-disable-next-line react-hooks/immutability -- event handler, not render: safe to set a cookie here.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 font-sans text-xs">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => choose(l)}
          aria-current={l === locale}
          className={`px-1.5 py-0.5 rounded ${
            l === locale
              ? "font-semibold text-[var(--ink)]"
              : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
        >
          {SHORT_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
