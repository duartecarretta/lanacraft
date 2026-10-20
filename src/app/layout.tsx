import type { Metadata } from "next";
import { connection } from "next/server";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteData } from "@/lib/site-data";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const data = await getSiteData();
  return {
    title: `${data.siteName} — ${data.tagline}`,
    description:
      "Retratos de mascotas, bordados y patrones de fieltro de aguja hechos a mano, con envíos a toda España.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const data = await getSiteData();
  return (
    <html lang="es">
      <body className="antialiased">
        <CartProvider>
          <Header siteName={data.siteName} />
          <main>{children}</main>
          <Footer siteName={data.siteName} tagline={data.tagline} contactEmail={data.contactEmail} />
        </CartProvider>
      </body>
    </html>
  );
}
