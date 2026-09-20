import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, APPLICATION_STATUS } from "@/lib/constants";
import { rejectApplication } from "@/lib/certificate";
import { rejectApplicationSchema } from "@/lib/validation";

export async function POST(
  request: Request,
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
      { error: "심사 대기 중인 신청서만 반려할 수 있습니다." },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = rejectApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  await rejectApplication(id, session.sub, parsed.data.reason);

  return NextResponse.json({ ok: true });
}
