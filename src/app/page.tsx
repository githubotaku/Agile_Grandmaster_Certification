import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS, CERT_ORG_NAME, CERT_TITLE } from "@/lib/constants";
import { QuizForm } from "@/components/QuizForm";

const STEPS = [
  {
    title: "1. 회원가입",
    description: "이메일, 영문 이름, (선택) 한국어 이름과 비밀번호로 가입합니다.",
  },
  {
    title: "2. 1차 관문 · 지식 퀴즈",
    description: "애자일/스크럼 핵심 개념 3문항을 모두 맞히면 1차 관문을 통과합니다.",
  },
  {
    title: "3. 2차 관문 · 위원회 신청",
    description:
      "애자일 그랜드마스터로서 실천한 내용을 5,000자 이내로 작성해 위원회에 정식 신청합니다.",
  },
  {
    title: "4. 관리자 심사 및 발급",
    description:
      `${CERT_ORG_NAME}의 최종 검토 후 승인되면 00000001부터 시작하는 고유 발급번호와 함께 ${CERT_TITLE} 자격증이 발급됩니다.`,
  },
];

export default async function Home() {
  const session = await getSession();
  if (!session) return <LandingPage />;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: {
      certificate: true,
      applications: { orderBy: { submittedAt: "desc" }, take: 1 },
    },
  });
  if (!user) redirect("/login");

  const latestApplication = user.applications[0] ?? null;
  const certificate = user.certificate;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">
        안녕하세요, {user.nameKo || user.nameEn}님
      </h1>
      <p className="mt-1 text-sm text-slate-600">{user.email}</p>

      <div className="mt-8 space-y-4">
        <StatusStep
          done={user.quizPassed}
          title="1차 관문 · 지식 퀴즈"
          description="애자일/스크럼 핵심 개념 3문항을 모두 맞히면 통과합니다."
        >
          {!user.quizPassed && <QuizForm />}
        </StatusStep>

        <StatusStep
          done={
            Boolean(latestApplication) &&
            latestApplication?.status !== APPLICATION_STATUS.REJECTED
          }
          title="2차 관문 · 위원회 신청"
          description="애자일 그랜드마스터로서 실천한 내용을 5,000자 이내로 작성해 제출합니다."
        >
          {!certificate && user.quizPassed && (
            <>
              {(!latestApplication || latestApplication.status === APPLICATION_STATUS.REJECTED) && (
                <div className="space-y-3">
                  {latestApplication?.status === APPLICATION_STATUS.REJECTED && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                      반려되었습니다{latestApplication.rejectionReason ? `: ${latestApplication.rejectionReason}` : ""}
                      . 내용을 보완해 다시 제출해주세요.
                    </p>
                  )}
                  <Link href="/apply" className="btn-primary inline-block">
                    신청서 제출하기
                  </Link>
                </div>
              )}
              {latestApplication?.status === APPLICATION_STATUS.PENDING && (
                <p className="text-sm text-slate-600">
                  신청서가 제출되었습니다. 위원회 심사 결과를 기다려주세요.
                </p>
              )}
            </>
          )}
          {!user.quizPassed && (
            <p className="text-sm text-slate-400">1차 관문을 먼저 통과해주세요.</p>
          )}
        </StatusStep>

        <StatusStep
          done={Boolean(certificate)}
          title="3차 관문 · 관리자 최종 승인 및 발급"
          description="위원회 검토 후 승인되면 고유 발급번호와 함께 자격증이 발급됩니다."
        >
          {certificate ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                발급번호{" "}
                <span className="font-mono font-semibold">{certificate.number}</span>
              </p>
              <Link
                href={`/certificate/${certificate.number}`}
                className="btn-primary inline-block"
              >
                자격증 보기 및 LinkedIn 공유
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-400">아직 발급되지 않았습니다.</p>
          )}
        </StatusStep>
      </div>
    </div>
  );
}

function StatusStep({
  done,
  title,
  description,
  children,
}: {
  done: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
          }`}
        >
          {done ? "✓" : "·"}
        </span>
        <div className="flex-1">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          {CERT_ORG_NAME}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {CERT_TITLE} 자격증
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          지식 퀴즈와 위원회 심사를 통과하면 공식 {CERT_TITLE} 자격증을 발급받고,
          LinkedIn 프로필에 바로 공유할 수 있습니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            지금 가입하기
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            로그인
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {step.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
