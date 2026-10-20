import { connection } from "next/server";
import { getLocale } from "@/lib/get-locale";
import CartClient from "./CartClient";

export default async function CartPage() {
  await connection();
  const locale = await getLocale();
  return <CartClient locale={locale} />;
}
