import { Lightbulb, Handshake, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/FadeIn";

const values = [
  {
    icon: Lightbulb,
    title: "최적화된 솔루션",
    description:
      "축적된 경험과 최신 기술을 결합하여 안전성과 경제성을 동시에 확보하는 최적의 구조 솔루션을 제공합니다.",
  },
  {
    icon: Handshake,
    title: "적극적인 협력",
    description:
      "건축사, 시공사 등 프로젝트 참여자들과의 긴밀한 소통과 협력을 통해 최고의 결과물을 만들어냅니다.",
  },
  {
    icon: Cpu,
    title: "최신 기술과 지식",
    description:
      "끊임없는 연구와 학습으로 최신 구조공학 기술과 설계 기법을 실무에 적용합니다.",
  },
];

export function CoreValues() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              핵심 가치
            </h2>
            <p className="mt-3 text-muted-foreground">
              동양구조가 추구하는 가치입니다
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <FadeIn key={value.title} delay={(i + 1) as 1 | 2 | 3}>
              <Card className="h-full border-none bg-muted/50 transition-all hover:shadow-md hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/10">
                    <value.icon className="h-6 w-6 text-navy" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
