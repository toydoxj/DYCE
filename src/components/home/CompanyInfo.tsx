import { Building, Award, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const infoItems = [
  {
    icon: Building,
    label: "대표이사",
    value: "김효진",
  },
  {
    icon: FileText,
    label: "사업자등록번호",
    value: "211-81-98082",
  },
  {
    icon: Award,
    label: "안전진단전문기관",
    value: "제15호",
    badge: true,
  },
];

export function CompanyInfo() {
  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {infoItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <item.icon className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-xs text-white/50">{item.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-white">
                    {item.value}
                  </p>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-brand/20 text-brand-light border-none text-[10px]">
                      인증
                    </Badge>
                  )}
                </div>
              </div>
              {index < infoItems.length - 1 && (
                <Separator orientation="vertical" className="ml-auto hidden h-10 bg-white/10 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
