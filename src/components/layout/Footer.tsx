import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* 회사 정보 */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/dongyang_logo.svg"
                alt="동양구조 로고"
                width={32}
                height={32}
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="font-heading text-xl font-extrabold text-white tracking-tight">
                DYCE
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              1981년 설립된 구조설계 및 안전진단 전문업체.
              40여 년의 경험과 기술력으로 건축물의 안전을 설계합니다.
            </p>
          </div>

          {/* 연락처 */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              Contact
            </h4>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center gap-3 transition-colors hover:text-brand-light"
              >
                <Phone className="h-4 w-4 text-brand/70" />
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 transition-colors hover:text-brand-light"
              >
                <Mail className="h-4 w-4 text-brand/70" />
                {COMPANY.email}
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand/70" />
                <span>{COMPANY.address}</span>
              </div>
            </div>
          </div>

          {/* 바로가기 */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              Menu
            </h4>
            <nav className="mt-5 flex flex-col gap-2.5 text-sm text-white/60">
              <Link href="/about" className="hover:text-white transition-colors w-fit">
                회사소개
              </Link>
              <Link href="/business" className="hover:text-white transition-colors w-fit">
                사업분야
              </Link>
              <Link href="/projects" className="hover:text-white transition-colors w-fit">
                수행실적
              </Link>
              <Link href="/location" className="hover:text-white transition-colors w-fit">
                오시는 길
              </Link>
            </nav>
          </div>

          {/* 법적 */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30">
              Legal
            </h4>
            <div className="mt-5 space-y-2.5 text-sm text-white/60">
              <p>사업자등록번호</p>
              <p className="text-white/40">211-81-98082</p>
              <p className="mt-3">대표이사</p>
              <p className="text-white/40">김효진</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.06] pt-6">
          <p className="text-center text-xs text-white/25">
            © {new Date().getFullYear()} {COMPANY.copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}
