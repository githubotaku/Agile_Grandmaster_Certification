"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/lib/quiz";

export function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allAnswered = QUIZ_QUESTIONS.every((q) => answers[q.id]);
  const passed = results && Object.values(results).every(Boolean);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "제출 중 오류가 발생했습니다.");
        return;
      }
      setResults(data.results);
      if (data.passed) {
        router.refresh();
      }
    } catch {
      setError("제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (passed) {
    return (
      <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        축하합니다! 1차 관문을 통과했습니다.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {QUIZ_QUESTIONS.map((q, idx) => (
        <fieldset key={q.id} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
          <legend className="mb-2 text-sm font-medium text-slate-900">
            {idx + 1}. {q.question}
          </legend>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50"
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={answers[q.id] === opt.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                  className="h-4 w-4"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {results && (
            <p
              className={`mt-2 text-sm font-medium ${
                results[q.id] ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {results[q.id] ? "정답입니다." : "오답입니다."}
            </p>
          )}
        </fieldset>
      ))}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={!allAnswered || loading}
        className="btn-primary w-full"
      >
        {loading ? "채점 중..." : "제출하기"}
      </button>
    </form>
  );
}
