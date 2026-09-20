"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreePrivacy) {
      setError("개인정보 수집·이용에 동의해야 가입할 수 있습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nameEn, nameKo, password, agreePrivacy }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "가입 중 오류가 발생했습니다.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">회원가입</h1>
      <p className="mt-2 text-sm text-slate-600">
        Agile Grandmaster 자격증 취득 여정을 시작해보세요.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="이메일" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="영문 이름" htmlFor="nameEn" hint="여권/영문 실명 기준">
          <input
            id="nameEn"
            type="text"
            required
            placeholder="Gildong Hong"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="한국어 이름 (선택)" htmlFor="nameKo">
          <input
            id="nameKo"
            type="text"
            placeholder="홍길동"
            value={nameKo}
            onChange={(e) => setNameKo(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="비밀번호" htmlFor="password" hint="8자 이상">
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="비밀번호 확인" htmlFor="passwordConfirm">
          <input
            id="passwordConfirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="input"
          />
        </Field>

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            required
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            [필수]{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="font-medium text-indigo-600 hover:underline"
            >
              개인정보 수집·이용
            </Link>
            에 동의합니다.
          </span>
        </label>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !agreePrivacy}
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
