import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "lana & cactus — Arte textil hecho a mano",
    description:
          "Retratos de mascotas, bordados y patrones de fieltro de aguja hechos a mano, con envíos a toda España.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
          <html lang="es">
                <body className="antialiased">
                        <CartProvider>
                                  <Header />
                                  <main>{children}</main>main>
                                  <Footer />
                        </CartProvider>CartProvider>
                </body>body>
          </html>html>
        );
}
</html>
