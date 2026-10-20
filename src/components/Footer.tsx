import Link from "next/link";
import { dictionaries, type Locale } from "@/lib/i18n";

export default function Footer({
  siteName,
  tagline,
  contactEmail,
  locale,
}: {
  siteName: string;
  tagline: string;
  contactEmail: string;
  locale: Locale;
}) {
  const t = dictionaries[locale];

  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-3 font-sans text-sm text-[var(--ink-soft)]">
        <div>
          <div className="font-display text-xl text-[var(--ink)] mb-3">{siteName}</div>
          <p>{t.footer.about}</p>
        </div>
        <div>
          <div className="text-[var(--ink)] mb-3">{t.footer.linksTitle}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/tienda" className="hover:text-[var(--ink)]">
                {t.nav.shop}
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-[var(--ink)]">
                {t.nav.contact}
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-[var(--ink)]">
                {t.nav.cart}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[var(--ink)] mb-3">{t.footer.contactTitle}</div>
          <p>{contactEmail}</p>
          <p>{t.footer.madeWithLove}</p>
        </div>
      </div>
      <div className="text-center text-xs text-[var(--ink-soft)] pb-8 font-sans">
        © 2026 {siteName} · {tagline}. {t.footer.rights}
      </div>
    </footer>
  );
}
