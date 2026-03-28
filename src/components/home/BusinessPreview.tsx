import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            사업분야
          </h2>
          <p className="mt-3 text-muted-foreground">
            전문적인 구조 엔지니어링 서비스를 제공합니다
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {businessAreas.map((area) => {
            const Icon = iconMap[area.icon];
            return (
              <Card
                key={area.id}
                className="group border transition-all hover:border-gold/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition-colors group-hover:bg-gold">
                      {Icon && <Icon className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-navy">
                        {area.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {area.subtitle}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
          >
            사업분야 자세히 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
