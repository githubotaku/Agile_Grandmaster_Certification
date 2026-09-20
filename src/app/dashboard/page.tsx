import { redirect } from "next/navigation";

// The dashboard now lives on the home page.
export default function DashboardPage() {
  redirect("/");
}
