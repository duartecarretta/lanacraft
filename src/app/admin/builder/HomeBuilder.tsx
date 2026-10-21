"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import blocksBasic from "grapesjs-blocks-basic";
import presetWebpage from "grapesjs-preset-webpage";
import type { SiteData, HomeBuilderPage } from "@/lib/site-data";
import { LOCALES, LANGUAGE_NAMES, type Locale } from "@/lib/i18n";

const STARTER_BLOCKS: { id: string; label: string; category: string; content: string }[] = [
  {
    id: "hero-section",
    label: "Destaque (Hero)",
    category: "Atelier Sayuri",
    content: `<section style="padding:64px 24px; display:flex; gap:48px; align-items:center; flex-wrap:wrap; max-width:1100px; margin:0 auto;">
      <div style="flex:1; min-width:280px;">
        <p class="font-sans" style="text-transform:uppercase; letter-spacing:0.1em; color:var(--accent); font-size:14px; margin-bottom:16px;">Hecho a mano · España</p>
        <h1 class="font-display section-title" style="font-size:44px; line-height:1.15; margin-bottom:24px;">Título principal</h1>
        <p class="section-text" style="font-size:18px; max-width:420px; margin-bottom:32px;">Escribe aquí una descripción breve y atractiva.</p>
        <a href="/tienda" class="btn-primary">Ver la tienda</a>
      </div>
      <div style="flex:1; min-width:280px;">
        <img src="/products/cactus-3.jpg" style="width:100%; border-radius:16px; display:block;" />
      </div>
    </section>`,
  },
  {
    id: "text-section",
    label: "Sección de texto",
    category: "Atelier Sayuri",
    content: `<section style="padding:48px 24px; max-width:900px; margin:0 auto;">
      <h2 class="font-display section-title">Título de la sección</h2>
      <p class="section-text">Escribe aquí el texto de esta sección. Puedes hablar de tu historia, tus materiales o lo que hace especial a cada pieza.</p>
    </section>`,
  },
  {
    id: "image-gallery",
    label: "Galería (3 imágenes)",
    category: "Atelier Sayuri",
    content: `<section style="padding:48px 24px; display:grid; grid-template-columns:repeat(3,1fr); gap:24px; max-width:1100px; margin:0 auto;">
      <img src="/products/cactus-1.jpg" style="width:100%; border-radius:12px; aspect-ratio:1; object-fit:cover; display:block;" />
      <img src="/products/cactus-2.jpg" style="width:100%; border-radius:12px; aspect-ratio:1; object-fit:cover; display:block;" />
      <img src="/products/cactus-6.jpg" style="width:100%; border-radius:12px; aspect-ratio:1; object-fit:cover; display:block;" />
    </section>`,
  },
  {
    id: "testimonial-card",
    label: "Tarjeta de opinión",
    category: "Atelier Sayuri",
    content: `<div class="card" style="border-radius:16px; padding:32px; max-width:480px; margin:24px auto;">
      <p class="section-text" style="font-style:italic; margin-bottom:16px;">"Escribe aquí la opinión de tu clienta..."</p>
      <p class="font-sans" style="font-size:14px;">— Nombre</p>
    </div>`,
  },
  {
    id: "cta-button",
    label: "Botón",
    category: "Atelier Sayuri",
    content: `<div style="padding:16px 24px; text-align:center;"><a href="/tienda" class="btn-primary">Texto del botón</a></div>`,
  },
  {
    id: "spacer",
    label: "Espaciador",
    category: "Atelier Sayuri",
    content: `<div style="height:48px;"></div>`,
  },
];

export default function HomeBuilder({ initialData }: { initialData: SiteData }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const pagesRef = useRef<Record<Locale, HomeBuilderPage>>({ ...initialData.homeBuilder.pages });
  const dataRef = useRef<SiteData>(initialData);
  const editLangRef = useRef<Locale>("es");

  const [editLang, setEditLang] = useState<Locale>("es");
  const [enabled, setEnabled] = useState(initialData.homeBuilder.enabled);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    editLangRef.current = editLang;
  }, [editLang]);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      width: "auto",
      storageManager: false,
      fromElement: false,
      plugins: [blocksBasic, presetWebpage],
      pluginsOpts: {
        [blocksBasic as unknown as string]: {
          blocks: ["column1", "column2", "column3", "text", "link", "image"],
          flexGrid: true,
          category: "Básico",
        },
        [presetWebpage as unknown as string]: {
          blocks: ["link-block", "quote", "text-basic"],
          modalImportTitle: "Importar código",
        },
      },
      canvas: {
        styles: ["/builder-canvas.css"],
      },
      assetManager: {
        upload: "/api/admin/upload",
        uploadName: "file",
        multiUpload: false,
        autoAdd: true,
        credentials: "include",
        customFetch: async (url: string, options: Record<string, unknown>) => {
          const res = await fetch(url, {
            method: "POST",
            body: options.body as FormData,
            credentials: "include",
          });
          if (!res.ok) throw new Error("No se pudo subir la imagen.");
          const result = await res.json();
          return { data: [result.url] };
        },
      },
    } as unknown as Parameters<typeof grapesjs.init>[0]);

    editorRef.current = editor;

    for (const block of STARTER_BLOCKS) {
      editor.BlockManager.add(block.id, {
        label: block.label,
        category: block.category,
        content: block.content,
      });
    }

    // Seed initial images from existing products so Stephanie can reuse them.
    const existingImages = Array.from(
      new Set(initialData.products.flatMap((p) => p.images))
    ).filter((src) => !src.startsWith("http"));
    editor.AssetManager.add(existingImages.map((src) => ({ src })));

    const startLocale = editLangRef.current;
    editor.setComponents(pagesRef.current[startLocale].html || "<p>Empieza arrastrando bloques aquí…</p>");
    editor.setStyle(pagesRef.current[startLocale].css || "");

    setReady(true);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function captureCurrentLang() {
    const editor = editorRef.current;
    if (!editor) return;
    pagesRef.current[editLangRef.current] = {
      html: editor.getHtml(),
      css: editor.getCss() || "",
    };
  }

  function switchLang(next: Locale) {
    if (next === editLang) return;
    captureCurrentLang();
    setEditLang(next);
    editLangRef.current = next;
    const editor = editorRef.current;
    if (!editor) return;
    editor.setComponents(pagesRef.current[next].html || "<p>Empieza arrastrando bloques aquí…</p>");
    editor.setStyle(pagesRef.current[next].css || "");
  }

  function copyFromSpanish() {
    if (editLang === "es") return;
    const editor = editorRef.current;
    if (!editor) return;
    pagesRef.current[editLang] = { ...pagesRef.current.es };
    editor.setComponents(pagesRef.current.es.html || "<p>Empieza arrastrando bloques aquí…</p>");
    editor.setStyle(pagesRef.current.es.css || "");
  }

  async function handleSave() {
    captureCurrentLang();
    setSaving(true);
    setStatus(null);
    const updated: SiteData = {
      ...dataRef.current,
      homeBuilder: { enabled, pages: { ...pagesRef.current } },
    };
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: result.error || "No se pudo guardar." });
        return;
      }
      dataRef.current = updated;
      setStatus({ ok: true, message: "¡Guardado! La página de inicio ya refleja estos cambios." });
    } catch {
      setStatus({ ok: false, message: "No se pudo conectar. Inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
        <div>
          <Link href="/admin" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
            ← Voltar ao painel
          </Link>
          <h1 className="font-display text-2xl mt-1">Construtor visual da página inicial</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Usar este layout personalizado no site
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`mx-6 mt-3 rounded-lg p-3 text-sm ${
            status.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)]">
        <span className="text-sm text-[var(--ink-soft)]">Editando en:</span>
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => switchLang(l)}
            className={`px-3 py-1 rounded-full text-sm border ${
              editLang === l
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "border-[var(--border)] text-[var(--ink-soft)]"
            }`}
          >
            {LANGUAGE_NAMES[l]}
          </button>
        ))}
        {editLang !== "es" && (
          <button onClick={copyFromSpanish} className="text-xs text-[var(--accent)] underline ml-2">
            Copiar do Español
          </button>
        )}
        {!ready && <span className="text-xs text-[var(--ink-soft)] ml-auto">Cargando editor…</span>}
      </div>

      <div ref={containerRef} style={{ height: "calc(100vh - 150px)" }} />
    </div>
  );
}
