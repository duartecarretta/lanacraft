import { connection } from "next/server";
import { getLocale } from "@/lib/get-locale";
import ContactClient from "./ContactClient";

export default async function ContactPage() {
  await connection();
  const locale = await getLocale();
  return <ContactClient locale={locale} />;
}
