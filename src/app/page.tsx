import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";

export default async function Home() {
  await connection();
  const data = await getSiteData();
  const heroImage = data.products[0]?.images[0] || "/products/cactus-5.jpg";
  const aboutImage = data.products[0]?.images[1] || data.products[0]?.images[0] || "/products/cactus-2.jpg";

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-sans text-sm tracking-widest uppercase text-[var(--accent)] mb-4">
            Hecho a mano · España
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-6">
            {data.heroTitle}
          </h1>
          <p className="font-sans text-[var(--ink-soft)] text-lg mb-8 max-w-md">
            {data.heroSubtitle}
          </p>
          <div className="flex gap-4 font-sans">
            <Link href="/tienda" className="btn-primary">
              Ver la tienda
            </Link>
            <Link href="/#sobre-mi" className="btn-outline">
              Conóceme
            </Link>
          </div>
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden card">
          <Image
            src={heroImage}
            alt={data.products[0]?.name || "Pieza hecha a mano"}
            fill
            className="object-cover"
            priority
            unoptimized={heroImage.startsWith("http")}
          />
        </div>
      </section>

      {/* Shop grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl mb-2">Descubre la colección</h2>
        <p className="font-sans text-[var(--ink-soft)] mb-10">
          Cada pieza se hace a mano, por encargo, con todo el cuidado del
          mundo.
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
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={p.images[0].startsWith("http")}
                />
              </div>
              <h3 className="font-display text-lg">{p.name}</h3>
              <p className="font-sans text-sm text-[var(--ink-soft)]">
                Desde {p.basePriceEUR}€
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
          <h2 className="font-display text-3xl mb-5">{data.aboutTitle}</h2>
          <p className="font-sans text-[var(--ink-soft)] mb-4 leading-relaxed">
            {data.aboutText1}
          </p>
          <p className="font-sans text-[var(--ink-soft)] leading-relaxed">
            {data.aboutText2}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl mb-10 text-center">
          Lo que dicen mis clientes
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 font-sans">
          <div className="card rounded-xl p-8">
            <p className="text-[var(--ink-soft)] italic mb-4">
              “Llegó el paquete y nos quedamos sin palabras. ¡Quedó
              precioso, se nota todo el cariño puesto en cada detalle!”
            </p>
            <p className="text-sm">— Carmen</p>
          </div>
          <div className="card rounded-xl p-8">
            <p className="text-[var(--ink-soft)] italic mb-4">
              “Superó todas mis expectativas. El empaquetado también fue
              precioso. Gracias de corazón por tanta dedicación.”
            </p>
            <p className="text-sm">— Lucía</p>
          </div>
        </div>
      </section>
    </div>
  );
}
