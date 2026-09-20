# Agile Grandmaster Certification

애자일 그랜드마스터(Agile Grandmaster) 자격증 발급 사이트입니다.

## 자격증 취득 절차

1. **회원가입** — 이메일, 영문 이름, 한국어 이름(선택), 비밀번호로 가입
2. **1차 관문 · 지식 퀴즈** — 애자일/스크럼 핵심 개념 3문항을 모두 맞히면 통과
3. **2차 관문 · 위원회 신청** — 애자일 그랜드마스터로서 실천한 내용을 5,000자 이내로 작성해 제출
4. **관리자 최종 승인** — 관리자가 신청서를 검토해 승인하면 `00000001`부터 시작하는
   순번의 발급번호와 함께 자격증이 발급됨
5. **LinkedIn 공유** — 발급된 자격증 페이지에서 LinkedIn 프로필에 바로 추가 가능

## 기술 스택

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Prisma 7 + SQLite (`better-sqlite3` 드라이버 어댑터)
- 자체 구현 인증: `bcryptjs`(비밀번호 해시) + `jose`(JWT 세션 쿠키)

## 로컬 개발 환경 설정

```bash
npm install
cp .env.example .env   # 이미 .env가 있다면 값만 확인/수정
npx prisma migrate dev # 최초 1회: 로컬 SQLite DB 생성 및 마이그레이션 적용
npm run db:seed        # .env의 ADMIN_EMAIL/ADMIN_PASSWORD로 관리자 계정 생성
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 환경 변수 (`.env`)

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | SQLite 파일 경로 (기본값 `file:./dev.db`) |
| `SESSION_SECRET` | 세션 쿠키 서명에 사용하는 랜덤 비밀키 |
| `NEXT_PUBLIC_SITE_URL` | 자격증 URL, LinkedIn 공유 링크 생성에 사용하는 사이트 기본 주소 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME_EN` | `npm run db:seed` 실행 시 생성되는 최초 관리자 계정 정보 |

`SESSION_SECRET`은 아래 명령으로 새로 생성할 수 있습니다.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 주요 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run db:migrate` | Prisma 마이그레이션 생성/적용 |
| `npm run db:seed` | 관리자 계정 시드 |
| `npm run db:studio` | Prisma Studio (DB GUI) 실행 |

## 프로젝트 구조

```
src/
  app/                     라우트 (App Router)
    signup/, login/        회원가입·로그인
    dashboard/             진행 상태 대시보드
    quiz/                  1차 관문 (지식 퀴즈)
    apply/                 2차 관문 (위원회 신청서)
    admin/                 관리자 심사 화면
    certificate/[number]/  공개 자격증 검증 페이지 + LinkedIn 공유
    api/                   회원가입/로그인/퀴즈 채점/신청/승인·반려 API
  lib/
    auth.ts                비밀번호 해시, 세션 JWT 발급/검증
    certificate.ts         발급번호 채번, 승인/반려, LinkedIn URL 생성
    quiz.ts / quiz-answer-key.ts  퀴즈 문항(공개) / 정답(서버 전용)
    validation.ts           zod 입력 검증 스키마
  proxy.ts                 로그인/관리자 권한에 따른 라우트 보호 (Next 16의 middleware 후속)
prisma/
  schema.prisma            User / Application / Certificate / Counter 모델
  seed.ts                  관리자 계정 시드 스크립트
```

## 자격증 발급번호

`Counter` 테이블의 `certificate` 행을 트랜잭션 내에서 원자적으로 증가시켜
`1`부터 순번을 채번하고, 8자리로 0-패딩한 문자열(`00000001`, `00000002`, ...)을
자격증 발급번호로 사용합니다.
