import { timeline } from "@/data/company";
import { FadeIn } from "@/components/ui/FadeIn";

export function Timeline() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">연혁</h2>
            <p className="mt-3 text-muted-foreground">
              1981년부터 이어온 동양구조의 발자취
            </p>
          </div>
        </FadeIn>

        <div className="relative mx-auto mt-12 max-w-2xl">
          {/* 세로선 */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-navy/10 sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <FadeIn key={item.year}>
                <div
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    index % 2 === 0
                      ? "sm:flex-row"
                      : "sm:flex-row-reverse"
                  }`}
                >
                  {/* 점 */}
                  <div className="absolute left-4 top-1.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-navy bg-white sm:left-1/2" />

                  {/* 콘텐츠 */}
                  <div className="ml-10 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div
                      className={`rounded-lg bg-muted/50 p-4 ${
                        index % 2 === 0
                          ? "sm:text-right"
                          : "sm:text-left"
                      }`}
                    >
                      <span className="text-lg font-bold text-brand">
                        {item.year}
                      </span>
                      {item.events.map((event) => (
                        <p
                          key={event}
                          className="mt-1 text-sm text-muted-foreground"
                        >
                          {event}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* 빈 공간 (반대편) */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
