# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 프로젝트 개요

(주)동양구조 기업 홈페이지. Next.js 16 App Router + React 19 기반 정적/동적 하이브리드 사이트.

## 명령어

- `npm run dev` — 개발 서버 (Turbopack)
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint 검사
- `vercel --prod --yes` — Vercel 프로덕션 배포

## 구조

```
src/
├── app/                        # App Router 페이지
│   ├── layout.tsx              # 루트 레이아웃 (TooltipProvider 래핑)
│   ├── page.tsx                # 홈 (Hero → CoreValues → BusinessPreview → Timeline → CompanyInfo)
│   ├── about/                  # 회사소개
│   ├── business/               # 사업분야
│   ├── contact/                # 문의하기 (action.ts: Server Action + nodemailer)
│   ├── projects/               # 수행실적 (loading.tsx 스켈레톤)
│   ├── location/               # 오시는 길
│   ├── globals.css             # Tailwind v4 @theme inline + 커스텀 컬러
│   ├── not-found.tsx, opengraph-image.tsx, robots.ts, sitemap.ts
├── components/
│   ├── home/                   # HeroSection, CoreValues, BusinessPreview, Timeline, CompanyInfo
│   ├── layout/                 # Header, Footer, MobileNav, PageHero
│   ├── about/                  # ProfileCard (탭 기반 상세 이력)
│   ├── business/               # BusinessCard, BusinessSection
│   ├── contact/                # ContactForm (react-hook-form + zod)
│   ├── projects/               # ProjectCard, ProjectFilter, ProjectGallery, ProjectTable, ViewToggle
│   └── ui/                     # shadcn/ui (base-nova + @base-ui/react)
│       badge, button, card, input, label, select, separator,
│       sheet, table, tabs, textarea, tooltip, FadeIn
├── data/                       # 정적 데이터 (business, company, navigation, team)
├── hooks/                      # useFadeIn
├── lib/                        # utils(cn), constants(COMPANY), dy-task(수행실적 API),
│                               # notion(폴백), notion-cache(KV), notion-image(프록시),
│                               # kv(Upstash), schemas/contact(zod)
└── types/                      # TypeScript 인터페이스
```

## 아키텍처

**데이터 소스 이원화**:
- `src/data/` — 회사소개, 연혁, 사업분야, 팀원 등 정적 데이터 (TypeScript 파일)
- 수행실적 — dy-task(사내 업무관리) 공개 API가 주 소스

**수행실적 데이터 흐름**: Notion 마스터 DB가 원본이지만 직접 조회하지 않는다.
```
Notion 마스터 DB → (dy-task sync, 1시간) → mirror_master_projects
  → GET api.dyce.kr/api/public/projects → Upstash KV(24h TTL, 30분 SWR) → 페이지
```
- `src/lib/dy-task.ts` — 주 소스. mirror를 읽으므로 Notion rate limit(3 req/s)과 전량 페이지네이션에서 자유롭고, 마스터 DB에 없는 **진행단계·계약일을 하위 프로젝트에서 유도**해 받는다
- `src/lib/notion.ts` — dy-task 장애 시 폴백 경로 (Notion 직결)
- `src/lib/notion-cache.ts` — KV 캐시 계층. `syncProjects()`를 Vercel cron(매일 02:00)과 SWR 백그라운드가 호출
- 이미지는 여전히 Notion이 원본. `/api/notion-image/{cover|block}/...`가 바이너리를 스트리밍하고 CDN이 캐싱한다(302 redirect를 쓰면 Notion signed URL 1시간 만료로 캐시가 무의미). API가 `image_kind`로 이미지 부재를 알려주면 프록시 호출 자체를 생략

**주의**: 마스터 DB는 대부분의 속성이 비어 있다 (331건 중 용도 35, 구조형식 25, 연면적 21, MASTER_CODE 101). 필터·카드에 값이 안 보이는 것은 코드 문제가 아니라 원본 입력 상태다.

**문의하기**: `src/app/contact/action.ts` Server Action + nodemailer SMTP 전송 (수신: dyce@dyce.kr)

**색상 시스템**: `globals.css`의 `@theme inline`에서 정의. Stitch "Snug Editorial 2026" 디자인 시스템 기반.
- `navy`(#0F172A) 주조색, `brand`(#72B91F) 포인트, `slate`(#475569) 보조
- Surface 계층: `surface`(#f7f9fb) → `surface-low`(#f2f4f6) → `surface-lowest`(#fff) → `surface-high`(#e6e8ea)
- No-Line Rule: 1px 보더 대신 배경색 전환으로 섹션 구분
- 카드: rounded-2xl, 구분선 없이 ambient shadow
- 버튼: Primary=gradient pill(from-brand to-brand-light), Secondary=surface pill
- Glass 효과: `.glass` (backdrop-blur-20px, 70% opacity)

**타이포그래피**: Manrope(font-heading, Display/Headline) + Inter(font-sans, Body/Label)

**컴포넌트 구조**: 디렉토리별 `index.ts` 배럴 파일. shadcn/ui는 `base-nova` 스타일 + `@base-ui/react` 사용 (Radix UI 아님 → `asChild` 대신 `render` prop 사용)

**Header 특수 처리**: 홈(`/`)에서만 `fixed` + 투명 배경 → 스크롤 시 흰색 전환. 다른 페이지는 `sticky`

## 환경변수

```
DY_TASK_API_URL=      # dy-task backend (기본 https://api.dyce.kr)
DY_TASK_PUBLIC_KEY=   # dy-task PUBLIC_API_KEY와 동일 값 (미설정 시 검증 생략)
NOTION_API_KEY=       # Notion Integration 토큰 (이미지 프록시 + 폴백)
NOTION_DATABASE_ID=   # 수행실적 데이터베이스 ID (폴백 전용)
SMTP_HOST=            # 메일 서버 (smtp.worksmobile.com)
SMTP_PORT=            # 587
SMTP_USER=            # 발신 이메일
SMTP_PASS=            # 앱 비밀번호
```

로컬: `.env.local` / 배포: Vercel 환경변수 (`vercel env add`)

## 배포

- Vercel에 배포, 커스텀 도메인 `dyce.kr` 연결
- GitHub 레포: toydoxj/DYCE (private)
- `git push` 후 `vercel --prod --yes`로 수동 배포 (GitHub 자동 연동 미설정)
