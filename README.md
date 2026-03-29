# (주)동양구조 기업 홈페이지

구조설계 전문기업 **(주)동양구조**의 공식 웹사이트입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router) + React 19
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **폼**: React Hook Form + Zod
- **CMS**: Notion API (수행실적 관리)
- **이메일**: Nodemailer (문의 폼)
- **배포**: Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 실제 값 입력

# 개발 서버
npm run dev
```

## 환경변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `NOTION_API_KEY` | Notion Integration 토큰 | 선택 (없으면 실적 빈 배열) |
| `NOTION_DATABASE_ID` | 수행실적 데이터베이스 ID | 선택 |
| `SMTP_HOST` | 메일 서버 호스트 | 문의 폼 사용 시 필수 |
| `SMTP_PORT` | 메일 서버 포트 (587) | 문의 폼 사용 시 필수 |
| `SMTP_USER` | 발신 이메일 | 문의 폼 사용 시 필수 |
| `SMTP_PASS` | 앱 비밀번호 | 문의 폼 사용 시 필수 |

## 명령어

```bash
npm run dev      # 개발 서버 (Turbopack)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 배포

Vercel에 배포되어 있으며 커스텀 도메인 `dyce.kr`이 연결되어 있습니다.

```bash
vercel --prod --yes
```
