import { connection } from "next/server";
import { getLocale } from "@/lib/get-locale";
import SuccessClient from "./SuccessClient";

export default async function SuccessPage() {
  await connection();
  const locale = await getLocale();
  return <SuccessClient locale={locale} />;
}
