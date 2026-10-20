import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const nombre = formData.get("nombre")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const mensaje = formData.get("mensaje")?.toString() || "";
  const foto = formData.get("foto") as File | null;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  // If email isn't configured yet, still acknowledge receipt so the form
  // works end-to-end during development. Configure RESEND_API_KEY and
  // CONTACT_TO_EMAIL in Vercel to actually deliver these messages.
  if (!apiKey || !toEmail) {
    console.log("Contact form submission (email not configured):", {
      nombre,
      email,
      mensaje,
      foto: foto?.name,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const attachments = [];
    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      attachments.push({ filename: foto.name, content: buffer });
    }

    await resend.emails.send({
      from: "Atelier Sayuri <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      text: `De: ${nombre} (${email})\n\n${mensaje}`,
      attachments,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el mensaje." },
      { status: 500 }
    );
  }
}
