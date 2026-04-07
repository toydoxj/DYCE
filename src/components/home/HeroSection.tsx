import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Clock3, Users2 } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "안전 최우선 설계",
    description: "성능기반 내진·내풍 검토를 통한 구조 안정성 확보",
  },
  {
    icon: Clock3,
    title: "초기 단계부터 빠른 대응",
    description: "계획·실시설계 전 과정에서 일정 지연 리스크 최소화",
  },
  {
    icon: Users2,
    title: "협업 중심 엔지니어링",
    description: "건축사·시공사·발주처와의 유기적 커뮤니케이션",
  },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center bg-navy">
      <Image
        src="/hero-main.png"
        alt="동양구조 프로젝트"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-flex items-center rounded-full bg-brand/15 px-4 py-1.5 text-xs font-semibold text-brand-light backdrop-blur-sm">
            Since 1981 · 40년 이상 구조설계 전문기업
          </span>

          <h1 className="mt-8 font-heading text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
            건축의 신뢰를 설계하다.
            <br />
            <span className="text-brand-light">더 안전하고, 더 합리적인</span>
            <br />
            구조 엔지니어링 파트너
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            (주)동양구조는 40여 년간 축적한 실무 데이터와 고도화된 구조 해석 역량으로,
            프로젝트의 안전성과 경제성을 동시에 실현합니다.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-light px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-shadow hover:shadow-xl hover:shadow-brand/35"
            >
              프로젝트 문의하기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/20"
            >
              수행실적 보기
            </Link>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-brand-light">
                  <point.icon className="h-4 w-4" />
                  <p className="text-sm font-semibold text-white">{point.title}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/20 pt-1.5">
          <div className="h-1.5 w-1 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
