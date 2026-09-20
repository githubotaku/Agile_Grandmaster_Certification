"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({
  email,
  initialNameEn,
  initialNameKo,
  hasCertificate,
}: {
  email: string;
  initialNameEn: string;
  initialNameKo: string;
  hasCertificate: boolean;
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

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  async function handleDeleteSubmit(e: FormEvent) {
    e.preventDefault();
    setDeleteError(null);

    if (
      !window.confirm(
        "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 제출한 신청서와 발급된 자격증도 함께 삭제됩니다.",
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error ?? "탈퇴 처리 중 오류가 발생했습니다.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setDeleteError("탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
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

      <form
        onSubmit={handleDeleteSubmit}
        className="card space-y-4 border-red-200 bg-red-50/40"
      >
        <h2 className="font-semibold text-red-700">회원 탈퇴</h2>
        <p className="text-sm text-slate-600">
          탈퇴하면 계정과 제출한 신청서가 삭제되며, 이 작업은 되돌릴 수 없습니다.
          {hasCertificate &&
            " 이미 발급된 자격증도 함께 삭제되어 검증 링크가 더 이상 작동하지 않습니다."}
        </p>

        <div>
          <label
            htmlFor="deletePassword"
            className="block text-sm font-medium text-slate-700"
          >
            비밀번호 확인
          </label>
          <input
            id="deletePassword"
            type="password"
            required
            autoComplete="current-password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="input"
          />
        </div>

        {deleteError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {deleteError}
          </p>
        )}

        <button
          type="submit"
          disabled={deleteLoading}
          className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleteLoading ? "탈퇴 처리 중..." : "회원 탈퇴"}
        </button>
      </form>
    </div>
  );
}
