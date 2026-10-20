import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteData, saveSiteData, type SiteData } from "@/lib/site-data";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let data: SiteData;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    await saveSiteData(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "No se pudo guardar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
