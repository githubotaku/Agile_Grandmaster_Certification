import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ROLES, SITE_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-5">
          {session ? (
            <>
              {session.role === ROLES.ADMIN && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  관리자
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                대시보드
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                가입하기
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
