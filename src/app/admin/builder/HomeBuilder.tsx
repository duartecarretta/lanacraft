"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import blocksBasic from "grapesjs-blocks-basic";
import presetWebpage from "grapesjs-preset-webpage";
import type { SiteData, HomeBuilderPage } from "@/lib/site-data";
import { LOCALES, LANGUAGE_NAMES, dictionaries, localize, type Locale } from "@/lib/i18n";

// Text left over from very early builds of this screen (before the
// "import current layout" feature existed), which should be treated as
// blank rather than as real content someone authored.
const LEGACY_PLACEHOLDER_TEXT = "Empieza arrastrando bloques aquí…";

function isBlankPage(page: HomeBuilderPage | undefined): boolean {
  // getHtml() wraps content in its own <body>, adds whitespace, etc., so
  // compare on text content only rather than exact markup.
  const textOnly = (page?.html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return textOnly === "" || textOnly === LEGACY_PLACEHOLDER_TEXT;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// GrapesJS 0.23 strips style="" attributes on parse (avoidInlineStyle is a
// deprecated no-op), so every block/section below is styled with these
// classes instead of inline styles. This same CSS text is (a) saved inside
// each page's `css` field — see captureCurrentLang — so it travels with the
// content when rendered live via dangerouslySetInnerHTML, and (b) mirrored
// into public/builder-canvas.css so it's also available while editing.
const BUILDER_SHARED_CSS = `
.ab-section { padding: 48px 24px; max-width: 1100px; margin: 0 auto; }
.ab-section-lg { padding: 64px 24px; max-width: 1100px; margin: 0 auto; }
.ab-two-col { display: flex; gap: 48px; align-items: center; flex-wrap: wrap; }
.ab-two-col > div { flex: 1; min-width: 280px; }
.ab-cta-row { display: flex; gap: 16px; flex-wrap: wrap; }
.ab-badge { text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); font-size: 14px; margin-bottom: 16px; }
.ab-hero-title { font-size: 44px; line-height: 1.15; margin-bottom: 24px; }
.ab-hero-text { font-size: 18px; max-width: 420px; margin-bottom: 32px; }
.ab-img-rounded { width: 100%; border-radius: 16px; display: block; }
.ab-img-square { aspect-ratio: 1; object-fit: cover; }
.ab-img-portrait { aspect-ratio: 4 / 5; object-fit: cover; }
.ab-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
.ab-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ab-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.ab-product-card { display: block; text-decoration: none; color: inherit; }
.ab-product-thumb { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
.ab-product-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-product-name { font-size: 18px; margin: 0 0 4px 0; }
.ab-product-price { font-size: 14px; color: var(--ink-soft); margin: 0; }
.ab-testimonial { border-radius: 12px; padding: 32px; }
.ab-testimonial-standalone { max-width: 480px; margin: 24px auto; }
.ab-testimonial-quote { font-style: italic; margin: 0 0 16px 0; }
.ab-testimonial-author { font-size: 14px; margin: 0; }
.ab-cta-wrap { padding: 16px 24px; text-align: center; }
.ab-spacer { height: 48px; }
.ab-section-heading { margin-bottom: 8px; }
.ab-section-intro { margin-bottom: 40px; }
.ab-mb-sm { margin-bottom: 16px; }
.ab-center { text-align: center; }
@media (max-width: 760px) {
  .ab-grid-2, .ab-grid-3, .ab-grid-4 { grid-template-columns: 1fr; }
}
`.trim();

// Rebuilds the current curated homepage (src/app/page.tsx) as static
// HTML/CSS so Stephanie's canvas starts from what's already live, instead
// of a blank page that would wipe the site the moment she enables it.
function buildCurrentHomeHtml(data: SiteData, locale: Locale): HomeBuilderPage {
  const t = dictionaries[locale];
  const heroImage = data.products[0]?.images[0] || "/products/cactus-5.jpg";
  const aboutImage = data.products[0]?.images[1] || data.products[0]?.images[0] || "/products/cactus-2.jpg";

  const productsHtml = data.products
    .map(
      (p) => `
      <a href="/tienda/${p.slug}" class="ab-product-card">
        <div class="card ab-product-thumb">
          <img src="${p.images[0]}" />
        </div>
        <h3 class="font-display ab-product-name">${escapeHtml(localize(p.name, locale))}</h3>
        <p class="font-sans ab-product-price">${escapeHtml(t.home.from)} ${p.basePriceEUR}€</p>
      </a>`
    )
    .join("");

  const testimonialsHtml = t.home.testimonials
    .map(
      (item) => `
      <div class="card ab-testimonial">
        <p class="section-text ab-testimonial-quote">"${escapeHtml(item.quote)}"</p>
        <p class="font-sans ab-testimonial-author">— ${escapeHtml(item.author)}</p>
      </div>`
    )
    .join("");

  const html = `
    <section class="ab-section-lg ab-two-col">
      <div>
        <p class="font-sans ab-badge">${escapeHtml(t.home.badge)}</p>
        <h1 class="font-display section-title ab-hero-title">${escapeHtml(localize(data.heroTitle, locale))}</h1>
        <p class="section-text ab-hero-text">${escapeHtml(localize(data.heroSubtitle, locale))}</p>
        <div class="ab-cta-row">
          <a href="/tienda" class="btn-primary">${escapeHtml(t.home.ctaShop)}</a>
          <a href="/#sobre-mi" class="btn-outline">${escapeHtml(t.home.ctaAbout)}</a>
        </div>
      </div>
      <div>
        <img src="${heroImage}" class="ab-img-rounded ab-img-square" />
      </div>
    </section>

    <section class="ab-section">
      <h2 class="font-display section-title ab-section-heading">${escapeHtml(t.home.collectionTitle)}</h2>
      <p class="section-text ab-section-intro">${escapeHtml(t.home.collectionSubtitle)}</p>
      <div class="ab-grid-4">${productsHtml}</div>
    </section>

    <section id="sobre-mi" class="ab-section ab-two-col">
      <div>
        <img src="${aboutImage}" class="ab-img-rounded ab-img-portrait" />
      </div>
      <div>
        <h2 class="font-display section-title">${escapeHtml(localize(data.aboutTitle, locale))}</h2>
        <p class="section-text ab-mb-sm">${escapeHtml(localize(data.aboutText1, locale))}</p>
        <p class="section-text">${escapeHtml(localize(data.aboutText2, locale))}</p>
      </div>
    </section>

    <section class="ab-section">
      <h2 class="font-display section-title ab-center ab-section-intro">${escapeHtml(t.home.testimonialsTitle)}</h2>
      <div class="ab-grid-2">${testimonialsHtml}</div>
    </section>
  `;

  return { html, css: BUILDER_SHARED_CSS };
}

const STARTER_BLOCKS: { id: string; label: string; category: string; content: string }[] = [
  {
    id: "hero-section",
    label: "Destaque (Hero)",
    category: "Atelier Sayuri",
    content: `<section class="ab-section-lg ab-two-col">
      <div>
        <p class="font-sans ab-badge">Hecho a mano · España</p>
        <h1 class="font-display section-title ab-hero-title">Título principal</h1>
        <p class="section-text ab-hero-text">Escribe aquí una descripción breve y atractiva.</p>
        <a href="/tienda" class="btn-primary">Ver la tienda</a>
      </div>
      <div>
        <img src="/products/cactus-3.jpg" class="ab-img-rounded" />
      </div>
    </section>`,
  },
  {
    id: "text-section",
    label: "Sección de texto",
    category: "Atelier Sayuri",
    content: `<section class="ab-section">
      <h2 class="font-display section-title">Título de la sección</h2>
      <p class="section-text">Escribe aquí el texto de esta sección. Puedes hablar de tu historia, tus materiales o lo que hace especial a cada pieza.</p>
    </section>`,
  },
  {
    id: "image-gallery",
    label: "Galería (3 imágenes)",
    category: "Atelier Sayuri",
    content: `<section class="ab-section ab-grid-3">
      <img src="/products/cactus-1.jpg" class="ab-img-rounded ab-img-square" />
      <img src="/products/cactus-2.jpg" class="ab-img-rounded ab-img-square" />
      <img src="/products/cactus-6.jpg" class="ab-img-rounded ab-img-square" />
    </section>`,
  },
  {
    id: "testimonial-card",
    label: "Tarjeta de opinión",
    category: "Atelier Sayuri",
    content: `<div class="card ab-testimonial ab-testimonial-standalone">
      <p class="section-text ab-testimonial-quote">"Escribe aquí la opinión de tu clienta..."</p>
      <p class="font-sans ab-testimonial-author">— Nombre</p>
    </div>`,
  },
  {
    id: "cta-button",
    label: "Botón",
    category: "Atelier Sayuri",
    content: `<div class="ab-cta-wrap"><a href="/tienda" class="btn-primary">Texto del botón</a></div>`,
  },
  {
    id: "spacer",
    label: "Espaciador",
    category: "Atelier Sayuri",
    content: `<div class="ab-spacer"></div>`,
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
    let startPage = pagesRef.current[startLocale];
    if (isBlankPage(startPage)) {
      startPage = buildCurrentHomeHtml(initialData, startLocale);
      pagesRef.current[startLocale] = startPage;
    }
    editor.setComponents(startPage.html);
    editor.setStyle(startPage.css || "");

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
    // Always prefix the shared layout CSS so content built from our blocks
    // (or the imported current layout) keeps working once rendered outside
    // the editor, where /builder-canvas.css isn't loaded.
    const generatedCss = editor.getCss() || "";
    pagesRef.current[editLangRef.current] = {
      html: editor.getHtml(),
      css: `${BUILDER_SHARED_CSS}\n\n${generatedCss}`,
    };
  }

  function switchLang(next: Locale) {
    if (next === editLang) return;
    captureCurrentLang();
    setEditLang(next);
    editLangRef.current = next;
    const editor = editorRef.current;
    if (!editor) return;
    let page = pagesRef.current[next];
    if (isBlankPage(page)) {
      page = buildCurrentHomeHtml(dataRef.current, next);
      pagesRef.current[next] = page;
    }
    editor.setComponents(page.html);
    editor.setStyle(page.css || "");
  }

  function copyFromSpanish() {
    if (editLang === "es") return;
    const editor = editorRef.current;
    if (!editor) return;
    pagesRef.current[editLang] = { ...pagesRef.current.es };
    editor.setComponents(pagesRef.current.es.html);
    editor.setStyle(pagesRef.current.es.css || "");
  }

  function importCurrentLayout() {
    const editor = editorRef.current;
    if (!editor) return;
    const confirmed = window.confirm(
      "Isso vai substituir o conteúdo atual deste idioma no construtor pelo layout que está no ar agora no site. Continuar?"
    );
    if (!confirmed) return;
    const page = buildCurrentHomeHtml(dataRef.current, editLang);
    pagesRef.current[editLang] = page;
    editor.setComponents(page.html);
    editor.setStyle(page.css || "");
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
        <button onClick={importCurrentLayout} className="text-xs text-[var(--accent)] underline ml-2">
          Importar layout atual do site
        </button>
        {!ready && <span className="text-xs text-[var(--ink-soft)] ml-auto">Cargando editor…</span>}
      </div>

      <div style={{ height: "calc(100vh - 150px)" }}>
        <div ref={containerRef} style={{ height: "100%" }} />
      </div>
    </div>
  );
}
