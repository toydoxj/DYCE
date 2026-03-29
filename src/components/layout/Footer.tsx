import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 회사 정보 */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/dongyang_logo.svg"
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
            <div className="mt-4 space-y-3 text-sm">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="flex items-center gap-2 transition-colors hover:text-brand-light w-fit"
                    />
                  }
                >
                  <Phone className="h-4 w-4 text-brand" />
                  <span>{COMPANY.phone}</span>
                </TooltipTrigger>
                <TooltipContent>전화 걸기</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="flex items-center gap-2 transition-colors hover:text-brand-light w-fit"
                    />
                  }
                >
                  <Mail className="h-4 w-4 text-brand" />
                  <span>{COMPANY.email}</span>
                </TooltipTrigger>
                <TooltipContent>이메일 보내기</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="font-semibold text-white">바로가기</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-brand-light transition-colors w-fit">
                회사소개
              </Link>
              <Link href="/business" className="hover:text-brand-light transition-colors w-fit">
                사업분야
              </Link>
              <Link href="/projects" className="hover:text-brand-light transition-colors w-fit">
                수행실적
              </Link>
              <Link href="/contact" className="hover:text-brand-light transition-colors w-fit">
                문의하기
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="mt-10 bg-white/10" />
        <p className="pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {COMPANY.copyrightName}
        </p>
      </div>
    </footer>
  );
}
