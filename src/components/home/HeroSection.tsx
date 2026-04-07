import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center bg-navy">
      {/* 배경 이미지 */}
      <Image
        src="/hero-main.png"
        alt="동양구조 프로젝트"
        fill
        className="object-cover"
        priority
      />
      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-brand/15 px-4 py-1.5 text-xs font-semibold text-brand-light backdrop-blur-sm">
            Since 1981
          </span>

          <h1 className="mt-8 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Leading Structural
            <br />
            Design &{" "}
            <span className="text-brand-light">Safety</span>
            <br />
            Inspection.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            40여 년의 경험과 기술력으로 건축물의 안전을 설계합니다.
            최적화된 구조 솔루션을 제공하는 (주)동양구조입니다.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-brand to-brand-light px-8 py-6 text-sm font-semibold text-white shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 transition-shadow"
              render={<Link href="/business" />}
            >
              사업분야 보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 px-8 py-6 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10 hover:text-white hover:border-white/30"
              render={<Link href="/projects" />}
            >
              수행실적
            </Button>
          </div>
        </div>
      </div>

      {/* 하단 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/20 pt-1.5">
          <div className="h-1.5 w-1 animate-bounce rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
