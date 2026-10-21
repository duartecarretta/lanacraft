import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteData } from "@/lib/site-data";
import AdminLogin from "../AdminLogin";
import HomeBuilder from "./HomeBuilder";

export const instant = false;

export const metadata = { title: "Construtor visual — Atelier Sayuri" };

export default async function BuilderPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  const data = await getSiteData();
  return <HomeBuilder initialData={data} />;
}
