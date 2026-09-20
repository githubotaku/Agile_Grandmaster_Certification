"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function approve() {
    setError(null);
    setLoading("approve");
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "승인 중 오류가 발생했습니다.");
        return;
      }
      router.refresh();
    } catch {
      setError("승인 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  async function reject() {
    setError(null);
    if (reason.trim().length === 0) {
      setError("반려 사유를 입력해주세요.");
      return;
    }
    setLoading("reject");
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "반려 중 오류가 발생했습니다.");
        return;
      }
      router.refresh();
    } catch {
      setError("반려 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={approve}
        disabled={loading !== null}
        className="btn-primary w-full"
      >
        {loading === "approve" ? "승인 처리 중..." : "승인 및 자격증 발급"}
      </button>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
          반려 사유
        </label>
        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input font-normal"
          placeholder="반려 사유를 입력하면 신청자가 대시보드에서 확인할 수 있습니다."
        />
        <button
          type="button"
          onClick={reject}
          disabled={loading !== null}
          className="btn-secondary mt-2 w-full"
        >
          {loading === "reject" ? "반려 처리 중..." : "반려"}
        </button>
      </div>
    </div>
  );
}
