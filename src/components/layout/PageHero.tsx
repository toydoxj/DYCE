import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-navy py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/30">
          <Link href="/" className="transition-colors hover:text-white/60">
            홈
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white/60">{title}</span>
        </nav>

        <h1 className="font-heading text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
