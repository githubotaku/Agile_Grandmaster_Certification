"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({
  email,
  initialNameEn,
  initialNameKo,
}: {
  email: string;
  initialNameEn: string;
  initialNameKo: string;
}) {
  const router = useRouter();

  const [nameEn, setNameEn] = useState(initialNameEn);
  const [nameKo, setNameKo] = useState(initialNameKo);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleInfoSubmit(e: FormEvent) {
    e.preventDefault();
    setInfoError(null);
    setInfoSuccess(false);
    setInfoLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameEn, nameKo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInfoError(data.error ?? "저장 중 오류가 발생했습니다.");
        return;
      }
      setInfoSuccess(true);
      router.refresh();
    } catch {
      setInfoError("저장 중 오류가 발생했습니다.");
    } finally {
      setInfoLoading(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== newPasswordConfirm) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error ?? "변경 중 오류가 발생했습니다.");
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      setPasswordError("변경 중 오류가 발생했습니다.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleInfoSubmit} className="card space-y-4">
        <h2 className="font-semibold text-slate-900">기본 정보</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700">이메일</label>
          <input value={email} disabled className="input bg-slate-50 text-slate-400" />
        </div>

        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-slate-700">
            영문 이름
          </label>
          <input
            id="nameEn"
            type="text"
            required
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="nameKo" className="block text-sm font-medium text-slate-700">
            한국어 이름 (선택)
          </label>
          <input
            id="nameKo"
            type="text"
            value={nameKo}
            onChange={(e) => setNameKo(e.target.value)}
            className="input"
          />
        </div>

        {infoError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {infoError}
          </p>
        )}
        {infoSuccess && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            저장되었습니다.
          </p>
        )}

        <button type="submit" disabled={infoLoading} className="btn-primary">
          {infoLoading ? "저장 중..." : "정보 저장"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card space-y-4">
        <h2 className="font-semibold text-slate-900">비밀번호 변경</h2>

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-slate-700"
          >
            현재 비밀번호
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
            새 비밀번호
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="newPasswordConfirm"
            className="block text-sm font-medium text-slate-700"
          >
            새 비밀번호 확인
          </label>
          <input
            id="newPasswordConfirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            className="input"
          />
        </div>

        {passwordError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            비밀번호가 변경되었습니다.
          </p>
        )}

        <button type="submit" disabled={passwordLoading} className="btn-primary">
          {passwordLoading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
