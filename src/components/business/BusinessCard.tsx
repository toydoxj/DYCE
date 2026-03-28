import { Card, CardContent } from "@/components/ui/card";
import { BusinessService } from "@/types";

interface BusinessCardProps {
  service: BusinessService;
  icon?: React.ComponentType<{ className?: string }>;
}

export function BusinessCard({ service, icon: Icon }: BusinessCardProps) {
  return (
    <Card className="border transition-all hover:border-brand/30 hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
              <Icon className="h-4.5 w-4.5 text-brand" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-navy">{service.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
