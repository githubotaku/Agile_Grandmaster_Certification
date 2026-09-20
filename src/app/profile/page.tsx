import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { certificate: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">개인정보 수정</h1>
      <p className="mt-2 text-sm text-slate-600">
        이름과 비밀번호를 여기서 변경할 수 있습니다.
      </p>

      <div className="mt-8">
        <ProfileForm
          email={user.email}
          initialNameEn={user.nameEn}
          initialNameKo={user.nameKo ?? ""}
          hasCertificate={Boolean(user.certificate)}
        />
      </div>
    </div>
  );
}
