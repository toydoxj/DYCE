import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight, Building2, Shield, Landmark, FileCheck } from "lucide-react";
import { businessAreas } from "@/data/business";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Shield,
  Landmark,
  FileCheck,
};

export function BusinessPreview() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
                Services
              </span>
              <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Integrated Engineering Services
              </h2>
              <p className="mt-3 text-slate">
                전문적인 구조 엔지니어링 서비스를 제공합니다
              </p>
            </div>
            <Link
              href="/business"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-surface-high"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {businessAreas.map((area, i) => {
            const Icon = iconMap[area.icon];
            return (
              <FadeIn key={area.id} delay={Math.min(i + 1, 3) as 1 | 2 | 3}>
                <Link href={`/business#${area.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-surface-low p-8 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1">
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-brand-light">
                        {Icon && <Icon className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-bold text-navy">
                          {area.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-brand">
                          {area.subtitle}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate line-clamp-2">
                          {area.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-xs font-medium text-navy/50 transition-colors group-hover:text-brand">
                      자세히 보기
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
