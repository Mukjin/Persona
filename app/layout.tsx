import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Persona",
  description: "Build AI personas and chat with them."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <main className="relative py-8 sm:py-10 lg:py-12">{children}</main>
      </body>
    </html>
  );
}
