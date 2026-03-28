import { TimelineEvent } from "@/types";

export const companyInfo = {
  name: "(주)동양구조",
  nameEn: "Dongyang Consulting Engineers, Co., Ltd.",
  ceo: "김효진",
  businessNumber: "211-81-98082",
  safetyDiagnosisNumber: "안전진단전문기관 제15호",
  address: "서울시 송파구 법원로11길 11, A동 707호 (문정동, 현대지식산업센터)",
  phone: "02-549-4566",
  fax: "02-549-4567",
  email: "dyce@dyce.kr",
  founded: "1981년",
};

export const timeline: TimelineEvent[] = [
  {
    year: "2016",
    events: ["사무실 이전 (문정동)"],
  },
  {
    year: "2001",
    events: ["엔지니어링 주체 활동 신고"],
  },
  {
    year: "1995",
    events: ["안전진단전문기관 지정"],
  },
  {
    year: "1993",
    events: ["(주)동양구조 설립"],
  },
  {
    year: "1990~1993",
    events: ["동양구조기술사사무소"],
  },
  {
    year: "1981~1990",
    events: ["동양기술개발공사 건축구조부"],
  },
  {
    year: "1981",
    events: ["신종순구조연구소"],
  },
];
