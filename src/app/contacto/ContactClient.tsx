"use client";

import { useState } from "react";
import { dictionaries, type Locale } from "@/lib/i18n";

export default function ContactClient({ locale }: { locale: Locale }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const t = dictionaries[locale].contact;

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
        setError(data.error || t.genericError);
      }
    } catch {
      setError(t.connectionError);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 font-sans">
      <h1 className="font-display text-3xl mb-2">{t.title}</h1>
      <p className="text-[var(--ink-soft)] mb-10">{t.subtitle}</p>

      {sent ? (
        <div className="card rounded-xl p-6">
          <p>{t.sent}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              {t.name}
            </label>
            <input
              name="nombre"
              required
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--ink-soft)]">
              {t.email}
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
              {t.message}
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
              {t.photo}
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
            {sending ? t.sending : t.send}
          </button>
        </form>
      )}
    </div>
  );
}
