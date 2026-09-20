import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS, ROLES } from "@/lib/constants";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/");

  const [totalUsers, quizPassedCount, applicantsCount, certificateCount, applications] =
    await Promise.all([
      prisma.user.count({ where: { role: ROLES.USER } }),
      prisma.user.count({ where: { role: ROLES.USER, quizPassed: true } }),
      prisma.user.count({
        where: { role: ROLES.USER, applications: { some: {} } },
      }),
      prisma.certificate.count(),
      prisma.application.findMany({
        orderBy: [{ status: "asc" }, { submittedAt: "desc" }],
        include: { user: true, certificate: true },
      }),
    ]);

  const pendingCount = applications.filter(
    (a) => a.status === APPLICATION_STATUS.PENDING,
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === APPLICATION_STATUS.REJECTED,
  ).length;

  const pct = (n: number) => (totalUsers > 0 ? Math.round((n / totalUsers) * 100) : 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">관리자 · 신청서 심사</h1>
      <p className="mt-1 text-sm text-slate-600">심사 대기 {pendingCount}건</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="가입자" value={totalUsers} />
        <StatTile
          label="1차 관문 통과"
          value={quizPassedCount}
          hint={`가입자의 ${pct(quizPassedCount)}%`}
        />
        <StatTile
          label="2차 관문 신청"
          value={applicantsCount}
          hint={`가입자의 ${pct(applicantsCount)}%`}
        />
        <StatTile label="심사 대기" value={pendingCount} tone="amber" />
        <StatTile
          label="자격증 발급"
          value={certificateCount}
          hint={`가입자의 ${pct(certificateCount)}%`}
          tone="emerald"
        />
        <StatTile label="반려" value={rejectedCount} tone="red" />
      </div>

      <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {applications.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-slate-400">
            제출된 신청서가 없습니다.
          </p>
        )}
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/admin/applications/${app.id}`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
          >
            <div>
              <p className="font-medium text-slate-900">
                {app.user.nameEn}
                {app.user.nameKo ? ` (${app.user.nameKo})` : ""}
              </p>
              <p className="text-sm text-slate-500">{app.user.email}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                제출일 {app.submittedAt.toISOString().slice(0, 10)}
                {app.certificate ? ` · 발급번호 ${app.certificate.number}` : ""}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "slate" | "amber" | "emerald" | "red";
}) {
  const valueStyles: Record<string, string> = {
    slate: "text-slate-900",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    red: "text-red-600",
  };
  return (
    <div className="card py-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueStyles[tone]}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    PENDING: "심사 대기",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
