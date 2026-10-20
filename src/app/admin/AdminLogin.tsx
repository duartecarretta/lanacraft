"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24 font-sans">
      <h1 className="font-display text-3xl mb-2">Panel de administración</h1>
      <p className="text-[var(--ink-soft)] mb-8">
        Introduce la contraseña para editar los textos, precios e imágenes de
        la tienda.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
