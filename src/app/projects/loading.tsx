import { PageHero } from "@/components/layout";
import { Loader2 } from "lucide-react";

export default function ProjectsLoading() {
  return (
    <>
      <PageHero
        title="수행실적"
        subtitle="다양한 분야의 구조설계 및 안전진단 실적"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <p className="mt-4 text-sm text-muted-foreground">
              수행실적을 불러오는 중...
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
