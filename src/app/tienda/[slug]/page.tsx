import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getSiteData } from "@/lib/site-data";
import ProductDetail from "./ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const data = await getSiteData();
  const product = data.products.find((p) => p.slug === slug);
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
