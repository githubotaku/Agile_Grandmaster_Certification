import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS } from "@/lib/constants";
import { ApplyForm } from "./ApplyForm";

export default async function ApplyPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: {
      certificate: true,
      applications: { orderBy: { submittedAt: "desc" }, take: 1 },
    },
  });
  if (!user) redirect("/login");

  if (!user.quizPassed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            2차 관문에 접근하려면 먼저 1차 관문(지식 퀴즈)을 통과해야 합니다.
          </p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            퀴즈 풀러 가기
          </Link>
        </div>
      </div>
    );
  }

  if (user.certificate) {
    redirect("/");
  }

  const latest = user.applications[0] ?? null;

  if (latest?.status === APPLICATION_STATUS.PENDING) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            이미 제출한 신청서가 심사 중입니다. 결과를 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">2차 관문 · 위원회 신청</h1>
      <p className="mt-2 text-sm text-slate-600">
        애자일 그랜드마스터로서 실천한 내용을 5,000자 이내로 작성해 위원회에 정식으로
        신청해주세요.
      </p>

      {latest?.status === APPLICATION_STATUS.REJECTED && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          이전 신청서가 반려되었습니다
          {latest.rejectionReason ? `: ${latest.rejectionReason}` : ""}. 내용을 보완해
          다시 제출해주세요.
        </p>
      )}

      <div className="mt-6">
        <ApplyForm initialEssay={latest?.status === APPLICATION_STATUS.REJECTED ? latest.essay : ""} />
      </div>
    </div>
  );
}
