import { Lightbulb, Handshake, Cpu } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const values = [
  {
    icon: Lightbulb,
    title: "최적화된 솔루션",
    titleEn: "Structural Solutions",
    description:
      "수십 년간 축적된 데이터와 고도화된 구조 해석 능력을 바탕으로, 최고 수준의 안전성과 VE(Value Engineering)를 통한 경제적 설계를 제공합니다.",
  },
  {
    icon: Handshake,
    title: "혁신 기반 협업",
    titleEn: "Innovation-Driven",
    description:
      "건축사, 시공사 및 발주처와의 긴밀한 파트너십을 구축하며, BIM 등 첨단 도구를 활용하여 설계 초기부터 최적의 엔지니어링 서비스를 제공합니다.",
  },
  {
    icon: Cpu,
    title: "최신 기술과 지식",
    titleEn: "Advanced Technology",
    description:
      "끊임없는 연구와 학습으로 최신 구조공학 기술과 해석 기법을 실무에 적용하며, 자체 프로그램 개발을 통해 설계 품질을 극대화합니다.",
  },
];

export function CoreValues() {
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              핵심 가치
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              프로젝트 성공을 만드는 3가지 기준
            </h2>
            <p className="mt-2 text-xs font-medium tracking-wide text-slate/50">
              3 Principles for Reliable Structural Engineering
            </p>
            <p className="mt-3 text-slate">
              발주처와 사용자가 체감하는 성과 중심으로 구조 엔지니어링을 수행합니다.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {values.map((value, i) => (
            <FadeIn key={value.title} delay={Math.min(i + 1, 3) as 1 | 2 | 3}>
              <div className="group rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-brand/10">
                  <value.icon className="h-6 w-6 text-navy transition-colors group-hover:text-brand" />
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold text-navy">
                  {value.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-slate/40">
                  {value.titleEn}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate">
                  {value.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
