import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProduct(slug);
    if (!product) return notFound();
    return <ProductDetail product={product} />;
}
