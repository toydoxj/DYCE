import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center bg-navy">
      {/* 배경 이미지 */}
      <Image
        src="/hero-main.png"
        alt="동양구조 프로젝트"
        fill
        className="object-cover"
        priority
      />
      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-navy/75" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-brand uppercase">
            Since 1981
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            구조설계 및
            <br />
            안전진단 전문업체
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            40여 년의 경험과 기술력으로 건축물의 안전을 설계합니다.
            <br className="hidden sm:block" />
            최적화된 구조 솔루션을 제공하는{" "}
            <span className="text-brand font-semibold">(주)동양구조</span>
            입니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/business"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              사업분야 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/30 px-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
