import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dyce.kr"),
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
    <html lang="ko" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
