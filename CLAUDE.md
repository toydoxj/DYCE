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
├── lib/                        # utils(cn), constants(COMPANY), notion(API), schemas/contact(zod)
└── types/                      # TypeScript 인터페이스
```

## 아키텍처

**데이터 소스 이원화**:
- `src/data/` — 회사소개, 연혁, 사업분야, 팀원 등 정적 데이터 (TypeScript 파일)
- `src/lib/notion.ts` — 수행실적은 Notion DB에서 ISR(1시간)로 조회. API 미설정 시 빈 배열 반환

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
NOTION_API_KEY=       # Notion Integration 토큰
NOTION_DATABASE_ID=   # 수행실적 데이터베이스 ID
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
