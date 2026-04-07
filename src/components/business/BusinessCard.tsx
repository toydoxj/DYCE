import { BusinessService } from "@/types";

interface BusinessCardProps {
  service: BusinessService;
  icon?: React.ComponentType<{ className?: string }>;
}

export function BusinessCard({ service, icon: Icon }: BusinessCardProps) {
  return (
    <div className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-brand/10">
            <Icon className="h-4 w-4 text-navy transition-colors group-hover:text-brand" />
          </div>
        )}
        <div>
          <h3 className="font-heading text-sm font-bold text-navy">{service.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
