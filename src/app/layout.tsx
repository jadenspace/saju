import { GoogleAdSense } from "@/shared/lib/google/GoogleAdSense";
import { ThemeProvider } from "@/shared/lib/theme";
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
  title:
    "무료 사주 운세 추천 | 2026 신년운세, 오늘의 운세, 만세력 - 오늘의 운세는",
  description:
    "정확한 명리학 분석으로 무료 사주와 운세를 확인하세요. 2026년 병오년 신년운세, 오늘의 운세, 전문적인 만세력 분석을 통해 당신의 인생 지도를 그려드립니다.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Pretendard 폰트 - preconnect로 DNS/연결 선제 수립, preload로 병렬 로딩 */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string}
          />
          <GoogleAdSense
            pid={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID as string}
          />
          <main style={{ overflowX: "hidden", flex: 1 }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
