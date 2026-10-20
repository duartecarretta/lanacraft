"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
    const { count } = useCart();

  return (
        <header className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-2xl tracking-wide">
              lana &amp; cactus
        </Link>
            <nav className="hidden sm:flex items-center gap-8 font-sans text-sm text-[var(--ink-soft)]">
              <Link href="/tienda" className="hover:text-[var(--ink)]">
                Tienda
              </Link>
              <Link href="/#sobre-mi" className="hover:text-[var(--ink)]">
                Sobre mí
          </Link>
              <Link href="/contacto" className="hover:text-[var(--ink)]">
                Contacto
              </Link>
            </nav>
            <Link
              href="/carrito"
              className="relative font-sans text-sm border border-[var(--border)] rounded-full px-4 py-2 hover:bg-[var(--bg-card)]"
            >
              Carrito
    {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
    {count}
                </span>
              )}
            </Link>
          </div>
        </header>
      );
}
