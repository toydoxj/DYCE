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
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : isHome
            ? "bg-transparent"
            : "bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/dongyang_logo.svg"
              alt="동양구조 로고"
              width={40}
              height={40}
              className="h-9 w-9 lg:h-10 lg:w-10"
            />
            <div className="flex flex-col">
              <span className={`text-lg font-bold lg:text-xl ${isTransparent ? "text-white" : "text-navy"}`}>
                (주)동양구조
              </span>
              <span className={`hidden text-[10px] tracking-wider sm:block ${isTransparent ? "text-white/60" : "text-navy/60"}`}>
                Dongyang Consulting Engineers
              </span>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-brand"
                    : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-navy/80 hover:text-navy hover:bg-navy/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 */}
          <MobileNav isTransparent={isTransparent} />
        </div>
      </div>
    </header>
  );
}
