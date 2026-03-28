import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { ProfileCard } from "@/components/about";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "(주)동양구조를 소개합니다. 대표이사 김효진, 사장 정지훈이 이끄는 구조설계 전문 기업입니다.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="회사소개"
        subtitle="1981년부터 이어온 구조설계 전문 기업"
      />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 인사말 */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-navy">인사말</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              안녕하십니까, (주)동양구조 대표이사 김효진입니다.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              (주)동양구조는 1993년 창립 이래 30여 년간 건축구조설계
              전문기업으로서 안전하고 합리적인 구조설계를 통해 대한민국 건축물의
              구조적 안전성 확보에 기여해 왔습니다. 그동안 축적된 기술력과 경험을
              바탕으로 신축 건축물 구조설계는 물론, 리모델링 구조설계, 안전진단,
              구조감리 협력, 법원감정 등 건축구조 전 분야에 걸쳐 전문 서비스를
              제공하고 있습니다.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              저희는 단순히 구조계산을 수행하는 것이 아니라, 건축물의 용도와
              특성을 깊이 이해하고 최적의 구조시스템을 제안하는 것을 목표로
              합니다. 건축구조기술사를 포함한 우수한 전문 인력이 최신 해석 기술과
              풍부한 현장 경험을 결합하여, 안전성과 경제성을 동시에 만족시키는
              설계를 실현하고 있습니다.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              앞으로도 끊임없는 기술 혁신과 인재 육성을 통해 고객 여러분께 더
              높은 수준의 기술 서비스를 제공하고, 대한민국 건축구조 분야의 발전에
              이바지하는 기업이 되겠습니다. 변함없는 관심과 성원을 부탁드립니다.
            </p>
            <p className="mt-6 text-sm font-semibold text-navy">
              (주)동양구조 대표이사 김효진
            </p>
          </div>

          {/* 대표이사 */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-navy">
              대표이사
            </h2>
            <div className="space-y-8">
              {teamMembers
                .filter((m) => m.position === "대표이사")
                .map((member) => (
                  <ProfileCard key={member.name} member={member} />
                ))}
            </div>
          </div>

          {/* 임원 */}
          {teamMembers.some((m) => m.position !== "대표이사") && (
            <div className="mt-16">
              <h2 className="mb-8 text-center text-2xl font-bold text-navy">
                임원
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((m) => m.position !== "대표이사")
                  .map((member) => (
                    <ProfileCard key={member.name} member={member} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
