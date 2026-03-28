"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectTable } from "./ProjectTable";
import { ViewToggle } from "./ViewToggle";

interface ProjectListClientProps {
  projects: Project[];
}

export function ProjectListClient({ projects }: ProjectListClientProps) {
  const [view, setView] = useState<"gallery" | "table">("gallery");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-navy">{projects.length}</span>건
        </p>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {view === "gallery" ? (
        <ProjectGallery projects={projects} />
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  );
}
