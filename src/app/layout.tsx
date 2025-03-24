import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Toaster } from "@/components/ui/sonner"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MarkMe",
  description: "MarkMe - AI Powered AMS",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedIn >
            <SidebarProvider>
              <AppSidebar  />
              <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 m-2">
                  <div className="flex items-center gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumbs></Breadcrumbs>
                    <div className="grow"></div>
                    <UserButton showName></UserButton>
                  </div>
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </SignedIn>
          <SignedOut>
            <div className="grid h-dvh place-items-center">
              <SignIn routing="hash"></SignIn>
            </div>
          </SignedOut>
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
