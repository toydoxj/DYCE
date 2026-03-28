import { Card, CardContent } from "@/components/ui/card";
import { BusinessService } from "@/types";

interface BusinessCardProps {
  service: BusinessService;
}

export function BusinessCard({ service }: BusinessCardProps) {
  return (
    <Card className="border transition-all hover:border-gold/30 hover:shadow-sm">
      <CardContent className="p-5">
        <h3 className="font-semibold text-navy">{service.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {service.description}
        </p>
      </CardContent>
    </Card>
  );
}
