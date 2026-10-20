import { put, list } from "@vercel/blob";
import { products as seedProducts, type Product } from "@/data/products";

export type { Product, Variant } from "@/data/products";

export type SiteData = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  contactEmail: string;
  products: Product[];
};

const DATA_KEY = "site-data.json";

export function seedSiteData(): SiteData {
  return {
    siteName: "Atelier Sayuri",
    tagline: "Arte textil hecho a mano",
    heroTitle: "Arte textil para momentos que importan",
    heroSubtitle:
      "Retratos de mascotas, bordados y piezas de fieltro de aguja, creados uno a uno, pensando en ti y en quienes quieres.",
    aboutTitle: "Un poco sobre mí",
    aboutText1:
      "Cada pieza nace del fieltro de aguja y el bordado, dos técnicas que me permiten crear con las manos algo único para cada persona que me escribe.",
    aboutText2:
      "Me encanta transformar una foto, una historia o un recuerdo en una obra textil que se pueda guardar para siempre. Trabajo despacio, con intención, cuidando cada detalle.",
    contactEmail: "hola@ateliersayuri.com",
    products: seedProducts,
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
    return {
      ...seed,
      ...stored,
      products:
        Array.isArray(stored.products) && stored.products.length > 0
          ? stored.products
          : seed.products,
    };
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
