import { GoogleAdSense } from "@/shared/lib/google/GoogleAdSense";
import { ThemeProvider } from "@/shared/lib/theme";
import { Footer } from "@/shared/ui/Footer";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
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
  title: "무료 사주 운세 추천 | 2026 신년운세, 오늘의 운세, 만세력 - 운명의 나침반",
  description: "정확한 명리학 분석으로 무료 사주와 운세를 확인하세요. 2026년 병오년 신년운세, 오늘의 운세, 전문적인 만세력 분석을 통해 당신의 인생 지도를 그려드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string} />
          <GoogleAdSense pid={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID as string} />
          <ThemeToggle />
          <main style={{ overflowX: "hidden", flex: 1 }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
