import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout";
import { ProjectFilter, ProjectListClient } from "@/components/projects";
import { getProjects, getFilterOptions } from "@/lib/notion";

export const revalidate = 3600; // ISR: 1시간마다 재검증

export const metadata: Metadata = {
  title: "프로젝트 실적",
  description:
    "(주)동양구조의 프로젝트 실적입니다. 공동주택, 업무시설, 교육연구시설 등 다양한 분야의 구조설계 실적을 확인하세요.",
};

interface ProjectsPageProps {
  searchParams: Promise<{
    usage?: string;
    structureType?: string;
    status?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;

  const [projects, filterOptions] = await Promise.all([
    getProjects({
      usage: params.usage,
      structureType: params.structureType,
      status: params.status,
    }),
    getFilterOptions(),
  ]);

  return (
    <>
      <PageHero
        title="프로젝트 실적"
        subtitle="다양한 분야의 구조설계 및 안전진단 실적"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <ProjectFilter filterOptions={filterOptions} />
          </Suspense>

          <div className="mt-8">
            <ProjectListClient projects={projects} />
          </div>
        </div>
      </section>
    </>
  );
}
