import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-navy py-16 sm:py-20 lg:py-24">
      {/* 브랜드 악센트 라인 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-white/40">
          <Link href="/" className="transition-colors hover:text-white/70">
            홈
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white/70">{title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-base text-white/60">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
