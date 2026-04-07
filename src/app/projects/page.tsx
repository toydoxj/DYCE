import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { ProjectListClient } from "@/components/projects";
import { getProjects, getFilterOptions } from "@/lib/notion";

export const revalidate = 3600; // ISR: 1시간마다 재검증

export const metadata: Metadata = {
  title: "수행실적",
  description:
    "(주)동양구조의 수행실적입니다. 공동주택, 업무시설, 교육연구시설 등 다양한 분야의 구조설계 실적을 확인하세요.",
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
        title="수행실적"
        subtitle="2,500+ 프로젝트, 다양한 분야의 구조설계 및 안전진단 실적"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectListClient projects={projects} filterOptions={filterOptions} />
        </div>
      </section>
    </>
  );
}
