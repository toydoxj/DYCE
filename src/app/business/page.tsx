import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { BusinessSection } from "@/components/business";
import { businessAreas } from "@/data/business";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사업분야",
  description:
    "건축구조설계, 구조안전진단·점검, 특수구조설계, 상세구조업무 등 (주)동양구조의 전문 서비스를 소개합니다.",
};

export default function BusinessPage() {
  return (
    <>
      <PageHero
        title="사업분야"
        subtitle="전문적인 구조 엔지니어링 서비스를 제공합니다"
      />

      {/* 탭 네비게이션 */}
      <nav className="sticky top-16 z-40 border-b bg-white/95 backdrop-blur-sm lg:top-20">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {businessAreas.map((area) => (
            <Link
              key={area.id}
              href={`#${area.id}`}
              className="whitespace-nowrap px-4 py-3 text-sm font-medium text-navy/70 transition-colors hover:text-navy border-b-2 border-transparent hover:border-brand"
            >
              {area.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* 섹션 목록 */}
      {businessAreas.map((area, index) => (
        <BusinessSection key={area.id} area={area} index={index} />
      ))}
    </>
  );
}
