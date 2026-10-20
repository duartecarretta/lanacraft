import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type IncomingItem = {
  name: string;
  priceEUR: number;
  qty: number;
};

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "El pago todavía no está configurado. Añade tu clave de Stripe (STRIPE_SECRET_KEY) en Vercel para activarlo.",
      },
      { status: 200 }
    );
  }

  const stripe = new Stripe(key);

  const body = await req.json();
  const items: IncomingItem[] = body.items || [];

  if (!items.length) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: Math.round(item.priceEUR * 100),
        },
        quantity: item.qty,
      })),
      shipping_address_collection: { allowed_countries: ["ES", "PT", "FR", "IT", "DE"] },
      success_url: `${origin}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo crear la sesión de pago." },
      { status: 500 }
    );
  }
}
