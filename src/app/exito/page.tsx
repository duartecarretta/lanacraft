"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center font-sans">
      <h1 className="font-display text-3xl mb-4">¡Gracias por tu pedido! 🌵</h1>
      <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
        Hemos recibido tu pago correctamente. Te escribiremos por email en
        breve para confirmar los detalles y, si tu pedido lo necesita, para
        pedirte las fotos de referencia.
      </p>
      <Link href="/tienda" className="btn-primary">
        Seguir viendo la tienda
      </Link>
    </div>
  );
}
