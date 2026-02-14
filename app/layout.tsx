import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
// import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
// import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio | Micheal",
  description: "Personal portfolio of Micheal Akingbade",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add inline script to set initial theme */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <Script id="theme-script" strategy="beforeInteractive">
          {`
            // Check for saved theme preference or prefer-color-scheme
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Apply dark mode if saved as dark or not saved but prefers dark
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexClientProvider>
            <Providers>

              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </Providers>
          </ConvexClientProvider>

        </ClerkProvider>
      </body>
    </html>
  );
}
