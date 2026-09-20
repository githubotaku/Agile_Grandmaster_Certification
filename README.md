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
- Prisma 7 + SQLite/libSQL (`@prisma/adapter-libsql` 드라이버 어댑터 — 로컬은 파일, 배포 환경은 Turso)
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
| `DATABASE_URL` | 로컬은 SQLite 파일 경로(`file:./dev.db`), 배포 환경은 Turso libSQL URL(`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso DB 인증 토큰 (로컬 파일 DB 사용 시에는 비워둠) |
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

## 배포하기 (Vercel + Turso)

SQLite 파일은 Vercel 같은 서버리스 환경에서 배포할 때마다 초기화되므로, 배포 시에는
SQLite와 호환되는 원격 DB인 [Turso](https://turso.tech)를 사용합니다. 코드는 이미
`@prisma/adapter-libsql` 어댑터로 로컬 파일(`file:./dev.db`)과 Turso(`libsql://...`)를
모두 지원하도록 되어 있습니다.

### 1. Turso 데이터베이스 생성

```bash
# Turso CLI 설치 (최초 1회)
curl -sSfL https://get.tur.so/install.sh | bash

turso auth login
turso db create agile-grandmaster
turso db show agile-grandmaster --url        # -> DATABASE_URL 로 사용
turso db tokens create agile-grandmaster      # -> TURSO_AUTH_TOKEN 으로 사용
```

CLI 대신 [turso.tech](https://turso.tech) 웹 콘솔에서 동일하게 생성할 수도 있습니다.

### 2. 프로덕션 DB에 스키마 적용 + 관리자 계정 생성

로컬 `.env`에 방금 발급받은 값을 임시로 넣고 실행합니다.

```bash
DATABASE_URL="libsql://agile-grandmaster-xxx.turso.io" \
TURSO_AUTH_TOKEN="발급받은 토큰" \
npx prisma migrate deploy

DATABASE_URL="libsql://agile-grandmaster-xxx.turso.io" \
TURSO_AUTH_TOKEN="발급받은 토큰" \
ADMIN_EMAIL="admin@yourdomain.com" ADMIN_PASSWORD="강력한 비밀번호" \
npx prisma db seed
```

### 3. Vercel에 배포

1. [vercel.com/new](https://vercel.com/new) 에서 이 GitHub 저장소
   (`githubotaku/Agile_Grandmaster_Certification`)를 Import 합니다.
   - Framework는 Next.js로 자동 인식됩니다. 빌드/설치 명령은 기본값 그대로 두면 됩니다
     (`npm run build`, `postinstall`에서 `prisma generate`가 자동 실행됩니다).
   - 지금 바로 올리고 싶다면 배포 브랜치를 이 작업 브랜치로 지정하거나,
     먼저 이 브랜치를 기본 브랜치에 머지한 뒤 Import 하세요.
2. **Environment Variables**에 아래 값을 추가합니다.

   | 변수 | 값 |
   | --- | --- |
   | `DATABASE_URL` | `libsql://agile-grandmaster-xxx.turso.io` |
   | `TURSO_AUTH_TOKEN` | Turso 토큰 |
   | `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` 로 생성한 값 |
   | `NEXT_PUBLIC_SITE_URL` | 배포 후 Vercel이 주는 주소 (예: `https://agile-grandmaster.vercel.app`) — 최초 배포 후 값을 채우고 재배포 |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME_EN` | 참고용으로만 쓰이며(런타임에서는 사용하지 않음), 실제 관리자 계정은 2단계의 `prisma db seed`로 이미 생성됨 |

3. **Deploy**를 누르면 Vercel이 자동으로 기본 주소(`*.vercel.app`)를 발급합니다.
   커스텀 도메인은 나중에 Vercel 프로젝트의 **Settings → Domains**에서 연결하면 됩니다.
   도메인을 연결한 뒤에는 `NEXT_PUBLIC_SITE_URL`도 해당 도메인으로 갱신하고 재배포해야
   LinkedIn 공유 링크가 올바른 주소를 가리킵니다.

### 스키마를 변경했다면

로컬에서 `prisma migrate dev`로 마이그레이션 파일을 만들어 커밋한 뒤, 배포 전에
프로덕션 Turso DB에도 위 2단계처럼 `prisma migrate deploy`를 실행해 반영하세요.
Vercel 빌드 과정에는 마이그레이션 적용이 포함되어 있지 않습니다.

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
