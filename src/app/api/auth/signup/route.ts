import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { ROLES } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { email, nameEn, nameKo, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일입니다." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      nameEn,
      nameKo: nameKo && nameKo.length > 0 ? nameKo : null,
      passwordHash,
      role: ROLES.USER,
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role as "USER" | "ADMIN",
    nameEn: user.nameEn,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
