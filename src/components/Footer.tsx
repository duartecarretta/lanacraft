import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-3 font-sans text-sm text-[var(--ink-soft)]">
        <div>
          <div className="font-display text-xl text-[var(--ink)] mb-3">
            lana &amp; cactus
          </div>
          <p>
            Piezas de fieltro de aguja y bordado hechas a mano, con cariño,
            desde España.
          </p>
        </div>
        <div>
          <div className="text-[var(--ink)] mb-3">Enlaces</div>
          <ul className="space-y-2">
            <li>
              <Link href="/tienda" className="hover:text-[var(--ink)]">
                Tienda
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-[var(--ink)]">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-[var(--ink)]">
                Carrito
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[var(--ink)] mb-3">Contacto</div>
          <p>hola@lanaycactus.com</p>
          <p>Hecho con amor en España</p>
        </div>
      </div>
      <div className="text-center text-xs text-[var(--ink-soft)] pb-8 font-sans">
        © 2026 lana &amp; cactus. Todos los derechos reservados.
      </div>
    </footer>
  );
}
