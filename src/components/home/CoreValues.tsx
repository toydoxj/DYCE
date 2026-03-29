import { Lightbulb, Handshake, Cpu, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/FadeIn";

const values = [
  {
    icon: Lightbulb,
    title: "최적화된 솔루션",
    subtitle: "Optimized Solution",
    description:
      "수십 년간 축적된 데이터와 고도화된 구조 해석 능력을 바탕으로, 최고 수준의 안전성을 보장함과 동시에 VE(Value Engineering)를 통한 경제적인 설계를 제공합니다.",
    tag: "VE",
  },
  {
    icon: Handshake,
    title: "적극적인 협력",
    subtitle: "Collaborative Partnership",
    description:
      "건축사, 시공사 및 발주처와의 긴밀한 파트너십을 구축하며, BIM 등 첨단 협업 도구를 활용하여 설계 초기 단계부터 최적의 구조 엔지니어링 서비스를 제공합니다.",
    tag: "BIM",
  },
  {
    icon: Cpu,
    title: "최신 기술과 지식",
    subtitle: "Advanced Technology",
    description:
      "끊임없는 연구와 학습으로 최신 구조공학 기술과 해석 기법을 실무에 적용하며, 자체 프로그램 개발을 통해 설계 품질과 효율성을 극대화합니다.",
    tag: "R&D",
  },
  {
    icon: ShieldCheck,
    title: "신뢰와 책임",
    subtitle: "Trust & Responsibility",
    description:
      "철저한 품질 관리(QA/QC) 체계와 도면 검토 프로세스를 통해 프로젝트의 시작부터 끝까지 구조 안전에 대한 무한한 책임을 다합니다.",
    tag: "QA/QC",
  },
];

export function CoreValues() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-brand bg-brand/10 border-none">
              Core Values
            </Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              핵심 가치
            </h2>
            <p className="mt-3 text-muted-foreground">
              안전을 넘어 혁신을 구조하다, 동양구조의 핵심 가치
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((value, i) => (
            <FadeIn key={value.title} delay={Math.min(i + 1, 3) as 1 | 2 | 3}>
              <Card className="group h-full border-none bg-muted/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/10 transition-colors group-hover:bg-brand/10">
                      <value.icon className="h-6 w-6 text-navy transition-colors group-hover:text-brand" />
                    </div>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {value.tag}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-brand font-medium">
                    {value.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
