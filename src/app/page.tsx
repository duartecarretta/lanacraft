import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { getLocale } from "@/lib/get-locale";
import { dictionaries, localize } from "@/lib/i18n";

export default async function Home() {
  await connection();
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  const t = dictionaries[locale];
  const heroImage = data.products[0]?.images[0] || "/products/cactus-5.jpg";
  const aboutImage = data.products[0]?.images[1] || data.products[0]?.images[0] || "/products/cactus-2.jpg";

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-sans text-sm tracking-widest uppercase text-[var(--accent)] mb-4">
            {t.home.badge}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-6">
            {localize(data.heroTitle, locale)}
          </h1>
          <p className="font-sans text-[var(--ink-soft)] text-lg mb-8 max-w-md">
            {localize(data.heroSubtitle, locale)}
          </p>
          <div className="flex gap-4 font-sans">
            <Link href="/tienda" className="btn-primary">
              {t.home.ctaShop}
            </Link>
            <Link href="/#sobre-mi" className="btn-outline">
              {t.home.ctaAbout}
            </Link>
          </div>
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden card">
          <Image
            src={heroImage}
            alt={data.products[0] ? localize(data.products[0].name, locale) : "Pieza hecha a mano"}
            fill
            className="object-cover"
            priority
            unoptimized={heroImage.startsWith("http")}
          />
        </div>
      </section>

      {/* Shop grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl mb-2">{t.home.collectionTitle}</h2>
        <p className="font-sans text-[var(--ink-soft)] mb-10">
          {t.home.collectionSubtitle}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.products.map((p) => (
            <Link
              key={p.slug}
              href={`/tienda/${p.slug}`}
              className="group block"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden card mb-3">
                <Image
                  src={p.images[0]}
                  alt={localize(p.name, locale)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={p.images[0].startsWith("http")}
                />
              </div>
              <h3 className="font-display text-lg">{localize(p.name, locale)}</h3>
              <p className="font-sans text-sm text-[var(--ink-soft)]">
                {t.home.from} {p.basePriceEUR}€
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="sobre-mi"
        className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-12 items-center"
      >
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden card order-2 md:order-1">
          <Image
            src={aboutImage}
            alt="Pieza de fieltro de aguja en proceso"
            fill
            className="object-cover"
            unoptimized={aboutImage.startsWith("http")}
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-display text-3xl mb-5">{localize(data.aboutTitle, locale)}</h2>
          <p className="font-sans text-[var(--ink-soft)] mb-4 leading-relaxed">
            {localize(data.aboutText1, locale)}
          </p>
          <p className="font-sans text-[var(--ink-soft)] leading-relaxed">
            {localize(data.aboutText2, locale)}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl mb-10 text-center">
          {t.home.testimonialsTitle}
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 font-sans">
          {t.home.testimonials.map((item) => (
            <div key={item.author} className="card rounded-xl p-8">
              <p className="text-[var(--ink-soft)] italic mb-4">“{item.quote}”</p>
              <p className="text-sm">— {item.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
