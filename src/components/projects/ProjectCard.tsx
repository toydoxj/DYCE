import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { Building, Ruler, Layers } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="border transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-navy line-clamp-2">
            {project.projectName}
          </h3>
          {project.status && (
            <Badge
              variant="secondary"
              className="shrink-0 text-xs"
            >
              {project.status}
            </Badge>
          )}
        </div>

        {project.address && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
            {project.address}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {project.usage.map((u) => (
            <Badge key={u} variant="outline" className="text-xs font-normal">
              {u}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {project.aboveGroundFloors !== null && (
            <div className="rounded bg-muted/50 px-2 py-1.5">
              <Building className="mx-auto mb-0.5 h-3.5 w-3.5 text-navy/60" />
              <span className="text-muted-foreground">
                지상 {project.aboveGroundFloors}층
              </span>
            </div>
          )}
          {project.height !== null && (
            <div className="rounded bg-muted/50 px-2 py-1.5">
              <Ruler className="mx-auto mb-0.5 h-3.5 w-3.5 text-navy/60" />
              <span className="text-muted-foreground">
                {project.height.toLocaleString()}m
              </span>
            </div>
          )}
          {project.totalFloorArea !== null && (
            <div className="rounded bg-muted/50 px-2 py-1.5">
              <Layers className="mx-auto mb-0.5 h-3.5 w-3.5 text-navy/60" />
              <span className="text-muted-foreground">
                {project.totalFloorArea.toLocaleString()}m²
              </span>
            </div>
          )}
        </div>

        {project.structureType.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.structureType.map((s) => (
              <span key={s} className="text-xs text-brand">
                {s}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
