import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { getLocale } from "@/lib/get-locale";
import ProductDetail from "./ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  const product = data.products.find((p) => p.slug === slug);
  if (!product) return notFound();
  return <ProductDetail product={product} locale={locale} />;
}
