import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, APPLICATION_STATUS } from "@/lib/constants";
import { approveApplicationAndIssueCertificate } from "@/lib/certificate";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    return NextResponse.json({ error: "신청서를 찾을 수 없습니다." }, { status: 404 });
  }
  if (application.status !== APPLICATION_STATUS.PENDING) {
    return NextResponse.json(
      { error: "심사 대기 중인 신청서만 승인할 수 있습니다." },
      { status: 409 },
    );
  }

  const certificate = await approveApplicationAndIssueCertificate(id, session.sub);

  return NextResponse.json({ ok: true, certificateNumber: certificate.number });
}
