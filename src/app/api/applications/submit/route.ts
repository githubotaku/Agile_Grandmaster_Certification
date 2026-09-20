import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validation";
import { APPLICATION_STATUS } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }
  if (!user.quizPassed) {
    return NextResponse.json(
      { error: "먼저 1차 관문(퀴즈)을 통과해야 합니다." },
      { status: 403 },
    );
  }

  const latest = await prisma.application.findFirst({
    where: { userId: user.id },
    orderBy: { submittedAt: "desc" },
  });
  if (latest && latest.status !== APPLICATION_STATUS.REJECTED) {
    return NextResponse.json(
      {
        error:
          latest.status === APPLICATION_STATUS.PENDING
            ? "이미 제출한 신청서가 심사 중입니다."
            : "이미 자격증이 발급된 신청 건이 있습니다.",
      },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      essay: parsed.data.essay,
      status: APPLICATION_STATUS.PENDING,
    },
  });

  return NextResponse.json({ ok: true, applicationId: application.id });
}
