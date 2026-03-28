import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "(주)동양구조 | 구조설계 및 안전진단 전문업체",
    template: "%s | (주)동양구조",
  },
  description:
    "1981년 설립된 구조설계 및 안전진단 전문업체 (주)동양구조입니다. 건축구조설계, 구조안전진단, 특수구조설계, 상세구조업무 서비스를 제공합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "(주)동양구조",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
