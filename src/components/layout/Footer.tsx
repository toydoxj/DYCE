import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 회사 정보 */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="동양구조 로고"
                width={36}
                height={36}
                className="h-9 w-9 brightness-0 invert"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{COMPANY.name}</h3>
                <p className="text-xs text-white/50">{COMPANY.nameEn}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              {COMPANY.address}
            </p>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="font-semibold text-white">연락처</h4>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>{COMPANY.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <span>{COMPANY.email}</span>
              </div>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="font-semibold text-white">바로가기</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-gold transition-colors">
                회사소개
              </Link>
              <Link href="/business" className="hover:text-gold transition-colors">
                사업분야
              </Link>
              <Link href="/projects" className="hover:text-gold transition-colors">
                프로젝트 실적
              </Link>
              <Link href="/contact" className="hover:text-gold transition-colors">
                문의하기
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          {COMPANY.copyright}
        </div>
      </div>
    </footer>
  );
}
