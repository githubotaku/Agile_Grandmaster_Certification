import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { quizSubmitSchema } from "@/lib/validation";
import { QUIZ_QUESTIONS } from "@/lib/quiz";
import { QUIZ_ANSWER_KEY } from "@/lib/quiz-answer-key";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = quizSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "답안을 모두 선택해주세요." },
      { status: 400 },
    );
  }

  const { answers } = parsed.data;
  const results: Record<string, boolean> = {};
  let allCorrect = true;
  for (const question of QUIZ_QUESTIONS) {
    const submitted = answers[question.id];
    const correct = submitted != null && submitted === QUIZ_ANSWER_KEY[question.id];
    results[question.id] = correct;
    if (!correct) allCorrect = false;
  }

  if (allCorrect) {
    await prisma.user.update({
      where: { id: session.sub },
      data: { quizPassed: true, quizPassedAt: new Date() },
    });
  }

  return NextResponse.json({ passed: allCorrect, results });
}
