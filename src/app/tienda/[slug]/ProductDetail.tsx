"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { dictionaries, localize, type Locale } from "@/lib/i18n";

export default function ProductDetail({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const t = dictionaries[locale].product;

  const variant = product.variants.find((v) => v.id === variantId)!;
  const name = localize(product.name, locale);
  const variantLabel = localize(variant.label, locale);

  function handleAdd() {
    addItem(
      {
        key: `${product.slug}-${variant.id}-${Date.now()}`,
        slug: product.slug,
        name: `${name} — ${variantLabel}`,
        variantLabel: notes ? `${variantLabel} (${notes.slice(0, 40)})` : variantLabel,
        priceEUR: variant.priceEUR,
        image: product.images[0],
        petPhotoName: petPhoto?.name,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/tienda"
        className="font-sans text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
      >
        {t.back}
      </Link>

      <div className="mt-6 grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden card mb-3">
            <Image
              src={mainImage}
              alt={name}
              fill
              className="object-cover"
              unoptimized={mainImage.startsWith("http")}
            />
            {product.placeholder && (
              <span className="absolute top-3 left-3 bg-white/90 text-xs font-sans px-3 py-1 rounded-full text-[var(--ink-soft)]">
                {t.sampleImage}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    mainImage === img ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={img.startsWith("http")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + form */}
        <div className="font-sans">
          <h1 className="font-display text-3xl mb-1">{name}</h1>
          <p className="text-[var(--ink-soft)] mb-4">{localize(product.tagline, locale)}</p>
          <p className="text-2xl mb-6">{variant.priceEUR}€</p>
          <p className="text-[var(--ink-soft)] leading-relaxed mb-8">
            {localize(product.description, locale)}
          </p>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-[var(--ink-soft)]">
              {t.option}
            </label>
            <select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {localize(v.label, locale)} — {v.priceEUR}€
                </option>
              ))}
            </select>
          </div>

          {product.requiresPhoto && (
            <div className="mb-6">
              <label className="block text-sm mb-2 text-[var(--ink-soft)]">
                {t.photoLabel}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPetPhoto(e.target.files?.[0] ?? null)}
                className="w-full text-sm border border-dashed border-[var(--border)] rounded-lg px-4 py-3 bg-white"
              />
              {petPhoto && (
                <p className="text-xs text-[var(--ink-soft)] mt-1">
                  {t.file}: {petPhoto.name}
                </p>
              )}
              <textarea
                placeholder={t.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full mt-3 border border-[var(--border)] rounded-lg px-4 py-3 bg-white text-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm text-[var(--ink-soft)]">{t.quantity}</label>
            <div className="flex items-center border border-[var(--border)] rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9"
              >
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9">
                +
              </button>
            </div>
          </div>

          <button onClick={handleAdd} className="btn-primary w-full text-center">
            {added ? t.added : t.addToCart}
          </button>

          {product.madeToOrder && product.leadTime && (
            <p className="text-xs text-[var(--ink-soft)] mt-4">
              {t.madeToOrder} {localize(product.leadTime, locale)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
