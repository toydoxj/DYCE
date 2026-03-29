"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Project, FilterOptions } from "@/types";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectTable } from "./ProjectTable";
import { ViewToggle } from "./ViewToggle";
import { ProjectFilter } from "./ProjectFilter";

interface ProjectListClientProps {
  projects: Project[];
  filterOptions: FilterOptions;
}

export function ProjectListClient({ projects, filterOptions }: ProjectListClientProps) {
  const [view, setView] = useState<"gallery" | "table">("gallery");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const usage = searchParams.get("usage") ?? "";
  const structureType = searchParams.get("structureType") ?? "";
  const status = searchParams.get("status") ?? "";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname, startTransition]);

  return (
    <div>
      <ProjectFilter
        filterOptions={filterOptions}
        usage={usage}
        structureType={structureType}
        status={status}
        setFilter={setFilter}
        clearFilters={clearFilters}
      />

      <div className={`mt-8 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isPending ? (
              "불러오는 중..."
            ) : (
              <>총 <span className="font-semibold text-navy">{projects.length}</span>건</>
            )}
          </p>
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {view === "gallery" ? (
          <ProjectGallery projects={projects} />
        ) : (
          <ProjectTable projects={projects} />
        )}
      </div>
    </div>
  );
}
