"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contacto", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
        form.reset();
      } else {
        setError(data.error || "No se pudo enviar el mensaje.");
      }
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 font-sans">
      <h1 className="font-display text-3xl mb-2">Contacto</h1>
      <p className="text-[var(--ink-soft)] mb-10">
        ¿Tienes dudas sobre un pedido o quieres enviarnos una foto de tu
        mascota? Escríbenos aquí.
      </p>

      {sent ? (
        <div className="card rounded-xl p-6">
          <p>¡Mensaje enviado! Te responderemos lo antes posible 💛</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              Nombre
            </label>
            <input
              name="nombre"
              required
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              rows={5}
              required
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              Adjuntar foto (opcional)
            </label>
            <input
              type="file"
              name="foto"
              accept="image/*"
              className="w-full text-sm border border-dashed border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
            {sending ? "Enviando…" : "Enviar mensaje"}
          </button>
        </form>
      )}
    </div>
  );
}
