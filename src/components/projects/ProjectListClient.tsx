"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Project, FilterOptions } from "@/types";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectTable } from "./ProjectTable";
import { ViewToggle } from "./ViewToggle";
import { ProjectFilter } from "./ProjectFilter";

const PAGE_SIZE = 24;

interface ProjectListClientProps {
  projects: Project[];
  filterOptions: FilterOptions;
}

export function ProjectListClient({ projects, filterOptions }: ProjectListClientProps) {
  const [view, setView] = useState<"gallery" | "table">("gallery");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const usage = searchParams.get("usage") ?? "";
  const structureType = searchParams.get("structureType") ?? "";
  const status = searchParams.get("status") ?? "";

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const paginatedProjects = useMemo(
    () => projects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [projects, currentPage]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      setCurrentPage(1);
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname, startTransition]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지 번호 목록 생성 (최대 7개 표시)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 3);
      const end = Math.min(totalPages, start + maxVisible - 1);
      const adjustedStart = Math.max(1, end - maxVisible + 1);
      for (let i = adjustedStart; i <= end; i++) pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

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
          <ProjectGallery projects={paginatedProjects} />
        ) : (
          <ProjectTable projects={paginatedProjects} />
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-slate transition-colors hover:bg-surface"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="flex h-9 w-9 items-center justify-center text-sm text-slate/40">...</span>
                )}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-navy text-white"
                    : "text-slate hover:bg-surface"
                }`}
              >
                {page}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="flex h-9 w-9 items-center justify-center text-sm text-slate/40">...</span>
                )}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-slate transition-colors hover:bg-surface"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
