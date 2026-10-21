import { put, list } from "@vercel/blob";
import { products as seedProducts, type Product, type Variant } from "@/data/products";
import { emptyLocalized, toLocalized, LOCALES, type Locale, type Localized } from "@/lib/i18n";

export type { Product, Variant } from "@/data/products";

export type HomeBuilderPage = {
  html: string;
  css: string;
};

export type HomeBuilderData = {
  enabled: boolean;
  pages: Record<Locale, HomeBuilderPage>;
};

export type SiteData = {
  siteName: string;
  tagline: Localized;
  heroTitle: Localized;
  heroSubtitle: Localized;
  aboutTitle: Localized;
  aboutText1: Localized;
  aboutText2: Localized;
  contactEmail: string;
  products: Product[];
  homeBuilder: HomeBuilderData;
};

function emptyHomeBuilderPage(): HomeBuilderPage {
  return { html: "", css: "" };
}

function emptyHomeBuilder(): HomeBuilderData {
  return {
    enabled: false,
    pages: { es: emptyHomeBuilderPage(), en: emptyHomeBuilderPage(), pt: emptyHomeBuilderPage() },
  };
}

const DATA_KEY = "site-data.json";

export function seedSiteData(): SiteData {
  return {
    siteName: "Atelier Sayuri",
    tagline: {
      es: "Arte textil hecho a mano",
      en: "Handmade textile art",
      pt: "Arte têxtil feita à mão",
    },
    heroTitle: {
      es: "Arte textil para momentos que importan",
      en: "Textile art for moments that matter",
      pt: "Arte têxtil para momentos que importam",
    },
    heroSubtitle: {
      es: "Retratos de mascotas, bordados y piezas de fieltro de aguja, creados uno a uno, pensando en ti y en quienes quieres.",
      en: "Pet portraits, embroidery and needle-felted pieces, created one at a time, with you and your loved ones in mind.",
      pt: "Retratos de animais de estimação, bordados e peças em feltro de agulha, criados um a um, pensando em você e em quem você ama.",
    },
    aboutTitle: {
      es: "Un poco sobre mí",
      en: "A little about me",
      pt: "Um pouco sobre mim",
    },
    aboutText1: {
      es: "Cada pieza nace del fieltro de aguja y el bordado, dos técnicas que me permiten crear con las manos algo único para cada persona que me escribe.",
      en: "Every piece begins with needle felting and embroidery, two techniques that let me create something unique by hand for each person who writes to me.",
      pt: "Cada peça nasce do feltro de agulha e do bordado, duas técnicas que me permitem criar à mão algo único para cada pessoa que me escreve.",
    },
    aboutText2: {
      es: "Me encanta transformar una foto, una historia o un recuerdo en una obra textil que se pueda guardar para siempre. Trabajo despacio, con intención, cuidando cada detalle.",
      en: "I love turning a photo, a story or a memory into a textile piece you can keep forever. I work slowly, with intention, taking care of every detail.",
      pt: "Adoro transformar uma foto, uma história ou uma lembrança em uma obra têxtil para guardar para sempre. Trabalho devagar, com intenção, cuidando de cada detalhe.",
    },
    contactEmail: "hola@ateliersayuri.com",
    products: seedProducts,
    homeBuilder: emptyHomeBuilder(),
  };
}

function normalizeVariant(stored: unknown, fallback?: Variant, index = 0): Variant {
  const v = (stored && typeof stored === "object" ? stored : {}) as Partial<Variant>;
  return {
    id: typeof v.id === "string" && v.id ? v.id : fallback?.id ?? `opcion-${index}`,
    label: toLocalized(v.label, fallback?.label ?? emptyLocalized()),
    priceEUR: typeof v.priceEUR === "number" ? v.priceEUR : fallback?.priceEUR ?? 0,
  };
}

function normalizeProduct(stored: unknown, fallback?: Product): Product {
  const p = (stored && typeof stored === "object" ? stored : {}) as Partial<Product> & {
    [key: string]: unknown;
  };
  const fallbackVariants = fallback?.variants ?? [];
  const variants =
    Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v, i) => normalizeVariant(v, fallbackVariants[i], i))
      : fallbackVariants.length > 0
      ? fallbackVariants
      : [normalizeVariant(undefined, undefined, 0)];

  return {
    slug: typeof p.slug === "string" && p.slug ? p.slug : fallback?.slug ?? `producto-${Date.now()}`,
    name: toLocalized(p.name, fallback?.name ?? emptyLocalized()),
    tagline: toLocalized(p.tagline, fallback?.tagline ?? emptyLocalized()),
    description: toLocalized(p.description, fallback?.description ?? emptyLocalized()),
    basePriceEUR: typeof p.basePriceEUR === "number" ? p.basePriceEUR : fallback?.basePriceEUR ?? 0,
    images:
      Array.isArray(p.images) && p.images.length > 0
        ? (p.images as string[])
        : fallback?.images ?? ["/products/placeholder-pattern.svg"],
    variants,
    requiresPhoto:
      typeof p.requiresPhoto === "boolean" ? p.requiresPhoto : fallback?.requiresPhoto ?? false,
    madeToOrder:
      typeof p.madeToOrder === "boolean" ? p.madeToOrder : fallback?.madeToOrder ?? true,
    leadTime: p.leadTime
      ? toLocalized(p.leadTime, fallback?.leadTime ?? emptyLocalized())
      : fallback?.leadTime,
    placeholder: typeof p.placeholder === "boolean" ? p.placeholder : fallback?.placeholder,
  };
}

function normalizeHomeBuilder(stored: unknown): HomeBuilderData {
  const hb = (stored && typeof stored === "object" ? stored : {}) as Partial<HomeBuilderData> & {
    [key: string]: unknown;
  };
  const storedPages = (hb.pages && typeof hb.pages === "object" ? hb.pages : {}) as Partial<
    Record<Locale, Partial<HomeBuilderPage>>
  >;
  const pages = {} as Record<Locale, HomeBuilderPage>;
  for (const locale of LOCALES) {
    const p = storedPages[locale];
    pages[locale] = {
      html: typeof p?.html === "string" ? p.html : "",
      css: typeof p?.css === "string" ? p.css : "",
    };
  }
  return { enabled: typeof hb.enabled === "boolean" ? hb.enabled : false, pages };
}

/**
 * Merges whatever was saved in Blob storage (which may still be in the old,
 * pre-i18n flat-string shape) on top of the seed data, normalizing every
 * translatable field into a full { es, en, pt } object along the way.
 */
function normalizeSiteData(stored: Partial<SiteData> & { [key: string]: unknown }, seed: SiteData): SiteData {
  const storedProducts = Array.isArray(stored.products) ? stored.products : [];
  const products =
    storedProducts.length > 0
      ? storedProducts.map((sp, i) => normalizeProduct(sp, seed.products[i]))
      : seed.products;

  return {
    siteName: typeof stored.siteName === "string" && stored.siteName ? stored.siteName : seed.siteName,
    tagline: toLocalized(stored.tagline, seed.tagline),
    heroTitle: toLocalized(stored.heroTitle, seed.heroTitle),
    heroSubtitle: toLocalized(stored.heroSubtitle, seed.heroSubtitle),
    aboutTitle: toLocalized(stored.aboutTitle, seed.aboutTitle),
    aboutText1: toLocalized(stored.aboutText1, seed.aboutText1),
    aboutText2: toLocalized(stored.aboutText2, seed.aboutText2),
    contactEmail:
      typeof stored.contactEmail === "string" && stored.contactEmail
        ? stored.contactEmail
        : seed.contactEmail,
    products,
    homeBuilder: stored.homeBuilder ? normalizeHomeBuilder(stored.homeBuilder) : emptyHomeBuilder(),
  };
}

/**
 * Reads the editable site data from Vercel Blob storage. Falls back to the
 * hardcoded seed data (src/data/products.ts) whenever Blob storage isn't
 * configured yet, or the file doesn't exist there yet.
 */
export async function getSiteData(): Promise<SiteData> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const seed = seedSiteData();
  if (!token) return seed;

  try {
    const { blobs } = await list({ prefix: DATA_KEY, token, limit: 10 });
    const match = blobs.find((b) => b.pathname === DATA_KEY);
    if (!match) return seed;

    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return seed;

    const stored = (await res.json()) as Partial<SiteData>;
    return normalizeSiteData(stored, seed);
  } catch (err) {
    console.error("getSiteData: falling back to seed data", err);
    return seed;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "El almacenamiento (Vercel Blob) no está configurado todavía."
    );
  }
  await put(DATA_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}
