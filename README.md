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
- Prisma 7 + PostgreSQL (Supabase) — `@prisma/adapter-pg` 드라이버 어댑터
- 자체 구현 인증: `bcryptjs`(비밀번호 해시) + `jose`(JWT 세션 쿠키)

## 로컬 개발 환경 설정

Supabase 프로젝트를 하나 만들고 (또는 기존 프로젝트 사용), **Project Settings → Database →
Connection string**에서 두 개의 연결 문자열을 복사해 `.env`에 넣습니다.

- **Transaction pooler** (포트 6543) → `DATABASE_URL` — 앱 런타임이 사용
- **Session pooler / Direct connection** (포트 5432) → `DIRECT_URL` — 마이그레이션 전용

```bash
npm install
cp .env.example .env   # 이미 .env가 있다면 값만 확인/수정 (DATABASE_URL, DIRECT_URL 등)
npm run dev
```

DB에 아직 테이블이 없다면(최초 1회) 아래처럼 마이그레이션을 적용하세요. DDL이라
반드시 직접 연결(`DIRECT_URL`)로 실행해야 합니다 — 풀러는 DDL을 지원하지 않습니다.
(Vercel에 먼저 배포했다면 빌드 시 자동으로 적용되므로 이 단계는 생략해도 됩니다.)

```bash
DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy
npm run db:seed   # .env의 ADMIN_EMAIL/ADMIN_PASSWORD로 관리자 계정 생성
```

`$DIRECT_URL`은 셸에 그 값이 들어있지 않으면 치환되지 않으니, `.env`에 적어둔 실제
Direct connection 문자열을 직접 붙여넣어도 됩니다.

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 환경 변수 (`.env`)

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | Supabase **Transaction pooler** 연결 문자열 (포트 6543). 앱이 실제로 쿼리할 때 사용 |
| `DIRECT_URL` | Supabase **Direct/Session** 연결 문자열 (포트 5432). `prisma migrate` 실행 시에만 사용 (풀러는 DDL을 지원하지 않음) |
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

## 배포하기 (Vercel + Supabase)

`package.json`의 `vercel-build` 스크립트가 Vercel 빌드 때마다 자동으로
`prisma migrate deploy`(직접 연결로 스키마 적용) → `prisma db seed`(관리자 계정 없으면
생성, 실패해도 빌드는 계속 진행) → `next build` 순서로 실행하므로, **로컬에서 마이그레이션
명령을 따로 실행할 필요 없이** 아래 두 단계만 하면 됩니다.

### 1. Supabase 연결 문자열 준비

Supabase 대시보드 → 프로젝트 상단 **Connect** 버튼 → **ORMs** 탭 → **Prisma** 선택 시
`DATABASE_URL`/`DIRECT_URL` 값이 바로 나옵니다. (또는 **Connect → Connection string** 탭에서
Transaction pooler(6543) / Session pooler·Direct(5432) 문자열을 각각 복사해도 동일)

### 2. Vercel에 배포

1. [vercel.com/new](https://vercel.com/new) 에서 이 GitHub 저장소
   (`githubotaku/Agile_Grandmaster_Certification`)를 Import 합니다.
   - Framework는 Next.js로 자동 인식되고, `vercel-build` 스크립트가 있으므로 빌드 명령도
     자동으로 이걸 사용합니다. 따로 설정할 필요 없습니다.
   - 지금 바로 올리고 싶다면 배포 브랜치를 이 작업 브랜치로 지정하거나,
     먼저 이 브랜치를 기본 브랜치에 머지한 뒤 Import 하세요.
2. **Environment Variables**에 아래 값을 추가합니다.

   | 변수 | 값 |
   | --- | --- |
   | `DATABASE_URL` | Supabase Transaction pooler 연결 문자열 (포트 6543) |
   | `DIRECT_URL` | Supabase Direct/Session pooler 연결 문자열 (포트 5432) — 빌드 시 마이그레이션에 사용됨 |
   | `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` 로 생성한 값 |
   | `NEXT_PUBLIC_SITE_URL` | 배포 후 Vercel이 주는 주소 (예: `https://agile-grandmaster.vercel.app`) — 최초 배포 후 값을 채우고 재배포 |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME_EN` | 설정해두면 빌드 시 자동으로 이 계정이 관리자로 시드됨 |

3. **Deploy**를 누르면 Vercel이 마이그레이션 적용 → 관리자 계정 시드 → 빌드까지 자동으로
   끝내고, 기본 주소(`*.vercel.app`)를 발급합니다. 커스텀 도메인은 나중에 Vercel 프로젝트의
   **Settings → Domains**에서 연결하면 됩니다. 도메인을 연결한 뒤에는
   `NEXT_PUBLIC_SITE_URL`도 해당 도메인으로 갱신하고 재배포해야 LinkedIn 공유 링크가
   올바른 주소를 가리킵니다.

### 스키마를 변경했다면

로컬에서 `DATABASE_URL="$DIRECT_URL" npx prisma migrate dev`로 마이그레이션 파일을
만들어 커밋하고 푸시하면, 다음 Vercel 배포 때 `vercel-build`가 자동으로 프로덕션 DB에
반영합니다.

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
