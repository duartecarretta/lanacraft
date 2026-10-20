"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SiteData } from "@/lib/site-data";
import type { Product, Variant } from "@/data/products";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

function emptyProduct(): Product {
  return {
    slug: `producto-${Date.now()}`,
    name: "Nuevo producto",
    tagline: "",
    description: "",
    basePriceEUR: 0,
    images: ["/products/placeholder-pattern.svg"],
    variants: [{ id: "unico", label: "Único", priceEUR: 0 }],
    requiresPhoto: false,
    madeToOrder: true,
  };
}

export default function AdminEditor({ initialData }: { initialData: SiteData }) {
  const router = useRouter();
  const [data, setData] = useState<SiteData>(initialData);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  function updateField<K extends keyof SiteData>(key: K, value: SiteData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    setData((d) => ({
      ...d,
      products: d.products.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));
  }

  function updateVariant(productIndex: number, variantIndex: number, patch: Partial<Variant>) {
    setData((d) => ({
      ...d,
      products: d.products.map((p, i) => {
        if (i !== productIndex) return p;
        return {
          ...p,
          variants: p.variants.map((v, vi) => (vi === variantIndex ? { ...v, ...patch } : v)),
        };
      }),
    }));
  }

  function addVariant(productIndex: number) {
    setData((d) => ({
      ...d,
      products: d.products.map((p, i) =>
        i === productIndex
          ? {
              ...p,
              variants: [
                ...p.variants,
                { id: `opcion-${p.variants.length + 1}-${Date.now()}`, label: "Nueva opción", priceEUR: 0 },
              ],
            }
          : p
      ),
    }));
  }

  function removeVariant(productIndex: number, variantIndex: number) {
    setData((d) => ({
      ...d,
      products: d.products.map((p, i) =>
        i === productIndex
          ? { ...p, variants: p.variants.filter((_, vi) => vi !== variantIndex) }
          : p
      ),
    }));
  }

  function addProduct() {
    setData((d) => ({ ...d, products: [...d.products, emptyProduct()] }));
  }

  function removeProduct(index: number) {
    if (!confirm("¿Seguro que quieres eliminar este producto de la tienda?")) return;
    setData((d) => ({ ...d, products: d.products.filter((_, i) => i !== index) }));
  }

  async function handleImageUpload(index: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: result.error || "No se pudo subir la imagen." });
        return;
      }
      updateProduct(index, { images: [result.url], placeholder: false });
    } catch {
      setStatus({ ok: false, message: "No se pudo subir la imagen. Inténtalo de nuevo." });
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    // auto-generate slugs for any new/renamed products that still look like placeholders
    const cleaned: SiteData = {
      ...data,
      products: data.products.map((p) => ({
        ...p,
        slug: p.slug.startsWith("producto-") ? slugify(p.name) || p.slug : p.slug,
      })),
    };
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: result.error || "No se pudo guardar." });
        setSaving(false);
        return;
      }
      setData(cleaned);
      setStatus({ ok: true, message: "¡Guardado! Los cambios ya están publicados en la web." });
    } catch {
      setStatus({ ok: false, message: "No se pudo conectar. Inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Panel de administración</h1>
          <p className="text-[var(--ink-soft)] text-sm">
            Edita los textos, precios e imágenes de la tienda. Pulsa &quot;Guardar
            cambios&quot; para publicarlos.
          </p>
        </div>
        <button onClick={handleLogout} className="btn-outline text-sm whitespace-nowrap">
          Cerrar sesión
        </button>
      </div>

      {status && (
        <div
          className={`rounded-lg p-4 mb-6 text-sm ${
            status.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <section className="card rounded-xl p-6 mb-8">
        <h2 className="font-display text-xl mb-4">Datos generales</h2>
        <div className="space-y-4">
          <Field label="Nombre del sitio" value={data.siteName} onChange={(v) => updateField("siteName", v)} />
          <Field label="Eslogan (footer)" value={data.tagline} onChange={(v) => updateField("tagline", v)} />
          <Field label="Título principal (portada)" value={data.heroTitle} onChange={(v) => updateField("heroTitle", v)} />
          <Field
            label="Subtítulo principal (portada)"
            value={data.heroSubtitle}
            onChange={(v) => updateField("heroSubtitle", v)}
            textarea
          />
          <Field label="Título — Sobre mí" value={data.aboutTitle} onChange={(v) => updateField("aboutTitle", v)} />
          <Field
            label="Texto — Sobre mí (párrafo 1)"
            value={data.aboutText1}
            onChange={(v) => updateField("aboutText1", v)}
            textarea
          />
          <Field
            label="Texto — Sobre mí (párrafo 2)"
            value={data.aboutText2}
            onChange={(v) => updateField("aboutText2", v)}
            textarea
          />
          <Field label="Email de contacto" value={data.contactEmail} onChange={(v) => updateField("contactEmail", v)} />
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Productos de la tienda</h2>
          <button onClick={addProduct} className="btn-outline text-sm">
            + Añadir producto
          </button>
        </div>

        <div className="space-y-6">
          {data.products.map((product, index) => (
            <div key={product.slug} className="card rounded-xl p-6">
              <div className="flex gap-6 flex-col sm:flex-row">
                <div className="sm:w-40 shrink-0">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg-card)] mb-2">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
                  </div>
                  <label className="block text-xs text-[var(--ink-soft)] mb-1">Cambiar imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <Field label="Nombre" value={product.name} onChange={(v) => updateProduct(index, { name: v })} />
                  <Field label="Subtítulo" value={product.tagline} onChange={(v) => updateProduct(index, { tagline: v })} />
                  <Field
                    label="Descripción"
                    value={product.description}
                    onChange={(v) => updateProduct(index, { description: v })}
                    textarea
                  />
                  <Field
                    label="Precio base (desde) €"
                    value={String(product.basePriceEUR)}
                    onChange={(v) => updateProduct(index, { basePriceEUR: Number(v) || 0 })}
                    type="number"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs text-[var(--ink-soft)]">Opciones y precios</label>
                      <button onClick={() => addVariant(index)} className="text-xs text-[var(--accent)]">
                        + opción
                      </button>
                    </div>
                    <div className="space-y-2">
                      {product.variants.map((variant, vi) => (
                        <div key={variant.id} className="flex gap-2 items-center">
                          <input
                            value={variant.label}
                            onChange={(e) => updateVariant(index, vi, { label: e.target.value })}
                            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm"
                            placeholder="Nombre de la opción"
                          />
                          <input
                            type="number"
                            value={variant.priceEUR}
                            onChange={(e) => updateVariant(index, vi, { priceEUR: Number(e.target.value) || 0 })}
                            className="w-24 border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm"
                            placeholder="€"
                          />
                          {product.variants.length > 1 && (
                            <button
                              onClick={() => removeVariant(index, vi)}
                              className="text-[var(--ink-soft)] text-sm px-2"
                              title="Eliminar opción"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                    <input
                      type="checkbox"
                      checked={product.requiresPhoto}
                      onChange={(e) => updateProduct(index, { requiresPhoto: e.target.checked })}
                    />
                    El cliente debe enviar una foto de referencia
                  </label>

                  <button onClick={() => removeProduct(index)} className="text-xs text-red-600 mt-2">
                    Eliminar este producto
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full disabled:opacity-60">
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--ink-soft)] mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm"
        />
      )}
    </div>
  );
}
