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
    label: "Years of Experience",
  },
  {
    icon: Building,
    value: "4.5M",
    label: "설계면적 (m²)",
  },
  {
    icon: Award,
    value: "50+",
    label: "수상 실적",
  },
];

export function CompanyInfo() {
  return (
    <section className="bg-navy py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
                <stat.icon className="h-5 w-5 text-brand-light" />
              </div>
              <p className="mt-5 font-heading text-4xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
