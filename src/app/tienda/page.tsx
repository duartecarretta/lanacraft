import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { getLocale } from "@/lib/get-locale";
import { dictionaries, localize } from "@/lib/i18n";

export async function generateMetadata() {
  await connection();
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  return { title: `${dictionaries[locale].shop.title} — ${data.siteName}` };
}

export default async function ShopPage() {
  await connection();
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  const t = dictionaries[locale].shop;
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl mb-2">{t.title}</h1>
      <p className="font-sans text-[var(--ink-soft)] mb-10">{t.subtitle}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.products.map((p) => (
          <Link key={p.slug} href={`/tienda/${p.slug}`} className="group block">
            <div className="relative aspect-square rounded-xl overflow-hidden card mb-3">
              <Image
                src={p.images[0]}
                alt={localize(p.name, locale)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={p.images[0].startsWith("http")}
              />
            </div>
            <h3 className="font-display text-xl">{localize(p.name, locale)}</h3>
            <p className="font-sans text-sm text-[var(--ink-soft)] mb-1">
              {localize(p.tagline, locale)}
            </p>
            <p className="font-sans text-sm">
              {t.from} {p.basePriceEUR}€
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
