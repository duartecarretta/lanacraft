"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "No se pudo iniciar el pago. Inténtalo de nuevo.");
      }
    } catch {
      setError("No se pudo conectar con el pago. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center font-sans">
        <h1 className="font-display text-3xl mb-4">Tu carrito está vacío</h1>
        <Link href="/tienda" className="btn-primary">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 font-sans">
      <h1 className="font-display text-3xl mb-10">Tu carrito</h1>
      <div className="space-y-6 mb-10">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-4 card rounded-xl p-4"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-display text-lg">{item.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">{item.variantLabel}</p>
              {item.petPhotoName && (
                <p className="text-xs text-[var(--ink-soft)]">
                  📎 {item.petPhotoName}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-[var(--border)] rounded-full">
                  <button
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    className="w-7 h-7 text-sm"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    className="w-7 h-7 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  className="text-xs text-[var(--ink-soft)] underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="font-display">{item.priceEUR * item.qty}€</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8 font-display text-xl">
        <span>Total</span>
        <span>{total}€</span>
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-60"
      >
        {loading ? "Redirigiendo al pago…" : "Pagar con tarjeta"}
      </button>
      <p className="text-xs text-[var(--ink-soft)] mt-4 text-center">
        Pago seguro procesado por Stripe. Si enviaste una foto de referencia,
        te confirmaremos por email los próximos pasos.
      </p>
    </div>
  );
}
