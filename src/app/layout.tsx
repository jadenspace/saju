import { GoogleAdSense } from "@/shared/lib/google/GoogleAdSense";
import { Footer } from "@/shared/ui/Footer";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "운명의 나침반 - 사주 만세력",
  description: "당신의 운명을 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string} />
      <GoogleAdSense />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main style={{ overflowX: "hidden", flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
