import type { Metadata } from "next";
import Image from "next/image";
import { ProfileCard } from "@/components/about";
import { teamMembers } from "@/data/team";
import { ShieldCheck, Cpu, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "(주)동양구조를 소개합니다. 대표이사 김효진, 사장 정지훈이 이끄는 구조설계 전문 기업입니다.",
};

const philosophy = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    titleKr: "무결성",
    description: "철저한 품질관리(QA/QC) 체계와 도면 검토 프로세스로 구조 안전에 대한 무한한 책임을 다합니다.",
  },
  {
    icon: Cpu,
    title: "AI Innovation",
    titleKr: "기술 혁신",
    description: "자체 프로그램 개발과 최신 해석 기법을 실무에 적용하여 설계 품질과 효율성을 극대화합니다.",
  },
  {
    icon: Lightbulb,
    title: "Optimized Solutions",
    titleKr: "최적화 설계",
    description: "수십 년간 축적된 데이터를 바탕으로 안전성과 경제성을 동시에 만족시키는 VE 설계를 제공합니다.",
  },
  {
    icon: Users,
    title: "Human-Centered",
    titleKr: "인간 중심",
    description: "건축물의 용도와 특성을 깊이 이해하고, 사용자 안전을 최우선으로 하는 구조시스템을 제안합니다.",
  },
];

const certifications = [
  { label: "ISO 9001", description: "품질경영시스템" },
  { label: "안전진단 제15호", description: "안전진단전문기관" },
  { label: "엔지니어링", description: "주체 활동 신고" },
  { label: "구조기술사", description: "전문 인력 보유" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-navy py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand/15 px-3.5 py-1 text-xs font-semibold text-brand-light">
                About DYCE
              </span>
              <h1 className="mt-8 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Engineering the
                <br />
                Future of{" "}
                <em className="not-italic text-brand-light">
                  Structural
                  <br />
                  Stability
                </em>
              </h1>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-white/50">
                1981년 설립 이래 40여 년간 대한민국 건축물의 구조적 안전성 확보에 기여해온
                (주)동양구조는 최적의 구조시스템을 제안하는 것을 목표로 합니다.
              </p>
            </div>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/Gemini_Generated_Image_mbegxembegxembeg.png"
                  alt="동양구조 조직도"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 인사말 */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              CEO Message
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              The Intelligent Sanctuary
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="space-y-5 text-base leading-relaxed text-slate">
              <p>안녕하십니까, (주)동양구조 대표이사 김효진입니다.</p>
              <p>
                (주)동양구조는 1993년 창립 이래 30여 년간 건축구조설계
                전문기업으로서 안전하고 합리적인 구조설계를 통해 대한민국
                건축물의 구조적 안전성 확보에 기여해 왔습니다. 그동안 축적된
                기술력과 경험을 바탕으로 신축 건축물 구조설계는 물론, 리모델링
                구조설계, 안전진단, 구조감리 협력, 법원감정 등 건축구조 전
                분야에 걸쳐 전문 서비스를 제공하고 있습니다.
              </p>
              <p>
                저희는 단순히 구조계산을 수행하는 것이 아니라, 건축물의 용도와
                특성을 깊이 이해하고 최적의 구조시스템을 제안하는 것을 목표로
                합니다.
              </p>
              <p>
                앞으로도 끊임없는 기술 혁신과 인재 육성을 통해 고객 여러분께
                더 높은 수준의 기술 서비스를 제공하고, 대한민국 건축구조 분야의
                발전에 이바지하는 기업이 되겠습니다.
              </p>
            </div>
            <div className="mt-10 border-t border-surface-high pt-6">
              <p className="text-right text-sm font-semibold text-navy">
                (주)동양구조 대표이사 김효진
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 철학 */}
      <section className="bg-surface py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              Philosophy
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Our Core Philosophy
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl bg-white p-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-brand/10">
                  <item.icon className="h-5 w-5 text-navy transition-colors group-hover:text-brand" />
                </div>
                <h3 className="mt-5 font-heading text-base font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-brand">
                  {item.titleKr}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 인증 */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              Certifications
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Global Standards
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert.label}
                className="rounded-2xl bg-surface p-7 text-center"
              >
                <p className="font-heading text-lg font-bold text-navy">
                  {cert.label}
                </p>
                <p className="mt-2 text-sm text-slate">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 대표이사 & 임원 소개 */}
      <section className="bg-surface py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              Leadership
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Our Leadership
            </h2>
          </div>

          <div className="mt-14 space-y-8">
            {teamMembers.map((member) => (
              <ProfileCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
