import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { Building, Ruler, Layers } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 block">
      {project.coverImage && (
        <div className="relative h-52 w-full overflow-hidden bg-surface">
          <Image
            src={project.coverImage}
            alt={project.projectName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-navy line-clamp-2">
            {project.projectName}
          </h3>
          {project.status && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full bg-brand/10 text-brand text-xs border-none"
            >
              {project.status}
            </Badge>
          )}
        </div>

        {project.address && (
          <p className="mt-2 text-xs text-slate line-clamp-1">
            {project.address}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {project.usage.map((u) => (
            <Badge key={u} variant="outline" className="rounded-full text-xs font-normal border-surface-high">
              {u}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {project.aboveGroundFloors !== null && (
            <div className="rounded-xl bg-surface px-2 py-2">
              <Building className="mx-auto mb-0.5 h-3.5 w-3.5 text-slate" />
              <span className="text-slate">
                지상 {project.aboveGroundFloors}층
              </span>
            </div>
          )}
          {project.height !== null && (
            <div className="rounded-xl bg-surface px-2 py-2">
              <Ruler className="mx-auto mb-0.5 h-3.5 w-3.5 text-slate" />
              <span className="text-slate">
                {project.height.toLocaleString()}m
              </span>
            </div>
          )}
          {project.totalFloorArea !== null && (
            <div className="rounded-xl bg-surface px-2 py-2">
              <Layers className="mx-auto mb-0.5 h-3.5 w-3.5 text-slate" />
              <span className="text-slate">
                {project.totalFloorArea.toLocaleString()}m²
              </span>
            </div>
          )}
        </div>

        {project.structureType.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.structureType.map((s) => (
              <span key={s} className="text-xs font-medium text-brand">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
