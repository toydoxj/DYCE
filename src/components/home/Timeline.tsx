import { timeline } from "@/data/company";
import { FadeIn } from "@/components/ui/FadeIn";

export function Timeline() {
  return (
    <section className="bg-surface py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              History
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              A Legacy of Stability
            </h2>
            <p className="mt-4 text-slate">
              1981년부터 이어온 동양구조의 발자취
            </p>
          </div>
        </FadeIn>

        {/* 가로 타임라인 (데스크톱) */}
        <div className="mt-16 hidden sm:block">
          <div className="relative">
            {/* 가로선 */}
            <div className="absolute left-0 right-0 top-4 h-px bg-surface-high" />

            <div className="grid grid-cols-7 gap-4">
              {timeline.map((item, index) => (
                <FadeIn key={item.year} delay={Math.min(index + 1, 3) as 1 | 2 | 3}>
                  <div className="relative pt-10">
                    {/* 점 */}
                    <div className={`absolute top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-[3px] ${
                      index === 0
                        ? "border-brand bg-brand/20"
                        : "border-surface-high bg-white"
                    }`} />

                    <div className="text-center">
                      <span className={`font-heading text-lg font-bold ${
                        index === 0 ? "text-brand" : "text-navy"
                      }`}>
                        {item.year}
                      </span>
                      {item.events.map((event) => (
                        <p
                          key={event}
                          className="mt-2 text-xs leading-relaxed text-slate"
                        >
                          {event}
                        </p>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* 세로 타임라인 (모바일) */}
        <div className="mt-12 sm:hidden">
          <div className="relative ml-4">
            <div className="absolute left-0 top-0 h-full w-px bg-surface-high" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <FadeIn key={item.year}>
                  <div className="relative pl-8">
                    <div className={`absolute left-0 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 ${
                      index === 0
                        ? "border-brand bg-brand/20"
                        : "border-surface-high bg-white"
                    }`} />
                    <span className={`font-heading text-base font-bold ${
                      index === 0 ? "text-brand" : "text-navy"
                    }`}>
                      {item.year}
                    </span>
                    {item.events.map((event) => (
                      <p key={event} className="mt-1 text-sm text-slate">
                        {event}
                      </p>
                    ))}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
