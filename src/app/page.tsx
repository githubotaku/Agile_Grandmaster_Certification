import Link from "next/link";
import { getSession } from "@/lib/auth";
import { CERT_ORG_NAME, CERT_TITLE } from "@/lib/constants";

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
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              대시보드로 이동
            </Link>
          ) : (
            <>
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
            </>
          )}
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
