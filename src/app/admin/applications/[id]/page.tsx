import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS, ROLES } from "@/lib/constants";
import { ReviewActions } from "./ReviewActions";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/dashboard");

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { user: true, certificate: true, reviewedBy: true },
  });
  if (!application) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; 목록으로
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        {application.user.nameEn}
        {application.user.nameKo ? ` (${application.user.nameKo})` : ""}
      </h1>
      <p className="text-sm text-slate-500">{application.user.email}</p>
      <p className="mt-1 text-xs text-slate-400">
        제출일 {application.submittedAt.toISOString().slice(0, 10)}
      </p>

      <div className="card mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
        {application.essay}
      </div>

      {application.status === APPLICATION_STATUS.PENDING && (
        <div className="mt-6">
          <ReviewActions applicationId={application.id} />
        </div>
      )}

      {application.status === APPLICATION_STATUS.APPROVED && (
        <div className="mt-6 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          승인됨 · 발급번호 {application.certificate?.number}
        </div>
      )}

      {application.status === APPLICATION_STATUS.REJECTED && (
        <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          반려됨{application.rejectionReason ? `: ${application.rejectionReason}` : ""}
        </div>
      )}
    </div>
  );
}
