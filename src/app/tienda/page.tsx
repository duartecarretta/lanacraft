import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";

export async function generateMetadata() {
  await connection();
  const data = await getSiteData();
  return { title: `Tienda — ${data.siteName}` };
}

export default async function ShopPage() {
  await connection();
  const data = await getSiteData();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Tienda</h1>
      <p className="font-sans text-[var(--ink-soft)] mb-10">
        Piezas hechas a mano, por encargo. Envíos a toda España.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.products.map((p) => (
          <Link key={p.slug} href={`/tienda/${p.slug}`} className="group block">
            <div className="relative aspect-square rounded-xl overflow-hidden card mb-3">
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={p.images[0].startsWith("http")}
              />
            </div>
            <h3 className="font-display text-xl">{p.name}</h3>
            <p className="font-sans text-sm text-[var(--ink-soft)] mb-1">
              {p.tagline}
            </p>
            <p className="font-sans text-sm">Desde {p.basePriceEUR}€</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
