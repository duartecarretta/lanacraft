import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteData } from "@/lib/site-data";
import AdminLogin from "./AdminLogin";
import AdminEditor from "./AdminEditor";

export const instant = false;

export const metadata = { title: "Panel de administración — Atelier Sayuri" };

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  const data = await getSiteData();
  return <AdminEditor initialData={data} />;
}
