import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CERT_ORG_NAME, CERT_TITLE } from "@/lib/constants";
import { buildLinkedInAddToProfileUrl } from "@/lib/certificate";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { number },
    include: { user: true },
  });
  if (!certificate) notFound();

  const linkedInUrl = buildLinkedInAddToProfileUrl({
    certificateNumber: certificate.number,
    issuedAt: certificate.issuedAt,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="card border-2 border-slate-900/10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          {CERT_ORG_NAME}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{CERT_TITLE}</h1>
        <p className="mt-6 text-sm text-slate-500">이 자격증은 다음 사람에게 수여됩니다</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {certificate.user.nameEn}
          {certificate.user.nameKo ? ` (${certificate.user.nameKo})` : ""}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-left text-sm">
          <div>
            <dt className="text-slate-400">발급번호</dt>
            <dd className="mt-1 font-mono font-semibold text-slate-900">
              {certificate.number}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">발급일</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {certificate.issuedAt.toISOString().slice(0, 10)}
            </dd>
          </div>
        </dl>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-8 inline-flex items-center justify-center gap-2"
        >
          LinkedIn 프로필에 추가
        </a>
      </div>
    </div>
  );
}
