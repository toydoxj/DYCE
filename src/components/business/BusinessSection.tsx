import { BusinessArea } from "@/types";
import { Building2, Shield, Landmark, FileCheck } from "lucide-react";
import { BusinessCard } from "./BusinessCard";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Shield,
  Landmark,
  FileCheck,
};

interface BusinessSectionProps {
  area: BusinessArea;
  index: number;
}

export function BusinessSection({ area, index }: BusinessSectionProps) {
  const Icon = iconMap[area.icon];
  const isAlternate = index % 2 === 1;

  return (
    <section
      id={area.id}
      className={`py-16 sm:py-20 ${isAlternate ? "bg-muted/30" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
            {Icon && <Icon className="h-7 w-7" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy">{area.title}</h2>
            <p className="text-sm text-muted-foreground">{area.subtitle}</p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {area.description}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {area.services.map((service) => (
            <BusinessCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
