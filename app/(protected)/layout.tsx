"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn, handleMutation } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contributors",
    href: "/contributors",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSignOut, setOpenSignOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast('Success', {
        description: 'Sign Out successful'
      })
      setOpenSignOut(false)
      router.push("/");
      router.refresh();
    },
    onError: (error: any) => {
      toast(
        "Error",
        { description: error.message || "Failed to sign out", }
      );
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="bg-background/80 backdrop-blur-sm"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 z-40 h-screen pt-20 transition-all duration-300 ease-in-out bg-card border-r border-border",
          sidebarCollapsed ? "w-16" : "w-64",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar toggle button - Desktop only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-16 bg-red-400 z-50 rounded-full border bg-background p-1.5 shadow-md hidden lg:flex",
            "hover:bg-accent"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Sidebar content */}
        <div className="flex flex-col h-full px-3 py-6">
          {/* Navigation items */}
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0")} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>


          <div className="flex">
            <AlertDialog open={openSignOut} onOpenChange={setOpenSignOut}>
              <AlertDialogTrigger asChild>

                <Button
                  variant='outline'
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center  gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  {!sidebarCollapsed && (
                    <span className="truncate">Sign Out</span>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your account and redirected to the
                    homepage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={() => handleMutation(signOutMutation)}
                    disabled={signOutMutation.isPending}
                  >
                    {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-20",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <div className="px-4 lg:px-6">{children}</div>
      </main>
    </div>
  );
}
