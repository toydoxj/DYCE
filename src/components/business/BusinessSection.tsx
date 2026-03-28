import { BusinessArea } from "@/types";
import {
  Building2,
  Shield,
  Landmark,
  FileCheck,
  Layers,
  Home,
  Building,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  TrainFront,
  Factory,
  Scale,
  HardHat,
  ClipboardCheck,
  Siren,
  Wrench,
  ScrollText,
  Boxes,
  MoveHorizontal,
  Globe,
  ShieldCheck,
  Hammer,
  Activity,
  Target,
  PanelTop,
  Headset,
  FileWarning,
} from "lucide-react";
import { BusinessCard } from "./BusinessCard";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Shield,
  Landmark,
  FileCheck,
};

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // 건축구조설계 - 용도별
  "복합시설": Layers,
  "주거시설": Home,
  "공공시설": Building,
  "업무시설": Briefcase,
  "판매시설": ShoppingBag,
  "교육시설": GraduationCap,
  "의료시설": HeartPulse,
  "교통시설": TrainFront,
  "산업시설": Factory,
  // 구조안전진단·점검
  "시설물의안전및유지관리에관한특별법에 의한 정밀안전진단(점검)": Scale,
  "리모델링을 위한 정밀안전진단(점검)": HardHat,
  "건축물 유지관리를 위한 정밀안전진단(점검)": ClipboardCheck,
  "해체계획을 위한 정밀안전진단(점검)": Wrench,
  "긴급 정밀안전진단(점검)": Siren,
  "기타 정밀안전진단(점검)": ScrollText,
  // 특수구조설계
  "모듈러 건축 구조 설계": Boxes,
  "장경간 구조 설계": MoveHorizontal,
  "해외 건축 구조 설계": Globe,
  "비구조요소 내진 설계": ShieldCheck,
  "가설 구조 설계": Hammer,
  // 상세구조업무
  "기존 건축물의 내진성능평가 및 보강": Activity,
  "성능기반 내진설계": Target,
  "비구조요소 내진설계": PanelTop,
  "현장기술지원": Headset,
  "관계기술자 협력(구조감리)": ClipboardCheck,
  "해체계획서 작성 및 해체감리": FileWarning,
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

        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          {area.description.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {area.services.map((service) => (
            <BusinessCard
              key={service.title}
              service={service}
              icon={serviceIconMap[service.title]}
            />
          ))}
        </div>

        {area.serviceGroups?.map((group) => (
          <div key={group.label} className="mt-12">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy">
              <span className="h-5 w-1 rounded-full bg-brand" />
              {group.label}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.services.map((service) => (
                <BusinessCard
                  key={service.title}
                  service={service}
                  icon={serviceIconMap[service.title]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
