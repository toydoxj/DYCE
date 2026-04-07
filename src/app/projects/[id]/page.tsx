import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getProjectImages, getRelatedProjects } from "@/lib/notion";
import {
  Briefcase,
  Building,
  Ruler,
  Layers,
  MapPin,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export const revalidate = 3600;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };

  return {
    title: project.projectName,
    description: `${project.projectName} - ${project.usage.join(", ")} | (주)동양구조 수행실적`,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  const [project, images] = await Promise.all([
    getProjectById(id),
    getProjectImages(id),
  ]);

  if (!project) notFound();

  const relatedProjects = await getRelatedProjects(id, project.usage);

  // 기술 데이터 항목
  const specs = [
    {
      icon: Briefcase,
      label: "업무내용",
      value: project.workScope.length > 0 ? project.workScope.join(", ") : null,
    },
    {
      icon: Building,
      label: "규모",
      value:
        project.aboveGroundFloors || project.undergroundFloors
          ? `지상 ${project.aboveGroundFloors ?? "-"}층 / 지하 ${project.undergroundFloors ?? "-"}층`
          : null,
    },
    {
      icon: Ruler,
      label: "높이",
      value: project.height ? `${project.height.toLocaleString()}m` : null,
    },
    {
      icon: Layers,
      label: "연면적",
      value: project.totalFloorArea
        ? `${project.totalFloorArea.toLocaleString()}m²`
        : null,
    },
    {
      icon: Building,
      label: "동수",
      value: project.buildingCount
        ? `${project.buildingCount}동`
        : null,
    },
    {
      icon: MapPin,
      label: "위치",
      value: project.address || null,
    },
    {
      icon: Calendar,
      label: "계약일",
      value: project.contractDate || null,
    },
  ].filter((s) => s.value !== null);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] bg-navy flex items-end">
        {project.coverImage && (
          <>
            <Image
              src={project.coverImage}
              alt={project.projectName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
          </>
        )}

        <div className="relative w-full mx-auto max-w-7xl px-4 pb-16 pt-40 sm:px-6 lg:px-8">
          {/* 목록으로 돌아가기 */}
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            수행실적 목록으로
          </Link>

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/30">
            <Link href="/" className="hover:text-white/60 transition-colors">
              홈
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/projects"
              className="hover:text-white/60 transition-colors"
            >
              수행실적
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/60 line-clamp-1">
              {project.projectName}
            </span>
          </nav>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.usage.map((u) => (
              <span
                key={u}
                className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-light backdrop-blur-sm"
              >
                {u}
              </span>
            ))}
            {project.status && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                {project.status}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.projectName}
          </h1>

          {project.address && (
            <p className="mt-4 flex items-center gap-2 text-base text-white/50">
              <MapPin className="h-4 w-4" />
              {project.address}
            </p>
          )}
        </div>
      </section>

      {/* Technical Data */}
      {specs.length > 0 && (
        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
                제원
              </span>
              <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-navy">
                  기술 데이터
                </h2>
                <p className="mt-0.5 text-xs font-medium tracking-wide text-slate/50">
                  Technical Data
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start gap-4 rounded-2xl bg-white p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
                    <spec.icon className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate">
                      {spec.label}
                    </p>
                    <p className="mt-1 font-heading text-base font-bold text-navy">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 구조형식 */}
            {project.structureType.length > 0 && (
              <div className="mt-8 rounded-2xl bg-white p-6">
                <p className="text-xs font-medium text-slate mb-3">구조형식</p>
                <div className="flex flex-wrap gap-2">
                  {project.structureType.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-medium text-brand"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 이미지 갤러리 */}
      {images.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
                갤러리
              </span>
              <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-navy">
                  프로젝트 갤러리
                </h2>
                <p className="mt-0.5 text-xs font-medium tracking-wide text-slate/50">
                  Project Gallery
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl bg-surface aspect-[4/3]"
                >
                  <Image
                    src={src}
                    alt={`${project.projectName} 이미지 ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 관련 프로젝트 */}
      {relatedProjects.length > 0 && (
        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
                  관련
                </span>
                <div>
                  <h2 className="font-heading text-2xl font-extrabold tracking-tight text-navy">
                    관련 프로젝트
                  </h2>
                  <p className="mt-0.5 text-xs font-medium tracking-wide text-slate/50">
                    Related Projects
                  </p>
                </div>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-surface-high"
              >
                전체 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProjects.map((rp) => (
                <Link key={rp.id} href={`/projects/${rp.id}`}>
                  <div className="group overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1">
                    {rp.coverImage ? (
                      <div className="relative h-40 w-full overflow-hidden bg-surface">
                        <Image
                          src={rp.coverImage}
                          alt={rp.projectName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-surface">
                        <Building className="h-8 w-8 text-slate/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-heading text-sm font-bold text-navy line-clamp-2">
                        {rp.projectName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rp.usage.slice(0, 2).map((u) => (
                          <span
                            key={u}
                            className="text-[11px] text-brand font-medium"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 하단 네비게이션 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 rounded-full bg-navy px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-navy/80"
          >
            <ArrowLeft className="h-5 w-5" />
            수행실적 목록으로
          </Link>
        </div>
      </section>
    </>
  );
}
