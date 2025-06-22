import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdmin } from "@/app/actions/auth";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const { data, error } = await getAdmin();

  if (error || !data) {
    redirect("/login?redirect=/dashboard");
  }

  const user = data.user;

  return (
    <div className="py-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>

        </div>
      </div>

      <DashboardClient user={user} />
    </div>
  );
}
