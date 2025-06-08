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
      {/* Server-rendered header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
            {/* Sign out will be handled in client component */}
          </div>
        </div>
      </div>

      {/* Client component for interactive functionality */}
      <DashboardClient user={user} />
    </div>
  );
}
