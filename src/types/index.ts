// 프로젝트 실적
export interface Project {
  id: string;
  projectName: string;
  code: string;
  usage: string[];
  structureType: string[];
  height: number | null;
  totalFloorArea: number | null;
  aboveGroundFloors: number | null;
  undergroundFloors: number | null;
  buildingCount: number | null;
  address: string;
  status: string;
  contractDate: string | null;
}

// 사업 분야
export interface BusinessService {
  title: string;
  description: string;
}

export interface BusinessArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  services: BusinessService[];
}

// 팀 멤버
export interface TeamMember {
  name: string;
  position: string;
  image?: string;
  education: string[];
  career: string[];
  certifications: string[];
  awards: string[];
  publications?: string[];
}

// 네비게이션
export interface NavItem {
  label: string;
  href: string;
}

// 회사 연혁
export interface TimelineEvent {
  year: string;
  events: string[];
}

// 문의 폼
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// 필터 옵션
export interface FilterOptions {
  usages: string[];
  structureTypes: string[];
  statuses: string[];
}
