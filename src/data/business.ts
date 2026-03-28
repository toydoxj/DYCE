import { BusinessArea } from "@/types";

export const businessAreas: BusinessArea[] = [
  {
    id: "structural-design",
    title: "건축구조설계",
    subtitle: "Structural Design",
    description:
      "건축물의 안전성과 경제성을 동시에 확보하는 최적의 구조설계를 제공합니다. 초고층 건축물부터 일반 건축물까지 다양한 프로젝트에 대한 풍부한 경험을 바탕으로, 설계 초기 단계부터 시공 완료까지 체계적인 구조 솔루션을 제안합니다.",
    icon: "Building2",
    services: [
      { title: "초고층 및 장스팬 구조설계", description: "초고층 건축물, 장스팬 구조물 등 고난도 구조설계" },
      { title: "공장 및 특수 구조물 설계", description: "공장, 플랜트 등 특수 용도 구조물의 설계" },
      { title: "구조 감리 및 현장 구조자문", description: "시공 현장에서의 구조 감리 및 기술 자문 지원" },
      { title: "V.E 지원", description: "설계 VE(Value Engineering)를 통한 최적 구조 솔루션 제안" },
    ],
  },
  {
    id: "safety-diagnosis",
    title: "구조안전진단·점검",
    subtitle: "Safety Diagnosis & Inspection",
    description:
      "안전진단전문기관 제15호로 지정된 전문성을 바탕으로, 건축물의 구조 안전성을 정밀하게 진단하고 평가합니다. 체계적인 점검 프로세스와 최신 장비를 활용하여 정확한 진단 결과를 제공합니다.",
    icon: "Shield",
    services: [
      { title: "품질 시험", description: "구조물의 품질 확인을 위한 각종 시험 및 검사" },
      { title: "건축물 내구성 진단", description: "건축물의 구조적 내구성을 종합적으로 평가하는 정밀진단" },
      { title: "보수 보강 및 내진 보강 설계", description: "노후 건축물의 보수·보강 및 내진 성능 향상 설계" },
      { title: "리모델링", description: "기존 건축물의 리모델링에 따른 구조 검토 및 설계" },
    ],
  },
  {
    id: "special-structure",
    title: "특수구조설계",
    subtitle: "Special Structural Design",
    description:
      "비정형 건축물, 대공간 구조, 초고층 건축물 등 특수한 구조 형식이 요구되는 프로젝트에 대한 고도의 기술력을 보유하고 있습니다. 최신 해석 기법과 설계 기술을 적용하여 안전하고 혁신적인 구조 솔루션을 제공합니다.",
    icon: "Landmark",
    services: [
      { title: "초고층 구조설계", description: "초고층 건축물의 내풍·내진 설계 및 구조 해석" },
      { title: "대공간 구조설계", description: "경기장, 전시장 등 대공간 건축물의 구조설계" },
      { title: "비정형 구조설계", description: "곡면, 비대칭 등 비정형 건축물의 구조 해석 및 설계" },
      { title: "특수 기초설계", description: "연약지반, 복합지반 등 특수 조건의 기초 설계" },
    ],
  },
  {
    id: "detailed-work",
    title: "상세구조업무",
    subtitle: "Detailed Structural Services",
    description:
      "구조설계의 품질을 높이기 위한 상세 업무를 수행합니다. 설계도서 작성, 시공 단계 기술지원, 구조물 모니터링 등 프로젝트 전 과정에서 필요한 전문 서비스를 제공합니다.",
    icon: "FileCheck",
    services: [
      { title: "구조 상세도 작성", description: "시공을 위한 상세 구조도면 작성" },
      { title: "시공단계 기술지원", description: "시공 과정에서의 구조 기술 자문 및 지원" },
      { title: "구조물 모니터링", description: "시공 중 및 사용 중 건축물의 구조 거동 모니터링" },
      { title: "보수·보강 설계", description: "노후 건축물의 구조 보수 및 보강 설계" },
    ],
  },
];
