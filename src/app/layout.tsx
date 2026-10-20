import type { Metadata } from "next";
import { connection } from "next/server";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteData } from "@/lib/site-data";
import { getLocale } from "@/lib/get-locale";
import { localize } from "@/lib/i18n";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  return {
    title: `${data.siteName} — ${localize(data.tagline, locale)}`,
    description:
      "Retratos de mascotas, bordados y patrones de fieltro de aguja hechos a mano, con envíos a toda España.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const [data, locale] = await Promise.all([getSiteData(), getLocale()]);
  return (
    <html lang={locale}>
      <body className="antialiased">
        <CartProvider>
          <Header siteName={data.siteName} locale={locale} />
          <main>{children}</main>
          <Footer
            siteName={data.siteName}
            tagline={localize(data.tagline, locale)}
            contactEmail={data.contactEmail}
            locale={locale}
          />
        </CartProvider>
      </body>
    </html>
  );
}
