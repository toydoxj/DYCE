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

## 아키텍처

**데이터 소스가 이원화**되어 있음:
- `src/data/` — 회사소개, 연혁, 사업분야, 팀원 등 정적 데이터 (TypeScript 파일)
- `src/lib/notion.ts` — 수행실적(프로젝트) 목록은 Notion DB에서 ISR(1시간)로 조회. API 미설정 시 빈 배열 반환

**문의하기 이메일 전송**: `src/app/contact/action.ts`에서 Server Action + nodemailer로 SMTP 전송. 수신: dyce@dyce.kr

**색상 시스템**: `src/app/globals.css`의 `@theme inline`에서 커스텀 컬러 정의. `navy`(#2D3436 다크 차콜)은 주조색, `brand`(#669900 로고 그린)은 포인트. Tailwind 클래스에서 `text-navy`, `bg-brand` 등으로 사용

**컴포넌트 구조**: 각 디렉토리(`layout/`, `home/`, `projects/` 등)에 `index.ts` 배럴 파일로 re-export. shadcn/ui 컴포넌트는 `src/components/ui/`

**홈페이지 Header 특수 처리**: 홈(`/`)에서만 `fixed` 포지션 + 투명 배경으로 Hero 위에 오버레이. 스크롤 시 흰색 배경 전환. 다른 페이지에서는 `sticky`

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
