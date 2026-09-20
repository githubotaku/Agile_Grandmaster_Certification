"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ESSAY_MAX_LENGTH } from "@/lib/constants";

export function ApplyForm({ initialEssay = "" }: { initialEssay?: string }) {
  const router = useRouter();
  const [essay, setEssay] = useState(initialEssay);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const remaining = ESSAY_MAX_LENGTH - essay.length;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "제출 중 오류가 발생했습니다.");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        신청서가 제출되었습니다. 위원회 심사 결과를 기다려주세요.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="essay" className="block text-sm font-medium text-slate-700">
            애자일 그랜드마스터로서 실천한 내용
          </label>
          <span
            className={`text-xs ${remaining < 0 ? "text-red-600" : "text-slate-400"}`}
          >
            {essay.length.toLocaleString()} / {ESSAY_MAX_LENGTH.toLocaleString()}자
          </span>
        </div>
        <textarea
          id="essay"
          required
          rows={14}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="애자일 원칙을 팀/조직에 어떻게 적용했는지, 어떤 변화를 이끌어냈는지 구체적으로 작성해주세요."
          className="input font-normal"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || essay.trim().length === 0 || remaining < 0}
        className="btn-primary w-full"
      >
        {loading ? "제출 중..." : "위원회에 신청서 제출"}
      </button>
    </form>
  );
}
