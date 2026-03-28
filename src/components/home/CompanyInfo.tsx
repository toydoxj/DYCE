import { Building, Award, FileText } from "lucide-react";

const infoItems = [
  {
    icon: Building,
    label: "대표이사",
    value: "김효진",
  },
  {
    icon: FileText,
    label: "사업자등록번호",
    value: "120-81-47622",
  },
  {
    icon: Award,
    label: "안전진단전문기관",
    value: "제15호",
  },
];

export function CompanyInfo() {
  return (
    <section className="bg-navy py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-xs text-white/50">{item.label}</p>
                <p className="text-lg font-semibold text-white">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
