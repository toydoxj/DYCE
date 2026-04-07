"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/navigation";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "glass shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/dongyang_logo.svg"
              alt="동양구조 로고"
              width={36}
              height={36}
              className="h-8 w-8 lg:h-9 lg:w-9"
            />
            <span
              className={`font-heading text-xl font-extrabold tracking-tight ${
                isTransparent ? "text-white" : "text-navy"
              }`}
            >
              DYCE
            </span>
            <span
              className={`hidden rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:inline-block ${
                isTransparent
                  ? "bg-white/15 text-white/80"
                  : "bg-brand/10 text-brand"
              }`}
            >
              Engineering
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                  pathname === item.href
                    ? "text-brand"
                    : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate hover:text-navy hover:bg-surface"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`ml-3 rounded-full px-5 py-2 text-[13px] font-semibold transition-all ${
                isTransparent
                  ? "bg-white text-navy hover:bg-white/90"
                  : "bg-gradient-to-r from-brand to-brand-light text-white hover:shadow-md"
              }`}
            >
              문의하기
            </Link>
          </nav>

          {/* 모바일 메뉴 */}
          <MobileNav isTransparent={isTransparent} />
        </div>
      </div>
    </header>
  );
}
