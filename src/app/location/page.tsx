import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Train, Bus, Car } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `(주)동양구조 오시는 길 안내입니다. ${COMPANY.address}`,
};

const transportInfo = [
  {
    icon: Train,
    title: "지하철",
    items: [
      "8호선 문정역 4번출구 도보 5분",
      "3·8호선 가락시장역 8번출구 도보 15분",
    ],
  },
  {
    icon: Bus,
    title: "버스",
    items: [
      "간선: 302, 303, 320, 362",
      "지선: 3012, 3315, 3414",
    ],
  },
  {
    icon: Car,
    title: "주차",
    items: [
      "현대지식산업센터 건물 내 지하주차장 이용 가능",
    ],
  },
];

export default function LocationPage() {
  return (
    <>
      <PageHero
        title="오시는 길"
        subtitle="(주)동양구조 찾아오시는 방법을 안내합니다"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 주소 */}
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <h2 className="font-semibold text-navy">주소</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {COMPANY.address}
              </p>
            </div>
          </div>

          {/* 구글맵 */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border shadow-lg">
            <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-[5/2]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.0!2d127.1181921!3d37.4852832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca551d182ef61%3A0xa7faeb4b782f1ecd!2z66y47KCV7ZiE64yA7KeA7Iud7IKw7JeF7IS87YSw!5e0!3m2!1sko!2skr"
                className="h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="(주)동양구조 위치"
              />
            </div>
          </div>

          {/* 교통 정보 */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {transportInfo.map((info) => (
              <Card key={info.title}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <info.icon className="h-5 w-5 text-navy" />
                    <h3 className="font-semibold text-navy">{info.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {info.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
