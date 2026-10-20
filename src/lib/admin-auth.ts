import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "sayuri_admin";

function sign(secret: string): string {
  return crypto.createHmac("sha256", secret).update("sayuri-admin-ok").digest("hex");
}

export function adminCookieValue(): string {
  const password = process.env.ADMIN_PASSWORD || "";
  return sign(password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return token === sign(password);
}
