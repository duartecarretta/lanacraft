"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { dictionaries, type Locale } from "@/lib/i18n";

export default function SuccessClient({ locale }: { locale: Locale }) {
  const { clear } = useCart();
  const t = dictionaries[locale].success;

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center font-sans">
      <h1 className="font-display text-3xl mb-4">{t.title}</h1>
      <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">{t.text}</p>
      <Link href="/tienda" className="btn-primary">
        {t.cta}
      </Link>
    </div>
  );
}
