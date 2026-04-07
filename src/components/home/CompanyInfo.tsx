import Link from "next/link";
import { Building, Award, FileText, Users } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "2,500+",
    label: "수행 프로젝트",
  },
  {
    icon: Users,
    value: "40+",
    label: "업력 (년)",
  },
  {
    icon: Building,
    value: "500M+",
    label: "설계면적 (m²)",
  },
  {
    icon: Award,
    value: "10+",
    label: "수상 실적",
  },
];

export function CompanyInfo() {
  return (
    <section className="bg-navy py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wide text-brand-light/90">
            TRUSTED BY EXPERIENCE
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
            숫자로 증명되는 동양구조의 신뢰
          </h2>
          <p className="mt-3 text-sm text-white/60">
            다양한 용도의 건축물에서 검증된 구조설계 경험으로 프로젝트 리스크를 줄입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                <stat.icon className="h-5 w-5 text-brand-light" />
              </div>
              <p className="mt-5 font-heading text-4xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-5 text-center backdrop-blur-sm sm:px-8">
          <p className="text-sm text-white/80 sm:text-base">
            구조 안전, 공사비, 공기까지 함께 고민하는 파트너가 필요하신가요?
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-brand-light"
          >
            지금 상담 요청하기
          </Link>
        </div>
      </div>
    </section>
  );
}
