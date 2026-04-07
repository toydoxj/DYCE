import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { ContactForm } from "@/components/contact";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "(주)동양구조에 문의하세요. 구조설계, 안전진단 등 모든 문의를 환영합니다.",
};

const contactItems = [
  {
    icon: Phone,
    label: "전화",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone}`,
  },
  {
    icon: Mail,
    label: "이메일",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: MapPin,
    label: "주소",
    value: COMPANY.address,
  },
  {
    icon: Clock,
    label: "업무시간",
    value: "평일 09:00 ~ 18:00",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="문의하기"
        subtitle="구조설계, 안전진단 등 모든 문의를 환영합니다"
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* 연락처 정보 */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-bold text-navy">연락처</h2>
              <div className="mt-6 space-y-4">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-2xl bg-surface p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <item.icon className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-semibold text-navy hover:text-brand transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-navy">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 문의 폼 */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-xl font-bold text-navy">문의 양식</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
