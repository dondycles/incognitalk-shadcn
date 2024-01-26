import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
import QueryProvider from "@/components/QueryProvider";
export const metadata: Metadata = {
  title: "incognitalk.",
  description: "incognitalk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-outfit text-sm sm:text-base`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
