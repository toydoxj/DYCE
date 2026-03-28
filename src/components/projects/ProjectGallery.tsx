import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
